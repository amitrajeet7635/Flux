'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { slideInLeft } from '@/lib/motion';

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

type LangKey = 'DE' | 'JA' | 'AR' | 'PT-BR';

const samples: Record<LangKey, { original: string; translated: string }> = {
  DE: {
    original: 'Mein Paket ist seit einer Woche nicht angekommen.',
    translated: 'My package has not arrived in over a week.',
  },
  JA: {
    original: 'アカウントにログインできません。助けてください。',
    translated: 'I cannot log into my account. Please help.',
  },
  AR: {
    original: 'لم أتلق ردًا على رسالتي منذ ثلاثة أيام.',
    translated: 'I have not received a reply to my message in three days.',
  },
  'PT-BR': {
    original: 'O produto que recebi estava danificado.',
    translated: 'The product I received was damaged.',
  },
};

const langs: LangKey[] = ['DE', 'JA', 'AR', 'PT-BR'];

export default function LiveDemoSection() {
  const [selectedLang, setSelectedLang] = useState<LangKey>('DE');
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const connectorPath = useMotionValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayedText('');
    setTypingDone(false);
    setShowTranslation(false);
    setShowConnector(false);
    connectorPath.set(0);

    if (intervalRef.current) clearInterval(intervalRef.current);

    const text = samples[selectedLang].original;
    let i = 0;

    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        setTypingDone(true);
      }
    }, 40);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [selectedLang]);

  useEffect(() => {
    if (!typingDone) return;
    const t1 = setTimeout(() => {
      setShowConnector(true);
    }, 100);
    const t2 = setTimeout(() => {
      setShowTranslation(true);
    }, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [typingDone]);

  useEffect(() => {
    if (showConnector) {
      connectorPath.set(0);
      const start = performance.now();
      const animate = (now: number) => {
        const p = Math.min((now - start) / 700, 1);
        connectorPath.set(p);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [showConnector]);

  const strokeDashoffset = useTransform(connectorPath, (v) => `${(1 - v) * 200}`);

  return (
    <section
      style={{
        padding: '120px 24px',
        background: 'var(--bg-base)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            Watch the translation happen
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '14px',
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            No backend. This is a live simulation of what your inbox looks like.
          </p>
        </motion.div>

        <div style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'stretch' }}>
          <DemoPanel title="Customer View" accent={false}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {langs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${selectedLang === lang ? 'var(--accent)' : 'var(--border)'}`,
                    background: selectedLang === lang ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: selectedLang === lang ? 'var(--accent-glow)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: '120px',
              }}
            >
              {displayedText && (
                <div
                  style={{
                    alignSelf: 'flex-end',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '12px 12px 2px 12px',
                    padding: '12px 16px',
                    maxWidth: '85%',
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    direction: selectedLang === 'AR' ? 'rtl' : 'ltr',
                  }}
                >
                  {displayedText}
                  {!typingDone && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '14px',
                        background: 'rgba(255,255,255,0.8)',
                        marginLeft: '2px',
                        verticalAlign: 'middle',
                        animation: 'none',
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </DemoPanel>

          <svg
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '4px',
              overflow: 'visible',
              zIndex: 5,
              pointerEvents: 'none',
            }}
            viewBox="0 0 60 4"
          >
            <motion.line
              x1="0"
              y1="2"
              x2="60"
              y2="2"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="200"
              style={{ strokeDashoffset }}
              strokeLinecap="round"
            />
          </svg>

          <DemoPanel title="Agent View" accent>
            <AnimatePresence mode="wait">
              {showTranslation ? (
                <motion.div
                  key="translation"
                  variants={slideInLeft}
                  initial="hidden"
                  animate="visible"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '10px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {selectedLang}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '10px',
                        color: 'var(--accent)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      TRANSLATED
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-dm-sans), sans-serif',
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {samples[selectedLang].translated}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '13px',
                  }}
                >
                  Waiting for message...
                </motion.div>
              )}
            </AnimatePresence>
          </DemoPanel>
        </div>
      </div>
    </section>
  );
}

function DemoPanel({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      style={{
        flex: 1,
        background: 'var(--bg-surface)',
        border: `1px solid ${accent ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        minHeight: '260px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: accent ? 'var(--accent)' : 'var(--text-muted)',
          marginBottom: '20px',
        }}
      >
        {title}
      </div>
      {children}
    </motion.div>
  );
}
