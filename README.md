# Flux

Flux is a multilingual customer support CRM built with **Next.js 15**, **Supabase**, and **Lingo.dev**. Support agents can read and reply to customer messages in any language — all from a single inbox — without ever manually translating anything.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database / Auth / Realtime**: Supabase
- **Translation**: Lingo.dev (`@lingo.dev/compiler` + `@lingo.dev/_sdk`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `LINGO_API_KEY` | Your Lingo.dev API key |

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/               # Next.js App Router pages and layouts
├── components/        # Reusable React components
├── lib/
│   ├── supabase.ts    # Supabase client instance
│   └── lingo.ts       # Lingo.dev SDK instance
├── types/
│   ├── database.ts    # Supabase schema types
│   └── index.ts       # Shared TypeScript types
├── public/            # Static assets
└── .env.example       # Environment variable template
```

## Lingo.dev Architecture

- **`@lingo.dev/compiler`** — Handles the dashboard UI i18n at **build time**. No JSON files, no translation keys, no `t()` calls. Just write standard JSX.
- **`@lingo.dev/_sdk`** — Handles **runtime** translation of dynamic content: incoming messages, outgoing replies, and Supabase JSON objects/arrays.

## Supabase Schema

| Table | Key Columns |
|---|---|
| `agents` | `id`, `name`, `display_locale` |
| `customers` | `id`, `name`, `detected_locale` |
| `tickets` | `id`, `customer_id`, `status`, `source_locale` |
| `messages` | `id`, `ticket_id`, `body_original`, `body_translated`, `direction`, `locale` |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Lint the codebase |
