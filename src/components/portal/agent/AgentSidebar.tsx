'use client';

interface AgentSidebarProps {
  activeFilter: string;
  onFilterChange: (f: string) => void;
  openCount?: number;
}

const primaryItems = [
  { id: 'all', label: 'All Tickets' },
  { id: 'mine', label: 'Assigned to Me' },
  { id: 'resolved', label: 'Resolved' },
];

const adminItems = [
  { id: 'team', label: 'Team' },
  { id: 'analytics', label: 'Analytics' },
];

export default function AgentSidebar({
  activeFilter,
  onFilterChange,
  openCount = 0,
}: AgentSidebarProps) {
  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        height: '100%',
      }}
    >
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {primaryItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            active={activeFilter === item.id}
            onClick={() => onFilterChange(item.id)}
            badge={item.id === 'all' && openCount > 0 ? openCount : undefined}
          />
        ))}

        <div
          style={{
            height: '1px',
            background: 'var(--border)',
            margin: '12px 8px',
          }}
        />

        {adminItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            active={activeFilter === item.id}
            onClick={() => onFilterChange(item.id)}
            muted
          />
        ))}
      </nav>

      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: 'var(--accent)',
            flexShrink: 0,
          }}
        >
          A
        </div>
        <span
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          Agent
        </span>
      </div>
    </aside>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
  badge,
  muted,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
  muted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontWeight: 500,
        border: 'none',
        background: active ? 'var(--bg-elevated)' : 'transparent',
        borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
        color: active
          ? 'var(--text-primary)'
          : muted
          ? 'var(--text-muted)'
          : 'var(--text-secondary)',
        cursor: 'pointer',
        textAlign: 'left',
        marginBottom: '4px',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'var(--bg-elevated)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = muted ? 'var(--text-muted)' : 'var(--text-secondary)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {label}
      {badge !== undefined && (
        <span
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '11px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: '999px',
            padding: '1px 7px',
            minWidth: '20px',
            textAlign: 'center',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
