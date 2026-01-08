import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import { columns, Property } from "./columns" // Import Property type
import { Plus } from "lucide-react"

export default async function PropertiesPage() {
    const supabase = await createClient()

    // Fetch properties with proper typing
    const { data: properties, error } = await supabase
        .from("properties")
        .select("id, title, type, status, price, address_bairro, created_at, images_urls")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching properties:", error)
    }

    // Cast the data to the Property type
    const formattedProperties: Property[] = (properties || []).map(p => ({
        ...p,
        // Ensure status matches the union type (or fallback to 'disponivel' if needed)
        status: (p.status as Property['status']) || 'disponivel'
    }))

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">Inventário</h1>
                    <p className="text-text-secondary mt-1">Gerencie seus imóveis e lançamentos.</p>
                </div>
                <Link
                    href="/dashboard/properties/new"
                    className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="h-4 w-4" />
                    <span>Novo Imóvel</span>
                </Link>
            </div>

            {/* Metrics Row (Placeholder) */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">Total em Carteira</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: "compact" }).format(
                                formattedProperties.reduce((acc, curr) => acc + (curr.price || 0), 0)
                            )}
                        </span>
                        <span className="text-xs text-success">+2.5%</span>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">Imóveis Ativos</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">{formattedProperties.filter(p => p.status === 'disponivel').length}</span>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">Leads Qualificados</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">12</span>
                        <span className="text-xs text-primary">Novos</span>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <DataTable columns={columns} data={formattedProperties} />
        </div>
    )
}
