'use client';

import { useEffect, useState, useRef } from 'react';
import type { Message } from '@/types';

interface ReplyBoxProps {
  ticketId: string;
  agentLocale: string;
  customerLocale: string;
  onMessageSent: (message: Message) => void;
}

export default function ReplyBox({
  ticketId,
  agentLocale,
  customerLocale,
  onMessageSent,
}: ReplyBoxProps) {
  const [body, setBody] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced live translation preview
  useEffect(() => {
    if (!body.trim() || agentLocale === customerLocale) {
      setPreview(null);
      return;
    }

    if (previewTimer.current) clearTimeout(previewTimer.current);

    previewTimer.current = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await fetch('/api/messages/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: body,
            sourceLocale: agentLocale,
            targetLocale: customerLocale,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setPreview(data.translated);
        }
      } catch {
        // Preview is best-effort; silent fail
      } finally {
        setPreviewLoading(false);
      }
    }, 600);

    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, [body, agentLocale, customerLocale]);

  const handleSend = async () => {
    if (!body.trim()) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch('/api/messages/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          body_original: body.trim(),
          agent_locale: agentLocale,
          customer_locale: customerLocale,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to send message');
      }

      const { message } = await res.json();
      onMessageSent(message);
      setBody('');
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      {/* Live preview panel */}
      {(preview || previewLoading) && agentLocale !== customerLocale && (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm">
          <p className="text-xs font-medium text-brand-600 mb-1">
            Customer will see ({customerLocale.toUpperCase()}):
          </p>
          {previewLoading ? (
            <p className="text-gray-400 italic">Translating…</p>
          ) : (
            <p className="text-gray-700">{preview}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your reply… (⌘Enter to send)"
          rows={3}
          className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
        />
        <button
          onClick={handleSend}
          disabled={!body.trim() || sending}
          className="shrink-0 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
