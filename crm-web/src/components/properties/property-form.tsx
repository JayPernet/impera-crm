"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProperty, updateProperty } from "@/app/dashboard/properties/actions";
// import { useFormState } from "react-dom"; // Use if we want progressive enhancement, but RHF is easier for validation
import { useState, useTransition } from "react";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Schema matching the server action
const propertySchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    type: z.string().min(1, "Tipo é obrigatório"),
    transaction_type: z.enum(["venda", "aluguel"]).optional(),
    price: z.coerce.number().min(0),
    status: z.enum(["disponivel", "reservado", "vendido", "alugado"]).default("disponivel"),

    // Description
    description: z.string().optional(),

    // Address
    address_logradouro: z.string().optional(),
    address_number: z.string().optional(),
    address_bairro: z.string().optional(),
    address_city: z.string().optional(),
    address_state: z.string().optional(),
    address_cep: z.string().optional(),

    // Details
    bedrooms: z.coerce.number().optional(),
    suites: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    parking_spaces: z.coerce.number().optional(),

    // Areas
    area_m2: z.string().optional(),
    area_privativa: z.string().optional(),
    area_construida: z.string().optional(),

    // Financial
    iptu: z.string().optional(),
    condominio_fee: z.string().optional(),
    aceita_financiamento: z.coerce.boolean().optional(),
    accept_exchange: z.coerce.boolean().optional(),

    // Visibility Toggles
    mostrar_endereco: z.coerce.boolean().optional(),
    mostrar_bairro: z.coerce.boolean().optional(),
    mostrar_preco: z.coerce.boolean().optional(),

    // Marketing
    tarja_texto: z.string().optional(),
    tarja_cor: z.string().optional(),

    // Admin
    internal_notes: z.string().optional(),
    tipo_negociacao: z.enum(["publico", "privado"]).optional(),

    // Images
    images: z.any().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export function PropertyForm({ property }: { property?: PropertyFormData & { id: string, images_urls: string[] | null } }) {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState("");
    const [currentImages, setCurrentImages] = useState<string[]>(property?.images_urls || []);

    const handleRemoveImage = (indexToRemove: number) => {
        setCurrentImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const form = useForm<PropertyFormData>({
        resolver: zodResolver(propertySchema) as any,
        defaultValues: property ? {
            title: property.title,
            type: property.type,
            transaction_type: property.transaction_type || undefined,
            status: property.status,
            price: property.price,
            description: property.description || "",
            address_logradouro: property.address_logradouro || "",
            address_number: property.address_number || "",
            address_bairro: property.address_bairro || "",
            address_city: property.address_city || "",
            address_state: property.address_state || "",
            address_cep: property.address_cep || "",
            bedrooms: property.bedrooms || undefined,
            suites: property.suites || undefined,
            bathrooms: property.bathrooms || undefined,
            parking_spaces: property.parking_spaces || undefined,
            area_m2: property.area_m2 || "",
            area_privativa: property.area_privativa || "",
            area_construida: property.area_construida || "",
            iptu: property.iptu || "",
            condominio_fee: property.condominio_fee || "",
            aceita_financiamento: property.aceita_financiamento || false,
            accept_exchange: property.accept_exchange || false,
            mostrar_endereco: property.mostrar_endereco || false,
            mostrar_bairro: property.mostrar_bairro || false,
            mostrar_preco: property.mostrar_preco || false,
            tarja_texto: property.tarja_texto || "",
            tarja_cor: property.tarja_cor || "",
            internal_notes: property.internal_notes || "",
        } : {
            title: "",
            type: "apartamento",
            status: "disponivel",
            price: 0,
        },
    });

    const onSubmit = async (data: PropertyFormData) => {
        setServerError("");

        // Create FormData manually to pass to Server Action
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images' && value instanceof FileList) {
                Array.from(value).forEach((file) => {
                    formData.append('images', file);
                });
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        // Append kept images
        if (currentImages.length > 0) {
            formData.append('kept_images', JSON.stringify(currentImages));
        } else {
            formData.append('kept_images', JSON.stringify([]));
        }

        startTransition(async () => {
            const result = property?.id
                ? await updateProperty(property.id, null, formData)
                : await createProperty(null, formData);

            if (result?.message) {
                setServerError(result.message);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">{property ? "Editar Imóvel" : "Novo Imóvel"}</h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Card: Basic Info */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Informações Básicas</h3>

                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Título do Anúncio</label>
                            <input {...form.register("title")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary transition-colors" placeholder="Ex: Cobertura Duplex no Jardins" />
                            {form.formState.errors.title && <span className="text-xs text-danger">{form.formState.errors.title.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Descrição</label>
                            <textarea {...form.register("description")} className="w-full min-h-[100px] bg-surface-elevated border border-border-strong rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary transition-colors" placeholder="Descreva os detalhes do imóvel..." />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Tipo</label>
                                <select {...form.register("type")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary">
                                    <option value="apartamento">Apartamento</option>
                                    <option value="casa">Casa</option>
                                    <option value="terreno">Terreno</option>
                                    <option value="comercial">Comercial</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Transação</label>
                                <select {...form.register("transaction_type")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary">
                                    <option value="">Não informado</option>
                                    <option value="venda">Venda</option>
                                    <option value="aluguel">Aluguel</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Preço (R$)</label>
                                <input type="number" {...form.register("price")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Status</label>
                                <select {...form.register("status")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary">
                                    <option value="disponivel">Disponível</option>
                                    <option value="reservado">Reservado</option>
                                    <option value="vendido">Vendido</option>
                                    <option value="alugado">Alugado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card: Address */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Localização</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">CEP</label>
                            <input {...form.register("address_cep")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="00000-000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Cidade</label>
                            <input {...form.register("address_city")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-text-secondary">Logradouro (Rua/Av)</label>
                            <input {...form.register("address_logradouro")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Número</label>
                            <input {...form.register("address_number")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Bairro</label>
                            <input {...form.register("address_bairro")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: Jardins" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Estado (UF)</label>
                            <input {...form.register("address_state")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="SP" maxLength={2} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...form.register("mostrar_endereco")} className="w-4 h-4 rounded border-border-strong bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0" />
                            <span className="text-sm text-text-secondary">Público: Endereço</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...form.register("mostrar_bairro")} className="w-4 h-4 rounded border-border-strong bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0" />
                            <span className="text-sm text-text-secondary">Público: Bairro</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...form.register("mostrar_preco")} className="w-4 h-4 rounded border-border-strong bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0" />
                            <span className="text-sm text-text-secondary">Público: Preço</span>
                        </label>
                    </div>
                </div>

                {/* Card: Financial Info */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Informações Financeiras (Opcional)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">IPTU (R$/mês)</label>
                            <input {...form.register("iptu")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: 450,00" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Condomínio (R$/mês)</label>
                            <input {...form.register("condominio_fee")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: 850,00" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...form.register("aceita_financiamento")} className="w-4 h-4 rounded border-border-strong bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0" />
                            <span className="text-sm text-text-secondary">Aceita Financiamento</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...form.register("accept_exchange")} className="w-4 h-4 rounded border-border-strong bg-surface-elevated text-primary focus:ring-primary focus:ring-offset-0" />
                            <span className="text-sm text-text-secondary">Aceita Permuta</span>
                        </label>
                    </div>
                </div>

                {/* Card: Marketing */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Destaques & Marketing</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Texto da Tarja (Ex: 'Oportunidade', 'Vendido')</label>
                            <input {...form.register("tarja_texto")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: Oportunidade Única" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Cor da Tarja</label>
                            <select {...form.register("tarja_cor")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary">
                                <option value="">Padrão (Neutro)</option>
                                <option value="success">Verde (Disponível)</option>
                                <option value="warning">Amarelo (Atenção)</option>
                                <option value="danger">Vermelho (Urgente/Vendido)</option>
                                <option value="primary">Azul (Destaque)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Card: Details */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Detalhes</h3>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Quartos</label>
                            <input type="number" {...form.register("bedrooms")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Suítes</label>
                            <input type="number" {...form.register("suites")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Banheiros</label>
                            <input type="number" {...form.register("bathrooms")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Vagas</label>
                            <input type="number" {...form.register("parking_spaces")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Área Total (m²)</label>
                            <input {...form.register("area_m2")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: 120" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Área Privativa (m²)</label>
                            <input {...form.register("area_privativa")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: 95" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-text-secondary">Área Construída (m²)</label>
                            <input {...form.register("area_construida")} className="w-full h-9 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="Ex: 110" />
                        </div>
                    </div>
                </div>

                {/* Card: Internal Notes */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Notas Internas & Admin</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Tipo de Negociação</label>
                            <select {...form.register("tipo_negociacao")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary">
                                <option value="publico">Público (Site e Portais)</option>
                                <option value="privado">Privado (Apenas Interno)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Anotações Internas</label>
                        <textarea {...form.register("internal_notes")} className="w-full min-h-[80px] bg-surface-elevated border border-border-strong rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary transition-colors" placeholder="Ex: Proprietário aceita negociar o valor, chaves na imobiliária..." />
                    </div>
                </div>

                {/* Card: Images */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Fotos</h3>

                    <div className="flex flex-col gap-4">
                        {/* Existing Images */}
                        {currentImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                {currentImages.map((url, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-danger rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                                            title="Remover foto"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative border-2 border-dashed border-border-strong rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-surface-elevated/50">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                {...form.register("images")}
                                className="w-full h-full opacity-0 absolute cursor-pointer inset-0 z-10"
                            />
                            <div className="pointer-events-none">
                                <span className="text-sm text-text-secondary">Clique ou arraste novas fotos aqui</span>
                                <p className="text-xs text-text-tertiary mt-1">JPG, PNG (Max 5MB)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-4">
                    {serverError && <span className="text-sm text-danger">{serverError}</span>}
                    <Link href="/dashboard/properties" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">Cancelar</Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "h-9 px-6 rounded-md bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-all active:scale-[0.98]",
                            isPending && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        <span>Salvar Imóvel</span>
                    </button>
                </div>

            </form >
        </div >
    );
}
