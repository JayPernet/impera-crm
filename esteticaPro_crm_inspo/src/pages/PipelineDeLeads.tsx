import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { KanbanColumn } from "@/components/pipeline/KanbanColumn";
import { LeadCard } from "@/components/pipeline/LeadCard";
import { PipelineFilters } from "@/components/pipeline/PipelineFilters";
import { CreateLeadModal } from "@/components/pipeline/CreateLeadModal";
import { LeadDetailsModal } from "@/components/pipeline/LeadDetailsModal";
import { CreateAppointmentModal } from "@/components/appointments/CreateAppointmentModal";
import { LossReasonModal } from "@/components/pipeline/LossReasonModal";
import {
  Lead,
  LeadStatus,
  Temperature,
  SourceType,
  useLeads,
  useUpdateLeadStatus,
} from "@/hooks/useLeads";

// Colunas do Kanban com cores conforme solicitado
const columns: Array<{ id: LeadStatus; title: string; color: string }> = [
  { id: "new", title: "Novos", color: "bg-blue-500" },
  { id: "contacted", title: "Contatados", color: "bg-yellow-500" },
  { id: "scheduled", title: "Agendados", color: "bg-orange-500" },
  { id: "attended", title: "Comparecimento", color: "bg-purple-500" },
  { id: "sold", title: "Vendas", color: "bg-success" },
  { id: "lost", title: "Perdidos", color: "bg-destructive" },
];

export default function PipelineDeLeads() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTemperatures, setSelectedTemperatures] = useState<Temperature[]>([]);
  const [selectedSourceType, setSelectedSourceType] = useState<SourceType | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState<string | null>(null);

  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showAppointmentIntent, setShowAppointmentIntent] = useState(false);
  const [selectedLeadForAppointment, setSelectedLeadForAppointment] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showLossReasonModal, setShowLossReasonModal] = useState(false);
  const [leadToMarkAsLost, setLeadToMarkAsLost] = useState<Lead | null>(null);

  // Abre modal de criação se veio da URL
  useEffect(() => {
    if (searchParams.get("action") === "new-lead") {
      setShowCreateLead(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const { data: leads, isLoading } = useLeads({
    temperature: selectedTemperatures.length > 0 ? selectedTemperatures : undefined,
    source_type: selectedSourceType ? [selectedSourceType] : undefined,
    tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    assigned_to: selectedAssignedTo || undefined,
  });

  const updateStatus = useUpdateLeadStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const leadsByStatus = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      new: [],
      contacted: [],
      scheduled: [],
      attended: [],
      sold: [],
      lost: [],
    };

    leads?.forEach((lead) => {
      const status = lead.status || "new";
      grouped[status].push(lead);
    });

    return grouped;
  }, [leads]);

  const activeLead = useMemo(() => {
    if (!activeId) return null;
    return leads?.find((l) => l.id === activeId) || null;
  }, [activeId, leads]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const targetStatus = over.id as LeadStatus;

    const lead = leads?.find((l) => l.id === leadId);
    if (!lead || lead.status === targetStatus) return;

    // Se soltar em "scheduled", dispara intenção de abrir modal de agendamento
    if (targetStatus === "scheduled") {
      setSelectedLeadForAppointment(lead);
      setShowAppointmentIntent(true);
    }

    // Sugestão de conversão ao vender
    if (targetStatus === "sold") {
      import("sonner").then(({ toast }) => {
        toast.success("Venda registrada!", {
          description: "O lead agora é um cliente. Deseja registrar os detalhes agora?",
          action: {
            label: "Ver Detalhes",
            onClick: () => handleViewDetails(lead),
          },
        });
      });
    }

    // Se soltar em "lost", abre modal de motivo da perda
    if (targetStatus === "lost") {
      setLeadToMarkAsLost(lead);
      setShowLossReasonModal(true);
      return; // Do not update yet
    }

    // Atualiza status independentemente
    updateStatus.mutate({ leadId, status: targetStatus });
  };

  const handleConfirmLoss = (reason: string, description: string) => {
    if (!leadToMarkAsLost) return;
    updateStatus.mutate({
      leadId: leadToMarkAsLost.id,
      status: "lost",
      lossReason: reason,
      lossDescription: description
    });
    setLeadToMarkAsLost(null);
    setShowLossReasonModal(false);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLeadId(lead.id);
  };

  const handleClearFilters = () => {
    setSelectedTemperatures([]);
    setSelectedSourceType(null);
    setSelectedTagIds([]);
    setSelectedAssignedTo(null);
  };

  const totalLeads = leads?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline de Leads</h1>
          <p className="text-muted-foreground">{totalLeads} leads no total</p>
        </div>
        <Button className="gold-gradient text-secondary" onClick={() => setShowCreateLead(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Filters */}
      <PipelineFilters
        selectedTemperatures={selectedTemperatures}
        setSelectedTemperatures={setSelectedTemperatures}
        selectedSourceType={selectedSourceType}
        setSelectedSourceType={setSelectedSourceType}
        selectedTagIds={selectedTagIds}
        setSelectedTagIds={setSelectedTagIds}
        selectedAssignedTo={selectedAssignedTo}
        setSelectedAssignedTo={setSelectedAssignedTo}
        onClearFilters={handleClearFilters}
      />

      {/* Kanban Board */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.id} className="space-y-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                leads={leadsByStatus[column.id]}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead && (
              <div className="opacity-80 rotate-3">
                <LeadCard lead={activeLead} onViewDetails={() => { }} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modal: Criar Lead */}
      <CreateLeadModal open={showCreateLead} onClose={() => setShowCreateLead(false)} />

      {/* Modal: Detalhes do Lead */}
      <LeadDetailsModal
        open={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        leadId={selectedLeadId}
        onCreateAppointment={(lead) => {
          setSelectedLeadForAppointment(lead);
          setShowAppointmentIntent(true);
        }}
      />

      {/* Modal: Criar Agendamento */}
      <CreateAppointmentModal
        open={showAppointmentIntent}
        onClose={() => {
          setShowAppointmentIntent(false);
          setSelectedLeadForAppointment(null);
        }}
        preselectedLead={selectedLeadForAppointment}
      />

      {/* Modal: Motivo da Perda */}
      <LossReasonModal
        open={showLossReasonModal}
        onClose={() => {
          setShowLossReasonModal(false);
          setLeadToMarkAsLost(null);
        }}
        onConfirm={handleConfirmLoss}
        leadName={leadToMarkAsLost?.name || ""}
      />
    </div>
  );
}
