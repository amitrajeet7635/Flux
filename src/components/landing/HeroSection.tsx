'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/motion';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const sourceBubbles = [
  {
    id: 'de',
    locale: 'DE',
    text: 'Mein Paket ist nicht angekommen.',
    x: '8%',
    y: '12%',
    delay: 0,
  },
  {
    id: 'ja',
    locale: 'JA',
    text: 'ログインできません。',
    x: '68%',
    y: '8%',
    delay: 1,
  },
  {
    id: 'ar',
    locale: 'AR',
    text: 'لم أتلق ردًا منذ ثلاثة أيام.',
    x: '4%',
    y: '66%',
    delay: 2,
  },
];

export default function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 900px 600px at 50% 40%, #1a1a3e 0%, #0A0A0F 70%)',
          pointerEvents: 'none',
        }}
      />
      <NoiseOverlay />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '860px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Support Anyone.{' '}
            <span style={{ color: 'var(--accent-glow)' }}>In Any Language.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '18px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '580px',
              margin: 0,
            }}
          >
            Flux translates every customer conversation in real time - so your team reads
            in English and your customers read in theirs.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <HeroButton href="/portal/customer" primary>
              Open a Support Ticket
            </HeroButton>
            <HeroButton href="/portal/agent/login" primary={false}>
              View Agent Dashboard
            </HeroButton>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
          style={{
            marginTop: '72px',
            position: 'relative',
            height: '340px',
            width: '100%',
            maxWidth: '760px',
            margin: '72px auto 0',
          }}
        >
          <TranslationGraphic prefersReduced={!!prefersReduced} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroButton({
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
        padding: '13px 28px',
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
        } else {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (primary) {
          e.currentTarget.style.background = 'var(--accent)';
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

function TranslationGraphic({ prefersReduced }: { prefersReduced: boolean }) {
  const center = { x: 50, y: 50 };

  const bubblePositions = [
    { cx: 14, cy: 18 },
    { cx: 82, cy: 14 },
    { cx: 10, cy: 76 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 Z" fill="rgba(99,102,241,0.5)" />
          </marker>
        </defs>
        {bubblePositions.map((pos, i) => (
          <motion.line
            key={i}
            x1={`${pos.cx}%`}
            y1={`${pos.cy}%`}
            x2={`${center.x}%`}
            y2={`${center.y}%`}
            stroke="rgba(99,102,241,0.4)"
            strokeWidth="0.4"
            strokeDasharray="2 1.5"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: prefersReduced ? 0 : 0.6 + i * 0.15, duration: 0.8, ease },
              opacity: { delay: prefersReduced ? 0 : 0.6 + i * 0.15, duration: 0.3 },
            }}
          />
        ))}
      </svg>

      {sourceBubbles.map((bubble) => (
        <FloatingBubble key={bubble.id} bubble={bubble} prefersReduced={prefersReduced} />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: prefersReduced ? 0 : 0.5, duration: 0.5, ease }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--accent)',
          borderRadius: '14px',
          padding: '14px 20px',
          minWidth: '200px',
          textAlign: 'center',
          boxShadow: '0 0 32px rgba(99,102,241,0.25)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '10px',
            color: 'var(--accent-glow)',
            marginBottom: '6px',
            letterSpacing: '0.08em',
          }}
        >
          EN - OUTPUT
        </div>
        <div
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '13px',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          My package has not arrived.
        </div>
      </motion.div>
    </div>
  );
}

function FloatingBubble({
  bubble,
  prefersReduced,
}: {
  bubble: (typeof sourceBubbles)[0];
  prefersReduced: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={
        prefersReduced
          ? { opacity: 1, scale: 1, y: 0 }
          : {
              opacity: 1,
              scale: 1,
              y: [0, -6, 0, 6, 0],
            }
      }
      transition={
        prefersReduced
          ? { duration: 0.4 }
          : {
              opacity: { duration: 0.4, delay: bubble.delay * 0.15 + 0.4 },
              scale: { duration: 0.4, delay: bubble.delay * 0.15 + 0.4 },
              y: {
                duration: 3.5 + bubble.delay * 0.5,
                delay: bubble.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      style={{
        position: 'absolute',
        left: bubble.x,
        top: bubble.y,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '10px 14px',
        maxWidth: '180px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '10px',
          color: 'var(--accent-glow)',
          marginBottom: '5px',
          letterSpacing: '0.06em',
        }}
      >
        {bubble.locale}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}
      >
        {bubble.text}
      </div>
    </motion.div>
  );
}

function NoiseOverlay() {
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        pointerEvents: 'none',
      }}
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}
