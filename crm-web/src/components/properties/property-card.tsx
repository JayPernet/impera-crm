"use client";

import Link from "next/link";
import { Building2, Bed, Bath, Car, MapPin, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteProperty } from "@/app/dashboard/properties/actions";
import { toast } from "sonner";

type PropertyCardProps = {
    property: {
        id: string;
        title: string;
        type: string;
        status: "disponivel" | "reservado" | "vendido" | "alugado";
        price: number;
        address_bairro: string;
        images_urls: string[] | null;
        bedrooms?: number;
        bathrooms?: number;
        parking_spaces?: number;
        area_m2?: string;
    };
};

const statusMap = {
    disponivel: { label: "Disponível", color: "bg-success/20 text-success border-success/30" },
    reservado: { label: "Reservado", color: "bg-warning/20 text-warning border-warning/30" },
    vendido: { label: "Vendido", color: "bg-danger/20 text-danger border-danger/30" },
    alugado: { label: "Alugado", color: "bg-info/20 text-info border-info/30" },
};

export function PropertyCard({ property }: PropertyCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteProperty(property.id);
        if (result.success) {
            toast.success("Imóvel excluído com sucesso");
            setShowDeleteDialog(false);
        } else {
            toast.error("Erro ao excluir imóvel: " + result.message);
        }
        setIsDeleting(false);
    };

    const firstImage = property.images_urls?.[0];
    const config = statusMap[property.status] || statusMap.disponivel;

    const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(property.price);

    return (
        <>
            <div className="group relative luxury-card overflow-hidden transition-all duration-300">
                {/* Image */}
                <Link href={`/dashboard/properties/${property.id}`} className="block relative aspect-video bg-surface-elevated overflow-hidden">
                    {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-disabled">
                            <Building2 className="h-12 w-12" />
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md", config.color)}>
                            {config.label}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            href={`/dashboard/properties/${property.id}/edit`}
                            className="p-2 bg-surface/90 backdrop-blur-sm hover:bg-primary rounded-lg text-text-primary hover:text-primary-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowDeleteDialog(true);
                            }}
                            className="p-2 bg-surface/90 backdrop-blur-sm hover:bg-danger rounded-lg text-text-primary hover:text-white transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </Link>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="font-semibold text-text-primary text-lg line-clamp-1">{property.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-text-tertiary mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="capitalize">{property.type}</span>
                            {property.address_bairro && (
                                <>
                                    <span>•</span>
                                    <span>{property.address_bairro}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                        {property.bedrooms !== undefined && property.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                <span>{property.bedrooms}</span>
                            </div>
                        )}
                        {property.bathrooms !== undefined && property.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                                <Bath className="h-4 w-4" />
                                <span>{property.bathrooms}</span>
                            </div>
                        )}
                        {property.parking_spaces !== undefined && property.parking_spaces > 0 && (
                            <div className="flex items-center gap-1">
                                <Car className="h-4 w-4" />
                                <span>{property.parking_spaces}</span>
                            </div>
                        )}
                        {property.area_m2 && (
                            <div className="text-xs">
                                <span className="font-medium">{property.area_m2}m²</span>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="pt-3 border-t border-white/[0.05]">
                        <span className="text-xl font-bold text-primary">{formatted}</span>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Excluir Imóvel"
                description={`Tem certeza que deseja excluir "${property.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                isLoading={isDeleting}
            />
        </>
    );
}
