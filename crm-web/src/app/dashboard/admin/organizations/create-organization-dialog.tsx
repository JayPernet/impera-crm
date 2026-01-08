"use client";

import { Plus, Building2, UserPlus, Eye, EyeOff, Copy, Check, Sparkles, MessageSquare, X } from "lucide-react";
import { useState, useTransition } from "react";
import { createOrganization } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function generatePassword(length = 12): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function CreateOrganizationDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [password, setPassword] = useState(generatePassword());
    const [whatsappEnabled, setWhatsappEnabled] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("adminPassword", password);
        formData.set("whatsappAutomated", whatsappEnabled.toString());

        startTransition(async () => {
            const result = await createOrganization(null, formData);
            if (result.success) {
                toast.success("Imobiliária criada com sucesso!");
                setIsOpen(false);
                e.currentTarget.reset();
                setPassword(generatePassword());
                setWhatsappEnabled(false);
            } else {
                toast.error(result.message || "Erro ao criar imobiliária");
            }
        });
    };

    const copyPassword = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const regeneratePassword = () => {
        setPassword(generatePassword());
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="h-9 px-5 rounded-lg bg-primary hover:bg-primary-light text-background font-bold text-xs uppercase tracking-wide flex items-center gap-2 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,205,0,0.3)]"
            >
                <Plus className="h-3.5 w-3.5 stroke-[3px]" />
                Nova Unidade
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-background/85 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto luxury-card border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] transition-all animate-in fade-in zoom-in duration-200">
                <form onSubmit={handleSubmit} className="p-0 space-y-0">
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-surface/50 backdrop-blur-md rounded-t-xl flex items-center justify-between sticky top-0 z-10">
                        <div>
                            <h2 className="text-lg font-bold text-primary flex items-center gap-2 tracking-tight">
                                <Building2 className="h-5 w-5" />
                                Cadastrar Nova Unidade
                            </h2>
                            <p className="sub-header mt-1 opacity-60">
                                Expandir Ecossistema Impera
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated border border-transparent hover:border-border transition-all flex items-center justify-center"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Section: Organization Info */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Dados da Imobiliária
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Nome Comercial</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full h-10 bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all font-medium placeholder:text-text-disabled"
                                        placeholder="Ex: Prime Realty"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Slug (Subdomínio)</label>
                                    <input
                                        name="slug"
                                        required
                                        className="w-full h-10 bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all font-mono placeholder:text-text-disabled"
                                        placeholder="prime-realty"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Admin Info */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Administrador Principal
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Nome Completo</label>
                                    <input
                                        name="adminName"
                                        required
                                        className="w-full h-10 bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all font-medium placeholder:text-text-disabled"
                                        placeholder="Diretor Unidade"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email de Acesso</label>
                                    <input
                                        name="adminEmail"
                                        type="email"
                                        required
                                        className="w-full h-10 bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-text-disabled"
                                        placeholder="diretoria@unidade.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Senha Provisória</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            readOnly
                                            className="w-full h-10 bg-white/[0.03] border border-white/[0.05] rounded-lg pl-3 pr-20 text-sm font-mono text-text-primary focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all"
                                        />
                                        <div className="absolute right-0 top-0 h-full flex items-center gap-0.5 px-1">
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={copyPassword}
                                                className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
                                            >
                                                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={regeneratePassword}
                                        className="h-10 px-4 rounded-lg border border-border-strong text-text-secondary hover:text-text-primary hover:bg-surface transition-all text-sm font-bold"
                                    >
                                        Gerar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section: Features */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Módulos Contratados
                            </h3>

                            <div className={cn(
                                "group p-5 border rounded-xl transition-all duration-300",
                                whatsappEnabled
                                    ? "bg-primary/5 border-primary/30 shadow-[0_0_20px_rgba(201,162,77,0.05)]"
                                    : "bg-surface border-border hover:border-border-strong"
                            )}>
                                <label className="flex items-start gap-4 cursor-pointer">
                                    <div className="mt-1">
                                        <div className={cn(
                                            "h-5 w-5 rounded border transition-all flex items-center justify-center",
                                            whatsappEnabled
                                                ? "bg-primary border-primary text-background"
                                                : "bg-background border-border-strong hover:border-text-tertiary"
                                        )}>
                                            {whatsappEnabled && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={whatsappEnabled}
                                                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className={cn("h-4 w-4", whatsappEnabled ? "text-primary" : "text-text-tertiary")} />
                                            <span className="text-sm font-semibold text-text-primary">Automação de WhatsApp</span>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                                            Habilita o motor de IA para atuar como secretária digital para esta unidade.
                                        </p>
                                    </div>
                                </label>

                                {whatsappEnabled && (
                                    <div className="mt-6 pt-6 border-t border-primary/10 space-y-5 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Interface de API</label>
                                                <select
                                                    name="whatsappType"
                                                    className="w-full h-10 bg-background border border-border-strong rounded-lg px-3 text-xs font-medium text-text-primary focus:outline-none focus:border-primary transition-all cursor-pointer"
                                                >
                                                    <option value="nao_oficial">API Não Oficial (Socket)</option>
                                                    <option value="oficial">API Oficial (Cloud)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">ID da Instância</label>
                                                <input
                                                    name="instanceId"
                                                    className="w-full h-10 bg-background border border-border-strong rounded-lg px-3 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
                                                    placeholder="Insira ID"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Token da API</label>
                                            <input
                                                name="tokenId"
                                                className="w-full h-10 bg-background border border-border-strong rounded-lg px-3 text-xs font-mono text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
                                                placeholder="Insira o Token"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-8 border-t border-border bg-surface/30 flex items-center justify-end gap-3 rounded-b-xl">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="h-10 px-6 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent hover:border-border transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="h-10 px-10 rounded-lg bg-primary hover:bg-primary-light text-background font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Criando Unidade..." : "Finalizar Cadastro"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
