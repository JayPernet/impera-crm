"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { columns, Property } from "./columns";
import { Plus, LayoutGrid, LayoutList } from "lucide-react";
import { PropertyCard } from "@/components/properties/property-card";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [qualifiedLeadCount, setQualifiedLeadCount] = useState(0);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [statusFilter, setStatusFilter] = useState<"ativos" | "historico" | "todos">("ativos");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        async function fetchProperties() {
            const { data, error } = await supabase
                .from("properties")
                .select("id, title, type, status, price, address_bairro, created_at, images_urls, bedrooms, bathrooms, parking_spaces, area_m2")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching properties:", error);
            } else {
                const formattedProperties: Property[] = (data || []).map(p => ({
                    ...p,
                    status: (p.status as Property['status']) || 'disponivel'
                }));
                setProperties(formattedProperties);
            }
        }

        async function fetchQualifiedLeads() {
            const { count, error } = await supabase
                .from("leads")
                .select("*", { count: 'exact', head: true })
                .eq("status", "qualificado");

            if (error) {
                console.error("Error fetching lead count:", error);
            } else {
                setQualifiedLeadCount(count || 0);
            }
        }

        Promise.all([fetchProperties(), fetchQualifiedLeads()]).finally(() => {
            setIsLoading(false);
        });
    }, []);

    // Filter properties based on status
    const filteredProperties = properties.filter(p => {
        if (statusFilter === "ativos") {
            return p.status === "disponivel" || p.status === "reservado";
        } else if (statusFilter === "historico") {
            return p.status === "vendido" || p.status === "alugado";
        }
        return true; // "todos"
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-primary">Inventário</h1>
                    <p className="sub-header mt-1">Imóveis e lançamentos</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/[0.05] rounded-lg backdrop-blur-sm">
                        <button
                            onClick={() => setViewMode("table")}
                            className={cn(
                                "p-1.5 rounded-md transition-all duration-300",
                                viewMode === "table" ? "bg-primary text-background shadow-[0_0_10px_rgba(255,205,0,0.3)]" : "text-text-tertiary hover:text-primary"
                            )}
                            title="Visualização em Tabela"
                        >
                            <LayoutList className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "p-1.5 rounded-md transition-all duration-300",
                                viewMode === "grid" ? "bg-primary text-background shadow-[0_0_10px_rgba(255,205,0,0.3)]" : "text-text-tertiary hover:text-primary"
                            )}
                            title="Visualização em Grid"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <Link
                        href="/dashboard/properties/new"
                        className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Novo Imóvel</span>
                    </Link>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border">
                <button
                    onClick={() => setStatusFilter("ativos")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        statusFilter === "ativos"
                            ? "text-primary border-b-2 border-primary"
                            : "text-text-tertiary hover:text-text-primary"
                    )}
                >
                    Ativos
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-success/10 text-success">
                        {properties.filter(p => p.status === "disponivel" || p.status === "reservado").length}
                    </span>
                </button>
                <button
                    onClick={() => setStatusFilter("historico")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        statusFilter === "historico"
                            ? "text-primary border-b-2 border-primary"
                            : "text-text-tertiary hover:text-text-primary"
                    )}
                >
                    Histórico
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-surface-elevated text-text-tertiary">
                        {properties.filter(p => p.status === "vendido" || p.status === "alugado").length}
                    </span>
                </button>
                <button
                    onClick={() => setStatusFilter("todos")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors relative",
                        statusFilter === "todos"
                            ? "text-primary border-b-2 border-primary"
                            : "text-text-tertiary hover:text-text-primary"
                    )}
                >
                    Todos
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-surface-elevated text-text-tertiary">
                        {properties.length}
                    </span>
                </button>
            </div>

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">Total em Carteira</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: "compact" }).format(
                                properties.reduce((acc, curr) => acc + (curr.price || 0), 0)
                            )}
                        </span>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">Imóveis Ativos</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">{properties.filter(p => p.status === 'disponivel').length}</span>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-surface/40 backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-text-secondary">Leads Qualificados</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-text-primary">{qualifiedLeadCount}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64 text-text-tertiary">
                    Carregando...
                </div>
            ) : viewMode === "table" ? (
                <DataTable columns={columns} data={filteredProperties} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))
                    ) : (
                        <div className="col-span-full flex items-center justify-center h-64 text-text-tertiary">
                            Nenhum imóvel encontrado nesta categoria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
