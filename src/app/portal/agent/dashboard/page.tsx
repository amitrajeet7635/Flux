'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import AgentTopNav from '@/components/portal/agent/AgentTopNav';
import AgentSidebar from '@/components/portal/agent/AgentSidebar';
import InboxPanel from '@/components/portal/agent/InboxPanel';
import DetailPanel from '@/components/portal/agent/DetailPanel';
import type { Ticket } from '@/types';

export default function AgentDashboardPage() {
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTickets() {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        id, customer_id, status, source_locale, created_at,
        customers ( id, name, detected_locale ),
        messages ( id, ticket_id, body_original, body_translated, direction, locale, created_at )
      `)
      .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching tickets:', error); return; }

    const enriched: Ticket[] = (data ?? []).map((t: any) => {
      const msgs: any[] = t.messages ?? [];
      const latest = msgs.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0] ?? null;
      return {
        id: t.id,
        customer_id: t.customer_id,
        status: t.status,
        source_locale: t.source_locale,
        created_at: t.created_at,
        customers: t.customers,
        latest_message: latest,
      };
    });

    setTickets(enriched);
    setLoading(false);
  }

  useEffect(() => {
    fetchTickets();
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel('agent-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, fetchTickets)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchTickets)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const openCount = tickets.filter((t) => t.status === 'open').length;

  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'resolved') return t.status === 'resolved';
    return true;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedId) ?? null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <AgentTopNav
        autoTranslate={autoTranslate}
        onToggleTranslate={() => setAutoTranslate((v) => !v)}
        agentName="Agent"
        agentLocale="EN"
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <AgentSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          openCount={openCount}
        />
        {loading ? (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px',
          }}>
            Loading tickets…
          </div>
        ) : (
          <>
            <InboxPanel
              autoTranslate={autoTranslate}
              selectedId={selectedId}
              onSelect={setSelectedId}
              tickets={filteredTickets}
            />
            <DetailPanel
              ticket={selectedTicket}
              autoTranslate={autoTranslate}
              onTicketUpdate={fetchTickets}
            />
          </>
        )}
      </div>
    </div>
  );
}
