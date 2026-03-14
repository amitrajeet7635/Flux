'use client';

import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/motion';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, badge, children }: AuthCardProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBackground />

      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {badge && (
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}
          >
            {badge}
          </span>
        )}
        <h1
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: subtitle ? '8px' : '32px',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
              fontFamily: 'var(--font-dm-sans), sans-serif',
            }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </motion.div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      animate={{
        background: [
          'radial-gradient(ellipse 600px 400px at 30% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          'radial-gradient(ellipse 600px 400px at 70% 60%, rgba(99,102,241,0.08) 0%, transparent 70%)',
          'radial-gradient(ellipse 600px 400px at 30% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)',
        ],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    />
  );
}
