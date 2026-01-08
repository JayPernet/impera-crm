"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfile } from "../actions";
import { User, Save } from "lucide-react";
import { useEffect } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
            {pending ? "Salvando..." : <><Save className="h-4 w-4" /> Salvar</>}
        </button>
    );
}

export function ProfileForm({ initialName, email }: { initialName: string, email: string }) {
    const [state, action] = useFormState(updateProfile, null);

    return (
        <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Perfil Pessoal</h3>
                    <p className="text-sm text-text-secondary">Informações da sua conta.</p>
                </div>
            </div>

            <form action={action} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Nome Completo</label>
                        <input
                            type="text"
                            name="fullName"
                            defaultValue={initialName}
                            placeholder="Seu nome"
                            className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-text-secondary uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            readOnly
                            className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-text-primary opacity-60 cursor-not-allowed focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex-1">
                        {state?.message && (
                            <p className={`text-sm ${state.success ? "text-success" : "text-danger"}`}>
                                {state.message}
                            </p>
                        )}
                    </div>
                    <div className="ml-auto">
                        <SubmitButton />
                    </div>
                </div>
            </form>
        </div>
    );
}
