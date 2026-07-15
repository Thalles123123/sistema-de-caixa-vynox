import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  AUTH_SECRET: z.string().min(24),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export function validateEnv() { return schema.safeParse(process.env); }
