import { PrismaClient } from "@prisma/client";

// Netlify Database exposes NETLIFY_DB_URL; Prisma expects DATABASE_URL.
process.env.DATABASE_URL ||= process.env.NETLIFY_DB_URL;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
