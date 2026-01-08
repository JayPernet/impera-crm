import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Send, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WHATSAPP_WEBHOOK;

interface Lead {
  id: string;
  name: string;
  phone: string | null;
}

interface Organization {
  id: string;
  id_instancia_z_api: string | null;
  token_z_api: string | null;
}

interface SendWhatsappModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess?: () => void;
}

export function SendWhatsappModal({ open, onClose, lead, onSuccess }: SendWhatsappModalProps) {
  const { organizationId, crmUser } = useCrmUser();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);

  useEffect(() => {
    if (!organizationId || !open) return;

    const fetchOrganization = async () => {
      setLoadingOrg(true);
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("id, id_instancia_z_api, token_z_api")
        .eq("id", organizationId)
        .single();

      if (!error && data) {
        setOrganization(data);
      }
      setLoadingOrg(false);
    };

    fetchOrganization();
  }, [organizationId, open]);

  const formatPhone = (phone: string | null): string => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("55")) return `+${digits}`;
    return `+55${digits}`;
  };

  const hasZApiConfigured = organization?.id_instancia_z_api && organization?.token_z_api;

  const handleSend = async () => {
    if (!lead || !message.trim() || !organization) return;

    setSending(true);
    try {
      const payload = {
        leadName: lead.name,
        message: message.trim(),
        phoneNumber: formatPhone(lead.phone),
        zapiInstanceId: organization.id_instancia_z_api,
        zapiToken: organization.token_z_api,
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Mensagem enviada para a fila!");

        // Register interaction
        await supabase.from("crm_interactions").insert({
          lead_id: lead.id,
          type: "whatsapp",
          content: message.trim(),
          user_id: crmUser?.id,
        });

        setMessage("");
        onSuccess?.();
        onClose();
      } else {
        throw new Error("Falha ao enviar mensagem");
      }
    } catch (error) {
      toast.error("Erro ao comunicar com n8n");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full h-full sm:h-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-success" />
            Enviar Mensagem para {lead.name}
          </DialogTitle>
          <DialogDescription>
            Envie uma mensagem via WhatsApp para o lead.
          </DialogDescription>
        </DialogHeader>

        {loadingOrg ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !hasZApiConfigured ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="font-medium text-foreground">Integração não configurada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Configure as credenciais Z-API nas configurações da clínica para enviar mensagens.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <Phone className="w-4 h-4" />
              <span>{formatPhone(lead.phone) || "Sem telefone"}</span>
            </div>

            <Textarea
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={!lead.phone}
            />

            {!lead.phone && (
              <p className="text-xs text-destructive">
                Este lead não possui telefone cadastrado.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending || !hasZApiConfigured || !lead.phone}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}