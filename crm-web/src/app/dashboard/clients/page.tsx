import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import { columns, Client } from "./columns"
import { Plus, Users } from "lucide-react"

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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Carteira de Clientes</h1>
                    <p className="text-text-secondary mt-1">Gestão de relacionamento e histórico de compras.</p>
                </div>
                <Link
                    href="/dashboard/clients/new"
                    className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    <span>Novo Cliente</span>
                </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary">Total de Clientes</h3>
                        <span className="text-2xl font-bold text-text-primary">{formattedClients.length}</span>
                    </div>
                </div>
                 {/* Placeholder metrics */}
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">LTV Médio</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">R$ 0,00</span>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                     <h3 className="text-sm font-medium text-text-secondary">Ativos este Mês</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">0</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={formattedClients} />
        </div>
    )
}
