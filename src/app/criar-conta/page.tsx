import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
import { googleLoginAction } from "@/app/actions/auth";
import { isDatabaseConfigured, isGoogleOAuthConfigured } from "@/lib/readiness";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const databaseReady = isDatabaseConfigured();
  const googleReady = isGoogleOAuthConfigured();
  return <AuthLayout title="Crie sua conta" text="Comece com seus dados básicos. Depois, complete o perfil da empresa.">
    {!databaseReady && <div className="form-message error">Banco ainda não disponível. Tente novamente em alguns instantes.</div>}
    <AuthForm mode="register" />
    <div className="divider">ou</div>
    {googleReady ? <form action={googleLoginAction}><button className="google-button">Cadastrar com Google</button></form> : <button className="google-button" disabled title="Preencha AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET">Google OAuth ainda não configurado</button>}
    <p className="form-note">Já possui uma conta? <Link href="/entrar">Entrar</Link></p>
  </AuthLayout>;
}
