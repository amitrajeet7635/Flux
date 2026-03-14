'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocalePill from '@/components/shared/LocalePill';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const navItems = [
  { label: 'My Tickets', href: '/portal/customer/dashboard' },
  { label: 'New Ticket', href: '/portal/customer/dashboard?view=new' },
  { label: 'Account', href: '/portal/customer/dashboard?view=account' },
];

// Map detected_locale to a short display label for the pill
function localeToLabel(locale: string | null): string {
  if (!locale) return 'EN';
  const map: Record<string, string> = {
    en: 'EN',
    de: 'DE',
    ja: 'JA',
    ar: 'AR',
    'pt-BR': 'PT',
    fr: 'FR',
    es: 'ES',
    ko: 'KO',
    zh: 'ZH',
    hi: 'HI',
    'hi-Latn': 'HI',
  };
  return map[locale] ?? locale.slice(0, 2).toUpperCase();
}

export default function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [displayName, setDisplayName] = useState<string>('Your Account');
  const [initials, setInitials] = useState<string>('U');
  const [localeLabel, setLocaleLabel] = useState<string>('EN');

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Name from customers table first, fallback to OAuth metadata
      const { data } = await supabase
        .from('customers')
        .select('name, detected_locale')
        .eq('id', user.id)
        .maybeSingle();

      const name: string =
        data?.name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Your Account';

      const locale: string = data?.detected_locale || 'en';

      setDisplayName(name);
      setInitials(
        name
          .split(' ')
          .slice(0, 2)
          .map((w: string) => w[0]?.toUpperCase() ?? '')
          .join(''),
      );
      setLocaleLabel(localeToLabel(locale));
    }

    loadProfile();

    // Re-run whenever the URL changes (e.g. after saving settings)
  }, [pathname]);

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
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </div>
            <LocalePill locale={localeLabel} />
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
