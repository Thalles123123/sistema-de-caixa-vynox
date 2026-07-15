import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
const body=Manrope({subsets:["latin"],variable:"--font-body"});const display=Sora({subsets:["latin"],variable:"--font-display"});
export const metadata:Metadata={title:{default:"Sistema de Caixa Pro",template:"%s | Sistema de Caixa Pro"},description:"Vendas, estoque, clientes, caixa e relatórios em uma plataforma simples para o comércio brasileiro.",metadataBase:new URL(process.env.NEXT_PUBLIC_APP_URL??"http://localhost:3000")};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body className={`${body.variable} ${display.variable}`}>{children}</body></html>}
