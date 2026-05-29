# Aprenda Aqui!

Plataforma de educação gamificada para aprender programação (HTML, CSS, JavaScript), inspirada no Duolingo.

## Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide Icons, Radix UI
- **Backend:** Express (TypeScript)
- **Banco:** MySQL + Prisma
- **Auth:** NextAuth.js (Credentials)

## Pré-requisitos

- Node.js 18+
- pnpm (`corepack enable`)
- Docker (para MySQL)

## Setup

```bash
# Instalar dependências
pnpm install

# Subir MySQL via Docker
docker compose up -d

# Configurar variáveis de ambiente
cp .env.example .env
cp .env.example apps/web/.env.local

# Gerar client Prisma e rodar migrations
pnpm db:generate
pnpm db:migrate

# Popular banco com dados demo
pnpm db:seed

# Iniciar frontend + API
pnpm dev
```

## URLs

- Frontend: http://localhost:3000
- API: http://localhost:4000
- Login demo: `demo@aprendaqui.com.br` / `demo123`

## Estrutura

```
apps/web/          → Next.js frontend
apps/api/          → Express API
packages/database/ → Prisma schema + client
```
