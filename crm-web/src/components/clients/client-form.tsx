"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClientRecord, updateClientRecord } from "@/app/dashboard/clients/actions";
import { useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const clientSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    phone: z.string().min(10, "Telefone inválido (mínimo 10 dígitos)"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    interest_type: z.enum(["compra", "aluguel", "ambos"]).default("compra"),
    budget: z.coerce.number().optional(),
    summary: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
    initialData?: ClientFormData & { id?: string };
}

export function ClientForm({ initialData }: ClientFormProps) {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState("");

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema) as any,
        defaultValues: initialData || {
            name: "",
            phone: "",
            email: "",
            interest_type: "compra",
            budget: undefined,
            summary: "",
        },
    });

    const onSubmit = async (data: ClientFormData) => {
        setServerError("");
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        startTransition(async () => {
            const result = initialData?.id 
                ? await updateClientRecord(initialData.id, formData)
                : await createClientRecord(null, formData);

            if (result?.message) {
                setServerError(result.message);
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">{initialData?.id ? "Editar Cliente" : "Novo Cliente"}</h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Basic Info */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Dados do Cliente</h3>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Nome Completo</label>
                        <input {...form.register("name")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary transition-colors" placeholder="Ex: João da Silva" />
                        {form.formState.errors.name && <span className="text-xs text-danger">{form.formState.errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Telefone (Whatsapp)</label>
                            <input {...form.register("phone")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="11999999999" />
                            {form.formState.errors.phone && <span className="text-xs text-danger">{form.formState.errors.phone.message}</span>}
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Email</label>
                            <input {...form.register("email")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" placeholder="joao@email.com" />
                            {form.formState.errors.email && <span className="text-xs text-danger">{form.formState.errors.email.message}</span>}
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-xl shadow-primary/5 space-y-4">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4 border-b border-border pb-2">Perfil</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Interesse</label>
                            <select {...form.register("interest_type")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary">
                                <option value="compra">Compra</option>
                                <option value="aluguel">Aluguel</option>
                                <option value="ambos">Ambos</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Orçamento (R$)</label>
                            <input type="number" {...form.register("budget")} className="w-full h-10 bg-surface-elevated border border-border-strong rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Notas / Histórico</label>
                        <textarea {...form.register("summary")} className="w-full min-h-[80px] bg-surface-elevated border border-border-strong rounded-lg p-3 text-text-primary focus:outline-none focus:border-primary transition-colors" placeholder="Ex: Cliente antigo, comprou unidade X em 2024..." />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    {serverError && <span className="text-sm text-danger">{serverError}</span>}
                    <button type="button" className="text-sm text-text-tertiary hover:text-text-primary transition-colors" onClick={() => window.history.back()}>Cancelar</button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className={cn(
                            "h-10 px-6 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20",
                            isPending && "opacity-70 cursor-wait"
                        )}
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        <span>Salvar Cliente</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
