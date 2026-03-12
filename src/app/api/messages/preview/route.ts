import { NextRequest, NextResponse } from 'next/server';
import { lingo } from '@/lib/lingo';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLocale, targetLocale } = await request.json();

    if (!text || !sourceLocale || !targetLocale) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (sourceLocale === targetLocale) {
      return NextResponse.json({ translated: text });
    }

    const translated = await lingo.localizeText(text, { sourceLocale, targetLocale });
    return NextResponse.json({ translated });
  } catch (err) {
    console.error('Preview translation error:', err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
