"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead, LeadStatus } from "./types";
import { LeadCard } from "./lead-card";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
    id: LeadStatus;
    leads: Lead[];
}

export function KanbanColumn({ id, leads }: KanbanColumnProps) {
    const { setNodeRef } = useSortable({
        id: id,
        data: { type: "Column", id },
        disabled: true // Columns themselves are not sortable in this version
    });

    const leadsIds = useMemo(() => leads.map((lead) => lead.id), [leads]);

    // Status Colors Mapping based on design system logic
    const statusColor = {
        "Novo": "border-info/20 text-info",
        "Em Contato": "border-primary/20 text-primary",
        "Visita Agendada": "border-primary/20 text-primary-light",
        "Visita Realizada": "border-primary/30 text-primary-light",
        "Em Negociação": "border-warning/20 text-warning",
        "Fechado": "border-success/20 text-success",
        "Perdido": "border-danger/20 text-danger"
    }[id] || "border-border text-text-tertiary";

    return (
        <div
            ref={setNodeRef}
            className="flex-shrink-0 w-[280px] bg-background rounded-xl flex flex-col h-full max-h-[calc(100vh-140px)]"
        >
            {/* Header */}
            <div className={cn("p-4 flex items-center justify-between mb-2 border-b border-white/[0.02]", statusColor)}>
                <h3 className="sub-header tracking-[0.2em] opacity-100">{id}</h3>
                <span className="text-[10px] font-bold text-text-tertiary bg-white/[0.03] px-2 py-0.5 rounded-full">{leads.length}</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3 custom-scrollbar">
                <SortableContext items={leadsIds}>
                    {leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
