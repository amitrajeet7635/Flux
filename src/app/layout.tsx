import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { LingoProvider } from '@lingo.dev/compiler/react';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Flux - Multilingual Support CRM',
  description: 'Real-time customer support with automatic translation powered by Lingo.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LingoProvider>
      <html lang="en" className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
        <body
          className="antialiased"
          style={{ fontFamily: 'var(--font-dm-sans), sans-serif', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
        >
          {children}
        </body>
      </html>
    </LingoProvider>
  );
}
