import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "./LeadCard";
import { Lead, LeadStatus } from "@/hooks/useLeads";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: LeadStatus;
  title: string;
  color: string;
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  leads,
  onViewDetails,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px] flex-1">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={cn("w-3 h-3 rounded-full", color)} />
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {leads.length}
        </Badge>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-3 min-h-[400px] p-2 rounded-lg transition-colors",
          isOver ? "bg-primary/10" : "bg-muted/30"
        )}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onViewDetails={onViewDetails} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
            Nenhum lead
          </div>
        )}
      </div>
    </div>
  );
}
