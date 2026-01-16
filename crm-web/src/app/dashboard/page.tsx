import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Users, TrendingUp, AlertCircle, CheckCircle2, Clock, MessageSquare, Search, TrendingDown, Clock3 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LeadsOverTime } from "@/components/dashboard/leads-over-time";
import { LeadsBySource } from "@/components/dashboard/leads-by-source";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { PropertyStats } from "@/components/dashboard/property-stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("role, organization_id, full_name")
        .eq("id", user.id)
        .single();

    const isSuperAdmin = profile?.role === "super_admin";

    let totalOrgs = 0;
    let activeOrgs = 0;
    let blockedOrgs = 0;
    let totalUsers = 0;
    let recentOrganizations: any[] = [];

    let totalLeads = 0;
    let newLeads = 0;
    let activeLeads = 0;
    let totalClients = 0;
    let recentLeads: any[] = [];
    let recentSales: any[] = [];
    let leadsBySource: Array<{ name: string; value: number }> = [];
    let leadsOverTime: Array<{ date: string; count: number }> = [];

    if (isSuperAdmin) {
        const { count: orgsCount } = await supabase.from("organizations").select("*", { count: "exact", head: true });
        totalOrgs = orgsCount || 0;
        const { count: activeCount } = await supabase.from("organizations").select("*", { count: "exact", head: true }).eq("subscription_status", "active");
        activeOrgs = activeCount || 0;
        const { count: blockedCount } = await supabase.from("organizations").select("*", { count: "exact", head: true }).eq("subscription_status", "blocked");
        blockedOrgs = blockedCount || 0;
        const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
        totalUsers = usersCount || 0;
        const { data: orgs } = await supabase.from("organizations").select("id, name, slug, subscription_status, created_at").order("created_at", { ascending: false }).limit(5);
        recentOrganizations = orgs || [];
    } else {
        const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).or('classification.eq.lead,classification.is.null');
        totalLeads = leadsCount || 0;
        const { count: newCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "Novo").or('classification.eq.lead,classification.is.null');
        newLeads = newCount || 0;
        const { count: activeCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).neq("status", "Novo").neq("status", "Fechado").neq("status", "Perdido").or('classification.eq.lead,classification.is.null');
        activeLeads = activeCount || 0;
        const { count: clientsCount } = await supabase.from("leads").select("*", { count: "exact", head: true }).eq("classification", "cliente");
        totalClients = clientsCount || 0;
        const { data: leads } = await supabase.from("leads").select("id, full_name, status, last_contact_at, source, classification").order("last_contact_at", { ascending: false }).limit(5);
        recentLeads = leads || [];
        const { data: sales } = await supabase.from("leads").select("id, full_name, status, created_at").eq("status", "Fechado").order("created_at", { ascending: false }).limit(5);
        recentSales = sales || [];

        const { data: allLeads } = await supabase.from("leads").select("source");
        if (allLeads) {
            const sourceCount: Record<string, number> = {};
            allLeads.forEach(lead => {
                const source = lead.source || "Sem origem";
                sourceCount[source] = (sourceCount[source] || 0) + 1;
            });
            leadsBySource = Object.entries(sourceCount).map(([name, value]) => ({ name, value }));
        }

        const { data: timeData } = await supabase.from("leads").select("created_at").gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).order("created_at", { ascending: true });
        if (timeData) {
            const dateCount: Record<string, number> = {};
            timeData.forEach(lead => {
                const date = new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                dateCount[date] = (dateCount[date] || 0) + 1;
            });
            leadsOverTime = Object.entries(dateCount).map(([date, count]) => ({ date, count }));
        }
    }

    // Fetch property stats and activities for non-super-admin users
    let totalProperties = 0;
    let recentProperties = 0;
    let activities: any[] = [];

    if (!isSuperAdmin) {
        // Property stats
        const { count: propertiesCount } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .in("status", ["disponivel", "reservado"]);
        totalProperties = propertiesCount || 0;

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { count: recentCount } = await supabase
            .from("properties")
            .select("*", { count: "exact", head: true })
            .gte("created_at", sevenDaysAgo);
        recentProperties = recentCount || 0;

        // Fetch activities with user names
        const { data: activitiesData } = await supabase
            .from("activities")
            .select(`
                id,
                created_at,
                user_id,
                entity_type,
                entity_id,
                action_type,
                description,
                profiles:user_id (full_name)
            `)
            .order("created_at", { ascending: false })
            .limit(10);

        activities = (activitiesData || []).map((activity: any) => ({
            ...activity,
            user_name: activity.profiles?.full_name || "Sistema"
        }));
    }

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    const firstName = profile?.full_name?.split(" ")[0] || "Usuário";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-primary">{greeting}, {firstName}!</h1>
                    <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-[0.4em] font-bold opacity-60">Visão geral</p>
                </div>
                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-full px-4 py-1.5 backdrop-blur-sm shadow-sm">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-text-secondary font-mono uppercase tracking-widest">
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).replace('.', '')}
                    </span>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isSuperAdmin ? (
                    <>
                        <div className="luxury-card p-6 group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">Total de Unidades</p>
                                    <h3 className="text-4xl font-extrabold text-primary tabular-nums">{totalOrgs}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="luxury-card p-6 group hover:bg-white/[0.02]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">Leads</p>
                                    <h3 className="text-4xl font-extrabold text-primary tabular-nums">{totalLeads}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        <div className="luxury-card p-6 group hover:bg-white/[0.02]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-info transition-colors">Novos</p>
                                    <h3 className="text-4xl font-extrabold text-primary tabular-nums">{newLeads}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center text-info border border-info/20">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        <div className="luxury-card p-6 group hover:bg-white/[0.02]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-warning transition-colors">Em Negócio</p>
                                    <h3 className="text-4xl font-extrabold text-primary tabular-nums">{activeLeads}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning border border-warning/20">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        <div className="luxury-card p-6 group hover:bg-white/[0.02]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-success transition-colors">Clientes</p>
                                    <h3 className="text-4xl font-extrabold text-primary tabular-nums">{totalClients}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success border border-success/20">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Property Stats - Only for non-super-admin */}
            {!isSuperAdmin && (
                <div className="space-y-4">
                    <h2 className="sub-header">Imóveis</h2>
                    <PropertyStats
                        totalProperties={totalProperties}
                        recentProperties={recentProperties}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 luxury-card flex flex-col">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h3 className="sub-header flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Atividade Recente
                        </h3>
                    </div>

                    <div className="flex-1 p-4">
                        {isSuperAdmin ? (
                            recentOrganizations.length > 0 ? (
                                recentOrganizations.map((org: any) => (
                                    <Link key={org.id} href="/dashboard/admin/organizations" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-border group">
                                        <div className="h-10 w-10 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold text-text-tertiary group-hover:text-primary">
                                            {org.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary truncate">{org.name}</p>
                                            <p className="text-xs text-text-muted">{org.slug}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-text-muted font-mono uppercase">
                                                {new Date(org.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-text-muted text-xs border border-dashed border-border rounded-xl">
                                    Nenhuma unidade cadastrada.
                                </div>
                            )
                        ) : (
                            <ActivityFeed activities={activities} />
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Quick Access */}
                    <div className="luxury-card p-6">
                        <h2 className="sub-header mb-6">Acesso Rápido</h2>
                        <div className="grid gap-2">
                            {isSuperAdmin ? (
                                <Link href="/dashboard/admin/organizations" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group">
                                    <div className="h-8 w-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-text-tertiary group-hover:text-primary transition-colors border border-white/5">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">Gerenciar Unidades</span>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/dashboard/leads/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group">
                                        <div className="h-8 w-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-text-tertiary group-hover:text-primary transition-colors border border-white/5">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">Adicionar Lead</span>
                                    </Link>
                                    <Link href="/dashboard/properties/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5 group">
                                        <div className="h-8 w-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-text-tertiary group-hover:text-primary transition-colors border border-white/5">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary">Cadastrar Imóvel</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Service Queue Card */}
                    {!isSuperAdmin && (
                        <div className="p-1 rounded-[2rem] bg-gradient-to-b from-primary/30 to-transparent">
                            <div className="p-8 rounded-[1.9rem] bg-[#0b1215] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MessageSquare className="h-24 w-24 text-primary" />
                                </div>
                                <div className="relative z-10 text-center">
                                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="sub-header mb-2 text-primary opacity-100">Fila de Atendimento</h3>
                                    <p className="text-xs text-text-tertiary mb-6 leading-relaxed">
                                        Verifique novas mensagens e mantenha sua taxa de resposta rápida.
                                    </p>
                                    <Link
                                        href="/dashboard/chat"
                                        className="inline-block px-8 py-2.5 rounded-full bg-primary text-[#0b1215] text-[10px] font-bold uppercase tracking-widest hover:bg-primary-light transition-all"
                                    >
                                        Acessar Chat
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts - Bottom */}
            {!isSuperAdmin && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <LeadsOverTime data={leadsOverTime} />
                    <LeadsBySource data={leadsBySource} />
                </div>
            )}

            {/* Recent Sales */}
            {!isSuperAdmin && recentSales.length > 0 && (
                <div className="pt-8">
                    <RecentSales sales={recentSales} />
                </div>
            )}
        </div>
    );
}
