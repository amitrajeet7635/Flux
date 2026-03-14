'use client';

import { useSearchParams } from 'next/navigation';
import CustomerSidebar from '@/components/portal/customer/CustomerSidebar';
import TicketList from '@/components/portal/customer/TicketList';
import NewTicketForm from '@/components/portal/customer/NewTicketForm';

export default function CustomerDashboardPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)' }}>
      <CustomerSidebar />
      <main
        style={{
          flex: 1,
          padding: '40px',
          overflowY: 'auto',
          minWidth: 0,
        }}
      >
        {view === 'new' ? <NewTicketForm /> : <TicketList />}
      </main>
    </div>
  );
}
