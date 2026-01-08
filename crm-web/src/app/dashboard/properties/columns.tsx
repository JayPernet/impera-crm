"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { deleteProperty } from "./actions"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// This type definitions should ideally be inferred from Supabase generated types
// But for now we define a shape matching the DB table
export type Property = {
    id: string
    title: string
    type: string
    status: "disponivel" | "reservado" | "vendido" | "alugado"
    price: number
    address_bairro: string
    created_at: string
    images_urls: string[] | null
    bedrooms?: number
    bathrooms?: number
    parking_spaces?: number
    area_m2?: string
}

const statusMap = {
    disponivel: { label: "Disponível", color: "text-success bg-success/10 border-success/20 ring-1 ring-success/20" },
    reservado: { label: "Reservado", color: "text-warning bg-warning/10 border-warning/20 ring-1 ring-warning/20" },
    vendido: { label: "Vendido", color: "text-danger bg-danger/10 border-danger/20 ring-1 ring-danger/20" },
    alugado: { label: "Alugado", color: "text-info bg-info/10 border-info/20 ring-1 ring-info/20" },
}

export const columns: ColumnDef<Property>[] = [
    {
        accessorKey: "images_urls",
        header: "",
        cell: ({ row }) => {
            const images = row.getValue("images_urls") as string[] | null
            const firstImage = images?.[0]

            return (
                <div className="h-12 w-16 bg-surface-elevated rounded-md overflow-hidden relative border border-border">
                    {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt="Property" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-text-disabled text-[10px] font-medium">
                            SEM FOTO
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "title",
        header: "Imóvel",
        cell: ({ row }) => {
            const title = row.getValue("title") as string
            const bairro = row.original.address_bairro || "Bairro não informado"
            return (
                <div className="flex flex-col">
                    <span className="font-medium text-text-primary truncate max-w-[200px]">{title}</span>
                    <span className="text-xs text-text-tertiary">{bairro}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => <span className="text-text-secondary capitalize">{row.getValue("type")}</span>,
    },
    {
        accessorKey: "price",
        header: "Valor",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount)

            return <div className="font-medium text-text-primary">{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as keyof typeof statusMap
            const config = statusMap[status] || statusMap.disponivel

            return (
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", config.color)}>
                    {config.label}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return <ActionsCell property={row.original} />
        },
    },
]

// ... imports
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useState } from "react"

// ... inside ActionsCell ...

function ActionsCell({ property }: { property: Property }) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteProperty(property.id)
        if (result.success) {
            toast.success("Imóvel excluído com sucesso")
            setShowDeleteDialog(false)
        } else {
            toast.error("Erro ao excluir imóvel: " + result.message)
        }
        setIsDeleting(false)
    }

    return (
        <>
            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/dashboard/properties/${property.id}`}
                    className="p-2 hover:bg-surface-elevated rounded-md text-text-tertiary hover:text-text-primary transition-colors"
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
                title="Excluir Imóvel"
                description={`Tem certeza que deseja excluir o imóvel "${property.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Sim, excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    )
}
