'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInLeft } from '@/lib/motion';
import StatusBadge from '@/components/shared/StatusBadge';
import LocalePill from '@/components/shared/LocalePill';
import ReplyBox from './ReplyBox';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { Ticket, Message } from '@/types';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface DetailPanelProps {
  ticket: Ticket | null;
  autoTranslate: boolean;
  onTicketUpdate: () => void;
}

export default function DetailPanel({ ticket, autoTranslate, onTicketUpdate }: DetailPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages(ticketId: string) {
    setLoadingMsgs(true);
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data ?? []);
    setLoadingMsgs(false);
  }

  useEffect(() => {
    if (!ticket) { setMessages([]); return; }

    fetchMessages(ticket.id);

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`messages-${ticket.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `ticket_id=eq.${ticket.id}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          onTicketUpdate();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [ticket?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!ticket) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px',
      }}>
        Select a ticket to view the conversation.
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
      <TicketMetaRow ticket={ticket} onStatusChange={onTicketUpdate} />
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {loadingMsgs ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px' }}>
            Loading messages…
          </div>
        ) : messages.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px' }}>
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <AgentMessageBubble key={msg.id} message={msg} autoTranslate={autoTranslate} />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <ReplyBox
        ticketId={ticket.id}
        customerLocale={ticket.source_locale}
        onSent={() => fetchMessages(ticket.id)}
      />
    </div>
  );
}

function TicketMetaRow({ ticket, onStatusChange }: { ticket: Ticket; onStatusChange: () => void }) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const statuses: Ticket['status'][] = ['open', 'pending', 'resolved', 'closed'];

  async function handleStatusChange(newStatus: Ticket['status']) {
    setStatusMenuOpen(false);
    const supabase = getSupabaseBrowserClient();
    await supabase.from('tickets').update({ status: newStatus }).eq('id', ticket.id);
    onStatusChange();
  }

  return (
    <div style={{
      padding: '14px 24px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
      background: 'var(--bg-surface)', flexShrink: 0, position: 'relative',
    }}>
      <div style={{ position: 'relative' }}>
        <div onClick={() => setStatusMenuOpen((v) => !v)} style={{ cursor: 'pointer' }}>
          <StatusBadge status={ticket.status} />
        </div>
        <AnimatePresence>
          {statusMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '6px', zIndex: 20,
                minWidth: '130px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {statuses.map((s) => (
                <div
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  style={{ padding: '7px 10px', borderRadius: '6px', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'transparent')}
                >
                  <StatusBadge status={s} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MetaChip label="Customer" value={ticket.customers?.name ?? '—'} />
      <MetaChip label="Channel" value="chat" mono />
      <LocalePill locale={ticket.source_locale.toUpperCase()} />
      <span style={{
        fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px',
        color: 'var(--text-muted)', marginLeft: 'auto',
      }}>
        {new Date(ticket.created_at).toLocaleDateString()}
      </span>
    </div>
  );
}

function MetaChip({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px', color: 'var(--text-muted)' }}>
        {label}:
      </span>
      <span style={{
        fontFamily: mono ? 'var(--font-jetbrains), monospace' : 'var(--font-dm-sans), sans-serif',
        fontSize: '12px', color: 'var(--text-secondary)',
      }}>
        {value}
      </span>
    </div>
  );
}

function AgentMessageBubble({ message, autoTranslate }: { message: Message; autoTranslate: boolean }) {
  const isOutbound = message.direction === 'outbound';
  const [showOriginal, setShowOriginal] = useState(false);

  const displayText = isOutbound
    ? message.body_original
    : autoTranslate
      ? (message.body_translated ?? message.body_original)
      : message.body_original;

  return (
    <motion.div variants={slideInLeft} initial="hidden" animate="visible"
      style={{ display: 'flex', justifyContent: isOutbound ? 'flex-end' : 'flex-start' }}
    >
      <div style={{ maxWidth: '72%' }}>
        <div style={{
          background: isOutbound ? 'var(--accent)' : 'var(--bg-elevated)',
          border: isOutbound ? 'none' : '1px solid var(--border)',
          borderRadius: isOutbound ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          padding: '12px 16px',
          color: isOutbound ? '#fff' : 'var(--text-primary)',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '14px', lineHeight: 1.6,
        }}>
          {displayText}
        </div>

        {!isOutbound && message.body_translated && (
          <div style={{ marginTop: '4px' }}>
            <button
              onClick={() => setShowOriginal((v) => !v)}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px',
                color: 'var(--text-muted)', cursor: 'pointer',
              }}
            >
              Translated from {message.locale.toUpperCase()} —{' '}
              <span style={{ color: 'var(--accent)' }}>
                {showOriginal ? 'Hide original' : 'Show original'}
              </span>
            </button>
            <AnimatePresence>
              {showOriginal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{
                    marginTop: '6px', padding: '8px 12px',
                    background: 'var(--bg-base)', border: '1px solid var(--border)',
                    borderRadius: '6px', fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6,
                  }}>
                    {message.body_original}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px',
          color: 'var(--text-muted)', marginTop: '4px',
          textAlign: isOutbound ? 'right' : 'left',
        }}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </motion.div>
  );
}
