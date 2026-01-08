import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch user profile to determine role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, organization_id")
        .eq("id", user.id)
        .single();

    const isSuperAdmin = profile?.role === "super_admin";

    // Super Admin Dashboard Data
    let totalOrgs = 0;
    let activeOrgs = 0;
    let blockedOrgs = 0;
    let totalUsers = 0;
    let recentOrganizations: any[] = [];

    // Organization Dashboard Data
    let totalLeads = 0;
    let newLeads = 0;
    let activeLeads = 0;
    let totalClients = 0;
    let recentLeads: any[] = [];

    if (isSuperAdmin) {
        // Fetch platform-level metrics
        const { count: orgsCount } = await supabase.from("organizations").select("*", { count: "exact", head: true });
        totalOrgs = orgsCount || 0;

        const { count: activeCount } = await supabase.from("organizations").select("*", { count: "exact", head: true }).eq("subscription_status", "active");
        activeOrgs = activeCount || 0;

        const { count: blockedCount } = await supabase.from("organizations").select("*", { count: "exact", head: true }).eq("subscription_status", "blocked");
        blockedOrgs = blockedCount || 0;

        const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        totalUsers = usersCount || 0;

        const { data: orgs } = await supabase
            .from("organizations")
            .select("id, name, slug, subscription_status, created_at")
            .order("created_at", { ascending: false })
            .limit(5);
        recentOrganizations = orgs || [];
    } else {
        // Fetch organization-level metrics (existing logic)
        const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).or('classification.eq.lead,classification.is.null');
        totalLeads = leadsCount || 0;

        const { count: newCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "Novo").or('classification.eq.lead,classification.is.null');
        newLeads = newCount || 0;

        const { count: activeCount } = await supabase.from("leads").select("*", { count: "exact", head: true })
            .neq("status", "Novo")
            .neq("status", "Fechado")
            .neq("status", "Perdido")
            .or('classification.eq.lead,classification.is.null');
        activeLeads = activeCount || 0;

        const { count: clientsCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("classification", "cliente");
        totalClients = clientsCount || 0;

        const { data: leads } = await supabase
            .from("leads")
            .select("id, full_name, status, last_contact_at, source, classification")
            .order("last_contact_at", { ascending: false })
            .limit(5);
        recentLeads = leads || [];
    }


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Painel IMPERA</h1>
                    <p className="text-text-secondary mt-1">Visão geral do sistema.</p>
                </div>
                <div className="flex items-center gap-3 bg-surface-elevated/50 border border-border rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-text-secondary font-mono uppercase tracking-wide">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace('.', '')}
                    </span>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isSuperAdmin ? (
                    <>
                        {/* Total Organizations */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-border-strong transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Total de Unidades</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{totalOrgs}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded-full text-text-tertiary">Imobiliárias</span>
                            </div>
                        </div>

                        {/* Active Organizations */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-success/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Ativas</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{activeOrgs}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full font-medium">Em Operação</span>
                            </div>
                        </div>

                        {/* Blocked Organizations */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-danger/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Bloqueadas</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{blockedOrgs}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-danger/10 flex items-center justify-center text-danger group-hover:scale-110 transition-transform duration-300">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded-full font-medium">Sem Acesso</span>
                            </div>
                        </div>

                        {/* Total Users */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-info/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Total de Usuários</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{totalUsers}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center text-info group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] text-info font-medium flex items-center gap-1">Plataforma</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Total Leads */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-border-strong transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Total de Leads</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{totalLeads}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded-full text-text-tertiary">Base Geral</span>
                            </div>
                        </div>

                        {/* New Opportunities */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-info/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Novos</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{newLeads}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center text-info group-hover:scale-110 transition-transform duration-300">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] text-info font-medium flex items-center gap-1">
                                    Aguardando atendimento
                                </span>
                            </div>
                        </div>

                        {/* In Negotiation */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-warning/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Em Negociação</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{activeLeads}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 h-1.5 w-full bg-surface rounded-full overflow-hidden">
                                <div className="h-full bg-warning/50 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>

                        {/* Clients */}
                        <div className="relative p-6 rounded-2xl border border-border bg-gradient-to-b from-surface/50 to-surface-elevated/20 backdrop-blur-xl group hover:border-success/30 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-1">Clientes</p>
                                    <h3 className="text-3xl font-bold text-text-primary tabular-nums">{totalClients}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full font-medium">Carteira Ativa</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity - Takes 2/3 width on large screens */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-border bg-surface/30 backdrop-blur-xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Atividade Recente
                        </h3>
                        {!isSuperAdmin && (
                            <Link href="/dashboard/leads" className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
                                Ver todos &rarr;
                            </Link>
                        )}
                    </div>

                    <div className="space-y-1 flex-1">
                        {isSuperAdmin ? (
                            recentOrganizations && recentOrganizations.length > 0 ? (
                                recentOrganizations.map((org: any) => (
                                    <Link key={org.id} href={`/dashboard/admin/organizations`} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-surface-elevated/50 transition-colors border border-transparent hover:border-border-subtle cursor-pointer block">
                                        <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold text-text-secondary group-hover:border-primary/30 group-hover:text-primary transition-colors">
                                            {org.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-text-primary truncate">{org.name}</p>
                                                <span className={cn(
                                                    "text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border",
                                                    org.subscription_status === 'active' ? 'bg-success/10 text-success border-success/20' :
                                                        org.subscription_status === 'blocked' ? 'bg-danger/10 text-danger border-danger/20' :
                                                            'bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20'
                                                )}>{org.subscription_status === 'active' ? 'Ativa' : org.subscription_status === 'blocked' ? 'Bloqueada' : 'Inativa'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                                <span className="font-mono">{org.slug}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-text-tertiary font-mono block">
                                                {new Date(org.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-text-tertiary text-sm border-2 border-dashed border-border/50 rounded-xl">
                                    <Users className="h-8 w-8 mb-2 opacity-20" />
                                    Nenhuma unidade cadastrada.
                                </div>
                            )
                        ) : (
                            recentLeads && recentLeads.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <Link key={lead.id} href={`/dashboard/leads/${lead.id}/edit`} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-surface-elevated/50 transition-colors border border-transparent hover:border-border-subtle cursor-pointer block">
                                        <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold text-text-secondary group-hover:border-primary/30 group-hover:text-primary transition-colors">
                                            {lead.full_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-text-primary truncate">{lead.full_name}</p>
                                                {lead.classification === 'cliente' && (
                                                    <span className="text-[9px] uppercase font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">Cliente</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-tertiary">
                                                <span>{lead.source}</span>
                                                <span className="h-1 w-1 rounded-full bg-border-strong"></span>
                                                <span className={cn(
                                                    "font-medium",
                                                    lead.status === 'Novo' ? 'text-info' :
                                                        lead.status === 'Fechado' ? 'text-success' :
                                                            lead.status === 'Perdido' ? 'text-danger' : 'text-warning'
                                                )}>{lead.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-text-tertiary font-mono block">
                                                {lead.last_contact_at ? new Date(lead.last_contact_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : "-"}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-text-tertiary text-sm border-2 border-dashed border-border/50 rounded-xl">
                                    <Users className="h-8 w-8 mb-2 opacity-20" />
                                    Nenhuma atividade recente.
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Quick Actions - Compact column */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-border bg-surface/30 backdrop-blur-xl">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Acesso Rápido</h3>
                        <div className="space-y-3">
                            {isSuperAdmin ? (
                                <>
                                    <Link href="/dashboard/admin/organizations" className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border transition-all group">
                                        <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-text-primary block">Gerenciar Unidades</span>
                                            <span className="text-[10px] text-text-tertiary block">Administrar imobiliárias</span>
                                        </div>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/dashboard/leads/new" className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border transition-all group">
                                        <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-text-primary block">Adicionar Lead</span>
                                            <span className="text-[10px] text-text-tertiary block">Cadastrar nova oportunidade</span>
                                        </div>
                                    </Link>

                                    <Link href="/dashboard/properties/new" className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated hover:bg-surface-elevated/80 border border-border transition-all group">
                                        <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-text-primary block">Cadastrar Imóvel</span>
                                            <span className="text-[10px] text-text-tertiary block">Novo item no portfólio</span>
                                        </div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {!isSuperAdmin && (
                        <div className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20">
                            <div className="p-5 rounded-xl bg-surface/90 backdrop-blur-md">
                                <h4 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    Fila de Atendimento
                                </h4>
                                <p className="text-xs text-text-secondary mb-4">
                                    Verifique as mensagens não lidas e dê andamento nos atendimentos.
                                </p>
                                <Link
                                    href="/dashboard/chat"
                                    className="block w-full text-center py-2 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground text-xs font-bold uppercase tracking-wide transition-all shadow-lg shadow-primary/20"
                                >
                                    Acessar Chat
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
