# Paroquia Nossa Senhora Aparecida

Site e sistema de gestao da Paroquia Nossa Senhora Aparecida — Maringa, PR.

Inclui pagina institucional, sistema de autenticacao, calendario de eventos com agendamento e painel administrativo.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Lucide Icons
- **Estado:** Zustand (estado de UI)
- **Banco de dados:** Prisma 7 + SQLite (via `@prisma/adapter-better-sqlite3`)
- **Autenticacao:** Auth.js v5 (`next-auth@beta`) com Credentials provider
- **Idioma:** Portugues brasileiro (pt-BR)

## Primeiros passos

### Pre-requisitos

- Node.js >= 20
- npm

### Instalacao

```bash
npm install
```

### Configuracao do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
AUTH_SECRET="gere-um-segredo-aqui"
DATABASE_URL="file:./dev.db"
```

Para gerar o `AUTH_SECRET`:

```bash
npx auth secret
```

### Banco de dados

Crie o banco e gere o client do Prisma:

```bash
npx prisma db push
npx prisma generate
```

Popule o banco com o usuario admin e eventos iniciais:

```bash
npx tsx prisma/seed.ts
```

Isso cria o usuario admin com as credenciais:

- **Email:** `admin@paroquia.com`
- **Senha:** `admin123`

### Executar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Arquitetura

### Estrutura de pastas

```
src/
  app/
    (auth)/                  # Grupo de rotas para login/registro (layout proprio)
      login/page.tsx
      registro/page.tsx
    admin/                   # Painel administrativo (protegido por middleware)
      layout.tsx             # Layout com sidebar
      page.tsx               # Dashboard com estatisticas
      usuarios/page.tsx      # Gerenciamento de usuarios
      eventos/page.tsx       # Gerenciamento de eventos
    api/
      auth/
        [...nextauth]/route.ts   # Endpoint Auth.js
        register/route.ts        # Registro de novos usuarios
      admin/
        users/[id]/route.ts      # PATCH: alterar papel/status do usuario
      eventos/
        route.ts                 # GET: listar eventos, POST: criar evento
        [id]/route.ts            # PUT: editar evento, DELETE: excluir evento
    calendario/page.tsx      # Pagina do calendario (protegida)
    page.tsx                 # Landing page publica
    layout.tsx               # Layout raiz com SessionProvider
  components/
    auth/                    # SessionProvider, LoginForm, RegisterForm
    admin/                   # AdminSidebar, UserTable, AdminEventList
    calendario/              # CalendarGrid, EventForm, EventDetail
    ui/                      # Componentes shadcn/ui
    Header.tsx               # Navegacao com links condicionais por autenticacao
    EventsSection.tsx        # Server component - busca eventos do banco
    ...                      # HeroSection, AboutSection, etc.
  lib/
    auth.ts                  # Configuracao do Auth.js (providers, callbacks)
    prisma.ts                # Singleton do PrismaClient com adapter SQLite
    utils.ts                 # Utilitarios (cn)
  store/
    useParishStore.ts        # Zustand - horarios de missa e estado de UI
  middleware.ts              # Protecao de rotas /admin e /calendario
  types/
    next-auth.d.ts           # Extensao dos tipos de sessao (role, id)
prisma/
  schema.prisma              # Modelos User e Event
  seed.ts                    # Script de seed (admin + eventos iniciais)
prisma.config.ts             # Configuracao do Prisma 7 (datasource URL)
```

### Modelos do banco

**User**
| Campo        | Tipo     | Descricao                              |
|--------------|----------|----------------------------------------|
| id           | String   | ID unico (cuid)                        |
| name         | String   | Nome completo                          |
| email        | String   | Email (unico)                          |
| passwordHash | String   | Hash bcrypt da senha                   |
| role         | String   | `"admin"` ou `"user"`                  |
| isActive     | Boolean  | Admin pode desativar para bloquear     |
| events       | Event[]  | Eventos criados pelo usuario           |

**Event**
| Campo       | Tipo    | Descricao                               |
|-------------|---------|---------------------------------------- |
| id          | String  | ID unico (cuid)                         |
| title       | String  | Titulo do evento                        |
| description | String  | Descricao                               |
| date        | String  | Data ISO `"2026-03-15"`                 |
| startTime   | String? | Horario de inicio `"09:00"`             |
| endTime     | String? | Horario de termino `"11:00"`            |
| location    | String? | Local do evento                         |
| createdBy   | User    | Relacao com o usuario criador           |

### Autenticacao e autorizacao

O sistema usa Auth.js v5 com Credentials provider (email + senha com bcrypt).

**Papeis:**
- `admin` — acesso total: painel admin, gerenciar usuarios e todos os eventos
- `user` — pode criar eventos e editar/excluir os proprios (se estiver ativo)

**Protecao de rotas** (via `middleware.ts`):
- `/admin/*` — requer papel `admin`
- `/calendario` — requer login

**Controle de acesso pelo admin:**
- Ativar/desativar usuarios (campo `isActive`) — usuarios desativados nao conseguem criar ou editar eventos
- Promover/rebaixar usuarios entre `admin` e `user`

### Fluxo de dados

```
Landing page (/)
  EventsSection (server component) --> Prisma --> SQLite
  Header (client component) --> useSession() --> mostra links condicionais

Calendario (/calendario)
  CalendarGrid (client component) --> fetch /api/eventos --> Prisma --> SQLite
  EventForm --> POST/PUT /api/eventos --> verifica auth + isActive --> Prisma

Admin (/admin)
  Dashboard --> Prisma (server component, contagens diretas)
  UserTable --> PATCH /api/admin/users/[id] --> verifica admin --> Prisma
```

### Paleta de cores

| Nome       | Hex       | Uso                         |
|------------|-----------|------------------------------|
| Navy       | `#1A3268` | Texto principal, titulos     |
| Royal      | `#2968A9` | Links, acentos, badges       |
| Gold       | `#C9A84C` | Botoes, CTAs, destaques      |
| Gold Light | `#D4BF7A` | Gradientes                   |
| Gold Dark  | `#A8893D` | Hover de botoes              |
| Ice        | `#EAF3FA` | Fundos de secoes             |
| Sky        | `#6DB8E3` | Acentos secundarios          |
| Light Blue | `#C5DFF0` | Bordas                       |

## Scripts

| Comando                    | Descricao                                |
|----------------------------|------------------------------------------|
| `npm run dev`              | Servidor de desenvolvimento              |
| `npm run build`            | Build de producao                        |
| `npm run start`            | Inicia o servidor de producao            |
| `npm run lint`             | Executa o ESLint                         |
| `npx prisma db push`      | Sincroniza schema com o banco            |
| `npx prisma generate`     | Gera o Prisma Client                     |
| `npx tsx prisma/seed.ts`  | Popula o banco com dados iniciais        |
| `npx prisma studio`       | Interface visual para o banco            |
