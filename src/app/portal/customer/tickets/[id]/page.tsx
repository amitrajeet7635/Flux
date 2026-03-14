'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import CustomerSidebar from '@/components/portal/customer/CustomerSidebar';
import ConversationThread from '@/components/portal/customer/ConversationThread';
import StatusBadge from '@/components/shared/StatusBadge';
import LocalePill from '@/components/shared/LocalePill';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { Ticket } from '@/types';

export default function CustomerTicketDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');
  const shortId = id ? id.slice(0, 8).toUpperCase() : '…';
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from('tickets')
        .select('id, customer_id, status, source_locale, created_at, customers(id, name, detected_locale)')
        .eq('id', id)
        .single();
      if (data) setTicket(data as unknown as Ticket);
    }
    fetchTicket();
  }, [id]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)' }}>
      <CustomerSidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh' }}>
        <div style={{
          padding: '20px 32px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '16px',
          background: 'var(--bg-surface)', flexShrink: 0,
        }}>
          <h1 style={{
            fontFamily: 'var(--font-syne), sans-serif', fontSize: '18px', fontWeight: 700,
            color: 'var(--text-primary)', margin: 0, flex: 1,
          }}>
            {'Ticket #' + shortId}
          </h1>
          {ticket && (
            <>
              <LocalePill locale={ticket.source_locale.toUpperCase()} />
              <StatusBadge status={ticket.status} />
            </>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {ticket ? (
            <ConversationThread ticketId={id} customerLocale={ticket.source_locale} />
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px',
            }}>
              Loading…
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

