"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Lead } from "./types";
import { cn } from "@/lib/utils";
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteLead } from "@/app/dashboard/leads/actions";
import { toast } from "sonner";

interface LeadCardProps {
    lead: Lead;
}

export function LeadCard({ lead }: LeadCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id, data: { type: "Lead", lead } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteLead(lead.id);
            if (result.success) {
                toast.success("Lead excluído com sucesso");
                setShowDeleteDialog(false);
            } else {
                toast.error("Erro ao excluir lead: " + result.message);
            }
        } catch (error) {
            toast.error("Erro inesperado ao excluir lead");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-surface-elevated border border-primary/50 rounded-lg h-[120px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "bg-surface/30 backdrop-blur-xl border border-border rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all group relative",
                "shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10"
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold">
                        {lead.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{lead.source}</span>
                </div>
                <span className="text-[10px] text-text-disabled font-mono">{lead.lastInteraction}</span>
            </div>

            <h4 className="text-sm font-semibold text-text-primary mb-1">{lead.name}</h4>

            {lead.value && (
                <p className="text-xs text-success font-medium mb-3">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumSignificantDigits: 3 }).format(lead.value)}
                </p>
            )}

            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-subtle">
                <Link
                    href={`/dashboard/chat?phone=${encodeURIComponent(lead.phone)}&name=${encodeURIComponent(lead.name)}`}
                    className="p-1.5 rounded-md hover:bg-surface-elevated text-text-tertiary hover:text-success transition-colors"
                    title="WhatsApp"
                >
                    <MessageCircle className="h-3.5 w-3.5" />
                </Link>
                <Link href={`/dashboard/leads/${lead.id}/edit`} className="p-1.5 rounded-md hover:bg-surface-elevated text-text-tertiary hover:text-primary transition-colors" title="Editar">
                    <Pencil className="h-3.5 w-3.5" />
                </Link>
                <button
                    className="p-1.5 rounded-md hover:bg-danger/10 text-text-tertiary hover:text-danger transition-colors"
                    title="Excluir"
                    onPointerDown={(e) => {
                        // Prevent drag start
                        e.stopPropagation();
                    }}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click/drag
                        setShowDeleteDialog(true);
                    }}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Excluir Lead"
                description={`Tem certeza que deseja excluir o lead "${lead.name}"?`}
                confirmText="Sim, excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
