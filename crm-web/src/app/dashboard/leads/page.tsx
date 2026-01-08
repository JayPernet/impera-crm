import { KanbanBoard } from "@/components/leads/kanban-board";
import { Lead } from "@/components/leads/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function LeadsPage() {
  const supabase = await createClient();
  // Filter for classification 'lead' OR null (to include old records before migration)
  const { data: leadsData } = await supabase
      .from("leads")
      .select("*")
      .or('classification.eq.lead,classification.is.null')
      .order("last_contact_at", { ascending: false });

  const mappedLeads: Lead[] = (leadsData || []).map((l) => ({
    id: l.id,
    name: l.full_name,
    phone: l.phone,
    status: l.status,
    source: l.source,
    lastInteraction: l.last_contact_at ? new Date(l.last_contact_at).toLocaleDateString('pt-BR') : "Sem contato",
    // value: l.value // Not in DB yet
  }));

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Pipeline de Vendas</h1>
          <p className="text-text-secondary mt-1">Gerencie oportunidades e acompanhe o fluxo de fechamento.</p>
        </div>
        <Link
          href="/dashboard/leads/new"
          className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Lead</span>
        </Link>
      </div>

      {/* Kanban Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="min-w-full inline-block align-top h-full">
          <KanbanBoard initialLeads={mappedLeads} />
        </div>
      </div>
    </div>
  );
}
