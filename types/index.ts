import type { Database } from "./database";

export type Agent = Database["public"]["Tables"]["agents"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Ticket = Database["public"]["Tables"]["tickets"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

export type TicketStatus = Ticket["status"];
export type MessageDirection = Message["direction"];
