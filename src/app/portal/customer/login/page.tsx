'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import AuthCard from '@/components/shared/AuthCard';

export default function CustomerLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/portal/customer/dashboard`,
      },
    });
  };

  return (
    <AuthCard
      title="Welcome to Flux"
      subtitle="Sign in to submit and track your support tickets."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Divider label="Continue with" />
        <GoogleButton loading={loading} onClick={handleGoogleSignIn} />
      </div>
    </AuthCard>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <span
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '12px',
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  );
}

function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      disabled={loading}
      type="button"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '13px',
        background: hovered && !loading ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${hovered && !loading ? 'var(--border-active)' : 'var(--border)'}`,
        borderRadius: '8px',
        color: loading ? 'var(--text-muted)' : 'var(--text-primary)',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontWeight: 500,
        fontSize: '15px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <GoogleIcon />
      )}
      {loading ? 'Redirecting...' : 'Sign in with Google'}
    </motion.button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.013 17.64 11.8 17.64 9.2z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      style={{
        width: '18px',
        height: '18px',
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        flexShrink: 0,
      }}
    />
  );
}
