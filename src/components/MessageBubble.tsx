'use client';

import { useState } from 'react';
import { useTranslation } from './TranslationProvider';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { translationEnabled } = useTranslation();
  const [showOriginal, setShowOriginal] = useState(false);

  const isOutbound = message.direction === 'outbound';
  const displayBody =
    translationEnabled && message.body_translated && !showOriginal
      ? message.body_translated
      : message.body_original;

  const hasAlternate =
    message.body_translated && message.body_translated !== message.body_original;

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] group relative`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
            isOutbound
              ? 'rounded-br-sm bg-brand-500 text-white'
              : 'rounded-bl-sm bg-white border border-gray-200 text-gray-800'
          }`}
        >
          <p className="whitespace-pre-wrap">{displayBody}</p>

          {hasAlternate && (
            <button
              onClick={() => setShowOriginal((v) => !v)}
              className={`mt-1.5 text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity ${
                isOutbound ? 'text-white' : 'text-gray-500'
              }`}
            >
              {showOriginal ? 'Show translated' : 'Show original'}
            </button>
          )}
        </div>

        <p
          className={`mt-1 text-xs text-gray-400 ${isOutbound ? 'text-right' : 'text-left'}`}
        >
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {' · '}
          <span className="capitalize">{message.direction}</span>
        </p>
      </div>
    </div>
  );
}
