"use client";

import { Shield, Key, Lock } from "lucide-react";
import { changePassword } from "../actions";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
            {pending ? "Alterando..." : "Mudar Senha"}
        </button>
    );
}

export function SecurityForm() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [state, action] = useFormState(changePassword, null);

    return (
        <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <Shield className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Segurança</h3>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Key className="h-4 w-4 text-primary" />
                    <span>Senha forte ativada</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>MFA (Em breve)</span>
                </div>

                {!isExpanded ? (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full mt-4 h-9 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-sm text-text-primary transition-colors"
                    >
                        Alterar Senha
                    </button>
                ) : (
                    <form action={action} className="mt-4 space-y-3 p-4 border border-border/50 rounded-lg bg-surface/50">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-secondary uppercase">Nova Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-tertiary" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full h-9 pl-9 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                            {state?.errors?.password && <p className="text-xs text-danger">{state.errors.password[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-text-secondary uppercase">Confirmar Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-text-tertiary" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="w-full h-9 pl-9 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                                />
                            </div>
                            {state?.errors?.confirmPassword && <p className="text-xs text-danger">{state.errors.confirmPassword[0]}</p>}
                        </div>

                        {state?.message && (
                            <p className={`text-xs ${state.success ? "text-success" : "text-danger"}`}>
                                {state.message}
                            </p>
                        )}

                        <div className="pt-2 flex flex-col gap-2">
                            <SubmitButton />
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="w-full h-9 rounded-lg border border-border text-text-secondary text-sm hover:bg-surface-elevated"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
