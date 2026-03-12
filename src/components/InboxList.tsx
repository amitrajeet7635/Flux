'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import TicketCard from './TicketCard';
import type { Ticket } from '@/types';

interface InboxListProps {
  initialTickets: Ticket[];
}

export default function InboxList({ initialTickets }: InboxListProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  useEffect(() => {
    // Subscribe to new tickets via Supabase Realtime
    const channel = supabase
      .channel('inbox-tickets')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        async (payload) => {
          // Fetch the new ticket with customer info
          const { data } = await supabase
            .from('tickets')
            .select('*, customers(*)')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setTickets((prev) => [data as Ticket, ...prev]);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tickets' },
        (payload) => {
          setTickets((prev) =>
            prev.map((t) => (t.id === payload.new.id ? { ...t, ...payload.new } : t))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-700">No tickets yet</h3>
        <p className="text-sm text-gray-400 mt-1">New support tickets will appear here in real time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
