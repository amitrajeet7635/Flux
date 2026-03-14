'use client';

interface LocalePillProps {
  locale: string;
}

export default function LocalePill({ locale }: LocalePillProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '11px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        padding: '2px 6px',
        color: 'var(--text-secondary)',
        letterSpacing: '0.03em',
        display: 'inline-block',
      }}
    >
      {locale}
    </span>
  );
}
