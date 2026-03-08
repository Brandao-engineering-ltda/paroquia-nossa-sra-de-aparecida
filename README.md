# Paroquia Nossa Senhora Aparecida

Site e sistema de gestao da Paroquia Nossa Senhora Aparecida — Maringa, PR.

Inclui pagina institucional, sistema de autenticacao, calendario de eventos com agendamento e painel administrativo.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui, Lucide Icons
- **Estado:** Zustand (estado de UI)
- **Banco de dados:** Prisma 7 + SQLite (via `@prisma/adapter-better-sqlite3`)
- **Autenticacao:** Auth.js v5 (`next-auth@beta`) com Credentials provider
- **Tema:** Dark/light mode via `next-themes`
- **Testes:** Vitest + React Testing Library (173+ testes, 80%+ cobertura)
- **Qualidade:** ESLint, Husky (pre-commit hooks), gitleaks
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
      banners/
        route.ts                 # GET: listar banners, POST: criar banner
        [id]/route.ts            # PUT: editar, DELETE: excluir banner
      upload/
        route.ts                 # POST: upload de imagens (admin)
      health/
        route.ts                 # GET: verificacao de saude da aplicacao
    calendario/page.tsx      # Pagina do calendario (protegida)
    page.tsx                 # Landing page publica
    layout.tsx               # Layout raiz com ThemeProvider + SessionProvider
    loading.tsx              # Skeleton de carregamento global
  components/
    auth/                    # SessionProvider, LoginForm, RegisterForm
    admin/                   # AdminSidebar, UserTable, AdminEventList
    calendario/              # CalendarGrid, EventForm, EventDetail
    skeletons/               # Componentes de skeleton loading
    ui/                      # Componentes shadcn/ui
    Header.tsx               # Navbar glassmorphica flutuante com indicador animado
    HomeContent.tsx          # Wrapper client com lazy loading (next/dynamic)
    BannerShowcase.tsx       # Carrossel de banners/destaques com snap scroll
    FloatingToolbar.tsx      # Toolbar flutuante para calendario/admin
    ThemeProvider.tsx         # Provider de tema (next-themes)
    ThemeToggle.tsx           # Botao de alternancia dark/light
    EventsSection.tsx        # Server component - busca eventos do banco
    HeroSection.tsx          # Hero com logo, gradientes e CTA
    AboutSection.tsx         # Secao sobre a paroquia
    MassScheduleSection.tsx  # Horarios das missas
    ContactSection.tsx       # Informacoes de contato
    Footer.tsx               # Rodape com links e informacoes
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

**Banner**
| Campo       | Tipo    | Descricao                               |
|-------------|---------|---------------------------------------- |
| id          | String  | ID unico (cuid)                         |
| title       | String  | Titulo do banner                        |
| subtitle    | String? | Subtitulo                               |
| description | String  | Descricao                               |
| date        | String? | Data do evento `"2026-03-15"`           |
| startTime   | String? | Horario de inicio                       |
| endTime     | String? | Horario de termino                      |
| location    | String? | Local                                   |
| imageUrl    | String? | URL da imagem (upload local)            |
| ctaText     | String? | Texto do botao de acao                  |
| ctaUrl      | String? | URL de destino do CTA                   |
| gradient    | String  | Classe CSS do gradiente de fundo        |
| order       | Int     | Ordem de exibicao no carrossel          |
| isActive    | Boolean | Visibilidade (default: true)            |

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

O tema dark utiliza variantes automaticas via CSS custom properties (`:root` para light, `.dark` para dark). Todos os componentes usam tokens semanticos (`text-foreground`, `bg-card`, `bg-secondary`, etc.) em vez de cores fixas para garantir legibilidade em ambos os temas.

## Funcionalidades

### Navbar glassmorphica

A landing page utiliza uma navbar flutuante com efeito glassmorphism que:
- Inicia transparente sobre o hero e transiciona para um pill translucido ao rolar
- Indicador animado deslizante que segue o link ativo (spring easing)
- Cores adaptam entre branco (sobre hero) e tematicas (apos scroll)
- Detecta secao ativa via IntersectionObserver

### Banner showcase

Secao de destaques/eventos com carrossel horizontal:
- Snap scroll com navegacao por setas e dots indicadores
- Cards com camadas: imagem de fundo, overlay de gradiente, scrim escuro, conteudo
- 12 opcoes de gradiente incluindo "sem gradiente"
- Upload de imagens locais (validacao de tipo/tamanho, UUID para nomes)
- Gerenciamento completo no painel admin (CRUD + reordenacao)

### Calendario

Calendario interativo com 4 visualizacoes (Dia/Semana/Mes/Ano):
- Toggle animado com indicador deslizante entre visualizacoes
- Busca com highlight parcial em titulo, descricao e local
- Animacoes de entrada escalonadas nas celulas (staggered fade-in)
- Indicador pulsante no dia atual
- Hover com micro-interacoes (lift, glow, color shift)
- Chips de evento com gradiente e shimmer no hover
- Transicoes suaves entre visualizacoes e navegacao
- Estilo glassmorphico na barra de controles e busca
- Fundo decorativo com orbs de blur

### Skeleton loading

Todos os componentes da landing page usam `next/dynamic` com fallbacks de skeleton para carregamento progressivo. As paginas internas (`/calendario`, `/admin`) tambem possuem loading states via `loading.tsx` do App Router.

### Floating toolbar

Paginas protegidas (calendario e admin) exibem uma toolbar flutuante no canto superior direito com:
- Navegacao rapida (Home, Calendario, Admin)
- Indicador de pagina ativa com anel dourado animado (conic-gradient)
- Alternancia de tema (dark/light)
- Efeito glassmorphism com backdrop-blur e grain overlay

### Tema dark/light

Alternancia de tema via `next-themes` com:
- Deteccao automatica do tema do sistema (`enableSystem`)
- Persistencia da preferencia no `localStorage`
- Transicao sem flash (classe no `<html>` + `suppressHydrationWarning`)
- Paleta completa de cores para ambos os modos

## Testes

O projeto usa Vitest com React Testing Library e jsdom. Os testes cobrem componentes, APIs, middleware, store e utilitarios.

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npx vitest
```

**Cobertura:** threshold minimo de 80% para statements, branches, functions e lines.

**Exclusoes de cobertura:** componentes shadcn/ui, layouts, pages, loading states, skeletons e `prisma.ts`.

### Pre-commit hooks

O projeto usa Husky com hooks de pre-commit que executam:
1. **lint-staged** — ESLint nos arquivos alterados
2. **vitest run** — todos os testes
3. **gitleaks** — varredura de credenciais

## Scripts

| Comando                    | Descricao                                |
|----------------------------|------------------------------------------|
| `npm run dev`              | Servidor de desenvolvimento              |
| `npm run build`            | Build de producao                        |
| `npm run start`            | Inicia o servidor de producao            |
| `npm run lint`             | Executa o ESLint                         |
| `npm test`                 | Executa todos os testes                  |
| `npm run test:watch`       | Testes em modo watch                     |
| `npm run test:coverage`    | Testes com relatorio de cobertura        |
| `npx prisma db push`      | Sincroniza schema com o banco            |
| `npx prisma generate`     | Gera o Prisma Client                     |
| `npx tsx prisma/seed.ts`  | Popula o banco com dados iniciais        |
| `npx prisma studio`       | Interface visual para o banco            |
