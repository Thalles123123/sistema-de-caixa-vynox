export function isDatabaseConfigured() {
  const value = (process.env.DATABASE_URL ?? process.env.NETLIFY_DB_URL)?.trim();
  return Boolean(value && value.startsWith("postgresql://"));
}

export function isGoogleOAuthConfigured() {
  const id = process.env.AUTH_GOOGLE_ID?.trim();
  const secret = process.env.AUTH_GOOGLE_SECRET?.trim();
  return Boolean(id && secret && !id.includes("preencha") && !secret.includes("preencha"));
}

export const databaseUnavailableMessage =
  "O banco PostgreSQL ainda nao esta disponivel. Tente novamente em alguns instantes.";
