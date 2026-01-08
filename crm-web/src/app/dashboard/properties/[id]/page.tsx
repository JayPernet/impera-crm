import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getPropertyLeadInterests } from "../actions";
import { InterestedLeadsList } from "@/components/properties/interested-leads-list";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, DollarSign, Bed, Bath, Car, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        if (error) console.error("Error fetching property:", error);
        notFound();
    }

    // Fetch interested leads
    const interestedLeads = await getPropertyLeadInterests(id);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(price);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/properties"
                    className="text-text-tertiary hover:text-text-primary transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold text-text-primary">{property.title}</h1>
                        {property.tarja_texto && (
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                property.tarja_cor === 'success' ? "bg-success/20 text-success border border-success/30" :
                                    property.tarja_cor === 'warning' ? "bg-warning/20 text-warning border border-warning/30" :
                                        property.tarja_cor === 'danger' ? "bg-danger/20 text-danger border border-danger/30" :
                                            property.tarja_cor === 'primary' ? "bg-primary/20 text-primary border border-primary/30" :
                                                "bg-surface-elevated text-text-secondary border border-border-strong"
                            )}>
                                {property.tarja_texto}
                            </span>
                        )}
                        {!property.mostrar_preco && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface/50 border border-border text-[10px] text-text-tertiary" title="Preço privado">
                                <EyeOff className="h-3 w-3" /> Preço
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {property.type}
                        </span>
                        {property.address_bairro && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {property.address_bairro}, {property.address_city}
                                {(!property.mostrar_endereco || !property.mostrar_bairro) && (
                                    <span title="Endereço ou Bairro privado">
                                        <EyeOff className="h-3 w-3 text-text-tertiary ml-1" />
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                </div>
                <Link
                    href={`/dashboard/properties/${id}/edit`}
                    className="px-4 py-2 bg-primary hover:bg-primary-light text-primary-foreground rounded-lg text-sm font-medium transition-colors"
                >
                    Editar
                </Link>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5">
                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">
                            Informações Principais
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-text-tertiary">Tipo de Transação:</span>
                                <p className="text-text-primary font-medium mt-1">{property.transaction_type}</p>
                            </div>
                            <div>
                                <span className="text-text-tertiary">Status:</span>
                                <p className="text-text-primary font-medium mt-1">{property.status}</p>
                            </div>
                            <div>
                                <span className="text-text-tertiary">Preço:</span>
                                <p className="text-primary font-semibold text-lg mt-1">{formatPrice(property.price)}</p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
                            {property.bedrooms && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Bed className="h-5 w-5" />
                                    <span className="text-sm">{property.bedrooms} quartos</span>
                                </div>
                            )}
                            {property.bathrooms && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Bath className="h-5 w-5" />
                                    <span className="text-sm">{property.bathrooms} banheiros</span>
                                </div>
                            )}
                            {property.parking_spaces && (
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Car className="h-5 w-5" />
                                    <span className="text-sm">{property.parking_spaces} vagas</span>
                                </div>
                            )}
                        </div>

                        {property.description && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <span className="text-text-tertiary text-sm">Descrição:</span>
                                <p className="text-text-primary mt-2 leading-relaxed">{property.description}</p>
                            </div>
                        )}

                        {/* Areas */}
                        {(property.area_m2 || property.area_privativa || property.area_construida) && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <span className="text-text-tertiary text-sm uppercase tracking-wider">Dimensões:</span>
                                <div className="grid grid-cols-3 gap-4 mt-3">
                                    {property.area_m2 && (
                                        <div>
                                            <span className="text-xs text-text-tertiary">Área Total</span>
                                            <p className="text-text-primary font-medium">{property.area_m2} m²</p>
                                        </div>
                                    )}
                                    {property.area_privativa && (
                                        <div>
                                            <span className="text-xs text-text-tertiary">Área Privativa</span>
                                            <p className="text-text-primary font-medium">{property.area_privativa} m²</p>
                                        </div>
                                    )}
                                    {property.area_construida && (
                                        <div>
                                            <span className="text-xs text-text-tertiary">Área Construída</span>
                                            <p className="text-text-primary font-medium">{property.area_construida} m²</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Financial */}
                        {(property.iptu || property.condominio_fee) && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <span className="text-text-tertiary text-sm uppercase tracking-wider">Custos Fixos:</span>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    {property.iptu && (
                                        <div>
                                            <span className="text-xs text-text-tertiary">IPTU</span>
                                            <p className="text-text-primary font-medium">R$ {property.iptu}/mês</p>
                                        </div>
                                    )}
                                    {property.condominio_fee && (
                                        <div>
                                            <span className="text-xs text-text-tertiary">Condomínio</span>
                                            <p className="text-text-primary font-medium">R$ {property.condominio_fee}/mês</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Conditions */}
                        {(property.aceita_financiamento || property.accept_exchange) && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <span className="text-text-tertiary text-sm uppercase tracking-wider">Condições:</span>
                                <div className="flex gap-4 mt-3">
                                    {property.aceita_financiamento && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                                            ✓ Aceita Financiamento
                                        </span>
                                    )}
                                    {property.accept_exchange && (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-info/10 text-info border border-info/20">
                                            ✓ Aceita Permuta
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Internal Notes */}
                        {property.internal_notes && (
                            <div className="mt-6 pt-6 border-t border-border">
                                <span className="text-text-tertiary text-sm uppercase tracking-wider">Notas Internas:</span>
                                <p className="text-text-secondary mt-2 text-sm italic leading-relaxed">{property.internal_notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar - Interested Leads */}
                <div className="md:col-span-1">
                    <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 sticky top-6">
                        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">
                            Leads Interessados ({interestedLeads.length})
                        </h3>
                        <InterestedLeadsList leads={interestedLeads} />
                    </div>
                </div>
            </div>
        </div>
    );
}
