# Deploy no Railway — Aprenda Aqui

O projeto é um monorepo com **3 peças** no Railway:

| Serviço | Função | Config Railway |
|---------|--------|----------------|
| **MySQL** | Banco de dados | Template MySQL do Railway |
| **Web** | Next.js (porta `PORT`) | `railway.web.toml` |
| **API** | Express (porta `PORT`) | `railway.api.toml` |

## 1. Criar o projeto

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → selecione este repositório.
2. Adicione **MySQL**: **+ New** → **Database** → **MySQL**.
3. Crie **dois serviços** a partir do mesmo repo (duas vezes **GitHub Repo** ou **Empty Service** + conecte o repo):
   - Renomeie um para `web`.
   - Renomeie o outro para `api`.

## 2. Config file por serviço

Em cada serviço: **Settings** → **Config-as-code** → **Config file path**:

- Serviço **web**: `railway.web.toml`
- Serviço **api**: `railway.api.toml`

O **MySQL** não precisa de config file.

## 3. Domínios públicos

Gere domínio em **Settings → Networking → Generate Domain** para **web** e **api**.

Anote as URLs (exemplo):

- Web: `https://aprenda-web-production.up.railway.app`
- API: `https://aprenda-api-production.up.railway.app`

## 4. Variáveis de ambiente

Configure no painel **Variables** (ou referências `${{MySQL.*}}`).

### MySQL → compartilhar com Web e API

No serviço **MySQL**, copie a variável `MYSQL_URL` (ou use referência).

Nos serviços **web** e **api**, adicione:

| Variável | Valor | Onde |
|----------|-------|------|
| `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` | **web** e **api** |

> O Prisma usa `DATABASE_URL`. O Railway expõe `MYSQL_URL` no plugin MySQL; mapeie para `DATABASE_URL` com a referência acima.

### Serviço Web

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` | Sim |
| `NEXTAUTH_SECRET` | String aleatória longa (ex.: `openssl rand -base64 32`) | Sim |
| `NEXTAUTH_URL` | URL pública do **web** (com `https://`) | Sim |
| `NEXT_PUBLIC_API_URL` | URL pública da **api** (com `https://`, sem barra no final) | Sim |
| `NODE_ENV` | `production` | Recomendado (Railway costuma definir) |

### Serviço API

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `DATABASE_URL` | `${{MySQL.MYSQL_URL}}` | Sim |
| `NEXTAUTH_SECRET` | **Mesmo valor** do serviço web | Sim |
| `NEXTAUTH_URL` | URL pública do **web** (igual ao web) | Sim (CORS) |
| `NODE_ENV` | `production` | Recomendado |

`PORT` é injetado automaticamente pelo Railway — não defina manualmente.

### Exemplo preenchido

Substitua pelas suas URLs reais:

```env
# Web + API (compartilhadas)
DATABASE_URL=${{MySQL.MYSQL_URL}}
NEXTAUTH_SECRET=sua-chave-secreta-minimo-32-caracteres
NEXTAUTH_URL=https://aprenda-web-production.up.railway.app

# Só no Web
NEXT_PUBLIC_API_URL=https://aprenda-api-production.up.railway.app
```

## 5. Ordem de deploy

1. Suba o **MySQL** e aguarde ficar healthy.
2. Deploy da **api** (roda `prisma migrate deploy` no `releaseCommand`).
3. Deploy do **web**.

## 6. Sincronizar trilhas do banco local para produção

Se você criou ou editou trilhas localmente e quer enviar para produção **sem apagar usuários**:

1. No Railway → **MySQL** → **Settings** → **Networking**, copie o endereço público (ex.: `algo.proxy.rlwy.net:40404`).
2. Na raiz do projeto, crie `.env.railway` (arquivo **ignorado pelo Git**):

```bash
cp .env.railway.example .env.railway
# Edite .env.railway com host, porta e senha reais
pnpm run db:sync-tracks
```

O script copia `tracks`, `units`, `lessons` e `track_chests` por `slug`. Trilhas que já existem com o mesmo conteúdo são ignoradas; trilhas novas são criadas.

> Use a URL **pública** (TCP Proxy), não `mysql.railway.internal`.

## 7. Seed (opcional, só primeira vez)

Se o banco estiver vazio e quiser dados iniciais, no serviço **api** (ou one-off):

```bash
pnpm run db:seed
```

Use **Railway CLI** ou um job temporário — não deixe seed automático em todo deploy.

## 8. Checklist pós-deploy

- [ ] `https://sua-api/health` retorna `{"status":"ok"}`
- [ ] Login em `https://sua-web/login` funciona
- [ ] Dashboard carrega (confirma `NEXT_PUBLIC_API_URL` e `NEXTAUTH_SECRET` iguais nos dois serviços)

## 9. Problemas comuns

| Sintoma | Causa provável |
|---------|----------------|
| MySQL sem tabelas | `DATABASE_URL` ausente no serviço **api** ou migrate não rodou — veja logs do deploy |
| Healthcheck `/health` falha | API não subiu (confira logs); serviço **api** precisa de `DATABASE_URL` + `NEXTAUTH_SECRET` |
| Erro de conexão MySQL | `DATABASE_URL` ausente ou URL errada |
| CORS / API bloqueada | `NEXTAUTH_URL` no api diferente da URL real do web |
| Dashboard vazio | `NEXT_PUBLIC_API_URL` errada ou API fora do ar |
| 401 na API | `NEXTAUTH_SECRET` diferente entre web e api |
| Build falha Prisma | `build:web` / `build:api` já rodam `prisma generate` |
| Login no iPhone/Safari: “servidor não pode ser encontrado” e URL `*.railway.internal` | `NEXTAUTH_URL` apontando para host **interno** do Railway. Use a URL **pública** (`https://….up.railway.app` ou domínio customizado). **Nunca** use `*.railway.internal` em `NEXTAUTH_URL`. O app tenta corrigir via `RAILWAY_PUBLIC_DOMAIN`, mas defina `NEXTAUTH_URL` corretamente no painel. |

Se o MySQL exigir SSL e o Prisma falhar, tente acrescentar na URL (conforme documentação Railway/Prisma):

`?sslaccept=strict`

## 10. Desenvolvimento local

Copie `.env.example` para `.env` na raiz do repositório e ajuste os valores locais.
