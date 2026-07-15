import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, Boxes, ChartNoAxesCombined, Check, CircleDollarSign, Clock3, PackageSearch, ScanBarcode, ShieldCheck, Sparkles, UsersRound, WalletCards, Wifi } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DashboardMockup } from "@/components/dashboard-mockup";
import { Reveal } from "@/components/reveal";
import { WhatsAppButton } from "@/components/whatsapp-button";

const features = [
  { icon: ScanBarcode, title: "Frente de caixa sem atrito", text: "Código de barras, descontos, PIX, cartões, dinheiro, fiado e comprovante em um fluxo rápido.", accent: "blue" },
  { icon: Boxes, title: "Estoque sempre atualizado", text: "Baixas automáticas, estoque mínimo, inventário, histórico e alertas antes de o produto acabar.", accent: "green" },
  { icon: PackageSearch, title: "Produtos bem organizados", text: "Custos, preços, margem, categorias, fornecedores, fotos e códigos em um cadastro objetivo.", accent: "orange" },
  { icon: UsersRound, title: "Clientes e crédito", text: "Histórico de compras, documentos, contato, dívidas, observações e limite individual de crédito.", accent: "cyan" },
  { icon: WalletCards, title: "Financeiro no controle", text: "Contas a pagar e receber, despesas, receitas, pendências e fluxo de caixa em uma visão única.", accent: "yellow" },
  { icon: BarChart3, title: "Relatórios que explicam", text: "Faturamento, lucro, produtos campeões e formas de pagamento com exportação em PDF e Excel.", accent: "violet" },
  { icon: ShieldCheck, title: "Equipe com permissões", text: "Perfis por função, acessos individuais e registro das ações para operar com segurança.", accent: "red" },
  { icon: ChartNoAxesCombined, title: "Painel administrativo", text: "Resumo diário, gráficos, vendas recentes, estoque crítico e atalhos para agir mais rápido.", accent: "navy" },
];

const faqs = [
  ["Quanto custa o Sistema de Caixa Pro?", "O Plano Pro custa R$ 100,00 por mês, sem fidelidade obrigatória."],
  ["Como faço o pagamento?", "O pagamento é realizado por PIX. Depois, envie o comprovante pela área segura para análise."],
  ["Quando meu acesso será liberado?", "Após a confirmação do pagamento pelo administrador. Você acompanha cada etapa pela área do cliente."],
  ["Posso entrar usando minha conta Google?", "Sim. O cadastro e o login podem ser realizados com uma conta Google configurada no projeto."],
  ["Posso cancelar?", "Sim. A cobrança é mensal e não existe fidelidade obrigatória."],
  ["Funciona no celular?", "O site e a área do cliente se adaptam a celulares, tablets, notebooks e computadores."],
  ["Meus dados ficam protegidos?", "Usamos sessões seguras, senhas com hash, controle de acesso, validação e logs de auditoria."],
];

export default function Home() {
  return <main>
    <SiteHeader />
    <section className="hero" id="inicio">
      <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={16} /> Gestão simples para negócios reais</div>
          <h1>Seu negócio organizado.<br/><span>Suas vendas sob controle.</span></h1>
          <p>Gerencie produtos, estoque, clientes, vendas, caixa e relatórios em uma plataforma simples, rápida e eficiente.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/criar-conta">Criar minha conta <ArrowRight size={19}/></Link>
            <a className="button button-ghost" href="#recursos">Conhecer os recursos</a>
          </div>
          <div className="trust-row">
            <span><BadgeCheck size={17}/> Fácil de usar</span><span><ShieldCheck size={17}/> Dados protegidos</span>
            <span><Wifi size={17}/> Acesso online</span><span><Clock3 size={17}/> Suporte humano</span>
          </div>
        </div>
        <Reveal><DashboardMockup /></Reveal>
      </div>
    </section>

    <section className="quick-strip"><div className="container quick-grid">
      <div><strong>Venda.</strong><span>Sem complicação.</span></div><div><strong>Organize.</strong><span>Sem planilhas.</span></div>
      <div><strong>Entenda.</strong><span>Sem relatórios confusos.</span></div><div><strong>Cresça.</strong><span>Com controle.</span></div>
    </div></section>

    <section className="section" id="recursos"><div className="container">
      <Reveal><div className="section-heading"><span className="kicker">Tudo conectado</span><h2>As ferramentas certas,<br/>no lugar certo.</h2><p>Da primeira venda ao fechamento do mês, cada informação conversa com a próxima.</p></div></Reveal>
      <div className="feature-grid">{features.map(({icon: Icon,...item}, i) => <Reveal key={item.title} delay={i%4*70}><article className={`feature-card accent-${item.accent}`}><div className="feature-icon"><Icon/></div><h3>{item.title}</h3><p>{item.text}</p><span>Explorar recurso <ArrowRight size={16}/></span></article></Reveal>)}</div>
    </div></section>

    <section className="section showcase"><div className="container split-showcase">
      <Reveal><div className="showcase-copy"><span className="kicker kicker-light">Frente de caixa</span><h2>Venda rápido.<br/>O sistema cuida do resto.</h2><p>Encontre o produto, confirme a quantidade e escolha o pagamento. O estoque, o caixa e os relatórios são atualizados juntos.</p><ul className="check-list"><li><Check/> Leitor de código de barras automático</li><li><Check/> Dinheiro, PIX, débito, crédito e fiado</li><li><Check/> Impressão opcional de comprovante</li><li><Check/> Cálculo de troco em tempo real</li></ul></div></Reveal>
      <Reveal delay={120}><div className="pos-card"><div className="pos-top"><span>Nova venda</span><b>Caixa aberto</b></div><div className="scan-field"><ScanBarcode/><span>Leia ou digite o código do produto</span><kbd>F2</kbd></div><div className="pos-item"><div className="product-dot orange"/><div><strong>Café especial 500g</strong><small>Quantidade 2 × R$ 21,90</small></div><b>R$ 43,80</b></div><div className="pos-item"><div className="product-dot blue"/><div><strong>Leite integral 1L</strong><small>Quantidade 3 × R$ 6,40</small></div><b>R$ 19,20</b></div><div className="pos-total"><span>Total da venda</span><strong>R$ 63,00</strong></div><button>Finalizar venda <ArrowRight size={18}/></button></div></Reveal>
    </div></section>

    <section className="section" id="como-funciona"><div className="container">
      <Reveal><div className="section-heading center"><span className="kicker">Comece sem complicação</span><h2>Da conta à primeira venda<br/>em três passos.</h2></div></Reveal>
      <div className="steps">{[["01","Crie sua conta","Cadastre-se com e-mail e senha ou use sua conta Google."],["02","Configure sua empresa","Informe os dados da empresa, produtos, equipe e formas de pagamento."],["03","Comece a vender","Abra o caixa, registre as vendas e acompanhe os resultados."]].map((s,i)=><Reveal key={s[0]} delay={i*100}><article><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p></article></Reveal>)}</div>
    </div></section>

    <section className="section plan-section" id="plano"><div className="container plan-grid">
      <Reveal><div className="plan-copy"><span className="kicker">Preço simples e transparente</span><h2>Um plano completo.<br/>Nenhuma surpresa.</h2><p>Controle o negócio inteiro com uma assinatura mensal. Sem fidelidade e com cancelamento disponível.</p><div className="plan-notes"><span><CircleDollarSign/> Cobrança mensal</span><span><BadgeCheck/> Acesso após aprovação</span><span><Clock3/> Validade de 30 dias</span></div></div></Reveal>
      <Reveal delay={120}><article className="pricing-card"><div className="popular">PLANO PRO</div><p>Tudo o que você precisa para controlar seu negócio.</p><div className="price"><sup>R$</sup><strong>100</strong><span>,00<br/><small>/mês</small></span></div><ul>{["Frente de caixa completa","Produtos ilimitados","Estoque e clientes","Financeiro e relatórios","Usuários e permissões","Backup e atualizações","Suporte pelo WhatsApp"].map(x=><li key={x}><Check/>{x}</li>)}</ul><Link href="/checkout" className="button button-primary">Assinar por R$ 100/mês <ArrowRight/></Link><small>Pagamento via PIX · sem renovação automática</small></article></Reveal>
    </div></section>

    <section className="section faq-section" id="faq"><div className="container faq-grid"><Reveal><div><span className="kicker">Perguntas frequentes</span><h2>Ficou com alguma dúvida?</h2><p>Se preferir, nossa equipe também conversa com você pelo WhatsApp.</p><a className="button button-dark" target="_blank" href="https://wa.me/5516993701293?text=Ol%C3%A1%21%20Vim%20pelo%20site%20do%20Sistema%20de%20Caixa%20Pro%20e%20gostaria%20de%20saber%20mais.">Falar com o suporte</a></div></Reveal><div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>

    <footer><div className="container footer-grid"><div><div className="brand brand-light"><span className="brand-mark"><ScanBarcode/></span><span>Sistema de Caixa <b>Pro</b></span></div><p>Controle suas vendas, estoque e caixa em um só lugar.</p></div><div><strong>Produto</strong><a href="#recursos">Recursos</a><a href="#como-funciona">Como funciona</a><a href="#plano">Plano Pro</a></div><div><strong>Conta</strong><Link href="/entrar">Entrar</Link><Link href="/criar-conta">Criar conta</Link><Link href="/painel">Área do cliente</Link></div><div><strong>Suporte</strong><a href="https://wa.me/5516993701293">WhatsApp</a><span>(16) 99370-1293</span><Link href="/privacidade">Privacidade</Link></div></div><div className="container footer-bottom"><span>© 2026 Sistema de Caixa Pro.</span><span>Feito para o comércio brasileiro.</span></div></footer>
    <WhatsAppButton />
  </main>;
}
