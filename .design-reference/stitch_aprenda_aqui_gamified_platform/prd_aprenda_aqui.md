# PRD: Aprenda Aqui! - Plataforma de Educação Gamificada

## Visão Geral
Uma plataforma de ensino de programação inspirada no Duolingo, focada em iniciantes brasileiros. O aprendizado é baseado em micro-lições, gamificação intensa (XP, Streaks, Ligas) e prática imediata através de um editor de código integrado.

## Stack Técnica Solicitada
- **Linguagem:** TypeScript
- **Frontend Recomendado:** React / Next.js (Tailwind CSS para o estilo visual)
- **Backend Recomendado:** Node.js (Express ou NestJS)
- **Banco de Dados:** MySQL
- **ORM:** Prisma ou TypeORM (para máxima compatibilidade com TypeScript)

## Funcionalidades Principais

### 1. Sistema de Usuário e Gamificação
- Autenticação (Login/Cadastro).
- Perfil do Aluno: Nível de XP, Sequência de Dias (Streak), Total de XP.
- Sistema de Ligas: Ranking semanal baseado no XP acumulado.
- Metas Diárias: Progresso de XP por dia.

### 2. Trilhas e Lições
- Gerenciamento de Trilhas (HTML, CSS, JS, Python).
- Mapa de Aprendizado: Visualização de progresso em árvore de lições (estilo Duolingo).
- Tipos de Desafios:
    - Múltipla escolha.
    - Desafios de código (Editor interativo).

### 3. Editor de Código (Interface de Lição)
- Instruções dinâmicas à esquerda.
- Editor de código (ex: Monaco Editor ou CodeMirror) à direita.
- Preview em tempo real do código HTML/CSS.
- Validação lógica do código submetido.

## Requisitos Visuais (Design System)
- **Cores:** Verde Elétrico (#58CC02), Marinho Profundo (#1C1F4A), Branco Puro (#FFFFFF).
- **Tipografia:** Nunito Sans (Chunky, arredondada).
- **Estética:** Bouncy, vibrante, estilo "premium mobile game".
- **Componentes:** Cards com sombras suaves, botões pill-shape com sombras coloridas, barras de progresso arredondadas.

## Estrutura do Banco de Dados (MySQL)
- `users`: id, name, email, password, xp_total, current_streak, last_activity.
- `tracks`: id, title, description, icon_url.
- `lessons`: id, track_id, title, type (quiz/code), content, solution.
- `user_progress`: user_id, lesson_id, completed_at.
- `leaderboards`: user_id, week_number, weekly_xp.
