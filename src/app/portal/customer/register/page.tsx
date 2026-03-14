'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AuthCard from '@/components/shared/AuthCard';

const languages = [
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
  { code: 'pt-BR', label: 'Português' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];

export default function CustomerRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lang, setLang] = useState('en');

  return (
    <AuthCard title="Create an account" subtitle="Submit and track support tickets in your language.">
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormField label="Full Name" type="text" value={name} onChange={setName} placeholder="Your name" />
        <FormField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <FormField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            Preferred Language
          </label>
          <LangSelect value={lang} onChange={setLang} />
        </div>

        <SubmitButton>Create Account</SubmitButton>
      </form>
      <p
        style={{
          textAlign: 'center',
          marginTop: '24px',
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        Already have an account?{' '}
        <Link
          href="/portal/customer/login"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Sign in
        </Link>
      </p>
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

function LangSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code} style={{ background: 'var(--bg-elevated)' }}>
          {l.label}
        </option>
      ))}
    </select>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      type="submit"
      style={{
        width: '100%',
        padding: '13px',
        background: hovered ? '#4F46E5' : 'var(--accent)',
        border: 'none',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'var(--font-syne), sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'background 0.15s',
        marginTop: '8px',
      }}
    >
      {children}
    </motion.button>
  );
}
