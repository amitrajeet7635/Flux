-- Flux CRM: Dummy Seed Data
-- Run this in your Supabase SQL editor AFTER 001_initial_schema.sql

-- Seed customers
INSERT INTO customers (id, name, detected_locale) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Mara Steinberg',  'de'),
  ('11111111-0000-0000-0000-000000000002', 'Kenji Watanabe',  'ja'),
  ('11111111-0000-0000-0000-000000000003', 'Layla Hassan',    'ar'),
  ('11111111-0000-0000-0000-000000000004', 'Carlos Mendes',   'pt-BR')
ON CONFLICT (id) DO NOTHING;

-- Seed tickets
INSERT INTO tickets (id, customer_id, status, source_locale, created_at) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 'open',     'de',    NOW() - INTERVAL '15 minutes'),
  ('22222222-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 'pending',  'ja',    NOW() - INTERVAL '45 minutes'),
  ('22222222-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000003', 'open',     'ar',    NOW() - INTERVAL '2 hours'),
  ('22222222-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000004', 'resolved', 'pt-BR', NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO NOTHING;

-- Seed messages for Ticket 1 (Mara – German)
INSERT INTO messages (ticket_id, body_original, body_translated, direction, locale, created_at) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Mein Paket ist seit einer Woche nicht angekommen.',                                           'My package has not arrived in over a week.',                                             'inbound',  'de', NOW() - INTERVAL '40 minutes'),
  ('22222222-0000-0000-0000-000000000001', 'Thank you for reaching out. We are looking into this right away.',                            'Vielen Dank, dass Sie sich gemeldet haben. Wir untersuchen das sofort.',                  'outbound', 'en', NOW() - INTERVAL '25 minutes'),
  ('22222222-0000-0000-0000-000000000001', 'Können Sie mir bitte die Tracking-Nummer mitteilen?',                                         'Can you please provide me with the tracking number?',                                    'inbound',  'de', NOW() - INTERVAL '10 minutes');

-- Seed messages for Ticket 2 (Kenji – Japanese)
INSERT INTO messages (ticket_id, body_original, body_translated, direction, locale, created_at) VALUES
  ('22222222-0000-0000-0000-000000000002', 'アカウントにログインできません。助けてください。',                                             'I cannot log into my account. Please help.',                                             'inbound',  'ja', NOW() - INTERVAL '44 minutes'),
  ('22222222-0000-0000-0000-000000000002', 'We are sorry to hear that. Can you tell us the email address linked to your account?',        '申し訳ありません。アカウントに登録されているメールアドレスを教えていただけますか？',           'outbound', 'en', NOW() - INTERVAL '30 minutes');

-- Seed messages for Ticket 3 (Layla – Arabic)
INSERT INTO messages (ticket_id, body_original, body_translated, direction, locale, created_at) VALUES
  ('22222222-0000-0000-0000-000000000003', 'لم أتلق ردًا على رسالتي منذ ثلاثة أيام.',                                                   'I have not received a reply to my message in three days.',                               'inbound',  'ar', NOW() - INTERVAL '2 hours');

-- Seed messages for Ticket 4 (Carlos – Portuguese)
INSERT INTO messages (ticket_id, body_original, body_translated, direction, locale, created_at) VALUES
  ('22222222-0000-0000-0000-000000000004', 'O produto que recebi estava danificado.',                                                     'The product I received was damaged.',                                                    'inbound',  'pt-BR', NOW() - INTERVAL '7 hours'),
  ('22222222-0000-0000-0000-000000000004', 'We sincerely apologize. A replacement will be shipped within 24 hours.',                      'Pedimos sinceras desculpas. Um substituto será enviado em até 24 horas.',                'outbound', 'en',   NOW() - INTERVAL '6 hours'),
  ('22222222-0000-0000-0000-000000000004', 'Obrigado pela rápida resolução!',                                                             'Thank you for the quick resolution!',                                                    'inbound',  'pt-BR', NOW() - INTERVAL '5 hours 50 minutes');
