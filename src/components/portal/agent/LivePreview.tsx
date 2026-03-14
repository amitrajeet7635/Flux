'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewProps {
  text: string;
  loading: boolean;
  targetLocale: string;
}

export default function LivePreview({ text, loading, targetLocale }: LivePreviewProps) {
  return (
    <div
      style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '14px 16px',
        marginBottom: '12px',
      }}
    >
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '10px',
        }}
      >
        Customer will receive ({targetLocale})
      </span>

      <div style={{ minHeight: '24px', position: 'relative' }}>
        {loading && (
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--bg-elevated) 0%, rgba(99,102,241,0.1) 50%, var(--bg-elevated) 100%)',
              borderRadius: '4px',
            }}
          />
        )}
        <AnimatePresence mode="wait">
          {!loading && text && (
            <motion.p
              key={text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {text}
            </motion.p>
          )}
          {!loading && !text && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '13px',
                color: 'var(--text-muted)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              Start typing to preview the translation...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
