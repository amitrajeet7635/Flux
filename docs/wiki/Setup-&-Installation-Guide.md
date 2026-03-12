## Setup & Installation Guide

## Prerequisites

Before getting started, make sure you have the following:

- **Node.js** v18 or later
- **npm** or **yarn**
- A **Supabase** account — [supabase.com](https://supabase.com)
- A **Lingo.dev** account — [lingo.dev](https://lingo.dev)

---

## 1. Clone the Repository

```bash
git clone https://github.com/amitrajeet7635/Flux.git
cd Flux
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Lingo.dev
LINGO_API_KEY=your-lingo-api-key-here
```

### Getting Your Supabase Keys

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to **Settings → API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon / public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Important:** Never commit your `.env.local` file. It is already listed in `.gitignore`.

### Getting Your Lingo.dev API Key

1. Sign in to [lingo.dev](https://lingo.dev)
2. Navigate to your project settings
3. Copy your API key → `LINGO_API_KEY`

---

## 4. Set Up the Database

Run the initial schema migration in your Supabase project. You can do this via the Supabase SQL editor:

1. Go to your Supabase project → **SQL Editor**
2. Open and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

This will create the following tables:
- `customers` — customer accounts
- `agents` — support agent accounts
- `tickets` — support conversation threads
- `messages` — individual messages within tickets

It also seeds a **default agent** (`Support Agent`) and a **demo customer** (`Demo Customer`, communicates in German).

---

## 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 6. Test the Application

### Creating a Test Ticket

To test the full flow, you can insert a test ticket directly in Supabase SQL editor:

```sql
-- Insert a test ticket for the demo customer
INSERT INTO tickets (customer_id, status, source_locale)
VALUES ('00000000-0000-0000-0000-000000000002', 'open', 'de');
```

Then use the Flux inbox to reply to it.

### Simulating an Inbound Message

You can POST a test inbound message using curl or any HTTP client:

```bash
curl -X POST http://localhost:3000/api/messages/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "<your-ticket-uuid>",
    "body_original": "Hallo, ich brauche Hilfe mit meiner Bestellung.",
    "source_locale": "de",
    "agent_locale": "en"
  }'
```

This will create a new message in the ticket with the German text and its English translation.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start the development server with hot reload |
| Build | `npm run build` | Build the production application |
| Start | `npm run start` | Start the production server |
| Lint | `npm run lint` | Run ESLint on the source code |

---

## Project Structure Reference

```
Flux/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and client initializers
│   └── types/            # TypeScript type definitions
├── supabase/
│   └── migrations/       # Database migration SQL files
├── .env.local.example    # Environment variable template
├── next.config.js        # Next.js + Lingo.dev configuration
└── package.json          # Dependencies and scripts
```

---

## Troubleshooting

### Translation not working

- Verify that `LINGO_API_KEY` is set correctly in `.env.local`
- Ensure your Lingo.dev project has the required target locales configured (`de`, `ja`, `ar`, `fr`, `es`, `pt`)

### Real-time updates not working

- Confirm that **Realtime** is enabled for the `tickets` and `messages` tables in your Supabase project
- Check that the migration script ran successfully (look for `ALTER PUBLICATION supabase_realtime ADD TABLE ...`)

### Database errors on startup

- Confirm all four tables (`customers`, `agents`, `tickets`, `messages`) were created
- Verify that `SUPABASE_SERVICE_ROLE_KEY` is correct — this key is needed for server-side API routes
