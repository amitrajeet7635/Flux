'use client';

interface SurfaceProps {
  children: React.ReactNode;
  className?: string;
}

export default function Surface({ children, className = '' }: SurfaceProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
      }}
    >
      {children}
    </div>
  );
}
