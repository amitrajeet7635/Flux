'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const SUPPORTED_LOCALES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'ja', label: '🇯🇵 日本語' },
  { code: 'ar', label: '🇸🇦 العربية' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'pt', label: '🇧🇷 Português' },
];

// Default agent ID — in production, derive from auth session
const DEFAULT_AGENT_ID = '00000000-0000-0000-0000-000000000001';

export default function SettingsPage() {
  const [locale, setLocale] = useState('en');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('agents')
        .select('name, display_locale')
        .eq('id', DEFAULT_AGENT_ID)
        .single();
      if (data) {
        setName(data.name);
        setLocale(data.display_locale);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await supabase
      .from('agents')
      .update({ name, display_locale: locale })
      .eq('id', DEFAULT_AGENT_ID);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Loading settings…</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Set your display name and preferred language for the CRM interface.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="agent-name">
            Display Name
          </label>
          <input
            id="agent-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="display-locale">
            Display Language
          </label>
          <p className="text-xs text-gray-500 mb-2">
            All customer messages will be translated into this language before you see them.
          </p>
          <select
            id="display-locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition bg-white"
          >
            {SUPPORTED_LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">✓ Saved successfully</span>
          )}
        </div>
      </form>
    </div>
  );
}
