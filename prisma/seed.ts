import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.upsert({
    where: { slug: "pro" },
    update: { monthlyPrice: 100, active: true },
    create: { slug: "pro", name: "Plano Pro", description: "Tudo o que voce precisa para controlar seu negocio.", monthlyPrice: 100 },
  });
  await prisma.pixSettings.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });
  await prisma.supportSettings.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (email && password && password !== "troque-esta-senha") {
    await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { role: UserRole.ADMIN },
      create: { name: "Administrador", email: email.toLowerCase(), emailVerified: new Date(), role: UserRole.ADMIN, passwordHash: await hash(password, 12) },
    });
  }
}

main().finally(() => prisma.$disconnect());
