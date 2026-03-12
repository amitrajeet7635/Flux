import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { lingo } from '@/lib/lingo';
import type { InboundMessageRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: InboundMessageRequest = await request.json();
    const { ticket_id, body_original, source_locale, agent_locale } = body;

    if (!ticket_id || !body_original || !source_locale || !agent_locale) {
      return NextResponse.json(
        { error: 'Missing required fields: ticket_id, body_original, source_locale, agent_locale' },
        { status: 400 }
      );
    }

    // Translate inbound message from customer's locale to agent's display locale
    let body_translated: string | null = null;
    if (source_locale !== agent_locale) {
      body_translated = await lingo.localizeText(body_original, {
        sourceLocale: source_locale,
        targetLocale: agent_locale,
      });
    } else {
      body_translated = body_original;
    }

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ticket_id,
        body_original,
        body_translated,
        direction: 'inbound',
        locale: source_locale,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (err) {
    console.error('Inbound message error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
