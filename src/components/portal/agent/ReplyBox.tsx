'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import LivePreview from './LivePreview';

interface ReplyBoxProps {
  ticketId: string;
  customerLocale: string;
  onSent?: () => void;
}

export default function ReplyBox({ ticketId, customerLocale, onSent }: ReplyBoxProps) {
  const [reply, setReply] = useState('');
  const [preview, setPreview] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnControls = useAnimation();

  // Live translation preview — calls the real outbound API in preview mode
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!reply.trim()) { setPreview(''); setPreviewLoading(false); return; }

    setPreviewLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/messages/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: reply, sourceLocale: 'en', targetLocale: customerLocale }),
        });
        const json = await res.json();
        setPreview(json.translated ?? '');
      } catch {
        setPreview('');
      } finally {
        setPreviewLoading(false);
      }
    }, 400);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [reply, customerLocale]);

  const handleSend = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/messages/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          body_original: reply,
          agent_locale: 'en',
          customer_locale: customerLocale,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? 'Failed to send message.');
        setSending(false);
        return;
      }
      await btnControls.start({ scale: [1, 0.97, 1], transition: { duration: 0.2 } });
      setReply('');
      setPreview('');
      onSent?.();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)', flexShrink: 0 }}>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(); }}
        placeholder="Type your reply in English… (⌘↵ to send)"
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
          boxSizing: 'border-box',
        }}
      />

      <LivePreview text={preview} loading={previewLoading} targetLocale={customerLocale.toUpperCase()} />

      {error && (
        <p style={{
          fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px',
          color: 'var(--destructive, #ef4444)', margin: '8px 0',
        }}>
          {error}
        </p>
      )}

      <motion.button
        animate={btnControls}
        onClick={handleSend}
        disabled={sending || !reply.trim()}
        style={{
          width: '100%', padding: '12px',
          background: sending || !reply.trim() ? 'var(--bg-elevated)' : 'var(--accent)',
          border: 'none', borderRadius: '8px',
          color: sending || !reply.trim() ? 'var(--text-muted)' : '#fff',
          fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, fontSize: '14px',
          cursor: sending || !reply.trim() ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {sending ? 'Sending…' : 'Send Reply'}
      </motion.button>
    </div>
  );
}
