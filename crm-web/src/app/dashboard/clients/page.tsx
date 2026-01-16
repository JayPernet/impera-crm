import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import { columns, Client } from "./columns"
import { Plus, Users, DollarSign, Calendar } from "lucide-react"

export default async function ClientsPage() {
    const supabase = await createClient()

    // Fetch ONLY clients (classification = 'cliente')
    const { data: clients, error } = await supabase
        .from("leads")
        .select("*")
        .eq('classification', 'cliente')
        .order("full_name", { ascending: true })

    if (error) {
        console.error("Error fetching clients:", error)
    }

    const formattedClients: Client[] = (clients || []).map(c => ({
        id: c.id,
        full_name: c.full_name,
        phone: c.phone,
        email: c.email,
        interest_type: c.interest_type || 'N/A',
        status: c.status,
        budget: c.budget,
        ltv: c.ltv || 0,
        last_contact_at: c.last_contact_at
    }))

    const totalLtv = formattedClients.reduce((acc, c) => acc + (c.ltv || 0), 0);
    const activeThisMonth = formattedClients.filter(c => {
        if (!c.last_contact_at) return false;
        const lastContact = new Date(c.last_contact_at);
        const now = new Date();
        return lastContact.getMonth() === now.getMonth() && lastContact.getFullYear() === now.getFullYear();
    }).length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-text-primary">Carteira de Clientes</h1>
                    <p className="text-sm text-text-secondary mt-1">Gestão de relacionamento e histórico de compras</p>
                </div>
                <Link
                    href="/dashboard/clients/new"
                    className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    <span>Novo Cliente</span>
                </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 luxury-card flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1">Total de Clientes</h3>
                        <span className="text-2xl font-bold text-text-primary">{formattedClients.length}</span>
                    </div>
                </div>

                <div className="p-6 luxury-card flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20 shadow-inner">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1">Total LTV</h3>
                        <span className="text-2xl font-bold text-success">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(totalLtv)}
                        </span>
                    </div>
                </div>

                <div className="p-6 luxury-card flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white/[0.03] flex items-center justify-center text-text-secondary border border-white/5">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1">Ativos este Mês</h3>
                        <span className="text-2xl font-bold text-text-primary">{activeThisMonth}</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                <DataTable columns={columns} data={formattedClients} />
            </div>
        </div>
    )
}

