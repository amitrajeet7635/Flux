'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInLeft } from '@/lib/motion';
import type { Message } from '@/types';

const mockMessages: Message[] = [
  {
    id: 'm1',
    ticket_id: '1',
    body_original: 'Mein Paket ist seit einer Woche nicht angekommen.',
    body_translated: 'My package has not arrived in over a week.',
    direction: 'inbound',
    locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: 'm2',
    ticket_id: '1',
    body_original: 'Thank you for reaching out. We are looking into this right away.',
    body_translated: 'Vielen Dank, dass Sie sich gemeldet haben. Wir untersuchen das sofort.',
    direction: 'outbound',
    locale: 'en',
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'm3',
    ticket_id: '1',
    body_original: 'Können Sie mir bitte die Tracking-Nummer mitteilen?',
    body_translated: 'Can you please provide me with the tracking number?',
    direction: 'inbound',
    locale: 'de',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ConversationThread({ messages = mockMessages }: { messages?: Message[] }) {
  const [reply, setReply] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your message..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={3}
            style={{
              flex: 1,
              background: 'var(--bg-elevated)',
              border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: 'var(--text-primary)',
              outline: 'none',
              resize: 'none',
              boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'outbound';

  return (
    <motion.div
      variants={slideInLeft}
      initial="hidden"
      animate="visible"
      style={{
        display: 'flex',
        justifyContent: isOutbound ? 'flex-end' : 'flex-start',
      }}
    >
      <div style={{ maxWidth: '72%' }}>
        <div
          style={{
            background: isOutbound ? 'var(--accent)' : 'var(--bg-elevated)',
            border: isOutbound ? 'none' : '1px solid var(--border)',
            borderRadius: isOutbound ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
            padding: '12px 16px',
            color: isOutbound ? '#fff' : 'var(--text-primary)',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '14px',
            lineHeight: 1.6,
          }}
        >
          {isOutbound ? message.body_translated ?? message.body_original : message.body_original}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '4px',
            textAlign: isOutbound ? 'right' : 'left',
          }}
        >
          {formatTime(message.created_at)}
        </div>
      </div>
    </motion.div>
  );
}
