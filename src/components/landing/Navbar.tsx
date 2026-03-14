'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(10, 10, 15, 0.7)',
      }}
      animate={{
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
      transition={{ duration: 0.2 }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Flux
        </span>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            href="#how-it-works"
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            How it works
          </Link>
          <Link
            href="#features"
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            For Teams
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <NavButton href="/portal/customer" variant="ghost">
              Customer Portal
            </NavButton>
            <NavButton href="/portal/agent/login" variant="solid">
              Agent Login
            </NavButton>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

function NavButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: 'ghost' | 'solid';
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'var(--font-dm-sans), sans-serif',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
  };

  const styles: React.CSSProperties =
    variant === 'ghost'
      ? {
          ...base,
          background: 'transparent',
          border: `1px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
          color: hovered ? 'var(--text-primary)' : 'var(--text-secondary)',
        }
      : {
          ...base,
          background: hovered ? '#4F46E5' : 'var(--accent)',
          border: '1px solid transparent',
          color: '#fff',
        };

  return (
    <Link
      href={href}
      style={styles}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  );
}
