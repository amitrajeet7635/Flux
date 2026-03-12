-- Flux CRM: Initial Schema Migration
-- Run this in your Supabase SQL editor or via the Supabase CLI

-- customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  detected_locale TEXT NOT NULL DEFAULT 'en'
);

-- agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_locale TEXT NOT NULL DEFAULT 'en'
);

-- tickets table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL DEFAULT 'open',
  source_locale TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  body_original TEXT NOT NULL,
  body_translated TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  locale TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development (tighten in production)
CREATE POLICY "Allow all on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all on agents" ON agents FOR ALL USING (true);
CREATE POLICY "Allow all on tickets" ON tickets FOR ALL USING (true);
CREATE POLICY "Allow all on messages" ON messages FOR ALL USING (true);

-- Enable Realtime for tickets and messages
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Seed a default agent
INSERT INTO agents (id, name, display_locale)
VALUES ('00000000-0000-0000-0000-000000000001', 'Support Agent', 'en');

-- Seed a sample customer
INSERT INTO customers (id, name, detected_locale)
VALUES ('00000000-0000-0000-0000-000000000002', 'Demo Customer', 'de');
