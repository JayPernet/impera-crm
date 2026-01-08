import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Trash2 } from "lucide-react";

interface LossReasonModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string, description: string) => void;
    leadName: string;
}

export const LOSS_REASONS = [
    { value: "preco_alto", label: "Preço muito alto / Fora do orçamento" },
    { value: "distancia", label: "Distância / Localização inacessível" },
    { value: "concorrente", label: "Escolheu a concorrência" },
    { value: "sem_contato", label: "Não respondeu aos contatos (Ghosting)" },
    { value: "atendimento", label: "Insatisfação com o atendimento" },
    { value: "desistiu", label: "Desistiu do procedimento / Não é o momento" },
    { value: "sem_servico", label: "Não oferecemos o serviço desejado" },
    { value: "outro", label: "Outro motivo" },
];

export function LossReasonModal({
    open,
    onClose,
    onConfirm,
    leadName,
}: LossReasonModalProps) {
    const [reason, setReason] = useState<string>("");
    const [description, setDescription] = useState("");

    const handleConfirm = () => {
        if (!reason) return;
        onConfirm(reason, description);
        resetForm();
    };

    const resetForm = () => {
        setReason("");
        setDescription("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <Trash2 className="w-5 h-5" />
                        Marcar Lead como Perdido
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3 text-sm text-destructive">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>
                            Você está movendo <strong>{leadName}</strong> para a coluna de perdidos.
                            Por favor, identifique o motivo para ajudar nas estatísticas da clínica.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="loss-reason">Motivo da Perda *</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="loss-reason">
                                <SelectValue placeholder="Selecione um motivo estruturado" />
                            </SelectTrigger>
                            <SelectContent>
                                {LOSS_REASONS.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="loss-description">Observações Adicionais (Opcional)</Label>
                        <Textarea
                            id="loss-description"
                            placeholder="Detalhes sobre o que aconteceu..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none h-24"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!reason}
                    >
                        Confirmar Perda
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
