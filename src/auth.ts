import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { isGoogleOAuthConfigured } from "@/lib/readiness";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/entrar", error: "/entrar" },
  providers: [
    ...(isGoogleOAuthConfigured()
      ? [Google({ allowDangerousEmailAccountLinking: false })]
      : []),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(input) {
        const parsed = loginSchema.safeParse(input);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        const recentFailures = await prisma.loginAttempt.count({
          where: {
            identifier: email,
            succeeded: false,
            createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
          },
        });
        if (recentFailures >= 8)
          throw new Error("Muitas tentativas. Aguarde 15 minutos.");
        const user = await prisma.user.findUnique({ where: { email } });
        const valid =
          !!user?.passwordHash &&
          !user.blockedAt &&
          !!user.emailVerified &&
          (await compare(parsed.data.password, user.passwordHash));
        await prisma.loginAttempt.create({
          data: { identifier: email, ipAddress: "server", succeeded: valid },
        });
        return valid ? user : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
      return session;
    },
    async signIn({ user }) {
      const current = user.email
        ? await prisma.user.findUnique({ where: { email: user.email } })
        : null;
      return !current?.blockedAt;
    },
  },
});
