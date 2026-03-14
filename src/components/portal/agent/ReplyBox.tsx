'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LivePreview from './LivePreview';

const fakeTranslations: Record<string, string> = {
  de: 'Wir entschuldigen uns für die Unannehmlichkeiten und untersuchen Ihr Anliegen sofort.',
  ja: 'ご不便をおかけして申し訳ございません。すぐに対応いたします。',
  ar: 'نعتذر عن الإزعاج وسنتحقق من مشكلتك على الفور.',
  'pt-br': 'Pedimos desculpas pelo inconveniente e vamos analisar sua solicitação imediatamente.',
};

interface ReplyBoxProps {
  ticketId: string;
  customerLocale: string;
}

export default function ReplyBox({ ticketId, customerLocale }: ReplyBoxProps) {
  const [reply, setReply] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnControls = useAnimation();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!reply.trim()) {
      setPreview('');
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => {
      const key = customerLocale.toLowerCase();
      setPreview(fakeTranslations[key] ?? 'Translation not available for this locale.');
      setLoading(false);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [reply, customerLocale]);

  const handleSend = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    await btnControls.start({ scale: [1, 0.97, 1], transition: { duration: 0.3 } });
    setTimeout(() => {
      setReply('');
      setPreview('');
      setSending(false);
    }, 500);
  };

  return (
    <div
      style={{
        padding: '16px 24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}
    >
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply in English..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={3}
        style={{
          width: '100%',
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
          marginBottom: '12px',
        }}
      />

      <LivePreview
        text={preview}
        loading={loading}
        targetLocale={customerLocale.toUpperCase()}
      />

      <motion.button
        animate={btnControls}
        onClick={handleSend}
        disabled={sending || !reply.trim()}
        style={{
          width: '100%',
          padding: '12px',
          background: sending || !reply.trim() ? 'var(--bg-elevated)' : 'var(--accent)',
          border: 'none',
          borderRadius: '8px',
          color: sending || !reply.trim() ? 'var(--text-muted)' : '#fff',
          fontFamily: 'var(--font-syne), sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          cursor: sending || !reply.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {sending ? 'Sending...' : 'Send Reply'}
      </motion.button>
    </div>
  );
}
