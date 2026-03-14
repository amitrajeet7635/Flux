'use client';

import { useState } from 'react';
import AgentTopNav from '@/components/portal/agent/AgentTopNav';
import AgentSidebar from '@/components/portal/agent/AgentSidebar';
import InboxPanel from '@/components/portal/agent/InboxPanel';
import DetailPanel from '@/components/portal/agent/DetailPanel';

const mockTickets = [
  {
    id: '1',
    customer_id: 'c1',
    status: 'open' as const,
    source_locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    customers: { id: 'c1', name: 'Mara Steinberg', detected_locale: 'de' },
    latest_message: {
      id: 'm1',
      ticket_id: '1',
      body_original: 'Mein Paket ist seit einer Woche nicht angekommen.',
      body_translated: 'My package has not arrived in over a week.',
      direction: 'inbound' as const,
      locale: 'de',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
  },
  {
    id: '2',
    customer_id: 'c2',
    status: 'pending' as const,
    source_locale: 'ja',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    customers: { id: 'c2', name: 'Kenji Watanabe', detected_locale: 'ja' },
    latest_message: {
      id: 'm2',
      ticket_id: '2',
      body_original: 'アカウントにログインできません。助けてください。',
      body_translated: 'I cannot log into my account. Please help.',
      direction: 'inbound' as const,
      locale: 'ja',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  },
  {
    id: '3',
    customer_id: 'c3',
    status: 'open' as const,
    source_locale: 'ar',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customers: { id: 'c3', name: 'Layla Hassan', detected_locale: 'ar' },
    latest_message: {
      id: 'm3',
      ticket_id: '3',
      body_original: 'لم أتلق ردًا على رسالتي منذ ثلاثة أيام.',
      body_translated: 'I have not received a reply to my message in three days.',
      direction: 'inbound' as const,
      locale: 'ar',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  },
  {
    id: '4',
    customer_id: 'c4',
    status: 'resolved' as const,
    source_locale: 'pt-BR',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    customers: { id: 'c4', name: 'Carlos Mendes', detected_locale: 'pt-BR' },
    latest_message: {
      id: 'm4',
      ticket_id: '4',
      body_original: 'O produto que recebi estava danificado.',
      body_translated: 'The product I received was damaged.',
      direction: 'inbound' as const,
      locale: 'pt-BR',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  },
];

export default function AgentDashboardPage() {
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openCount = mockTickets.filter((t) => t.status === 'open').length;

  const filteredTickets = mockTickets.filter((t) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'resolved') return t.status === 'resolved';
    return true;
  });

  const selectedTicket = mockTickets.find((t) => t.id === selectedId) ?? null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
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
        <InboxPanel
          autoTranslate={autoTranslate}
          selectedId={selectedId}
          onSelect={setSelectedId}
          tickets={filteredTickets}
        />
        <DetailPanel ticket={selectedTicket} />
      </div>
    </div>
  );
}
