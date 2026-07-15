"use client";
import Link from "next/link";
import { Menu, ScanBarcode, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container nav">
    <Link href="/" className="brand"><span className="brand-mark"><ScanBarcode /></span><span>Sistema de Caixa <b>Pro</b></span></Link>
    <nav className={open ? "nav-links open" : "nav-links"}>
      <Link href="/#recursos" onClick={() => setOpen(false)}>Recursos</Link><Link href="/#como-funciona" onClick={() => setOpen(false)}>Como funciona</Link><Link href="/#plano" onClick={() => setOpen(false)}>Plano</Link><Link href="/#faq" onClick={() => setOpen(false)}>Perguntas</Link><a href="https://wa.me/5516993701293">Suporte</a>
      <div className="mobile-actions"><Link href="/entrar">Entrar</Link><Link className="button button-primary" href="/criar-conta">Criar conta</Link></div>
    </nav>
    <div className="nav-actions"><Link href="/entrar">Entrar</Link><Link className="button button-primary compact" href="/criar-conta">Criar conta</Link></div>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menu">{open ? <X /> : <Menu />}</button>
  </div></header>;
}
