'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

export default function CTASection() {
  return (
    <section
      style={{
        padding: '120px 24px',
        background:
          'radial-gradient(ellipse 1000px 600px at 20% 50%, #1a1a3e 0%, #0A0A0F 60%), radial-gradient(ellipse 800px 500px at 80% 50%, rgba(6,182,212,0.05) 0%, transparent 60%)',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
        >
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Your customers are already global.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '18px',
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Flux makes sure your support is too.
          </motion.p>
          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <CTAButton href="/portal/customer/register" primary>
              Get Started as a Customer
            </CTAButton>
            <CTAButton href="/portal/agent/register" primary={false}>
              Set Up Your Agent Workspace
            </CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function CTAButton({
  href,
  primary,
  children,
}: {
  href: string;
  primary: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '14px 32px',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: 'var(--font-dm-sans), sans-serif',
        textDecoration: 'none',
        background: primary ? 'var(--accent)' : 'transparent',
        border: primary ? '1px solid transparent' : '1px solid var(--border)',
        color: primary ? '#fff' : 'var(--text-secondary)',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (primary) {
          e.currentTarget.style.background = '#4F46E5';
          e.currentTarget.style.transform = 'scale(1.01)';
        } else {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.background = 'var(--accent)';
          e.currentTarget.style.transform = 'scale(1)';
        } else {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {children}
    </Link>
  );
}
