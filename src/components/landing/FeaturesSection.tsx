'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

const features = [
  {
    title: 'Build-Time UI Translation',
    body: 'Your dashboard speaks your agents\u2019 languages. No JSON files. No translation keys. Powered by @lingo.dev/compiler.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 13.5h7M13.5 10v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Message Translation',
    body: 'Every inbound message is translated before it hits your inbox. Powered by Lingo.dev SDK at the API layer.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 9h8M9 5v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Live Reply Preview',
    body: 'Type your reply in English. See the customer-facing translation update live beneath your cursor before you send.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Language Detection',
    body: 'Flux identifies the customer\u2019s language from the first sentence. No dropdowns. No manual tagging.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 1.5C9 1.5 6 5 6 9s3 7.5 3 7.5M9 1.5c0 0 3 3.5 3 7.5s-3 7.5-3 7.5M1.5 9h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Structured Data Localization',
    body: 'Ticket statuses, priority labels, and categories render in each agent\u2019s language. The database stores one value. The API localizes on read.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 7h8M5 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Zero Translator Overhead',
    body: 'One support agent. Every language. No outsourcing, no translation subscriptions, no context-switching. Just a faster inbox.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L11.5 7H16.5L12.5 10.5L14 16L9 12.5L4 16L5.5 10.5L1.5 7H6.5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '120px 24px',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              textAlign: 'center',
              marginBottom: '64px',
              letterSpacing: '-0.02em',
            }}
          >
            Built different at every layer of the stack
          </motion.h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '28px',
      }}
    >
      <motion.div
        animate={{
          background: hovered ? 'var(--accent)' : 'var(--bg-elevated)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <motion.span
          animate={{ color: hovered ? '#fff' : 'var(--accent)' }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {feature.icon}
        </motion.span>
      </motion.div>
      <h3
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '10px',
        }}
      >
        {feature.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
        }}
      >
        {feature.body}
      </p>
    </motion.div>
  );
}
