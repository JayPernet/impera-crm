import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { getPropertyLeadInterests } from "../../actions";
import { InterestedLeadsList } from "@/components/properties/interested-leads-list";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, DollarSign, Bed, Bath, Car } from "lucide-react";

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
                    <h1 className="text-2xl font-semibold text-text-primary">{property.title}</h1>
                    <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {property.type}
                        </span>
                        {property.address_bairro && (
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {property.address_bairro}, {property.address_city}
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
