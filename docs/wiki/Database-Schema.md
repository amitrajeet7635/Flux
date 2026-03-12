## Flux Database Schema

## Overview

Flux uses **Supabase** (PostgreSQL) as its primary database. The schema is designed around four core tables that model the support workflow: customers, agents, tickets, and messages.

Supabase **Realtime** subscriptions are enabled on the `tickets` and `messages` tables to power live updates in the UI.

---

## Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
│  customers   │         │     tickets      │         │   messages   │
│──────────────│         │──────────────────│         │──────────────│
│ id (PK)      │◀────────│ customer_id (FK) │◀────────│ ticket_id(FK)│
│ name         │  1   N  │ id (PK)          │  1   N  │ id (PK)      │
│detected_locale│         │ status           │         │body_original │
└──────────────┘         │ source_locale    │         │body_translated│
                         │ created_at       │         │ direction    │
                         └──────────────────┘         │ locale       │
                                                       │ created_at   │
┌──────────────┐                                       └──────────────┘
│    agents    │
│──────────────│
│ id (PK)      │
│ name         │
│display_locale│
└──────────────┘
```

---

## Table Definitions

### `customers`

Represents the customers who submit support tickets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique customer identifier |
| `name` | `TEXT` | `NOT NULL` | Customer's display name |
| `detected_locale` | `TEXT` | `NOT NULL`, `DEFAULT 'en'` | The language code of the customer (e.g. `de`, `ja`, `fr`) |

---

### `agents`

Represents the support agents who use the Flux CRM.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique agent identifier |
| `name` | `TEXT` | `NOT NULL` | Agent's display name |
| `display_locale` | `TEXT` | `NOT NULL`, `DEFAULT 'en'` | Agent's preferred UI language (e.g. `en`, `de`, `fr`) |

> **Note:** In the current prototype, a single default agent (`00000000-0000-0000-0000-000000000001`) is seeded. In production, this should be linked to authenticated user sessions.

---

### `tickets`

Represents a support conversation thread between a customer and the support team.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique ticket identifier |
| `customer_id` | `UUID` | `NOT NULL`, `REFERENCES customers(id)` | The customer who opened this ticket |
| `status` | `TEXT` | `NOT NULL`, `DEFAULT 'open'` | Current ticket status: `open`, `pending`, or `closed` |
| `source_locale` | `TEXT` | `NOT NULL` | The locale of the customer (mirrors `customers.detected_locale`) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | When the ticket was created |

**Ticket Status Values:**

| Status | Meaning |
|--------|---------|
| `open` | Active ticket awaiting agent response |
| `pending` | Awaiting customer reply |
| `closed` | Resolved and closed |

---

### `messages`

Represents individual messages within a ticket conversation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique message identifier |
| `ticket_id` | `UUID` | `NOT NULL`, `REFERENCES tickets(id) ON DELETE CASCADE` | The ticket this message belongs to |
| `body_original` | `TEXT` | `NOT NULL` | The original message text (as written by sender) |
| `body_translated` | `TEXT` | nullable | The translated version of the message |
| `direction` | `TEXT` | `NOT NULL`, `CHECK (direction IN ('inbound', 'outbound'))` | `inbound` = customer → agent; `outbound` = agent → customer |
| `locale` | `TEXT` | `NOT NULL` | The locale of the original message |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | When the message was sent |

**Message Direction:**

| Direction | Meaning | `body_original` | `body_translated` |
|-----------|---------|----------------|------------------|
| `inbound` | Customer message | Customer's language | Agent's display language |
| `outbound` | Agent reply | Agent's display language | Customer's language |

---

## Row Level Security (RLS)

All four tables have **Row Level Security enabled**. The current policies are permissive (allow all) for development purposes:

```sql
CREATE POLICY "Allow all on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all on agents"    ON agents    FOR ALL USING (true);
CREATE POLICY "Allow all on tickets"   ON tickets   FOR ALL USING (true);
CREATE POLICY "Allow all on messages"  ON messages  FOR ALL USING (true);
```

> **Production Note:** These policies should be tightened to enforce authentication-based access control before deploying to production.

---

## Realtime Subscriptions

Supabase Realtime is enabled on two tables to power live UI updates:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

| Table | Subscription Used In | Events Listened |
|-------|---------------------|-----------------|
| `tickets` | `InboxList` component | `INSERT`, `UPDATE` |
| `messages` | `MessageThread` component | `INSERT` |

---

## Seed Data

The migration seeds the following default records for development:

```sql
-- Default support agent
INSERT INTO agents (id, name, display_locale)
VALUES ('00000000-0000-0000-0000-000000000001', 'Support Agent', 'en');

-- Demo customer (communicates in German)
INSERT INTO customers (id, name, detected_locale)
VALUES ('00000000-0000-0000-0000-000000000002', 'Demo Customer', 'de');
```
