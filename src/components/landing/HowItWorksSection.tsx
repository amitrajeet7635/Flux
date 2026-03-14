'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

const steps = [
  {
    number: '01',
    title: 'Customer writes in their language',
    body: 'A customer in Germany types a message. Flux detects the language instantly.',
  },
  {
    number: '02',
    title: 'Your team reads it in English',
    body: 'The message arrives in your inbox already translated. No tab-switching. No copy-paste.',
  },
  {
    number: '03',
    title: 'Your reply reaches them in theirs',
    body: 'You write in English. They receive it in German. The translation is invisible to both sides.',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: '120px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          How it works
        </motion.p>
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
          Three steps. Zero friction.
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
        >
          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StepCard({ step }: { step: (typeof steps)[0] }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -4,
        borderColor: 'var(--border-active)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          right: '16px',
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '80px',
          fontWeight: 800,
          color: 'var(--border)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {step.number}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '12px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {step.title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {step.body}
      </p>
    </motion.div>
  );
}
