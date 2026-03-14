'use client';

import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

const testimonials = [
  {
    quote:
      'We cut our average first-response time in half after switching to Flux. Our agents stopped waiting for translators.',
    name: 'Mara Steinberg',
    role: 'Head of Support, Nordstern GmbH',
    locale: 'DE',
  },
  {
    quote:
      'The live reply preview is what sold our team. Seeing the Japanese translation update as you type builds confidence you\u2019re sending the right message.',
    name: 'Kenji Watanabe',
    role: 'Customer Experience Lead, Aisu Technologies',
    locale: 'JA',
  },
  {
    quote:
      'We support customers across twelve countries with a team of six. Flux made that possible without adding headcount.',
    name: 'Layla Hassan',
    role: 'Support Operations Manager, Mawqa',
    locale: 'AR',
  },
];

export default function TestimonialsSection() {
  return (
    <section
      style={{
        padding: '120px 24px',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            Teams shipping faster in every language
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: 'var(--text-primary)',
                    flex: 1,
                    margin: 0,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-syne), sans-serif',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-syne), sans-serif',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-dm-sans), sans-serif',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
