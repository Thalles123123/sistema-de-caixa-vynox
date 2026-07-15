# Sistema de Caixa Pro - Site SaaS

Site comercial e portal de assinatura em Next.js 16, React 19, TypeScript, Prisma 6 e PostgreSQL.

## Recursos implementados

- Landing page responsiva com identidade própria e animações acessíveis.
- Cadastro com senha protegida por bcrypt e verificação de e-mail.
- Login Google real por OAuth, quando as credenciais forem configuradas.
- Recuperação de senha com token único de 15 minutos.
- Sessão de 24 horas, rate limit persistido e bloqueio administrativo.
- Perfil empresarial obrigatório antes do checkout.
- Plano Pro, PIX configurável, upload protegido e acompanhamento de status.
- Área do cliente com assinatura, vencimento, pagamentos e comprovantes.
- Administração protegida para aprovar ou recusar PIX e editar preço/PIX/WhatsApp.
- Logs de auditoria para ações sensíveis.

## Instalação

1. Instale Node.js 20.19 ou superior e PostgreSQL.
2. Copie `.env.example` para `.env` e preencha somente com suas próprias credenciais.
3. Crie o banco indicado em `DATABASE_URL`.
4. Execute:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`.

## Conta administrativa

Defina `ADMIN_EMAIL` e uma senha forte em `ADMIN_INITIAL_PASSWORD` antes de executar `npm run db:seed`. O seed não cria administrador com a senha de exemplo. Depois do primeiro acesso, troque a senha e remova a variável do ambiente.

## Google OAuth

1. Crie um cliente OAuth do tipo Aplicativo Web no Google Cloud Console.
2. Configure a origem `http://localhost:3000` no desenvolvimento.
3. Configure o callback `http://localhost:3000/api/auth/callback/google`.
4. Em produção, repita os dois endereços usando o domínio HTTPS real.
5. Preencha `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`.

## Resend

1. Valide o domínio de envio no Resend.
2. Preencha `RESEND_API_KEY` e `EMAIL_FROM`.
3. Sem Resend, os links são exibidos apenas no terminal em desenvolvimento; em produção nenhum e-mail é simulado.

## Produção

- Gere `AUTH_SECRET` com pelo menos 32 bytes aleatórios.
- Use PostgreSQL gerenciado com TLS e backups.
- Use HTTPS para que cookies seguros funcionem corretamente.
- Monte `PROOF_STORAGE_DIR` em volume privado persistente ou adapte o serviço para armazenamento S3 compatível.
- Não exponha a pasta de comprovantes como arquivo estático.
- Execute `npm run db:migrate`, `npm run db:seed`, `npm run build` e `npm start`.
- Configure `SYSTEM_APP_URL` com a URL real do sistema liberado para assinantes.

## Validação

```bash
npm run typecheck
npm run lint
npm run build
```

Nenhuma chave, senha ou token real deve ser enviado ao repositório.
