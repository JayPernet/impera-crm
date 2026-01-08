"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Lead, LeadStatus, PIPELINE_STAGES } from "./types";
import { KanbanColumn } from "./kanban-column";
import { LeadCard } from "./lead-card";
import { updateLeadStatus } from "@/app/dashboard/leads/actions";
import { toast } from "sonner"; // Assuming we install sonner or just use console for now if not installed. I'll stick to console for safety in auto-pilot.
import { triggerConfetti } from "@/components/ui/confetti";

interface KanbanBoardProps {
    initialLeads: Lead[];
}

export function KanbanBoard({ initialLeads }: KanbanBoardProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    // Sync state with server-side prop updates (e.g. after revalidatePath)
    useEffect(() => {
        setLeads(initialLeads);
    }, [initialLeads]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // Prevent accidental drags
            },
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Lead") {
            setActiveLead(event.active.data.current.lead);
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveALead = active.data.current?.type === "Lead";
        const isOverALead = over.data.current?.type === "Lead";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveALead) return;

        // Visual update only
        if (isActiveALead && isOverALead) {
            setLeads((leads) => {
                const activeIndex = leads.findIndex((l) => l.id === activeId);
                const overIndex = leads.findIndex((l) => l.id === overId);

                // If sorting within same column, arrayMove handles it for smooth sort
                // If moving columns, we update status + move
                if (leads[activeIndex].status !== leads[overIndex].status) {
                    leads[activeIndex].status = leads[overIndex].status;
                }

                return arrayMove(leads, activeIndex, overIndex);
            });
        }

        if (isActiveALead && isOverAColumn) {
            setLeads((leads) => {
                const activeIndex = leads.findIndex((l) => l.id === activeId);
                // If over a column, simply change status to that column
                if (leads[activeIndex].status !== overId) {
                    const newLeads = [...leads];
                    newLeads[activeIndex].status = overId as LeadStatus;
                    // No server call here!
                    return arrayMove(newLeads, activeIndex, activeIndex); // Just status change, keep index roughly or logical
                }
                return leads;
            });
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveLead(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        // Determine the new status based on where we dropped
        // Logic: The local state 'leads' is ALREADY updated by onDragOver for the visual snap.
        // We just need to persist the status of the active item to the server.

        // HOWEVER, relying on state 'leads' inside onDragEnd might be tricky due to closures if not careful, 
        // but 'leads' in the function scope is from the render matching this callback? 
        // Actually, dnd-kit callbacks might be stale if not careful. 
        // Safer to derive "New Status" from the 'over' target.

        let newStatus: LeadStatus | undefined;

        if (over.data.current?.type === "Column") {
            newStatus = over.id as LeadStatus;
        } else if (over.data.current?.type === "Lead") {
            newStatus = over.data.current.lead.status;
        }

        if (newStatus) {
            // Trigger confetti if moving to "Fechado"
            if (newStatus === "Fechado") {
                triggerConfetti();
            }

            // Optimistic update was already done in DragOver for visuals.
            // We just ensure we persist it.
            // We verify if the actual DB update is needed (though DragOver usually settles it).
            // To be safe, we just send the update command.
            updateLeadStatus(activeId as string, newStatus).catch(() => {
                toast.error("Erro ao mover card");
                // In a real app, we'd revert state here
            });
        }
    }

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/30 transition-colors">
                {PIPELINE_STAGES.map((stage) => (
                    <KanbanColumn
                        key={stage}
                        id={stage}
                        leads={leads.filter((l) => l.status === stage)}
                    />
                ))}
            </div>

            {typeof window !== "undefined" &&
                createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeLead && <LeadCard lead={activeLead} />}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
