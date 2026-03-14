'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInLeft } from '@/lib/motion';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { Message } from '@/types';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface ConversationThreadProps {
  ticketId: string;
  customerLocale: string;
}

export default function ConversationThread({ ticketId, customerLocale }: ConversationThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });
    setMessages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`customer-thread-${ticketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `ticket_id=eq.${ticketId}` },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/messages/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          body_original: reply,
          source_locale: customerLocale,
          agent_locale: 'en',
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setReply('');
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px' }}>
            Loading conversation…
          </div>
        ) : messages.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px' }}>
            No messages yet. An agent will reply shortly.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} customerLocale={customerLocale} />
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', background: 'var(--bg-surface)' }}>
        {error && (
          <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px', color: 'var(--destructive, #ef4444)', marginBottom: '8px' }}>
            {error}
          </p>
        )}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
            placeholder="Type your message… (⌘↵ to send)"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={3}
            style={{
              flex: 1, background: 'var(--bg-elevated)',
              border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px', padding: '10px 14px', fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-primary)',
              outline: 'none', resize: 'none',
              boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSend}
            disabled={sending || !reply.trim()}
            style={{
              padding: '10px 20px',
              background: sending || !reply.trim() ? 'var(--bg-elevated)' : 'var(--accent)',
              border: 'none', borderRadius: '8px',
              color: sending || !reply.trim() ? 'var(--text-muted)' : '#fff',
              fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, fontSize: '14px',
              cursor: sending || !reply.trim() ? 'not-allowed' : 'pointer', flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            {sending ? '…' : 'Send'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, customerLocale }: { message: Message; customerLocale: string }) {
  // From customer's POV: inbound = their own message (right), outbound = agent reply (left)
  const isOwn = message.direction === 'inbound';

  // Show agent reply in customer's locale (body_translated), own messages as-is
  const displayText = isOwn
    ? message.body_original
    : (message.body_translated ?? message.body_original);

  return (
    <motion.div
      variants={slideInLeft} initial="hidden" animate="visible"
      style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}
    >
      <div style={{ maxWidth: '72%' }}>
        {!isOwn && (
          <div style={{
            fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '11px',
            color: 'var(--text-muted)', marginBottom: '4px',
          }}>
            Support Agent
          </div>
        )}
        <div style={{
          background: isOwn ? 'var(--accent)' : 'var(--bg-elevated)',
          border: isOwn ? 'none' : '1px solid var(--border)',
          borderRadius: isOwn ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          padding: '12px 16px',
          color: isOwn ? '#fff' : 'var(--text-primary)',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '14px', lineHeight: 1.6,
        }}>
          {displayText}
        </div>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace', fontSize: '11px',
          color: 'var(--text-muted)', marginTop: '4px',
          textAlign: isOwn ? 'right' : 'left',
        }}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </motion.div>
  );
}
