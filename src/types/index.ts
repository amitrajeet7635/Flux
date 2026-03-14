export interface Customer {
  id: string;
  name: string;
  detected_locale: string;
}

export interface Agent {
  id: string;
  name: string;
  display_locale: string;
}

export interface Ticket {
  id: string;
  customer_id: string;
  status: 'open' | 'closed' | 'pending' | 'resolved';
  source_locale: string;
  created_at: string;
  customers?: Customer;
  latest_message?: Message;
}

export interface Message {
  id: string;
  ticket_id: string;
  body_original: string;
  body_translated: string | null;
  direction: 'inbound' | 'outbound';
  locale: string;
  created_at: string;
}

export interface InboundMessageRequest {
  ticket_id: string;
  body_original: string;
  source_locale: string;
  agent_locale: string;
}

export interface OutboundMessageRequest {
  ticket_id: string;
  body_original: string;
  agent_locale: string;
  customer_locale: string;
}
