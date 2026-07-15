import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
import { googleLoginAction } from "@/app/actions/auth";
import { isDatabaseConfigured, isGoogleOAuthConfigured } from "@/lib/readiness";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const databaseReady = isDatabaseConfigured();
  const googleReady = isGoogleOAuthConfigured();
  return <AuthLayout title="Entre na sua conta" text="Acesse sua assinatura e o Sistema de Caixa Pro.">
    {!databaseReady && <div className="form-message error">Banco ainda não disponível. Tente novamente em alguns instantes.</div>}
    <AuthForm mode="login" />
    <div className="divider">ou</div>
    {googleReady ? <form action={googleLoginAction}><button className="google-button">Continuar com Google</button></form> : <button className="google-button" disabled title="Preencha AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET">Google OAuth ainda não configurado</button>}
    <p className="form-note"><Link href="/recuperar-senha">Esqueci minha senha</Link></p>
    <p className="form-note">Ainda não possui conta? <Link href="/criar-conta">Cadastre-se</Link></p>
  </AuthLayout>;
}
