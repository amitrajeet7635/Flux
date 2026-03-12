'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MessageBubble from './MessageBubble';
import ReplyBox from './ReplyBox';
import type { Message, Ticket } from '@/types';

interface MessageThreadProps {
  ticket: Ticket;
  initialMessages: Message[];
  agentLocale: string;
}

export default function MessageThread({
  ticket,
  initialMessages,
  agentLocale,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`ticket-${ticket.id}-messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `ticket_id=eq.${ticket.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket.id]);

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No messages yet.</p>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <ReplyBox
          ticketId={ticket.id}
          agentLocale={agentLocale}
          customerLocale={ticket.customers?.detected_locale ?? ticket.source_locale}
          onMessageSent={handleMessageSent}
        />
      </div>
    </div>
  );
}
