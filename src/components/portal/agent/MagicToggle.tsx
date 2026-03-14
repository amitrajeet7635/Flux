'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MagicToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export default function MagicToggle({ enabled, onToggle }: MagicToggleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}
      >
        Auto-Translate
      </span>
      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {enabled && (
            <motion.div
              key="ring"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: '-4px',
                borderRadius: '999px',
                background: 'var(--accent-secondary)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
        </AnimatePresence>
        <motion.button
          onClick={onToggle}
          animate={{ background: enabled ? 'var(--accent)' : 'var(--bg-elevated)' }}
          transition={{ duration: 0.2 }}
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '999px',
            border: `1px solid ${enabled ? 'var(--accent)' : 'var(--border)'}`,
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            layout
            transition={{ type: 'spring', stiffness: 700, damping: 40 }}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#fff',
              flexShrink: 0,
              marginLeft: enabled ? 'auto' : '0',
            }}
          />
        </motion.button>
      </div>
    </div>
  );
}
