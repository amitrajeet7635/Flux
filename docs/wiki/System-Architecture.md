## Flux System Architecture

## Overview

Flux is a **real-time multilingual customer support CRM** that bridges language barriers between support agents and customers.

The application is built around three core principles:

- **Real-time updates** — Agents see new tickets and messages as they arrive, with no page refresh needed
- **Automatic translation** — Every message is translated seamlessly between the customer's language and the agent's preferred language
- **Live preview** — Agents see exactly how their reply will appear to the customer before sending

---

## High-Level Architecture

The diagram below shows how all components of Flux connect and communicate:

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUX APPLICATION                        │
│                                                                 │
│  ┌─────────────┐     ┌──────────────────┐    ┌──────────────┐  │
│  │   Browser   │────▶│  Next.js 14 App  │───▶│  Lingo.dev   │  │
│  │  (Agent UI) │◀────│  (Server + Edge) │◀───│  Translation │  │
│  └─────────────┘     └────────┬─────────┘    └──────────────┘  │
│                               │                                 │
│                      ┌────────▼─────────┐                      │
│                       │    Supabase      │                      │
│                       │  ┌───────────┐  │                      │
│                       │  │PostgreSQL │  │                      │
│                       │  │  (tables) │  │                      │
│                       │  └─────┬─────┘  │                      │
│                       │  ┌─────▼─────┐  │                      │
│                       │  │ Realtime  │  │                      │
│                       │  │  (WS/PG)  │  │                      │
│                       │  └───────────┘  │                      │
│                       └─────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Flow

### Inbound Message Flow (Customer → Agent)

```
Customer sends message (any language)
        │
        ▼
POST /api/messages/inbound
        │
        ├──▶ Lingo.dev SDK
        │      translate(source_locale → agent_locale)
        │
        ├──▶ Supabase: INSERT into messages
        │      { body_original, body_translated, direction: "inbound" }
        │
        └──▶ Supabase Realtime broadcasts INSERT event
               │
               ▼
        Agent's MessageThread subscribes → UI updates live
```

### Outbound Message Flow (Agent → Customer)

```
Agent types reply in their language
        │
        ▼
[Live Preview]: POST /api/messages/preview
        ├──▶ Lingo.dev translates text → customer locale
        └──▶ ReplyBox shows preview in real-time (debounced)

Agent sends reply (Ctrl/Cmd + Enter)
        │
        ▼
POST /api/messages/outbound
        │
        ├──▶ Lingo.dev SDK
        │      translate(agent_locale → customer_locale)
        │
        ├──▶ Supabase: INSERT into messages
        │      { body_original, body_translated, direction: "outbound" }
        │
        └──▶ Supabase Realtime broadcasts INSERT event
               │
               ▼
        MessageThread re-renders with new message
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Full-stack React framework |
| **Language** | TypeScript 5 | Type safety throughout |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **Database** | Supabase (PostgreSQL) | Persistent storage + real-time |
| **Real-time** | Supabase Realtime | WebSocket-based live updates |
| **Translation** | Lingo.dev SDK | AI-powered multilingual translation |
| **UI Translation** | Lingo.dev Compiler | Next.js compile-time UI localization |

---

## Supported Locales

Flux supports 7 locales across the full stack:

| Locale | Language |
|--------|----------|
| `en` | 🇬🇧 English (default) |
| `de` | 🇩🇪 Deutsch (German) |
| `ja` | 🇯🇵 日本語 (Japanese) |
| `ar` | 🇸🇦 العربية (Arabic) |
| `fr` | 🇫🇷 Français (French) |
| `es` | 🇪🇸 Español (Spanish) |
| `pt` | 🇧🇷 Português (Portuguese) |

---

## Data Flow Summary

```
┌──────────────────────────────────────────────────────────────────┐
│                     END-TO-END DATA FLOW                         │
│                                                                  │
│  Customer        API Route        Lingo.dev       Supabase       │
│     │                │                │               │          │
│     │── POST inbound ──▶             │               │          │
│     │                │── translate() ──▶             │          │
│     │                │◀── translated ──              │          │
│     │                │── INSERT message ────────────▶│          │
│     │                │◀──── message row ─────────────│          │
│     │                │                               │──▶ Realtime │
│     │                │                               │    event  │
│     │                │                               │           │
│  Agent UI ◀──────────────────────────────── WS push ─┘          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```
