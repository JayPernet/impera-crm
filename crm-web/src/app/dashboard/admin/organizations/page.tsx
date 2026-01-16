import { createClient } from "@/utils/supabase/server";
import { Building2, Plus, Power, PowerOff, Settings, MessageSquare } from "lucide-react";
import Link from "next/link";
import { OrganizationTable } from "./organization-table";
import { CreateOrganizationDialog } from "./create-organization-dialog";

export default async function AdminOrganizationsPage() {
    const supabase = await createClient();

    // Fetch all organizations
    const { data: organizations, error } = await supabase
        .from("organizations")
        .select("id, name, slug, subscription_status, plan_id, whatsapp_automated, whatsapp_type, token_id, instance_id, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching organizations:", error);
    }

    // Count users and get admin info per organization
    const orgsWithCounts = await Promise.all(
        (organizations || []).map(async (org) => {
            // Count total users
            const { count } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("organization_id", org.id);

            // Get admin details
            const { data: adminProfile } = await supabase
                .from("profiles")
                .select("id, full_name")
                .eq("organization_id", org.id)
                .eq("role", "admin")
                .single();

            let adminEmail = "";
            if (adminProfile) {
                const { data: adminUser } = await supabase.auth.admin.getUserById(adminProfile.id);
                adminEmail = adminUser?.user?.email || "";
            }

            return {
                ...org,
                userCount: count || 0,
                adminName: adminProfile?.full_name || "",
                adminEmail: adminEmail,
            };
        })
    );


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-primary">Administração de Imobiliárias</h1>
                    <p className="sub-header mt-1">Gestão de sistema</p>
                </div>
                <CreateOrganizationDialog />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 luxury-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider">Total</p>
                            <p className="text-2xl font-semibold text-text-primary tabular-nums">{orgsWithCounts.length}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 luxury-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Power className="h-5 w-5 text-success" />
                        </div>
                        <div>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider">Ativas</p>
                            <p className="text-2xl font-semibold text-text-primary tabular-nums">
                                {orgsWithCounts.filter(o => o.subscription_status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 luxury-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-danger/10 flex items-center justify-center">
                            <PowerOff className="h-5 w-5 text-danger" />
                        </div>
                        <div>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider">Bloqueadas</p>
                            <p className="text-2xl font-semibold text-text-primary tabular-nums">
                                {orgsWithCounts.filter(o => o.subscription_status === 'blocked').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 luxury-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-info" />
                        </div>
                        <div>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider">Com WhatsApp</p>
                            <p className="text-2xl font-semibold text-text-primary tabular-nums">
                                {orgsWithCounts.filter(o => o.whatsapp_automated).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organizations Table */}
            < div className="luxury-card overflow-hidden" >
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-text-primary">Imobiliárias Cadastradas</h2>
                    <p className="text-sm text-text-secondary mt-1">{orgsWithCounts.length} imobiliárias no sistema</p>
                </div>
                <OrganizationTable organizations={orgsWithCounts} />
            </div >
        </div >
    );
}
