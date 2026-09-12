# Pesquisa Stoka

Aplicação web para validação de mercado do **Projeto STOKA** — formulário digital de entrevista, dashboard analítico e sistema de autenticação.

## 🚀 Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (design tokens idênticos a `pesquisastoka.abacusai.app`)
- **CockroachDB** (PostgreSQL compatível) — banco de dados em cloud
- **JWT** via `jose` — autenticação segura com cookies HTTP-only
- **Recharts** — gráficos do dashboard

## 📦 Instalação local

```bash
npm install
cp .env.example .env.local
# Edite o .env.local com as credenciais correctas
npm run db:init   # Cria tabelas e admin padrão
npm run dev       # http://localhost:3000
```

## 🔑 Credenciais padrão

| Campo   | Valor               |
|---------|---------------------|
| Email   | admin@stoka.mz      |
| Senha   | adminstoka2025      |

> Altere as credenciais em produção via as variáveis de ambiente `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

## 📄 Páginas

| URL           | Descrição                              |
|---------------|----------------------------------------|
| `/`           | Formulário de entrevista (público)     |
| `/login`      | Login para administradores             |
| `/dashboard`  | Dashboard analítico (protegido)        |

## 🌐 Deploy na Vercel

1. Faça push para o repositório GitHub:
   ```bash
   git add .
   git commit -m "feat: initial release Pesquisa Stoka"
   git push origin main
   ```
2. Importe o repositório em [vercel.com](https://vercel.com).
3. Configure as variáveis de ambiente na Vercel (Settings → Environment Variables):
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_NAME`
4. Faça deploy. A Vercel detecta automaticamente o Next.js.

> **Nota:** Após o primeiro deploy, execute `npm run db:init` apontando para o banco de produção para criar as tabelas.

## 🗄️ Estrutura do Banco (CockroachDB)

- **`users`** — utilizadores com hash bcrypt (role: admin)
- **`surveys`** — entrevistas completas com todas as secções A–F em colunas + JSONB

## 📊 Dashboard

- KPIs: total de entrevistas, bairros, taxa de interesse, top problema
- Gráficos: tipo de estabelecimento, problemas, disposição para pagar, qualidade internet, prioridades (radar), timeline
- Tabela com filtros por entrevistador e bairro
- Modal de detalhe de entrevista
- Exportação para CSV
