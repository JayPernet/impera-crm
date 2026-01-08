"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, MessageCircle, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { deleteClientRecord } from "./actions"
import { toast } from "sonner"

export type Client = {
    id: string
    full_name: string
    phone: string
    email: string | null
    interest_type: string
    status: string
    budget: number | null
    ltv: number
    last_contact_at: string | null
}

export const columns: ColumnDef<Client>[] = [
    {
        accessorKey: "full_name",
        header: "Cliente",
        cell: ({ row }) => {
            const name = row.getValue("full_name") as string
            const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

            return (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {initials}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium text-text-primary">{name}</span>
                        <span className="text-xs text-text-tertiary">Cadastrado via {row.original.status}</span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "contact",
        header: "Contato",
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="text-sm text-text-secondary">{row.original.email || "Sem email"}</span>
                    <span className="text-xs text-text-tertiary">{row.original.phone}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "interest_type",
        header: "Interesse",
        cell: ({ row }) => (
            <span className="capitalize text-text-secondary">
                {row.getValue("interest_type")}
            </span>
        ),
    },
    {
        accessorKey: "budget",
        header: "Budget / LTV",
        cell: ({ row }) => {
            const budget = row.original.budget;
            const ltv = row.original.ltv;

            return (
                <div className="flex flex-col">
                    {ltv > 0 && (
                        <span className="text-sm font-medium text-success">
                            LTV: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(ltv)}
                        </span>
                    )}
                    {budget && (
                        <span className="text-xs text-text-tertiary">
                            Budget: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact" }).format(budget)}
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell client={row.original} />
    },
]

function ActionsCell({ client }: { client: Client }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteClientRecord(client.id)
        if (result.success) {
            toast.success("Cliente excluído com sucesso")
            setShowDeleteDialog(false)
        } else {
            toast.error("Erro ao excluir cliente: " + result.message)
        }
        setIsDeleting(false)
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/dashboard/chat?phone=${encodeURIComponent(client.phone)}&name=${encodeURIComponent(client.full_name)}`}
                    className="p-2 hover:bg-surface-elevated rounded-md text-text-tertiary hover:text-success transition-colors"
                    title="Ir para Chat"
                >
                    <MessageCircle className="h-4 w-4" />
                </Link>
                <Link
                    href={`/dashboard/clients/${client.id}/edit`}
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
                title="Excluir Cliente"
                description={`Tem certeza que deseja excluir o cliente "${client.full_name}"?`}
                confirmText="Sim, excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    )
}