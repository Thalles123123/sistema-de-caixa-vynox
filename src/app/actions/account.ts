"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomBytes, createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { FormState } from "./auth";
const profileSchema = z.object({
  fullName: z.string().min(3),
  companyName: z.string().min(2),
  document: z.string().min(11).max(18),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
});
export async function saveProfileAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user.id) return { ok: false, message: "Sua sessão expirou." };
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      ok: false,
      message: "Preencha todos os campos obrigatórios corretamente.",
    };
  await prisma.companyProfile.upsert({
    where: { userId: session.user.id },
    update: {
      ...parsed.data,
      state: parsed.data.state.toUpperCase(),
      completedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      ...parsed.data,
      state: parsed.data.state.toUpperCase(),
      completedAt: new Date(),
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "PROFILE_UPDATED",
      entity: "CompanyProfile",
      entityId: session.user.id,
    },
  });
  revalidatePath("/painel");
  return { ok: true, message: "Perfil da empresa atualizado." };
}

export async function submitPaymentAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user.id)
    return { ok: false, message: "Entre novamente para continuar." };
  const profile = await prisma.companyProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile?.completedAt)
    return {
      ok: false,
      message: "Complete o perfil da empresa antes do pagamento.",
    };
  const file = formData.get("proof");
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, message: "Selecione o comprovante." };
  if (file.size > 5 * 1024 * 1024)
    return { ok: false, message: "O arquivo deve ter no máximo 5 MB." };
  const allowed = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["application/pdf", ".pdf"],
  ]);
  const extension = allowed.get(file.type);
  if (!extension) return { ok: false, message: "Envie JPG, PNG ou PDF." };
  const plan = await prisma.plan.findUnique({ where: { slug: "pro" } });
  if (!plan || !plan.active)
    return { ok: false, message: "O plano está indisponível no momento." };
  const bytes = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const storageDir = path.resolve(
    /*turbopackIgnore: true*/ process.env.PROOF_STORAGE_DIR ?? "./storage/payment-proofs",
  );
  await mkdir(storageDir, { recursive: true });
  const storageKey = `${Date.now()}-${randomBytes(12).toString("hex")}${extension}`;
  await writeFile(path.join(storageDir, storageKey), bytes, { flag: "wx" });
  await prisma.$transaction(async (tx) => {
    const subscription = await tx.subscription.create({
      data: { userId: session.user.id, planId: plan.id, status: "PENDING" },
    });
    const payment = await tx.payment.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        subscriptionId: subscription.id,
        amount: plan.monthlyPrice,
        status: "UNDER_REVIEW",
      },
    });
    await tx.paymentProof.create({
      data: {
        paymentId: payment.id,
        storageKey,
        originalName: file.name.slice(0, 150),
        mimeType: file.type,
        size: file.size,
        sha256,
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "PAYMENT_PROOF_SUBMITTED",
        entity: "Payment",
        entityId: payment.id,
      },
    });
  });
  revalidatePath("/painel");
  return {
    ok: true,
    message:
      "Recebemos seu comprovante. O pagamento será analisado e, após a aprovação, seu Plano Pro será liberado.",
  };
}

export async function accessSystemAction() {
  const session = await auth();
  if (!session?.user.id) redirect("/entrar");
  const active = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      expiresAt: { gt: new Date() },
    },
  });
  if (!active) redirect("/checkout");
  redirect(process.env.SYSTEM_APP_URL ?? "/painel?access=configured");
}
