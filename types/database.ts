export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          name: string;
          display_locale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          display_locale: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          display_locale?: string;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          detected_locale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          detected_locale: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          detected_locale?: string;
          created_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          customer_id: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          source_locale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          source_locale: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          source_locale?: string;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          ticket_id: string;
          body_original: string;
          body_translated: string;
          direction: "inbound" | "outbound";
          locale: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          body_original: string;
          body_translated: string;
          direction: "inbound" | "outbound";
          locale: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          body_original?: string;
          body_translated?: string;
          direction?: "inbound" | "outbound";
          locale?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
