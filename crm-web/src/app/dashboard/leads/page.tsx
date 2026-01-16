"use client";

import { KanbanBoard } from "@/components/leads/kanban-board";
import { Lead } from "@/components/leads/types";
import { Plus, LayoutGrid, LayoutList, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();
    async function fetchLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .or('classification.eq.lead,classification.is.null')
        .order("last_contact_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
      } else {
        const mappedLeads: Lead[] = (data || []).map((l) => ({
          id: l.id,
          name: l.full_name,
          phone: l.phone,
          status: l.status,
          source: l.source,
          lastInteraction: l.last_contact_at ? new Date(l.last_contact_at).toLocaleDateString('pt-BR') : "Sem contato",
          value: l.budget || 0,
        }));
        setLeads(mappedLeads);
      }
      setIsLoading(false);
    }

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone.includes(searchQuery)
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-primary">Pipeline de Vendas</h1>
          <p className="sub-header mt-1">Gerencie oportunidades e fluxo</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-text-tertiary" />
            <input
              type="text"
              placeholder="Buscar leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-surface-elevated border border-border rounded-lg text-xs transition-all focus:outline-none focus:border-primary/30 focus:bg-surface-hover placeholder:text-text-tertiary/70"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-lg backdrop-blur-sm">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-300",
                viewMode === "table" ? "bg-primary text-background shadow-[0_0_10px_rgba(255,205,0,0.3)]" : "text-text-tertiary hover:text-primary"
              )}
              title="Visualização em Lista"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-1.5 rounded-md transition-all duration-300",
                viewMode === "kanban" ? "bg-primary text-background shadow-[0_0_10px_rgba(255,205,0,0.3)]" : "text-text-tertiary hover:text-primary"
              )}
              title="Visualização em Kanban"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link
            href="/dashboard/leads/new"
            className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Lead</span>
          </Link>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-text-tertiary">
            Carregando...
          </div>
        ) : viewMode === "kanban" ? (
          <div className="h-full overflow-x-auto overflow-y-hidden">
            <div className="min-w-full inline-block align-top h-full">
              <KanbanBoard initialLeads={filteredLeads} />
            </div>
          </div>
        ) : (
          <div className="bg-surface/30 backdrop-blur-xl border border-border rounded-xl p-4 h-full overflow-auto">
            <DataTable columns={columns} data={filteredLeads} />
          </div>
        )}
      </div>
    </div>
  );
}
