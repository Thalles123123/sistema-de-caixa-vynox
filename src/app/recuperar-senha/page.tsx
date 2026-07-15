import Link from "next/link";import { AuthForm } from "@/components/auth-form";import { AuthLayout } from "@/components/auth-layout";
export default function ForgotPage(){return <AuthLayout title="Recupere sua senha" text="Enviaremos um link único com validade de 15 minutos."><AuthForm mode="forgot"/><p className="form-note"><Link href="/entrar">Voltar para o login</Link></p></AuthLayout>}
