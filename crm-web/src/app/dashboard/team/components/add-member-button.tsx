"use client";

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { addTeamMember } from "../actions";
import { toast } from "sonner";

export function AddMemberButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await addTeamMember(formData);

        setIsLoading(false);

        if (result.success) {
            toast.success(result.message);
            setIsOpen(false);
            e.currentTarget.reset();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-primary-foreground rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
            >
                <UserPlus className="h-4 w-4" />
                Adicionar Membro
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-text-primary">Adicionar Corretor</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-text-tertiary hover:text-text-primary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Nome Completo</label>
                                <input
                                    name="full_name"
                                    type="text"
                                    required
                                    placeholder="Ex: João Silva"
                                    className="w-full h-10 bg-surface-elevated border border-border rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="joao@imobiliaria.com"
                                    className="w-full h-10 bg-surface-elevated border border-border rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Senha Inicial</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full h-10 bg-surface-elevated border border-border rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary"
                                />
                                <p className="text-xs text-text-tertiary">O corretor poderá alterar a senha depois.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Função</label>
                                <select
                                    name="role"
                                    defaultValue="agent"
                                    className="w-full h-10 bg-surface-elevated border border-border rounded-lg px-3 text-text-primary focus:outline-none focus:border-primary"
                                >
                                    <option value="agent">Corretor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 h-10 px-4 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 h-10 px-4 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Adicionando...
                                        </>
                                    ) : (
                                        "Adicionar"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
