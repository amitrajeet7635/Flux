'use client';

import CustomerSidebar from '@/components/portal/customer/CustomerSidebar';
import ConversationThread from '@/components/portal/customer/ConversationThread';
import StatusBadge from '@/components/shared/StatusBadge';
import LocalePill from '@/components/shared/LocalePill';

export default function CustomerTicketDetailPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)' }}>
      <CustomerSidebar />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: '100vh',
        }}
      >
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'var(--bg-surface)',
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              flex: 1,
            }}
          >
            Ticket #{params.id}
          </h1>
          <LocalePill locale="DE" />
          <StatusBadge status="open" />
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ConversationThread />
        </div>
      </main>
    </div>
  );
}
