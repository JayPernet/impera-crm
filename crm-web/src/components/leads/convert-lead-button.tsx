"use client";

import { useState, useTransition } from "react";
import { UserCheck, Loader2 } from "lucide-react";
import { convertLeadToClient } from "@/app/dashboard/leads/actions";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";

interface ConvertLeadButtonProps {
    leadId: string;
    leadName: string;
}

export function ConvertLeadButton({ leadId, leadName }: ConvertLeadButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleConvert = () => {
        startTransition(async () => {
            const result = await convertLeadToClient(leadId);
            if (result.success) {
                toast.success("Lead convertido em cliente com sucesso!");
                setShowConfirm(false);
                router.push("/dashboard/clients");
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="h-10 px-4 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-text-secondary border border-white/10 font-medium text-sm flex items-center gap-2 transition-all hover:text-primary hover:border-primary/30"
            >
                <UserCheck className="h-4 w-4" />
                <span>Converter em Cliente</span>
            </button>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConvert}
                title="Converter para Cliente"
                description={`Tem certeza que deseja converter o lead "${leadName}" em um cliente? Ele será movido para a carteira de clientes.`}
                confirmText="Confirmar Conversão"
                variant="info"
                isLoading={isPending}
            />
        </>
    );
}
