"use client";

import { Pencil, Building2, Sparkles, MessageSquare, X, Check, UserPen, Globe, Key, Eye, EyeOff } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { updateOrganization } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface Organization {
    id: string;
    name: string;
    slug: string;
    whatsapp_automated: boolean;
    whatsapp_type: string | null;
    token_id: string | null;
    instance_id: string | null;
    adminName?: string;
    adminEmail?: string;
}

export function EditOrganizationDialog({
    organization,
    onClose,
}: {
    organization: Organization;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();

    // Org Basic Info
    const [name, setName] = useState(organization.name);
    const [slug, setSlug] = useState(organization.slug);

    // Admin Info
    const [adminName, setAdminName] = useState(organization.adminName || "");
    const [adminEmail, setAdminEmail] = useState(organization.adminEmail || "");
    const [adminPassword, setAdminPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Features
    const [whatsappEnabled, setWhatsappEnabled] = useState(organization.whatsapp_automated);
    const [whatsappType, setWhatsappType] = useState(organization.whatsapp_type || "nao_oficial");
    const [tokenId, setTokenId] = useState(organization.token_id || "");
    const [instanceId, setInstanceId] = useState(organization.instance_id || "");

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("orgId", organization.id);
        formData.append("name", name);
        formData.append("slug", slug);
        formData.append("adminName", adminName);
        formData.append("adminEmail", adminEmail);
        formData.append("adminPassword", adminPassword);
        formData.append("whatsappAutomated", whatsappEnabled.toString());
        formData.append("whatsappType", whatsappEnabled ? whatsappType : "");
        formData.append("tokenId", whatsappEnabled ? tokenId : "");
        formData.append("instanceId", whatsappEnabled ? instanceId : "");

        startTransition(async () => {
            const result = await updateOrganization(formData);

            if (result.success) {
                toast.success("Imobiliária atualizada com sucesso!");
                onClose();
            } else {
                toast.error(result.message || "Erro ao atualizar imobiliária");
            }
        });
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-background/95 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl luxury-card border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-6 border-b border-white/[0.05] bg-surface/50 backdrop-blur-md flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center">
                                <Pencil className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-primary tracking-tight">Editar Unidade</h2>
                                <p className="sub-header mt-0.5 opacity-90">
                                    Configurações Administrativas
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-9 w-9 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-white/[0.05] transition-all flex items-center justify-center"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 overflow-y-auto space-y-10">
                        {/* Section: Basic Info */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-[0.2em] flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                Informações Básicas
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Nome da Imobiliária</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-semibold text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                                        placeholder="Nome Comercial"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Identificador (Slug)</label>
                                    <input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-mono text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                                        placeholder="slug-da-unidade"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Admin Info */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-bold text-[#9AA4B2] uppercase tracking-[0.2em] flex items-center gap-2">
                                <UserPen className="h-4 w-4 text-primary" />
                                Gestor Responsável
                            </h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Nome Completo</label>
                                    <input
                                        value={adminName}
                                        onChange={(e) => setAdminName(e.target.value)}
                                        className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-semibold text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                                        placeholder="Nome do Admin"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2 md:col-span-1">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">E-mail de Acesso</label>
                                    <input
                                        value={adminEmail}
                                        onChange={(e) => setAdminEmail(e.target.value)}
                                        className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-semibold text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                                        placeholder="admin@imobiliaria.com"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Nova Senha (deixe vazio para manter)</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl pl-4 pr-12 text-sm font-semibold text-primary focus:outline-none focus:border-primary/50 transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-tertiary hover:text-text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <Key className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: WhatsApp */}
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Módulo de Inteligência
                            </h3>

                            <div className={cn(
                                "p-6 rounded-2xl border transition-all duration-300",
                                whatsappEnabled
                                    ? "bg-white/[0.02] border-primary/40 shadow-[0_0_30px_rgba(201,162,77,0.08)]"
                                    : "bg-surface border-white/[0.05] hover:border-white/10"
                            )}>
                                <label className="flex items-start gap-5 cursor-pointer">
                                    <div className="mt-1">
                                        <div className={cn(
                                            "h-6 w-6 rounded-lg border transition-all flex items-center justify-center",
                                            whatsappEnabled
                                                ? "bg-primary border-primary shadow-[0_0_15px_rgba(201,162,77,0.4)]"
                                                : "bg-white/[0.05] border-white/10"
                                        )}>
                                            {whatsappEnabled && <Check className="h-4 w-4 text-background stroke-[3px]" />}
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
                                            <MessageSquare className={cn("h-5 w-5", whatsappEnabled ? "text-primary" : "text-text-tertiary")} />
                                            <span className="text-base font-bold text-text-primary">Automação de WhatsApp Estendida</span>
                                        </div>
                                        <p className="text-sm text-text-secondary mt-1 line-height-relaxed">
                                            Habilita o agente de IA para responder leads automaticamente via WhatsApp.
                                        </p>
                                    </div>
                                </label>

                                {whatsappEnabled && (
                                    <div className="mt-8 pt-8 border-t border-white/[0.05] space-y-6 animate-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Interface de API</label>
                                                <select
                                                    value={whatsappType}
                                                    onChange={(e) => setWhatsappType(e.target.value)}
                                                    className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-semibold text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                                                >
                                                    <option value="nao_oficial">API Não Oficial (Socket)</option>
                                                    <option value="oficial">API Oficial (Cloud)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">ID da Instância</label>
                                                <input
                                                    value={instanceId}
                                                    onChange={(e) => setInstanceId(e.target.value)}
                                                    className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-mono text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary/50 transition-all text-center"
                                                    placeholder="000-000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Token Secreto da API</label>
                                            <input
                                                type="password"
                                                value={tokenId}
                                                onChange={(e) => setTokenId(e.target.value)}
                                                className="w-full h-11 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 text-sm font-mono text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary/50 transition-all"
                                                placeholder="••••••••••••••••"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/[0.05] bg-surface/30 flex items-center justify-end gap-3 sticky bottom-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 px-8 rounded-xl text-sm font-bold text-text-tertiary hover:text-text-primary transition-all"
                        >
                            Descartar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="h-11 px-10 rounded-xl bg-primary hover:bg-primary-light text-background font-black text-sm shadow-[0_10px_20px_-5px_rgba(201,162,77,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isPending ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return mounted ? createPortal(modalContent, document.body) : null;
}
