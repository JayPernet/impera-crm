"use client";

import { Power, PowerOff, Settings, MessageSquare, Bot, Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { updateOrganizationStatus, deleteOrganization } from "./actions";
import { toast } from "sonner";
import { EditOrganizationDialog } from "./edit-organization-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Organization {
    id: string;
    name: string;
    slug: string;
    subscription_status: string;
    plan_id: string;
    whatsapp_automated: boolean;
    whatsapp_type: string | null;
    token_id: string | null;
    instance_id: string | null;
    created_at: string;
    userCount: number;
    adminName?: string;
    adminEmail?: string;
}

export function OrganizationTable({ organizations }: { organizations: Organization[] }) {
    const [isPending, startTransition] = useTransition();
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

    const handleToggleStatus = (orgId: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "blocked" : "active";

        startTransition(async () => {
            const result = await updateOrganizationStatus(orgId, newStatus);
            if (result.success) {
                toast.success(newStatus === "active" ? "Imobiliária ativada!" : "Imobiliária bloqueada!");
            } else {
                toast.error(result.message || "Erro ao atualizar status");
            }
        });
    };

    const handleDelete = async () => {
        if (!orgToDelete) return;

        startTransition(async () => {
            const result = await deleteOrganization(orgToDelete.id);
            if (result.success) {
                toast.success("Imobiliária e todos os dados vinculados foram excluídos.");
                setShowDeleteDialog(false);
                setOrgToDelete(null);
            } else {
                toast.error(result.message || "Erro ao excluir imobiliária");
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const config = {
            active: { label: "Ativa", className: "bg-success/10 text-success border-success/30" },
            inactive: { label: "Inativa", className: "bg-text-tertiary/10 text-text-tertiary border-text-tertiary/30" },
            blocked: { label: "Bloqueada", className: "bg-danger/10 text-danger border-danger/30" },
        };
        const { label, className } = config[status as keyof typeof config] || config.inactive;
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium uppercase tracking-wide ${className}`}>
                {label}
            </span>
        );
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.05]">
                            <th className="text-left py-4 px-6 sub-header">Nome</th>
                            <th className="text-left py-4 px-6 sub-header">Slug</th>
                            <th className="text-left py-4 px-6 sub-header">Usuários</th>
                            <th className="text-left py-4 px-6 sub-header">Features</th>
                            <th className="text-left py-4 px-6 sub-header">Status</th>
                            <th className="text-left py-4 px-6 sub-header">Criado em</th>
                            <th className="text-right py-4 px-6 sub-header">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-text-tertiary text-sm">
                                    Nenhuma imobiliária cadastrada
                                </td>
                            </tr>
                        ) : (
                            organizations.map((org) => (
                                <tr key={org.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-3 text-sm font-medium text-primary">{org.name}</td>
                                    <td className="px-6 py-3 text-sm text-text-secondary font-mono">{org.slug}</td>
                                    <td className="px-6 py-3 text-sm text-text-secondary tabular-nums">{org.userCount}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {org.whatsapp_automated && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium bg-success/10 text-success border-success/30">
                                                    <MessageSquare className="h-3 w-3" />
                                                    WhatsApp
                                                </span>
                                            )}
                                            {!org.whatsapp_automated && (
                                                <span className="text-xs text-text-tertiary">Nenhuma</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">{getStatusBadge(org.subscription_status)}</td>
                                    <td className="px-6 py-3 text-sm text-text-tertiary">
                                        {new Date(org.created_at).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditingOrg(org)}
                                                className="h-8 px-3 rounded-md text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors flex items-center gap-1.5"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(org.id, org.subscription_status)}
                                                disabled={isPending}
                                                className={`h-8 px-3 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${org.subscription_status === "active"
                                                    ? "text-danger hover:bg-danger/10"
                                                    : "text-success hover:bg-success/10"
                                                    }`}
                                            >
                                                {org.subscription_status === "active" ? (
                                                    <>
                                                        <PowerOff className="h-3.5 w-3.5" />
                                                        Bloquear
                                                    </>
                                                ) : (
                                                    <>
                                                        <Power className="h-3.5 w-3.5" />
                                                        Ativar
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setOrgToDelete(org);
                                                    setShowDeleteDialog(true);
                                                }}
                                                disabled={isPending}
                                                className="h-8 w-8 rounded-md text-text-tertiary hover:text-danger hover:bg-danger/10 transition-all flex items-center justify-center font-bold"
                                                title="Excluir Permanentemente"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody >
                </table >
            </div >

            {editingOrg && (
                <EditOrganizationDialog
                    organization={editingOrg}
                    onClose={() => setEditingOrg(null)}
                />
            )
            }

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setOrgToDelete(null);
                }}
                onConfirm={handleDelete}
                title="⚠️ ATENÇÃO: Exclusão Permanente"
                description={`Você está prestes a excluir PERMANENTEMENTE a imobiliária "${orgToDelete?.name}". Isso irá apagar:\n\n• Todos os leads e clientes\n• Todos os imóveis cadastrados\n• Todas as conversas e mensagens\n• Todas as contas de usuários (gestores e corretores)\n\nEsta ação NÃO PODE ser desfeita. Tem absoluta certeza?`}
                confirmText="Sim, excluir tudo"
                variant="danger"
                isLoading={isPending}
            />
        </>
    );
}
