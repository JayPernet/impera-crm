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
    pipeline_step?: number; // 0-6 mapping to status
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

// Mapping for pipeline_step (integer) to status (string)
export const STATUS_TO_STEP: Record<LeadStatus, number> = {
    "Novo": 0,
    "Em Contato": 1,
    "Visita Agendada": 2,
    "Visita Realizada": 3,
    "Em Negociação": 4,
    "Fechado": 5,
    "Perdido": 6,
};

