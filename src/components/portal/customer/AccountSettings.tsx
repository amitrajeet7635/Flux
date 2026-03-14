'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

const LOCALE_OPTIONS = [
  { value: 'en',      label: '🇬🇧 English',                    uiLocale: 'en' },
  { value: 'hi',      label: '🇮🇳 Hindi (हिंदी)',              uiLocale: 'hi' },
  { value: 'hi-Latn', label: '🇮🇳 Hinglish (Hindi in English letters)', uiLocale: 'en' },
  { value: 'de',      label: '🇩🇪 German',                     uiLocale: 'de' },
  { value: 'ja',      label: '🇯🇵 Japanese',                   uiLocale: 'ja' },
  { value: 'ar',      label: '🇸🇦 Arabic',                     uiLocale: 'ar' },
  { value: 'pt-BR',   label: '🇧🇷 Portuguese (Brazil)',        uiLocale: 'pt' },
  { value: 'fr',      label: '🇫🇷 French',                     uiLocale: 'fr' },
  { value: 'es',      label: '🇪🇸 Spanish',                    uiLocale: 'es' },
  { value: 'zh',      label: '🇨🇳 Chinese (Simplified)',       uiLocale: 'zh' },
];

export default function AccountSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [locale, setLocale] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? '');

      const { data: customer } = await supabase
        .from('customers')
        .select('name, detected_locale')
        .eq('id', user.id)
        .single();

      if (customer) {
        setName(customer.name ?? '');
        setLocale(customer.detected_locale ?? 'en');
      } else {
        // Fallback to email prefix as name
        setName(user.email?.split('@')[0] ?? '');
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: upsertErr } = await supabase
        .from('customers')
        .upsert(
          { id: user.id, name: name.trim(), detected_locale: locale },
          { onConflict: 'id' }
        );
      if (upsertErr) throw upsertErr;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Switch UI locale — Lingo.dev reads the `locale` cookie / query param
      const uiLocale = LOCALE_OPTIONS.find((o) => o.value === locale)?.uiLocale ?? 'en';
      document.cookie = `NEXT_LOCALE=${uiLocale}; path=/; max-age=31536000`;

      // Force a soft refresh so layout re-renders in new locale
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px' }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px' }}>
      <h2 style={{
        fontFamily: 'var(--font-syne), sans-serif', fontSize: '22px', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.01em',
      }}>
        Account Settings
      </h2>
      <p style={{
        fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '14px',
        color: 'var(--text-muted)', marginBottom: '36px',
      }}>
        Update your display name and preferred language. The portal UI will switch to your chosen language.
      </p>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Email — read only */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Email
          </label>
          <div style={{
            background: 'var(--bg-base)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
            fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-muted)',
          }}>
            {email}
          </div>
        </div>

        {/* Display name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            placeholder="Your name"
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${nameFocused ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-primary)',
              outline: 'none', width: '100%', boxSizing: 'border-box',
              boxShadow: nameFocused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
          />
        </div>

        {/* Language selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Preferred Language
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              fontFamily: 'var(--font-dm-sans), sans-serif', color: 'var(--text-primary)',
              outline: 'none', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            }}
          >
            {LOCALE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p style={{
            fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '12px',
            color: 'var(--text-muted)', margin: 0, fontStyle: 'italic',
          }}>
            This sets your ticket language and translates the portal UI.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p style={{
            fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px',
            color: 'var(--destructive, #ef4444)', margin: 0,
            padding: '10px 12px', background: 'rgba(239,68,68,0.08)',
            borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            {error}
          </p>
        )}

        {/* Save button + success flash */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 28px',
              background: saving ? 'var(--bg-elevated)' : 'var(--accent)',
              border: 'none', borderRadius: '8px',
              color: saving ? 'var(--text-muted)' : '#fff',
              fontFamily: 'var(--font-syne), sans-serif', fontWeight: 600, fontSize: '14px',
              cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
            }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </motion.button>

          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif', fontSize: '13px',
                  color: '#22c55e', display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                ✓ Saved
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
