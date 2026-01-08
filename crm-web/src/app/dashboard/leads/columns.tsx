import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/components/leads/types";
import { MessageCircle, Pencil, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteLead } from "./actions";
import { toast } from "sonner";

export const columns: ColumnDef<Lead>[] = [
    {
        accessorKey: "name",
        header: "Nome",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {row.original.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-semibold text-text-primary">{row.original.name}</div>
                        <div className="text-xs text-text-tertiary">{row.original.phone}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-surface-elevated text-text-secondary capitalize">
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "source",
        header: "Origem",
        cell: ({ row }) => (
            <span className="text-sm text-text-secondary">{row.original.source}</span>
        ),
    },
    {
        accessorKey: "lastInteraction",
        header: "Último Contato",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original;
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
                        toast.error("Erro ao excluir lead");
                    }
                } catch (error) {
                    toast.error("Erro inesperado");
                } finally {
                    setIsDeleting(false);
                }
            };

            return (
                <>
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/dashboard/chat?phone=${encodeURIComponent(lead.phone)}&name=${encodeURIComponent(lead.name)}`}
                            className="p-2 hover:bg-surface-elevated rounded-md text-text-tertiary hover:text-success transition-colors"
                            title="WhatsApp"
                        >
                            <MessageCircle className="h-4 w-4" />
                        </Link>
                        <Link
                            href={`/dashboard/leads/${lead.id}/edit`}
                            className="p-2 hover:bg-surface-elevated rounded-md text-text-tertiary hover:text-primary transition-colors"
                            title="Editar"
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            className="p-2 hover:bg-danger/10 rounded-md text-text-tertiary hover:text-danger transition-colors"
                            title="Excluir"
                        >
                            <Trash2 className="h-4 w-4" />
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
                </>
            );
        },
    },
];
