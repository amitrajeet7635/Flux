import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { lingo } from '@/lib/lingo';
import type { OutboundMessageRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: OutboundMessageRequest = await request.json();
    const { ticket_id, body_original, agent_locale, customer_locale } = body;

    if (!ticket_id || !body_original || !agent_locale || !customer_locale) {
      return NextResponse.json(
        { error: 'Missing required fields: ticket_id, body_original, agent_locale, customer_locale' },
        { status: 400 }
      );
    }

    // Translate the agent's reply from agent's locale to customer's locale
    let body_translated: string | null = null;
    if (agent_locale !== customer_locale) {
      body_translated = await lingo.localizeText(body_original, {
        sourceLocale: agent_locale,
        targetLocale: customer_locale,
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
        direction: 'outbound',
        locale: agent_locale,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: data }, { status: 201 });
  } catch (err) {
    console.error('Outbound message error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
