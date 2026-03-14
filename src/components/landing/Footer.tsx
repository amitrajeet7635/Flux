'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 24px',
        background: 'var(--bg-base)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '32px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Flux
          </div>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-muted)',
              maxWidth: '280px',
              lineHeight: 1.6,
            }}
          >
            Multilingual support infrastructure for modern teams.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'Customer Portal', href: '/portal/customer' },
            { label: 'Agent Portal', href: '/portal/agent/login' },
            { label: 'GitHub', href: 'https://github.com/amitrajeet7635/Flux' },
            { label: 'Built with Lingo.dev', href: 'https://lingo.dev' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
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
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: '1100px',
          margin: '32px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        &copy; {new Date().getFullYear()} Flux. All rights reserved.
      </div>
    </footer>
  );
}
