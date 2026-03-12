import Link from 'next/link';
import type { Ticket } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-gray-100 text-gray-500',
};

const LOCALE_LABELS: Record<string, string> = {
  en: '🇬🇧 EN',
  de: '🇩🇪 DE',
  ja: '🇯🇵 JA',
  ar: '🇸🇦 AR',
  fr: '🇫🇷 FR',
  es: '🇪🇸 ES',
  pt: '🇧🇷 PT',
};

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const statusStyle = STATUS_STYLES[ticket.status] ?? 'bg-gray-100 text-gray-500';
  const latestBody =
    ticket.latest_message?.body_translated ?? ticket.latest_message?.body_original ?? '';

  return (
    <Link href={`/tickets/${ticket.id}`} className="block group">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow group-hover:shadow-md group-hover:border-brand-500/40">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 truncate">
                {ticket.customers?.name ?? 'Unknown Customer'}
              </span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle}`}
              >
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{latestBody || 'No messages yet'}</p>
          </div>
          <div className="shrink-0 text-right">
            <span className="text-xs text-gray-400">
              {LOCALE_LABELS[ticket.source_locale] ?? ticket.source_locale}
            </span>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
