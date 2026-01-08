export type LeadStatus =
    | "Novo"
    | "Em Contato"
    | "Visita Agendada"
    | "Visita Realizada"
    | "Em Negociação"
    | "Fechado"
    | "Perdido";

export interface Lead {
    id: string;
    name: string;
    phone: string;
    email?: string;
    status: LeadStatus;
    source: "Whatsapp" | "Site" | "Indicação" | "Manual";
    lastInteraction: string; // ISO date or "2 min ago"
    value?: number; // Potential deal value
}

export const PIPELINE_STAGES: LeadStatus[] = [
    "Novo",
    "Em Contato",
    "Visita Agendada",
    "Visita Realizada",
    "Em Negociação",
    "Fechado",
    "Perdido",
];
