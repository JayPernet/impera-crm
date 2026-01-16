"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, Pencil, Trash2 } from "lucide-react";
import { archiveProperty, deleteProperty } from "@/app/dashboard/properties/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface PropertyHeaderActionsProps {
    id: string;
    title: string;
    status: string;
}

export function PropertyHeaderActions({ id, title, status }: PropertyHeaderActionsProps) {
    const router = useRouter();
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleArchive = async () => {
        setIsArchiving(true);
        const result = await archiveProperty(id);
        if (result.success) {
            toast.success("Imóvel arquivado com sucesso");
            setShowArchiveDialog(false);
            router.refresh(); // Refresh to update UI state if staying on page, or push if list logic requires
        } else {
            toast.error("Erro ao arquivar imóvel: " + result.message);
        }
        setIsArchiving(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteProperty(id);
        if (result.success) {
            toast.success("Imóvel excluído com sucesso");
            router.push("/dashboard/properties");
        } else {
            toast.error("Erro ao excluir imóvel: " + result.message);
        }
        setIsDeleting(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Link
                href={`/dashboard/properties/${id}/edit`}
                className="px-4 py-2 bg-primary hover:bg-primary-light text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
                <Pencil className="h-4 w-4" />
                <span>Editar</span>
            </Link>

            {status !== 'arquivado' && (
                <button
                    onClick={() => setShowArchiveDialog(true)}
                    className="p-2 hover:bg-warning/10 rounded-lg text-text-tertiary hover:text-warning transition-colors border border-transparent hover:border-warning/20"
                    title="Arquivar"
                >
                    <Archive className="h-4 w-4" />
                </button>
            )}

            <button
                onClick={() => setShowDeleteDialog(true)}
                className="p-2 hover:bg-danger/10 rounded-lg text-text-tertiary hover:text-danger transition-colors border border-transparent hover:border-danger/20"
                title="Excluir"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <ConfirmDialog
                isOpen={showArchiveDialog}
                onClose={() => setShowArchiveDialog(false)}
                onConfirm={handleArchive}
                title="Arquivar Imóvel"
                description={`Tem certeza que deseja arquivar o imóvel "${title}"?`}
                confirmText="Sim, arquivar"
                variant="info"
                isLoading={isArchiving}
            />

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Excluir Imóvel"
                description={`Tem certeza que deseja excluir o imóvel "${title}"? Esta ação não pode ser desfeita.`}
                confirmText="Sim, excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
