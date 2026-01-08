"use client";

import { useState } from "react";
import { User, Mail, Trash2, Shield, UserCircle } from "lucide-react";
import { deleteTeamMember } from "../actions";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface TeamMember {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export function TeamMemberCard({ member, isCurrentUser }: { member: TeamMember; isCurrentUser?: boolean }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteTeamMember(member.id);

        if (result.success) {
            toast.success(result.message);
            setShowDeleteDialog(false);
        } else {
            toast.error(result.message);
            setIsDeleting(false);
        }
    };

    const getRoleBadge = (role: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            admin: { bg: "bg-primary/10", text: "text-primary", label: "Administrador" },
            agent: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Corretor" },
            super_admin: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Super Admin" },
        };
        return badges[role] || badges["agent"];
    };

    const badge = getRoleBadge(member.role);
    const initials = member.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className={`p-6 rounded-xl border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 transition-all ${isCurrentUser ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {initials}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                            {member.full_name}
                            {isCurrentUser && (
                                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                    você
                                </span>
                            )}
                        </h3>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${badge.bg} ${badge.text}`}>
                            {badge.label}
                        </span>
                    </div>
                </div>

                {!isCurrentUser && member.role !== "super_admin" && (
                    <button
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={isDeleting}
                        className="text-text-tertiary hover:text-danger transition-colors disabled:opacity-50"
                        title="Remover membro"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="space-y-2 text-xs text-text-secondary">
                <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <UserCircle className="h-3 w-3" />
                    <span>Adicionado em {new Date(member.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Remover Membro"
                description={`Tem certeza que deseja remover ${member.full_name} da equipe? Esta ação não pode ser desfeita.`}
                confirmText="Sim, remover"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
