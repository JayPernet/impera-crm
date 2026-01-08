"use client";

import { Bell } from "lucide-react";
import { updateNotifications } from "../actions";
import { useTransition, useState } from "react";

interface Preferences {
    leads: boolean;
    team: boolean;
    security: boolean;
}

export function NotificationsForm({ initialPreferences }: { initialPreferences: Preferences }) {
    const [isPending, startTransition] = useTransition();
    // Optimistic state
    const [preferences, setPreferences] = useState(initialPreferences);

    const handleToggle = (key: keyof Preferences) => {
        const newPrefs = { ...preferences, [key]: !preferences[key] };
        setPreferences(newPrefs); // Optimistic update

        startTransition(async () => {
            const result = await updateNotifications(newPrefs);
            if (!result.success) {
                // Revert on failure
                setPreferences(preferences);
            }
        });
    };

    return (
        <div className="p-6 rounded-xl border border-border bg-surface/30 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                    <Bell className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">Notificações</h3>
                    <p className="text-sm text-text-secondary">Escolha como você deseja ser alertado.</p>
                </div>
            </div>

            <div className="space-y-4 divide-y divide-border/50">
                <ToggleItem
                    label="Alertas de Novos Leads"
                    description="Receba avisos quando um novo lead entrar."
                    checked={preferences.leads}
                    onChange={() => handleToggle('leads')}
                    disabled={isPending}
                />
                <ToggleItem
                    label="Atividades da Equipe"
                    description="Monitoramento de ações do time."
                    checked={preferences.team}
                    onChange={() => handleToggle('team')}
                    disabled={isPending}
                />
                {/* Can add Security Alerts here if we want a separate toggle, or just hardcode/hide it */}
                <ToggleItem
                    label="Alertas de Segurança"
                    description="Notificações sobre login e alterações de senha."
                    checked={preferences.security !== false} // Default true
                    onChange={() => handleToggle('security')}
                    disabled={isPending}
                />
            </div>
        </div>
    );
}

function ToggleItem({ label, description, checked, onChange, disabled }: any) {
    return (
        <div className="flex items-center justify-between py-2 pt-4 first:pt-0">
            <div>
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <p className="text-xs text-text-tertiary">{description}</p>
            </div>
            <button
                type="button"
                onClick={onChange}
                disabled={disabled}
                className={`h-6 w-11 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-primary' : 'bg-surface-elevated border border-border'}`}
            >
                <div className={`absolute top-1 h-4 w-4 rounded-full transition-all duration-200 bg-white shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1 bg-text-tertiary/50'}`}></div>
            </button>
        </div>
    );
}
