'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';
import StatusBadge from '@/components/shared/StatusBadge';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { Ticket } from '@/types';

function formatTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
  return `${Math.round(diff / 86400000)}d ago`;
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get customer record linked to this user
      const { data: customer } = await supabase
        .from('customers').select('id').eq('id', user.id).single();
      if (!customer) { setLoading(false); return; }

      const { data } = await supabase
        .from('tickets')
        .select(`id, customer_id, status, source_locale, created_at,
          messages ( id, ticket_id, body_original, body_translated, direction, locale, created_at )`)
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      const enriched: Ticket[] = (data ?? []).map((t: any) => {
        const msgs: any[] = t.messages ?? [];
        const latest = msgs.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] ?? null;
        return { ...t, latest_message: latest };
      });
      setTickets(enriched);
      setLoading(false);
    }
    fetchTickets();
  }, []);

  return (
    <div>
      <h2 style={{
        fontFamily: 'var(--font-syne), sans-serif', fontSize: '22px', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: '24px', letterSpacing: '-0.01em',
      }}>
        My Tickets
      </h2>
      {loading ? (
        <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px', color: 'var(--text-muted)' }}>
          Loading…
        </p>
      ) : tickets.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px', color: 'var(--text-muted)' }}>
          No tickets yet. <Link href="/portal/customer/dashboard?view=new" style={{ color: 'var(--accent)' }}>Open one →</Link>
        </p>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {tickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)}
        </motion.div>
      )}
    </div>
  );
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Link href={`/portal/customer/tickets/${ticket.id}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '16px',
            transition: 'border-color 0.15s', cursor: 'pointer',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-active)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)')}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-syne), sans-serif', fontSize: '15px', fontWeight: 600,
              color: 'var(--text-primary)', marginBottom: '4px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {'Ticket #' + (ticket.id ?? '').slice(0, 8).toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)',
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {ticket.latest_message?.body_original ?? 'No messages yet.'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
            <StatusBadge status={ticket.status} />
            <span style={{ fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px', color: 'var(--text-muted)' }}>
              {formatTime(ticket.created_at)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
