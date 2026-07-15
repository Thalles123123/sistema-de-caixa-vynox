import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountShell } from "@/components/account-shell";
import { accessSystemAction } from "@/app/actions/account";

const labels = { INACTIVE: "Sem assinatura", PENDING: "Em análise", ACTIVE: "Plano ativo", EXPIRED: "Vencida", CANCELED: "Cancelada" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user.id) redirect("/entrar?callbackUrl=/painel");
  const [profile, subscription, payments] = await Promise.all([
    prisma.companyProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.subscription.findFirst({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, include: { plan: true } }),
    prisma.payment.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 5, include: { proof: true } }),
  ]);
  const status = subscription?.status ?? "INACTIVE";
  const remaining = subscription?.expiresAt
    ? await prisma.$queryRaw<Array<{ days: number }>>`SELECT GREATEST(0, CEIL(EXTRACT(EPOCH FROM (${subscription.expiresAt} - NOW())) / 86400))::int AS days`
    : [];
  return <AccountShell admin={session.user.role === "ADMIN"}>
    <div className="page-title"><div><h1>Olá, {session.user.name?.split(" ")[0] ?? "cliente"}</h1><p>{profile?.companyName ?? "Complete o perfil da sua empresa para continuar."}</p></div><span className={`status-badge ${status === "ACTIVE" ? "active" : ""}`}>{labels[status]}</span></div>
    <div className="stat-cards"><div className="stat-card"><span>Plano atual</span><strong>{subscription?.plan.name ?? "Nenhum"}</strong></div><div className="stat-card"><span>Vencimento</span><strong>{subscription?.expiresAt?.toLocaleDateString("pt-BR") ?? "—"}</strong></div><div className="stat-card"><span>Dias restantes</span><strong>{status === "ACTIVE" ? remaining[0]?.days ?? 0 : "—"}</strong></div></div>
    {!profile?.completedAt && <div className="panel-card"><h3>Finalize seu perfil</h3><p>Precisamos dos dados da empresa antes de receber o pagamento.</p><Link className="button button-primary" href="/perfil">Completar perfil</Link></div>}
    {status === "PENDING" && <div className="panel-card"><h3>Seu pagamento está sendo analisado</h3><p>Você receberá a atualização assim que o administrador concluir a conferência.</p></div>}
    {status === "ACTIVE" && <div className="panel-card"><h3>Seu Plano Pro está ativo até {subscription?.expiresAt?.toLocaleDateString("pt-BR")}</h3><form action={accessSystemAction}><button className="button button-primary">Acessar o Sistema de Caixa</button></form></div>}
    {status !== "ACTIVE" && status !== "PENDING" && profile?.completedAt && <div className="panel-card"><h3>{status === "EXPIRED" ? "Sua assinatura venceu" : "Ative o Plano Pro"}</h3><p>Envie o comprovante do PIX para análise e liberação.</p><Link className="button button-primary" href="/checkout">Assinar ou renovar</Link></div>}
    <div className="panel-card"><h3>Histórico de pagamentos</h3>{payments.length === 0 ? <p>Nenhum pagamento enviado.</p> : <table className="data-table"><thead><tr><th>Data</th><th>Valor</th><th>Status</th><th>Comprovante</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.id}><td>{payment.createdAt.toLocaleDateString("pt-BR")}</td><td>{Number(payment.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td><td>{payment.status}</td><td>{payment.proof ? <a href={`/api/comprovantes/${payment.id}`} target="_blank">Visualizar</a> : "—"}</td></tr>)}</tbody></table>}</div>
  </AccountShell>;
}
