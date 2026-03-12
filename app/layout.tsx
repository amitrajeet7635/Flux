import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { LingoProvider } from "@lingo.dev/compiler/react/next";
import { getServerLocale } from "@lingo.dev/compiler/virtual/locale/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flux — Multilingual Customer Support CRM",
  description:
    "A multilingual customer support CRM powered by Next.js, Supabase, and Lingo.dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  return (
    <LingoProvider>
      <html lang={locale}>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </LingoProvider>
  );
}
