'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewTicketForm() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [msgFocused, setMsgFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 1500);
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '32px',
          letterSpacing: '-0.01em',
        }}
      >
        Open a new ticket
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Briefly describe your issue"
            onFocus={() => setSubjectFocused(true)}
            onBlur={() => setSubjectFocused(false)}
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${subjectFocused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '11px 14px',
              fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: 'var(--text-primary)',
              outline: 'none',
              boxShadow: subjectFocused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue in detail"
            onFocus={() => setMsgFocused(true)}
            onBlur={() => setMsgFocused(false)}
            rows={6}
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${msgFocused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px',
              padding: '11px 14px',
              fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              color: 'var(--text-primary)',
              outline: 'none',
              boxShadow: msgFocused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              width: '100%',
              resize: 'vertical',
              minHeight: '160px',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
              margin: 0,
            }}
          >
            Your message will be received by our team in English. You will receive all replies
            in your language.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 28px',
            background: submitting ? 'var(--bg-elevated)' : 'var(--accent)',
            border: 'none',
            borderRadius: '8px',
            color: submitting ? 'var(--text-muted)' : '#fff',
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 600,
            fontSize: '14px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-start',
            transition: 'all 0.15s',
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </motion.button>
      </form>
    </div>
  );
}
