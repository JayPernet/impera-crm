
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Smartphone, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { useCrmUser } from "@/hooks/useCrmUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface WhatsAppConnectionModalProps {
    open: boolean;
    onClose: () => void;
}

export function WhatsAppConnectionModal({ open, onClose }: WhatsAppConnectionModalProps) {
    const { organizationId } = useCrmUser();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const [phone, setPhone] = useState("");
    const [pairingCode, setPairingCode] = useState("");
    const [credentials, setCredentials] = useState<{ instanceId: string; token: string } | null>(null);
    const [generating, setGenerating] = useState(false);

    // Fetch credentials on mount
    useEffect(() => {
        if (open && organizationId) {
            checkCredentials();
        }
    }, [open, organizationId]);

    const checkCredentials = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("crm_organizations")
                .select("id_instancia_z_api, token_z_api")
                .eq("id", organizationId)
                .single();

            if (error) throw error;

            if (data?.id_instancia_z_api && data?.token_z_api) {
                setCredentials({
                    instanceId: data.id_instancia_z_api,
                    token: data.token_z_api
                });
                setStep(1);
            } else {
                setStep(0); // Missing credentials
            }
        } catch (err) {
            console.error("Error fetching credentials:", err);
            toast.error("Erro ao verificar configurações da clínica.");
        } finally {
            setLoading(false);
        }
    };

    const formatPhone = (val: string) => {
        // Basic mask: +55 (99) 99999-9999
        // Just allow numbers for input, format display?
        // API requires just numbers likely.
        return val.replace(/\D/g, "");
    };

    const handleGenerateCode = async () => {
        if (!credentials || !phone) return;

        // Validate phone (Brazilian format)
        if (phone.length < 10) {
            toast.error("Número de telefone inválido.");
            return;
        }

        setGenerating(true);
        try {
            // Z-API endpoint for Phone Code
            // URL format: https://api.z-api.io/instances/{INSTANCE_ID}/token/{TOKEN}/phone-code/{PHONE}
            // Assuming standard Z-API structure. Some versions use /send-pairing-code or similar.
            // Based on common Z-API docs: /phone-code/{phone}

            const response = await fetch(
                `https://api.z-api.io/instances/${credentials.instanceId}/token/${credentials.token}/phone-code/${phone}`,
                { method: "GET" } // Usually GET for retrieving the code, but sometimes POST with body. Assuming GET based on user prompt.
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro na API");
            }

            // Usually data.code or data.pairingCode
            // Check typical response structure.
            // If prompt says "Exhibition of Code", implies we receive it. 
            // Example response: { value: "ABCD-1234" } or { code: "..." }

            const code = data.code || data.value || data.pairingCode;

            if (!code) {
                throw new Error("Código não retornado pela API");
            }

            setPairingCode(code);
            setStep(2);
        } catch (err: any) {
            console.error("Error generating code:", err);
            toast.error(`Erro ao conectar: ${err.message || "Verifique se a instância está ativa"}`);
        } finally {
            setGenerating(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(pairingCode);
        toast.success("Código copiado!");
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-green-500" />
                        Conectar WhatsApp
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                ) : step === 0 ? (
                    <div className="flex flex-col items-center text-center py-6 space-y-4">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Configuração Necessária</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                Para conectar o WhatsApp, você precisa configurar as credenciais da API (Z-API) nas configurações da clínica.
                            </p>
                        </div>
                        <Button onClick={() => navigate("/configuracoes/clinica")}>
                            Ir para Configurações
                        </Button>
                    </div>
                ) : step === 1 ? (
                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div className="bg-blue-500/10 p-4 rounded-lg flex gap-3 text-sm text-blue-600 dark:text-blue-400">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>
                                    Certifique-se de que este número já está registrado no WhatsApp no seu celular.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Número do WhatsApp (com DDD)</Label>
                                <div className="flex gap-2">
                                    <div className="flex items-center justify-center px-3 border rounded-md bg-muted text-muted-foreground">
                                        +55
                                    </div>
                                    <Input
                                        placeholder="11999999999"
                                        value={phone}
                                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Apenas números. Ex: 11999999999
                                </p>
                            </div>

                            <Button
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                                onClick={handleGenerateCode}
                                disabled={generating || phone.length < 10}
                            >
                                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Gerar Código de Conexão
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center py-6 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-medium text-muted-foreground">Seu código de conexão</h3>
                            <div className="relative group">
                                <div
                                    className="text-4xl font-mono font-bold tracking-wider bg-muted p-4 rounded-lg border-2 border-primary/20 cursor-pointer hover:bg-muted/80 transition-colors"
                                    onClick={copyCode}
                                >
                                    {pairingCode.toUpperCase()}
                                </div>
                                <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={copyCode}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Clique para copiar</p>
                        </div>

                        <ol className="text-left text-sm space-y-3 bg-muted/30 p-4 rounded-lg w-full max-w-sm border">
                            <li className="flex gap-2">
                                <span className="font-bold bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">1</span>
                                <span>Abra o WhatsApp no seu celular</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">2</span>
                                <span>Vá em <strong>Configurações</strong> {'>'} <strong>Aparelhos Conectados</strong></span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">3</span>
                                <span>Toque em <strong>Conectar um aparelho</strong></span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">4</span>
                                <span>Escolha <strong>Conectar com número de telefone</strong></span>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold bg-primary/10 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0">5</span>
                                <span>Digite o código acima</span>
                            </li>
                        </ol>

                        <Button variant="outline" onClick={onClose} className="w-full">
                            Fechar
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
