'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const PRESET_QUERIES = [
  { label: '📦 Order not received', text: 'I have not received my order yet. Can you please check the status?' },
  { label: '🔄 Wrong item delivered', text: 'I received the wrong item in my order. Please help me resolve this.' },
  { label: '💰 Refund request', text: 'I would like to request a refund for my recent order.' },
  { label: '🛠️ Product not working', text: 'The product I received is not working properly. I need support.' },
  { label: '📝 Change order details', text: 'I need to update the details of my recent order.' },
  { label: '📍 Update delivery address', text: 'I need to change the delivery address for my pending order.' },
];

const LOCALE_OPTIONS = [
  { value: 'en',       label: '🇬🇧 English' },
  { value: 'hi',       label: '🇮🇳 Hindi (हिंदी)' },
  { value: 'hi-Latn',  label: '🇮🇳 Hinglish (Hindi in English letters)' },
  { value: 'de',       label: '🇩🇪 German' },
  { value: 'ja',       label: '🇯🇵 Japanese' },
  { value: 'ar',       label: '🇸🇦 Arabic' },
  { value: 'pt-BR',    label: '🇧🇷 Portuguese (Brazil)' },
  { value: 'fr',       label: '🇫🇷 French' },
  { value: 'es',       label: '🇪🇸 Spanish' },
  { value: 'zh',       label: '🇨🇳 Chinese' },
];

export default function NewTicketForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [locale, setLocale] = useState('en');
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [msgFocused, setMsgFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePreset = (text: string) => {
    setMessage(text);
    if (!subject) setSubject(text.split('.')[0].slice(0, 60));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('You must be logged in.'); setSubmitting(false); return; }

      // Ensure customer record exists
      const { data: customer, error: custErr } = await supabase
        .from('customers')
        .upsert({ id: user.id, name: user.email?.split('@')[0] ?? 'Customer', detected_locale: locale }, { onConflict: 'id' })
        .select()
        .single();
      if (custErr) throw custErr;

      // Create ticket
      const { data: ticket, error: ticketErr } = await supabase
        .from('tickets')
        .insert({ customer_id: customer.id, status: 'open', source_locale: locale })
        .select()
        .single();
      if (ticketErr) throw ticketErr;

      // Send first message via inbound API (triggers real Lingo translation)
      const res = await fetch('/api/messages/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticket.id,
          body_original: `${subject}\n\n${message}`,
          source_locale: locale,
          agent_locale: 'en',
        }),
      });
      if (!res.ok) throw new Error('Failed to send message');

      router.push(`/portal/customer/tickets/${ticket.id}`);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <h2 style={{
        fontFamily: 'var(--font-syne), sans-serif', fontSize: '22px', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em',
      }}>
        Open a new ticket
      </h2>
      <p style={{
        fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px',
        color: 'var(--text-muted)', marginBottom: '28px',
      }}>
        Our agents will reply in your language via real-time translation.
      </p>

      {/* Preset queries */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{
          fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px',
          color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          Quick select
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PRESET_QUERIES.map((q) => (
            <motion.button
              key={q.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePreset(q.text)}
              type="button"
              style={{
                padding: '7px 14px',
                background: message === q.text ? 'var(--accent)' : 'var(--bg-elevated)',
                border: `1px solid ${message === q.text ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '20px',
                color: message === q.text ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {q.label}
            </motion.button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Language selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Your language
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-primary)',
              outline: 'none', cursor: 'pointer',
            }}
          >
            {LOCALE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <AnimatePresence>
            {locale === 'hi-Latn' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px',
                  color: 'var(--accent)', margin: 0,
                  padding: '8px 12px', background: 'rgba(99,102,241,0.08)',
                  borderRadius: '6px', border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                ✨ Hinglish detected — type normally, e.g. <em>"muje delivery nhi mili"</em>. Our AI will translate it for the agent.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Subject */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Subject
          </label>
          <input
            type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            placeholder="Briefly describe your issue"
            onFocus={() => setSubjectFocused(true)} onBlur={() => setSubjectFocused(false)}
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${subjectFocused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-primary)',
              outline: 'none', width: '100%',
              boxShadow: subjectFocused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Message */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Message
          </label>
          <textarea
            value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder={locale === 'hi-Latn' ? 'Yahan apni baat likhein, jaise "muje iss product ki delivery nhi mili"...' : 'Describe your issue in detail…'}
            onFocus={() => setMsgFocused(true)} onBlur={() => setMsgFocused(false)}
            rows={6}
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${msgFocused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-primary)',
              outline: 'none', resize: 'vertical', minHeight: '160px', width: '100%',
              boxShadow: msgFocused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box',
            }}
          />
          <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
            Write in any language — agents receive an instant AI translation.
          </p>
        </div>

        {error && (
          <p style={{
            fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px',
            color: 'var(--destructive, #ef4444)', margin: 0,
            padding: '10px 12px', background: 'rgba(239,68,68,0.08)',
            borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            {error}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={submitting || !subject.trim() || !message.trim()}
          style={{
            padding: '12px 28px',
            background: submitting || !subject.trim() || !message.trim() ? 'var(--bg-elevated)' : 'var(--accent)',
            border: 'none', borderRadius: '8px',
            color: submitting || !subject.trim() || !message.trim() ? 'var(--text-muted)' : '#fff',
            fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, fontSize: '14px',
            cursor: submitting || !subject.trim() || !message.trim() ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start', transition: 'all 0.15s',
          }}
        >
          {submitting ? 'Submitting…' : 'Submit Ticket'}
        </motion.button>
      </form>
    </div>
  );
}
