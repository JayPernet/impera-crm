import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Pencil, MessageCircle, Phone, Mail, Calendar, DollarSign, User, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PIPELINE_STAGES } from "@/components/leads/types";
import { getLeadPropertyInterests } from "../actions";

export default async function LeadDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch lead data
    const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !lead) {
        notFound();
    }

    // Fetch property interests
    const propertyInterests = await getLeadPropertyInterests(id);

    // Fetch organization users for assignment (future-proof)
    const { data: orgUsers } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("organization_id", lead.organization_id);

    const currentStep = lead.pipeline_step ?? 0;
    const progressPercentage = ((currentStep + 1) / PIPELINE_STAGES.length) * 100;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{lead.full_name}</h1>
                    <p className="text-sm text-text-secondary mt-1">Lead criado em {new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/dashboard/chat?phone=${encodeURIComponent(lead.phone)}&name=${encodeURIComponent(lead.full_name)}`}
                        className="h-10 px-4 rounded-lg bg-success/10 hover:bg-success/20 text-success border border-success/20 font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                    </Link>
                    <Link
                        href={`/dashboard/leads/${id}/edit`}
                        className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Pencil className="h-4 w-4" />
                        <span>Editar</span>
                    </Link>
                </div>
            </div>

            {/* Pipeline Progress */}
            <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Pipeline de Vendas</h3>
                    <span className="text-xs text-text-tertiary">{Math.round(progressPercentage)}% concluído</span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-surface-elevated rounded-full overflow-hidden mb-6">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Pipeline Steps */}
                <div className="grid grid-cols-7 gap-2">
                    {PIPELINE_STAGES.map((stage, index) => (
                        <div key={stage} className="flex flex-col items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                index <= currentStep
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                    : "bg-surface-elevated text-text-tertiary border border-border"
                            )}>
                                {index + 1}
                            </div>
                            <span className={cn(
                                "text-[10px] mt-2 text-center leading-tight",
                                index === currentStep ? "text-primary font-semibold" : "text-text-tertiary"
                            )}>
                                {stage}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Current Status Badge */}
                <div className="mt-6 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full text-sm font-medium border border-primary/30 bg-primary/10 text-primary">
                        Status Atual: {lead.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2">Informações de Contato</h3>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-text-tertiary" />
                            <div>
                                <p className="text-xs text-text-tertiary">Telefone</p>
                                <p className="text-sm text-text-primary font-medium">{lead.phone}</p>
                            </div>
                        </div>

                        {lead.email && (
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">Email</p>
                                    <p className="text-sm text-text-primary font-medium">{lead.email}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-4 w-4 text-text-tertiary" />
                            <div>
                                <p className="text-xs text-text-tertiary">Origem</p>
                                <p className="text-sm text-text-primary font-medium">{lead.source}</p>
                            </div>
                        </div>

                        {lead.last_contact_at && (
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">Último Contato</p>
                                    <p className="text-sm text-text-primary font-medium">
                                        {new Date(lead.last_contact_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lead Qualification */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2">Qualificação</h3>

                    <div className="space-y-3">
                        {lead.budget && (
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-4 w-4 text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">Orçamento</p>
                                    <p className="text-sm text-text-primary font-medium">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.budget)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {lead.interest_type && (
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">Interesse</p>
                                    <p className="text-sm text-text-primary font-medium capitalize">{lead.interest_type}</p>
                                </div>
                            </div>
                        )}

                        {/* Future: Assignment (only show if org has >1 user) */}
                        {orgUsers && orgUsers.length > 1 && (
                            <div className="pt-3 border-t border-border">
                                <p className="text-xs text-text-tertiary mb-2">Responsável</p>
                                <select
                                    className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary text-sm focus:outline-none focus:border-primary"
                                    disabled
                                >
                                    <option>Não atribuído</option>
                                    {orgUsers.map(user => (
                                        <option key={user.id} value={user.id}>{user.full_name}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-text-tertiary mt-1">Funcionalidade em breve</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary/Notes */}
            {lead.summary && (
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2 mb-4">Notas</h3>
                    <p className="text-sm text-text-primary leading-relaxed">{lead.summary}</p>
                </div>
            )}

            {/* Property Interests */}
            {propertyInterests.length > 0 && (
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2 mb-4">
                        Imóveis de Interesse ({propertyInterests.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {propertyInterests.map((property: any) => (
                            <Link
                                key={property.id}
                                href={`/dashboard/properties/${property.id}`}
                                className="p-4 rounded-lg border border-border bg-surface-elevated/50 hover:bg-surface-elevated hover:border-primary/30 transition-all"
                            >
                                <p className="font-medium text-text-primary text-sm">{property.title || property.type}</p>
                                <p className="text-xs text-text-tertiary mt-1">
                                    {property.address_city} • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
