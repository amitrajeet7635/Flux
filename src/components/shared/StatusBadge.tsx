'use client';

type Status = 'open' | 'pending' | 'resolved' | 'closed';

interface StatusBadgeProps {
  status: Status;
}

const config: Record<Status, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)' },
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  resolved: { label: 'Resolved', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  closed: { label: 'Closed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color, bg } = config[status] ?? config.open;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        fontWeight: 500,
        color,
        background: bg,
        border: `1px solid ${color}30`,
        borderRadius: '999px',
        padding: '2px 10px',
        fontFamily: 'var(--font-dm-sans), sans-serif',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
