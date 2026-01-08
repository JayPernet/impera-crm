import { useState, useMemo } from "react";
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
import { CreateAppointmentModal } from "@/components/appointments/CreateAppointmentModal";
import { LeadDetailsModal } from "@/components/pipeline/LeadDetailsModal";
import {
  Lead,
  LeadStatus,
  Temperature,
  SourceType,
  useLeads,
  useUpdateLeadStatus,
} from "@/hooks/useLeads";

const columns: Array<{ id: LeadStatus; title: string; color: string }> = [
  { id: "new", title: "Novos", color: "bg-temperature-cold" },
  { id: "contacted", title: "Contatados", color: "bg-warning" },
  { id: "scheduled", title: "Agendados", color: "bg-success" },
  { id: "lost", title: "Perdidos", color: "bg-destructive" },
];

export default function Pipeline() {
  const [selectedTemperatures, setSelectedTemperatures] = useState<Temperature[]>([]);
  const [selectedSourceType, setSelectedSourceType] = useState<SourceType | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState<string | null>(null);

  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedLeadForAppointment, setSelectedLeadForAppointment] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

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

    // If dropping to "scheduled", open appointment modal
    if (targetStatus === "scheduled") {
      setSelectedLeadForAppointment(lead);
      setShowAppointmentModal(true);
    }

    // Update status regardless
    updateStatus.mutate({ leadId, status: targetStatus });
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLeadId(lead.id);
  };

  const handleCreateAppointment = (lead: Lead) => {
    setSelectedLeadForAppointment(lead);
    setShowAppointmentModal(true);
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
                <LeadCard lead={activeLead} onViewDetails={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Modals */}
      <CreateLeadModal open={showCreateLead} onClose={() => setShowCreateLead(false)} />

      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setSelectedLeadForAppointment(null);
        }}
        preselectedLead={selectedLeadForAppointment}
        lockPerson={!!selectedLeadForAppointment}
      />

      <LeadDetailsModal
        open={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        leadId={selectedLeadId}
        onCreateAppointment={handleCreateAppointment}
      />
    </div>
  );
}
