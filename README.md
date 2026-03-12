<div align="center">

# ⚡ Flux

**Real-time multilingual customer support CRM**

[![Status](https://img.shields.io/badge/status-Prototype-orange)](https://github.com/amitrajeet7635/Flux)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/amitrajeet7635/Flux)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/amitrajeet7635/Flux)
[![Wiki](https://img.shields.io/badge/docs-%20wiki-blue?logo=github)](https://github.com/amitrajeet7635/Flux/wiki)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Lingo.dev](https://img.shields.io/badge/Lingo.dev-AI%20Translation-purple)](https://lingo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

![Animated Line](https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif)

## 🎯 What is Flux?

Flux is a **real-time multilingual customer support CRM** that eliminates language barriers in customer service. Support agents can manage tickets while customers write in their native language — messages are automatically translated for the agent, and agent replies are translated back to the customer's language before sending.

> **The problem it solves:** Support teams are global, but customers write in dozens of languages. Traditional CRMs either force everyone to write in English or require manual copy-paste into external translation tools. Flux makes this seamless and automatic.

---

## ✨ Features

- 🌍 **Auto-translation** — Inbound customer messages are translated to the agent's preferred language instantly
- 🔄 **Real-time updates** — New tickets and messages appear live with no page refresh (powered by Supabase Realtime)
- 👁️ **Live translation preview** — Agents see how their reply will appear to the customer *as they type* (debounced)
- 🌐 **7 supported locales** — English, German, Japanese, Arabic, French, Spanish, Portuguese
- 🔀 **Toggle translations** — Agents can enable/disable translation display at any time
- ⚙️ **Agent settings** — Each agent sets their own display name and preferred language
- 📬 **Inbox management** — View, filter, and respond to tickets with status tracking (open / pending / closed)
- 🏗️ **Localized UI** — The entire interface is localized via Lingo.dev Compiler at build time

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 |
| **Database** | Supabase (PostgreSQL) |
| **Real-time** | Supabase Realtime (WebSockets) |
| **AI Translation** | [Lingo.dev](https://lingo.dev) SDK |
| **UI i18n** | Lingo.dev Compiler (Next.js integration) |

---

## 🏗️ Architecture

Flux architecture documentation is available in the **[Wiki](https://github.com/amitrajeet7635/Flux/wiki)**:

| Page | Description |
|------|-------------|
| 📐 [System Architecture](https://github.com/amitrajeet7635/Flux/wiki/System-Architecture) | High-level system design, component interaction, and data flow diagrams |
| 🖥️ [Frontend Architecture](https://github.com/amitrajeet7635/Flux/wiki/Frontend-Architecture) | Next.js app structure, component hierarchy, and rendering strategy |
| 🗄️ [Database Schema](https://github.com/amitrajeet7635/Flux/wiki/Database-Schema) | Supabase tables, relationships, RLS policies, and Realtime configuration |
| 🔌 [API Reference](https://github.com/amitrajeet7635/Flux/wiki/API-Reference) | REST API endpoints for message handling and translation preview |
| 🚀 [Setup & Installation](https://github.com/amitrajeet7635/Flux/wiki/Setup-&-Installation-Guide) | Step-by-step guide to run Flux locally |

> Architecture files are also available in the [`docs/wiki/`](./docs/wiki/) folder of this repository.

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) account
- A [Lingo.dev](https://lingo.dev) account

### Installation

```bash
# Clone the repository
git clone https://github.com/amitrajeet7635/Flux.git
cd Flux

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Lingo.dev credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Lingo.dev
LINGO_API_KEY=your-lingo-api-key-here
```

### Database Setup

Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor to create the schema, enable Realtime, and seed sample data.

For the full setup guide, see the **[Setup & Installation Wiki](https://github.com/amitrajeet7635/Flux/wiki/Setup-&-Installation-Guide)**.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Support Inbox
│   ├── tickets/[id]/         # Ticket detail & conversation
│   ├── settings/             # Agent settings
│   └── api/messages/         # API routes (inbound, outbound, preview)
├── components/               # React components
│   ├── InboxList             # Real-time ticket list
│   ├── MessageThread         # Conversation view
│   ├── ReplyBox              # Reply composer with live translation preview
│   ├── MagicToggle           # Translation on/off toggle
│   └── TranslationProvider   # Global translation context
├── lib/
│   ├── supabase.ts           # Browser Supabase client
│   ├── supabase-server.ts    # Server Supabase client
│   └── lingo.ts              # Lingo.dev translation engine
└── types/index.ts            # TypeScript interfaces
```

---

## 🌍 Supported Languages

| Code | Language |
|------|----------|
| `en` | 🇬🇧 English |
| `de` | 🇩🇪 Deutsch (German) |
| `ja` | 🇯🇵 日本語 (Japanese) |
| `ar` | 🇸🇦 العربية (Arabic) |
| `fr` | 🇫🇷 Français (French) |
| `es` | 🇪🇸 Español (Spanish) |
| `pt` | 🇧🇷 Português (Portuguese) |

---

## 📖 Documentation

Full documentation including architecture diagrams and setup guides is available in the **[Flux Wiki](https://github.com/amitrajeet7635/Flux/wiki)**.

![Animated Line](https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif)
