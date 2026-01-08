"use client";

import { User, Phone, Mail, DollarSign } from "lucide-react";
import Link from "next/link";

interface Lead {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    status: string;
    classification: string;
    budget?: number;
}

interface InterestedLeadsListProps {
    leads: Lead[];
}

export function InterestedLeadsList({ leads }: InterestedLeadsListProps) {
    const formatPrice = (price?: number) => {
        if (!price) return "Não informado";
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            "Novo": "text-blue-400",
            "Em Contato": "text-yellow-400",
            "Visita Agendada": "text-purple-400",
            "Visita Realizada": "text-indigo-400",
            "Em Negociação": "text-orange-400",
            "Fechado": "text-green-400",
            "Perdido": "text-red-400",
        };
        return colors[status] || "text-text-secondary";
    };

    const getClassificationBadge = (classification: string) => {
        const badges: Record<string, { bg: string; text: string }> = {
            "lead": { bg: "bg-blue-500/10", text: "text-blue-400" },
            "cliente": { bg: "bg-green-500/10", text: "text-green-400" },
            "arquivado": { bg: "bg-gray-500/10", text: "text-gray-400" },
        };
        return badges[classification] || badges["lead"];
    };

    if (leads.length === 0) {
        return (
            <div className="text-center py-8 text-text-tertiary text-sm">
                Nenhum lead interessado neste imóvel ainda.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {leads.map((lead) => {
                const badge = getClassificationBadge(lead.classification);
                return (
                    <Link
                        key={lead.id}
                        href={`/dashboard/leads/${lead.id}/edit`}
                        className="block p-4 bg-surface-elevated border border-border rounded-lg hover:border-primary/50 transition-all"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-sm font-medium text-text-primary truncate">
                                        {lead.full_name}
                                    </h4>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                                        {lead.classification}
                                    </span>
                                </div>

                                <div className="space-y-1 text-xs text-text-secondary">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        <span>{lead.phone}</span>
                                    </div>
                                    {lead.email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />
                                            <span className="truncate">{lead.email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-3 w-3" />
                                        <span>Orçamento: {formatPrice(lead.budget)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className={`text-xs font-medium ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
