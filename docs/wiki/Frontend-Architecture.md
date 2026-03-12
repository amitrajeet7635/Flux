## Flux Frontend Architecture

## Overview

The Flux frontend is a **Next.js 14 App Router** application written in TypeScript. It uses a hybrid rendering strategy — server components for initial data fetching and client components for real-time interactivity.

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Inbox page (Server Component)
│   ├── layout.tsx                # Root layout (TranslationProvider)
│   ├── globals.css               # Global styles
│   ├── settings/
│   │   └── page.tsx              # Agent settings page
│   ├── tickets/
│   │   └── [id]/
│   │       └── page.tsx          # Ticket detail page
│   └── api/
│       └── messages/
│           ├── inbound/
│           │   └── route.ts      # POST /api/messages/inbound
│           ├── outbound/
│           │   └── route.ts      # POST /api/messages/outbound
│           └── preview/
│               └── route.ts      # POST /api/messages/preview
│
├── components/
│   ├── NavBar.tsx                # Top navigation bar
│   ├── InboxList.tsx             # Real-time ticket list
│   ├── TicketCard.tsx            # Single ticket card preview
│   ├── MessageThread.tsx         # Conversation view with real-time updates
│   ├── MessageBubble.tsx         # Individual message display
│   ├── ReplyBox.tsx              # Agent reply input + live preview
│   ├── MagicToggle.tsx           # Translation enable/disable toggle
│   └── TranslationProvider.tsx   # Global translation context
│
├── lib/
│   ├── supabase.ts               # Browser-side Supabase client
│   ├── supabase-server.ts        # Server-side Supabase client
│   └── lingo.ts                  # Lingo.dev translation engine
│
└── types/
    └── index.ts                  # TypeScript interfaces (Ticket, Message, etc.)
```

---

## Component Architecture

### Component Hierarchy

```
layout.tsx (TranslationProvider)
│
├── NavBar (MagicToggle)
│
├── page.tsx [/] — Inbox
│   └── InboxList (client, realtime)
│       └── TicketCard (× N)
│
├── page.tsx [/tickets/[id]] — Ticket Detail
│   └── MessageThread (client, realtime)
│       ├── MessageBubble (× N)
│       └── ReplyBox
│
└── page.tsx [/settings] — Settings
```

---

## Component Reference

### `TranslationProvider`
- **Type**: Client Component (React Context)
- **Purpose**: Manages the global translation enabled/disabled state
- **State**: `translationEnabled: boolean` — persisted to `localStorage`
- **Consumed by**: `MagicToggle`, `MessageBubble`, `ReplyBox`

---

### `NavBar`
- **Type**: Client Component
- **Purpose**: Top navigation bar with Flux branding and navigation links
- **Features**: Links to Inbox and Settings, embeds `MagicToggle`

---

### `MagicToggle`
- **Type**: Client Component
- **Purpose**: Toggle button for enabling/disabling auto-translation
- **State**: Reads and updates `translationEnabled` from `TranslationContext`
- **Persistence**: State saved to `localStorage` for cross-session persistence

---

### `InboxList`
- **Type**: Client Component
- **Purpose**: Displays the full list of support tickets with live updates
- **Real-time**: Subscribes to Supabase Realtime on the `tickets` table
  - `INSERT` event → prepends new ticket to list
  - `UPDATE` event → updates existing ticket in-place
- **Renders**: List of `TicketCard` components

---

### `TicketCard`
- **Type**: Client Component
- **Purpose**: Shows a single ticket summary in the inbox list
- **Displays**: Customer name, latest message preview, status badge, locale, date
- **Navigation**: Clicking the card routes to `/tickets/[id]`

---

### `MessageThread`
- **Type**: Client Component
- **Purpose**: Shows the full conversation for a ticket with real-time updates
- **Real-time**: Subscribes to Supabase Realtime on the `messages` table for the current ticket
  - `INSERT` event → appends new message and scrolls to bottom
- **Renders**: List of `MessageBubble` components + `ReplyBox` at the bottom
- **Auto-scroll**: Scrolls to bottom on initial load and on new messages

---

### `MessageBubble`
- **Type**: Client Component
- **Purpose**: Displays a single message in the conversation
- **Direction**: 
  - `inbound` (customer) → left-aligned, white background
  - `outbound` (agent) → right-aligned, blue background
- **Translation**: Shows translated text if available; toggle button to view original
- **Respects**: `translationEnabled` context — hides translation toggle when disabled

---

### `ReplyBox`
- **Type**: Client Component
- **Purpose**: Text input for agent to compose and send replies
- **Live Preview**: Debounced call to `POST /api/messages/preview` as agent types
- **Send**: Submits via `POST /api/messages/outbound` on button click or `Ctrl/Cmd+Enter`
- **States**: idle, loading (preview), sending, error

---

## Rendering Strategy

| Page/Component | Rendering | Reason |
|---------------|-----------|--------|
| `app/page.tsx` (Inbox) | Server Component | Initial ticket data fetch at request time |
| `InboxList` | Client Component | Needs Supabase Realtime subscription |
| `app/tickets/[id]/page.tsx` | Server Component | Initial ticket + messages fetch |
| `MessageThread` | Client Component | Needs Realtime subscription |
| `ReplyBox` | Client Component | User interaction + API calls |
| `app/settings/page.tsx` | Client Component | Needs form state and async save |

---

## State Management

Flux uses a lightweight state management approach:

| State | Location | Mechanism |
|-------|----------|-----------|
| Translation enabled/disabled | `TranslationProvider` | React Context + localStorage |
| Ticket list | `InboxList` | useState + Supabase Realtime |
| Message thread | `MessageThread` | useState + Supabase Realtime |
| Reply text | `ReplyBox` | useState (local) |
| Translation preview | `ReplyBox` | useState + debounced fetch |
| Agent settings | `settings/page.tsx` | useState + Supabase fetch/update |

---

## Localization (UI Translation)

The entire Flux UI is localized via the **Lingo.dev Compiler** integrated into `next.config.js`.

```javascript
// next.config.js
module.exports = withLingo(nextConfig, {
  sourceRoot: './src',
  sourceLocale: 'en',
  targetLocales: ['de', 'ja', 'ar', 'fr', 'es', 'pt'],
  models: 'lingo.dev',
  buildMode: 'cache-only',
});
```

This means the UI text (labels, buttons, headings) is automatically translated at build time for all 7 supported locales, based on the agent's `display_locale` preference stored in the `agents` table.
