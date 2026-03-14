'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';
import StatusBadge from '@/components/shared/StatusBadge';
import type { Ticket } from '@/types';

const mockTickets: Ticket[] = [
  {
    id: '1',
    customer_id: 'c1',
    status: 'open',
    source_locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    customers: { id: 'c1', name: 'You', detected_locale: 'de' },
    latest_message: {
      id: 'm1',
      ticket_id: '1',
      body_original: 'Mein Paket ist seit einer Woche nicht angekommen.',
      body_translated: 'My package has not arrived in over a week.',
      direction: 'inbound',
      locale: 'de',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
  {
    id: '2',
    customer_id: 'c1',
    status: 'pending',
    source_locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    customers: { id: 'c1', name: 'You', detected_locale: 'de' },
    latest_message: {
      id: 'm2',
      ticket_id: '2',
      body_original: 'Ich habe eine falsche Bestellung erhalten.',
      body_translated: 'I received a wrong order.',
      direction: 'inbound',
      locale: 'de',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  },
  {
    id: '3',
    customer_id: 'c1',
    status: 'resolved',
    source_locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    customers: { id: 'c1', name: 'You', detected_locale: 'de' },
    latest_message: {
      id: 'm3',
      ticket_id: '3',
      body_original: 'Rückerstattung bitte.',
      body_translated: 'Refund please.',
      direction: 'inbound',
      locale: 'de',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  },
];

function formatTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
  return `${Math.round(diff / 86400000)}d ago`;
}

export default function TicketList({ tickets = mockTickets }: { tickets?: Ticket[] }) {
  return (
    <div>
      <h2
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        My Tickets
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {tickets.map((ticket) => (
          <TicketRow key={ticket.id} ticket={ticket} />
        ))}
      </motion.div>
    </div>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link
        href={`/portal/customer/tickets/${ticket.id}`}
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            transition: 'border-color 0.15s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-active)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')
          }
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Ticket #{ticket.id}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {ticket.latest_message?.body_original ?? 'No messages yet.'}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <StatusBadge status={ticket.status} />
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
        </div>
      </Link>
    </motion.div>
  );
}
