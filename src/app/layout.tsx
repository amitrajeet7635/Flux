import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import { TranslationProvider } from '@/components/TranslationProvider';
import { LingoProvider } from '@lingo.dev/compiler/react';

export const metadata: Metadata = {
  title: 'Flux — Multilingual Support CRM',
  description: 'Real-time customer support with automatic translation powered by Lingo.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LingoProvider>
      <html lang="en">
        <body className="bg-gray-50 font-sans text-gray-900 antialiased">
          <TranslationProvider>
            <NavBar />
            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          </TranslationProvider>
        </body>
      </html>
    </LingoProvider>
  );
}
