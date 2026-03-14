'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/shared/AuthCard';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export default function AgentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/portal/agent/dashboard');
    }
  }

  return (
    <AuthCard
      title="Agent Sign In"
      subtitle="Access your support workspace."
      badge="Agent Workspace"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormField label="Work Email" type="email" value={email} onChange={setEmail} placeholder="agent@company.com" />
        <FormField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        {error && (
          <p style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--destructive, #ef4444)',
            margin: 0,
            padding: '10px 12px',
            background: 'rgba(239,68,68,0.08)',
            borderRadius: '8px',
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            {error}
          </p>
        )}
        <SubmitButton loading={loading}>
          {loading ? 'Signing in…' : 'Sign In to Workspace'}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'var(--bg-surface)',
          border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '8px',
          padding: '11px 14px',
          fontSize: '14px',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          color: 'var(--text-primary)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
    </div>
  );
}

function SubmitButton({ children, loading }: { children: React.ReactNode; loading?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.01 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="submit"
      disabled={loading}
      style={{
        width: '100%',
        padding: '13px',
        background: loading ? 'var(--text-muted)' : hovered ? '#4F46E5' : 'var(--accent)',
        border: 'none',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'var(--font-syne), sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s',
        marginTop: '8px',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {children}
    </motion.button>
  );
}
