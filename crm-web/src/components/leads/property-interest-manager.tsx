"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { associatePropertyWithLead, disassociatePropertyFromLead } from "@/app/dashboard/leads/actions";
import { Search, X, Building2, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Property {
    id: string;
    title: string;
    type: string;
    transaction_type: string;
    price: number;
    status: string;
    address_city?: string;
    address_bairro?: string;
}

interface PropertyInterestManagerProps {
    leadId: string;
    initialInterests?: Property[];
}

export function PropertyInterestManager({ leadId, initialInterests = [] }: PropertyInterestManagerProps) {
    const [interests, setInterests] = useState<Property[]>(initialInterests);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Property[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            const supabase = createClient();

            const { data, error } = await supabase
                .from("properties")
                .select("id, title, type, transaction_type, price, status, address_city, address_bairro")
                .or(`title.ilike.%${searchQuery}%,address_city.ilike.%${searchQuery}%,address_bairro.ilike.%${searchQuery}%`)
                .eq("status", "disponivel")
                .limit(10);

            if (!error && data) {
                // Filter out already interested properties
                const filtered = data.filter(p => !interests.some(i => i.id === p.id));
                setSearchResults(filtered);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, interests]);

    const handleAddInterest = async (property: Property) => {
        const result = await associatePropertyWithLead(leadId, property.id);

        if (result.success) {
            setInterests([...interests, property]);
            setSearchQuery("");
            setSearchResults([]);
            setShowSearch(false);
            toast.success("Imóvel vinculado com sucesso!");
        } else {
            toast.error(result.message || "Erro ao vincular imóvel");
        }
    };

    const handleRemoveInterest = async () => {
        if (!propertyToDelete) return;

        const result = await disassociatePropertyFromLead(leadId, propertyToDelete.id);

        if (result.success) {
            setInterests(interests.filter(p => p.id !== propertyToDelete.id));
            toast.success("Imóvel desvinculado com sucesso!");
            setShowDeleteDialog(false);
            setPropertyToDelete(null);
        } else {
            toast.error(result.message || "Erro ao desvincular imóvel");
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-text-primary">Imóveis de Interesse</h3>
                <button
                    type="button"
                    onClick={() => setShowSearch(!showSearch)}
                    className="text-xs text-primary hover:text-primary-light transition-colors"
                >
                    {showSearch ? "Cancelar" : "+ Adicionar Imóvel"}
                </button>
            </div>

            {/* Search Box */}
            {showSearch && (
                <div className="relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Buscar imóveis por título, cidade ou bairro..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-surface-elevated border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary"
                        />
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((property) => (
                                <button
                                    key={property.id}
                                    type="button"
                                    onClick={() => handleAddInterest(property)}
                                    className="w-full p-3 hover:bg-surface text-left transition-colors border-b border-border last:border-b-0"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary truncate">{property.title}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="h-3 w-3" />
                                                    {property.type}
                                                </span>
                                                {property.address_bairro && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {property.address_bairro}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-primary whitespace-nowrap">
                                            {formatPrice(property.price)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {isSearching && (
                        <div className="absolute z-10 w-full mt-1 bg-surface-elevated border border-border rounded-lg shadow-lg p-4 text-center text-sm text-text-secondary">
                            Buscando...
                        </div>
                    )}
                </div>
            )}

            {/* Current Interests */}
            {interests.length > 0 ? (
                <div className="space-y-2">
                    {interests.map((property) => (
                        <div
                            key={property.id}
                            className="flex items-start justify-between gap-3 p-3 bg-surface-elevated border border-border rounded-lg"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">{property.title}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <Building2 className="h-3 w-3" />
                                        {property.type}
                                    </span>
                                    {property.address_bairro && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {property.address_bairro}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {formatPrice(property.price)}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setPropertyToDelete(property);
                                    setShowDeleteDialog(true);
                                }}
                                className="text-text-tertiary hover:text-danger transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-text-tertiary text-center py-4">
                    Nenhum imóvel vinculado ainda.
                </p>
            )}

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setPropertyToDelete(null);
                }}
                onConfirm={handleRemoveInterest}
                title="Desvincular Imóvel"
                description={`Tem certeza que deseja desvincular "${propertyToDelete?.title}" deste lead?`}
                confirmText="Sim, desvincular"
                variant="danger"
            />
        </div>
    );
}
