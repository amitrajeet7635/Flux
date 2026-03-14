'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AuthCard from '@/components/shared/AuthCard';

export default function AgentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthCard
      title="Agent Sign In"
      subtitle="Access your support workspace."
      badge="Agent Workspace"
    >
      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FormField label="Work Email" type="email" value={email} onChange={setEmail} placeholder="agent@company.com" />
        <FormField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        <SubmitButton>Sign In to Workspace</SubmitButton>
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
