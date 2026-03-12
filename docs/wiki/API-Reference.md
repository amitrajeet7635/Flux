## Flux API Reference

## Overview

Flux provides three internal API routes for message handling and translation preview. All routes are **Next.js Route Handlers** located under `/src/app/api/messages/`.

All endpoints accept and return `application/json`.

---

## Endpoints

### `POST /api/messages/inbound`

Handles an **incoming customer message**. Translates the message from the customer's locale to the agent's display locale, then stores both versions in the database.

#### Request Body

```json
{
  "ticket_id": "string (UUID)",
  "body_original": "string",
  "source_locale": "string (e.g. 'de', 'ja')",
  "agent_locale": "string (e.g. 'en')"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ticket_id` | UUID string | ✅ | The ticket this message belongs to |
| `body_original` | string | ✅ | The raw message text from the customer |
| `source_locale` | string | ✅ | The customer's language code |
| `agent_locale` | string | ✅ | The agent's preferred language code |

#### Response

**201 Created**

```json
{
  "message": {
    "id": "uuid",
    "ticket_id": "uuid",
    "body_original": "Hallo, ich brauche Hilfe.",
    "body_translated": "Hello, I need help.",
    "direction": "inbound",
    "locale": "de",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**400 Bad Request** — Missing required fields  
**500 Internal Server Error** — Database error or translation failure

#### Translation Logic

```
if source_locale === agent_locale:
    body_translated = body_original  (no translation needed)
else:
    body_translated = lingo.localizeText(body_original, {
        sourceLocale: source_locale,
        targetLocale: agent_locale
    })
```

---

### `POST /api/messages/outbound`

Handles an **agent reply**. Translates the reply from the agent's locale to the customer's locale, then stores both versions in the database.

#### Request Body

```json
{
  "ticket_id": "string (UUID)",
  "body_original": "string",
  "agent_locale": "string (e.g. 'en')",
  "customer_locale": "string (e.g. 'fr')"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ticket_id` | UUID string | ✅ | The ticket this reply belongs to |
| `body_original` | string | ✅ | The agent's reply text |
| `agent_locale` | string | ✅ | The agent's language code |
| `customer_locale` | string | ✅ | The customer's language code |

#### Response

**201 Created**

```json
{
  "message": {
    "id": "uuid",
    "ticket_id": "uuid",
    "body_original": "I can help you with that!",
    "body_translated": "Je peux vous aider avec ça !",
    "direction": "outbound",
    "locale": "en",
    "created_at": "2024-01-15T10:35:00Z"
  }
}
```

**400 Bad Request** — Missing required fields  
**500 Internal Server Error** — Database error or translation failure

#### Translation Logic

```
if agent_locale === customer_locale:
    body_translated = body_original  (no translation needed)
else:
    body_translated = lingo.localizeText(body_original, {
        sourceLocale: agent_locale,
        targetLocale: customer_locale
    })
```

---

### `POST /api/messages/preview`

Provides a **live translation preview** as the agent types. This endpoint does **not** store any data — it only returns the translation result for display purposes.

#### Request Body

```json
{
  "text": "string",
  "sourceLocale": "string",
  "targetLocale": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | ✅ | The text to translate |
| `sourceLocale` | string | ✅ | Source language code |
| `targetLocale` | string | ✅ | Target language code |

#### Response

**200 OK**

```json
{
  "translated": "Bonjour, comment puis-je vous aider ?"
}
```

If `sourceLocale === targetLocale`, the original text is returned unchanged:

```json
{
  "translated": "Hello, how can I help you?"
}
```

**400 Bad Request** — Missing required fields  
**500 Internal Server Error** — Translation failure

#### Usage

This endpoint is called by the `ReplyBox` component with a **debounce** to avoid excessive API calls while the agent is still typing. The preview appears below the text input in real-time.

---

## TypeScript Interfaces

The request/response types are defined in `/src/types/index.ts`:

```typescript
interface InboundMessageRequest {
  ticket_id: string;
  body_original: string;
  source_locale: string;
  agent_locale: string;
}

interface OutboundMessageRequest {
  ticket_id: string;
  body_original: string;
  agent_locale: string;
  customer_locale: string;
}

interface Message {
  id: string;
  ticket_id: string;
  body_original: string;
  body_translated: string | null;
  direction: 'inbound' | 'outbound';
  locale: string;
  created_at: string;
}
```

---

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "error": "Description of what went wrong"
}
```

| Status | Meaning |
|--------|---------|
| `201` | Message created successfully |
| `200` | Preview translation returned |
| `400` | Validation error — missing required field |
| `500` | Server error — database or translation service failure |
