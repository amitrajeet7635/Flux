'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { slideInLeft } from '@/lib/motion';
import StatusBadge from '@/components/shared/StatusBadge';
import LocalePill from '@/components/shared/LocalePill';
import type { Ticket } from '@/types';

const mockTickets: Ticket[] = [
  {
    id: '1',
    customer_id: 'c1',
    status: 'open',
    source_locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    customers: { id: 'c1', name: 'Mara Steinberg', detected_locale: 'de' },
    latest_message: {
      id: 'm1',
      ticket_id: '1',
      body_original: 'Mein Paket ist seit einer Woche nicht angekommen.',
      body_translated: 'My package has not arrived in over a week.',
      direction: 'inbound',
      locale: 'de',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  },
  {
    id: '2',
    customer_id: 'c2',
    status: 'pending',
    source_locale: 'ja',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customers: { id: 'c2', name: 'Kenji Watanabe', detected_locale: 'ja' },
    latest_message: {
      id: 'm2',
      ticket_id: '2',
      body_original: 'アカウントにログインできません。助けてください。',
      body_translated: 'I cannot log into my account. Please help.',
      direction: 'inbound',
      locale: 'ja',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  },
  {
    id: '3',
    customer_id: 'c3',
    status: 'open',
    source_locale: 'ar',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customers: { id: 'c3', name: 'Layla Hassan', detected_locale: 'ar' },
    latest_message: {
      id: 'm3',
      ticket_id: '3',
      body_original: 'لم أتلق ردًا على رسالتي منذ ثلاثة أيام.',
      body_translated: 'I have not received a reply to my message in three days.',
      direction: 'inbound',
      locale: 'ar',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  },
  {
    id: '4',
    customer_id: 'c4',
    status: 'resolved',
    source_locale: 'pt-BR',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    customers: { id: 'c4', name: 'Carlos Mendes', detected_locale: 'pt-BR' },
    latest_message: {
      id: 'm4',
      ticket_id: '4',
      body_original: 'O produto que recebi estava danificado.',
      body_translated: 'The product I received was damaged.',
      direction: 'inbound',
      locale: 'pt-BR',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  },
];

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
  return `${Math.round(diff / 86400000)}d ago`;
}

interface InboxPanelProps {
  autoTranslate: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  tickets?: Ticket[];
}

export default function InboxPanel({
  autoTranslate,
  selectedId,
  onSelect,
  tickets = mockTickets,
}: InboxPanelProps) {
  return (
    <div
      style={{
        width: '420px',
        flexShrink: 0,
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-syne), sans-serif',
          fontWeight: 700,
          fontSize: '16px',
          color: 'var(--text-primary)',
          flexShrink: 0,
          background: 'var(--bg-surface)',
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        Inbox
      </div>
      <AnimatePresence initial={false}>
        {tickets.map((ticket) => (
          <InboxCard
            key={ticket.id}
            ticket={ticket}
            autoTranslate={autoTranslate}
            selected={selectedId === ticket.id}
            onClick={() => onSelect(ticket.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function InboxCard({
  ticket,
  autoTranslate,
  selected,
  onClick,
}: {
  ticket: Ticket;
  autoTranslate: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const msg = ticket.latest_message;
  const locale = ticket.source_locale.toUpperCase();

  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        borderLeft: selected ? '3px solid var(--accent)' : '3px solid transparent',
        background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      whileHover={{
        background: selected ? 'var(--bg-elevated)' : 'rgba(26,26,38,0.6)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {ticket.customers?.name ?? 'Unknown'}
          </span>
          <LocalePill locale={locale} />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {formatTime(ticket.created_at)}
        </span>
      </div>

      <div style={{ marginBottom: '10px', minHeight: '38px' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={autoTranslate ? 'translated' : 'original'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              margin: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              direction:
                !autoTranslate && ticket.source_locale === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            {autoTranslate
              ? (msg?.body_translated ?? msg?.body_original)
              : msg?.body_original ?? 'No messages yet.'}
          </motion.p>
        </AnimatePresence>
      </div>

      <StatusBadge status={ticket.status} />
    </motion.div>
  );
}
