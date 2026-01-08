import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, MoreVertical, Flame, Snowflake, Thermometer, GripVertical } from "lucide-react";
import { Lead, Temperature, useUpdateLeadTemperature, useDeleteLead } from "@/hooks/useLeads";
import { useCrmUser } from "@/hooks/useCrmUser";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Trash2, Archive, AlertTriangle } from "lucide-react";
import { LOSS_REASONS } from "./LossReasonModal";

interface LeadCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
}

const TemperatureIcon = ({ temp }: { temp: Temperature | null }) => {
  switch (temp) {
    case "hot":
      return <Flame className="w-4 h-4 text-temperature-hot" />;
    case "warm":
      return <Thermometer className="w-4 h-4 text-temperature-warm" />;
    case "cold":
    default:
      return <Snowflake className="w-4 h-4 text-temperature-cold" />;
  }
};

function getTimeAgoColor(date: string | null): { bg: string; text: string } {
  if (!date) return { bg: "bg-destructive/20", text: "text-destructive" };

  const hours = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);

  if (hours < 24) return { bg: "bg-success/20", text: "text-success" };
  if (hours < 72) return { bg: "bg-warning/20", text: "text-warning" };
  return { bg: "bg-destructive/20", text: "text-destructive" };
}

export function LeadCard({ lead, onViewDetails }: LeadCardProps) {
  const updateTemperature = useUpdateLeadTemperature();
  const deleteLead = useDeleteLead();
  const { userRole } = useCrmUser();
  const isAdmin = userRole?.role === "admin" || userRole?.role === "super_admin";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const timeAgo = lead.last_interaction_at || lead.created_at;
  const timeAgoColors = getTimeAgoColor(timeAgo);
  const timeAgoText = timeAgo
    ? formatDistanceToNow(new Date(timeAgo), { addSuffix: true, locale: ptBR })
    : "Sem interação";

  const procedures = lead.lead_procedures || [];
  const tags = lead.lead_tags || [];

  const handleTemperatureChange = (temp: Temperature) => {
    updateTemperature.mutate({ leadId: lead.id, temperature: temp });
  };

  const handleDelete = (permanent: boolean) => {
    if (window.confirm(permanent ? "Tem certeza que deseja excluir definitivamente?" : "Arquivar este lead?")) {
      deleteLead.mutate({ leadId: lead.id, permanent });
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="bg-card shadow-sm hover:shadow-md transition-all cursor-pointer border-border/50 group overflow-hidden"
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 shrink-0">
                  <TemperatureIcon temp={lead.temperature} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleTemperatureChange("cold")}>
                  <Snowflake className="w-4 h-4 mr-2 text-temperature-cold" />
                  Frio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTemperatureChange("warm")}>
                  <Thermometer className="w-4 h-4 mr-2 text-temperature-warm" />
                  Morno
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTemperatureChange("hot")}>
                  <Flame className="w-4 h-4 mr-2 text-temperature-hot" />
                  Quente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <span
              className="font-medium text-sm cursor-pointer hover:text-primary transition-colors truncate"
              onClick={() => onViewDetails(lead)}
            >
              {lead.name}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(lead)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(false)}>
                <Archive className="w-4 h-4 mr-2" />
                Arquivar Lead
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => handleDelete(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Definitivamente
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {lead.phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Phone className="w-3 h-3" />
            {lead.phone}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 2).map((lt) => (
              <Badge
                key={lt.tag.id}
                variant="secondary"
                className="text-xs px-1.5 py-0"
                style={{ backgroundColor: lt.tag.color || undefined }}
              >
                {lt.tag.name}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Procedures */}
        {procedures.length > 0 && (
          <div className="text-xs text-muted-foreground mb-2">
            {procedures.slice(0, 2).map((lp) => lp.procedure.name).join(", ")}
            {procedures.length > 2 && ` +${procedures.length - 2} mais`}
          </div>
        )}

        {/* Motivo da Perda (Loss Reason) */}
        {lead.status === "lost" && lead.loss_reason && (
          <div className="flex items-center gap-1.5 p-2 bg-destructive/5 border border-destructive/10 rounded-md mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-destructive uppercase leading-none mb-1">Motivo da Perda</p>
              <p className="text-xs text-destructive/80 truncate">
                {LOSS_REASONS.find(r => r.value === lead.loss_reason)?.label || lead.loss_reason}
              </p>
            </div>
          </div>
        )}

        {/* Time since last interaction */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
          <Badge className={`${timeAgoColors.bg} ${timeAgoColors.text} text-xs border-0 shrink-0`}>
            {timeAgoText}
          </Badge>
          {lead.source_detail && (
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {lead.source_detail}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
