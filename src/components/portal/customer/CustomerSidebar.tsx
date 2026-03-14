'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LocalePill from '@/components/shared/LocalePill';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const navItems = [
  { label: 'My Tickets', href: '/portal/customer/dashboard' },
  { label: 'New Ticket', href: '/portal/customer/dashboard?view=new' },
  { label: 'Account', href: '/portal/customer/dashboard?view=account' },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <aside
      style={{
        width: '240px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
      }}
    >
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            display: 'block',
            marginBottom: '20px',
          }}
        >
          Flux
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            }}
          >
            U
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Your Account
            </div>
            <LocalePill locale="EN" />
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => {
          const active = pathname === item.href.split('?')[0];
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontWeight: 500,
                textDecoration: 'none',
                marginBottom: '4px',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--destructive)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
