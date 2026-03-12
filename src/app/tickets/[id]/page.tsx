import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import MessageThread from '@/components/MessageThread';
import type { Message, Ticket } from '@/types';

export const revalidate = 0;

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-gray-100 text-gray-500',
};

const LOCALE_LABELS: Record<string, string> = {
  en: '🇬🇧 English',
  de: '🇩🇪 Deutsch',
  ja: '🇯🇵 日本語',
  ar: '🇸🇦 العربية',
  fr: '🇫🇷 Français',
  es: '🇪🇸 Español',
  pt: '🇧🇷 Português',
};

// Default agent ID — in production, derive from auth session
const DEFAULT_AGENT_ID = '00000000-0000-0000-0000-000000000001';

async function fetchTicketWithMessages(
  id: string
): Promise<{ ticket: Ticket; messages: Message[]; agentLocale: string } | null> {
  const supabase = getSupabaseServerClient();

  const [ticketResult, messagesResult, agentResult] = await Promise.all([
    supabase.from('tickets').select('*, customers(*)').eq('id', id).single(),
    supabase
      .from('messages')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true }),
    supabase.from('agents').select('display_locale').eq('id', DEFAULT_AGENT_ID).single(),
  ]);

  if (ticketResult.error || !ticketResult.data) return null;

  return {
    ticket: ticketResult.data as Ticket,
    messages: (messagesResult.data ?? []) as Message[],
    agentLocale: agentResult.data?.display_locale ?? 'en',
  };
}

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await fetchTicketWithMessages(params.id);
  if (!result) notFound();

  const { ticket, messages, agentLocale } = result;
  const statusStyle = STATUS_STYLES[ticket.status] ?? 'bg-gray-100 text-gray-500';

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/"
              className="text-sm text-brand-600 hover:underline"
            >
              ← Inbox
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500 truncate">
              {ticket.customers?.name ?? 'Unknown'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            {ticket.customers?.name ?? 'Support Ticket'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Customer locale: {LOCALE_LABELS[ticket.source_locale] ?? ticket.source_locale} ·
            Your locale: {LOCALE_LABELS[agentLocale] ?? agentLocale}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${statusStyle}`}>
          {ticket.status}
        </span>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
        <MessageThread
          ticket={ticket}
          initialMessages={messages}
          agentLocale={agentLocale}
        />
      </div>
    </div>
  );
}
