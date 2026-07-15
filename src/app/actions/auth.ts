"use server";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { randomBytes, createHash } from "crypto";
import { Resend } from "resend";
import { z } from "zod";
import {
  databaseUnavailableMessage,
  isDatabaseConfigured,
  isGoogleOAuthConfigured,
} from "@/lib/readiness";
import { redirect } from "next/navigation";

export type FormState = { ok: boolean; message: string };
const registerSchema = z
  .object({
    name: z.string().min(3, "Informe seu nome."),
    email: z.string().email("E-mail inválido."),
    password: z
      .string()
      .min(8, "Use pelo menos 8 caracteres.")
      .regex(/[A-Z]/, "Inclua uma letra maiúscula.")
      .regex(/[0-9]/, "Inclua um número."),
    confirmPassword: z.string(),
  })
  .refine((x) => x.password === x.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export async function registerAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isDatabaseConfigured())
    return { ok: false, message: databaseUnavailableMessage };
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, message: parsed.error.issues[0].message };
  const email = parsed.data.email.toLowerCase();
  const token = randomBytes(32).toString("hex");
  try {
    if (await prisma.user.findUnique({ where: { email } }))
      return { ok: false, message: "Já existe uma conta com este e-mail." };
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          name: parsed.data.name,
          email,
          passwordHash: await hash(parsed.data.password, 12),
        },
      });
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    });
  } catch {
    return { ok: false, message: databaseUnavailableMessage };
  }
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  if (apiKey) {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ??
        "Sistema de Caixa Pro <onboarding@resend.dev>",
      to: email,
      subject: "Confirme seu e-mail",
      html: `<h2>Bem-vindo ao Sistema de Caixa Pro</h2><p>Confirme seu e-mail para acessar sua conta.</p><p><a href="${appUrl}/api/verificar-email?token=${token}&email=${encodeURIComponent(email)}">Confirmar meu e-mail</a></p><p>Este link expira em 24 horas.</p>`,
    });
    return {
      ok: true,
      message: "Conta criada. Enviamos a confirmação para seu e-mail.",
    };
  }
  if (process.env.NODE_ENV !== "production")
    console.info(
      `[DEV] Verificacao: ${appUrl}/api/verificar-email?token=${token}&email=${encodeURIComponent(email)}`,
    );
  return {
    ok: true,
    message:
      "Conta criada. Configure o Resend para receber o link; em desenvolvimento, ele foi exibido no terminal.",
  };
}

export async function loginAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/painel",
    });
    return { ok: true, message: "Entrando..." };
  } catch (error) {
    if (error instanceof AuthError)
      return {
        ok: false,
        message:
          error.type === "CredentialsSignin"
            ? "E-mail, senha ou verificação inválidos."
            : "Não foi possível entrar agora.",
      };
    throw error;
  }
}
export async function googleLoginAction() {
  if (!isGoogleOAuthConfigured()) redirect("/entrar?config=google");
  await signIn("google", { redirectTo: "/painel" });
}
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function requestResetAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!isDatabaseConfigured())
    return { ok: false, message: databaseUnavailableMessage };
  const parsed = z.string().email().safeParse(formData.get("email"));
  if (!parsed.success)
    return { ok: false, message: "Informe um e-mail válido." };
  const email = parsed.data.toLowerCase();
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch {
    return { ok: false, message: databaseUnavailableMessage };
  }
  if (user) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    if (process.env.RESEND_API_KEY) {
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from:
          process.env.EMAIL_FROM ??
          "Sistema de Caixa Pro <onboarding@resend.dev>",
        to: email,
        subject: "Recupere sua senha",
        html: `<p>Use este link nos próximos 15 minutos:</p><p><a href="${appUrl}/redefinir-senha?token=${token}">Redefinir senha</a></p>`,
      });
    } else if (process.env.NODE_ENV !== "production")
      console.info(`[DEV] Reset: ${appUrl}/redefinir-senha?token=${token}`);
  }
  return {
    ok: true,
    message: "Se o e-mail existir, enviaremos um link válido por 15 minutos.",
  };
}

export async function resetPasswordAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = z
    .object({
      token: z.string().min(20),
      password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, message: "Token ou nova senha inválidos." };
  const tokenHash = createHash("sha256")
    .update(parsed.data.token)
    .digest("hex");
  const reset = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!reset || reset.usedAt || reset.expiresAt < new Date())
    return { ok: false, message: "Este link expirou ou já foi utilizado." };
  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { passwordHash: await hash(parsed.data.password, 12) },
    }),
    prisma.passwordResetToken.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    }),
  ]);
  return { ok: true, message: "Senha alterada. Você já pode entrar." };
}
