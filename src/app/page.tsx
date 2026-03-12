import { getSupabaseServerClient } from '@/lib/supabase-server';
import InboxList from '@/components/InboxList';
import type { Ticket } from '@/types';

export const revalidate = 0;

async function fetchTickets(): Promise<Ticket[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from('tickets')
    .select(
      `
      *,
      customers(*),
      latest_message:messages(id, body_original, body_translated, direction, locale, created_at)
    `
    )
    .order('created_at', { ascending: false })
    .order('created_at', { ascending: false, foreignTable: 'messages' })
    .limit(1, { foreignTable: 'messages' });

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  // Flatten latest_message from array to single object
  return (data ?? []).map((ticket: Ticket & { latest_message: Ticket['latest_message'][] }) => ({
    ...ticket,
    latest_message: Array.isArray(ticket.latest_message)
      ? ticket.latest_message[0] ?? null
      : ticket.latest_message,
  })) as Ticket[];
}

export default async function InboxPage() {
  const tickets = await fetchTickets();
  const openCount = tickets.filter((t) => t.status === 'open').length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Inbox</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {openCount} open ticket{openCount !== 1 ? 's' : ''} · Updates in real time
          </p>
        </div>
        <span className="flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
      </div>

      <InboxList initialTickets={tickets} />
    </div>
  );
}
