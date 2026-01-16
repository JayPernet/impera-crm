import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Pencil, MessageCircle, Phone, Mail, Calendar, DollarSign, User, MapPin } from "lucide-react";
import Link from "next/link";
import { getLeadPropertyInterests } from "../../leads/actions";

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch lead data (which contains clients)
    const { data: client, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !client || client.classification !== 'cliente') {
        notFound();
    }

    // Fetch property interests
    const propertyInterests = await getLeadPropertyInterests(id);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-text-primary">{client.full_name}</h1>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-success/10 text-success border border-success/20">
                            Cliente
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">Cliente desde {client.converted_at ? new Date(client.converted_at).toLocaleDateString('pt-BR') : new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/dashboard/chat?phone=${encodeURIComponent(client.phone)}&name=${encodeURIComponent(client.full_name)}`}
                        className="h-10 px-4 rounded-lg bg-success/10 hover:bg-success/20 text-success border border-success/20 font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                    </Link>
                    <Link
                        href={`/dashboard/clients/${id}/edit`}
                        className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Pencil className="h-4 w-4" />
                        <span>Editar Cliente</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact & Profile */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2 text-primary">Informações de Contato</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-text-tertiary" />
                                        <div>
                                            <p className="text-xs text-text-tertiary">Telefone</p>
                                            <p className="text-sm text-text-primary font-medium">{client.phone}</p>
                                        </div>
                                    </div>
                                    {client.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-text-tertiary" />
                                            <div>
                                                <p className="text-xs text-text-tertiary">Email</p>
                                                <p className="text-sm text-text-primary font-medium">{client.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2 text-primary">Perfil Financeiro</h3>
                                <div className="space-y-3">
                                    {client.budget && (
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-4 w-4 text-text-tertiary" />
                                            <div>
                                                <p className="text-xs text-text-tertiary">Orçamento</p>
                                                <p className="text-sm text-text-primary font-medium">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.budget)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="h-4 w-4 text-success" />
                                        <div>
                                            <p className="text-xs text-text-tertiary">LTV (Lifetime Value)</p>
                                            <p className="text-sm text-success font-bold">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.ltv || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {client.summary && (
                            <div className="space-y-2 pt-4 border-t border-border">
                                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Histórico e Notas</h3>
                                <p className="text-sm text-text-primary leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/5 italic">
                                    "{client.summary}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Property Interests */}
                    <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider border-b border-border pb-2 mb-4 text-primary">
                            Imóveis em Negociação / Adquiridos
                        </h3>
                        {propertyInterests.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {propertyInterests.map((property: any) => (
                                    <Link
                                        key={property.id}
                                        href={`/dashboard/properties/${property.id}`}
                                        className="p-4 rounded-lg border border-border bg-surface-elevated/50 hover:bg-surface-elevated hover:border-primary/30 transition-all group"
                                    >
                                        <p className="font-medium text-text-primary text-sm group-hover:text-primary transition-colors">{property.title || property.type}</p>
                                        <div className="flex items-center gap-2 text-xs text-text-tertiary mt-2">
                                            <MapPin className="h-3 w-3" />
                                            <span>{property.address_city}</span>
                                            <span>•</span>
                                            <span className="text-success font-medium">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(property.price)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-lg flex flex-col items-center gap-2">
                                <p className="text-sm text-text-tertiary">Nenhum imóvel vinculado a este cliente.</p>
                                <Link href="/dashboard/properties" className="text-xs text-primary hover:underline">Explorar portfólio</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-xl shadow-xl shadow-primary/5">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Status Vip
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                                <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Última Atividade</p>
                                <p className="text-sm text-text-primary font-medium mt-1">
                                    {client.last_contact_at ? new Date(client.last_contact_at).toLocaleDateString('pt-BR') : 'Sem registro'}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                                <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Origem do Cadastro</p>
                                <p className="text-sm text-text-primary font-medium mt-1">{client.source}</p>
                            </div>
                            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                                <p className="text-[10px] text-primary uppercase tracking-wider font-bold">Interesse Principal</p>
                                <p className="text-sm text-text-primary font-semibold mt-1 capitalize">{client.interest_type}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Atendimento</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-primary font-bold">
                                {client.full_name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs text-text-tertiary">Broker Responsável</p>
                                <p className="text-sm text-text-primary font-medium">Você</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
