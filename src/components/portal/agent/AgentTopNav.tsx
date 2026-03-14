'use client';

import Link from 'next/link';
import MagicToggle from './MagicToggle';
import LocalePill from '@/components/shared/LocalePill';

interface AgentTopNavProps {
  autoTranslate: boolean;
  onToggleTranslate: () => void;
  agentName?: string;
  agentLocale?: string;
}

export default function AgentTopNav({
  autoTranslate,
  onToggleTranslate,
  agentName = 'Agent',
  agentLocale = 'EN',
}: AgentTopNavProps) {
  return (
    <header
      style={{
        height: '56px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontWeight: 700,
          fontSize: '18px',
          color: 'var(--text-primary)',
          textDecoration: 'none',
          marginRight: 'auto',
        }}
      >
        Flux
      </Link>

      <MagicToggle enabled={autoTranslate} onToggle={onToggleTranslate} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginLeft: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            {agentName}
          </span>
          <LocalePill locale={agentLocale} />
        </div>
        <Link
          href="/settings"
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          Settings
        </Link>
      </div>
    </header>
  );
}
