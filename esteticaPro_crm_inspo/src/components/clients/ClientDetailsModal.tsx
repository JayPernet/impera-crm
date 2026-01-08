import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, useClientAppointments, useUpdateClient } from "@/hooks/useClients";
import { useInteractions } from "@/hooks/useInteractions";
import { useAnamnesis } from "@/hooks/useAnamnesis";
import { AnamnesisModal } from "./AnamnesisModal";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  MessageSquare,
  PhoneCall,
  FileText,
  RefreshCw,
  Plus,
  Save,
  ClipboardList,
  AlertTriangle,
  Baby,
  Star,
  Link,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useCrmUser } from "@/hooks/useCrmUser";

interface ClientDetailsModalProps {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  onCreateAppointment?: (clientId: string) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Agendado", color: "bg-blue-500/10 text-blue-500" },
  completed: { label: "Concluído", color: "bg-success/10 text-success" },
  cancelled: { label: "Cancelado", color: "bg-muted text-muted-foreground" },
  no_show: { label: "Não Compareceu", color: "bg-destructive/10 text-destructive" },
};

const interactionIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare className="w-4 h-4 text-green-500" />,
  call: <PhoneCall className="w-4 h-4 text-blue-500" />,
  note: <FileText className="w-4 h-4 text-primary" />,
  status_change: <RefreshCw className="w-4 h-4 text-warning" />,
};

export function ClientDetailsModal({
  open,
  onClose,
  client,
  onCreateAppointment,
}: ClientDetailsModalProps) {
  const { data: appointments } = useClientAppointments(client?.id || null);
  const { data: interactions } = useInteractions(client?.lead_id || null);
  const { data: anamnesis } = useAnamnesis(client?.id || null);
  const updateClient = useUpdateClient();

  const [notes, setNotes] = useState(client?.notes || "");
  const [editingNotes, setEditingNotes] = useState(false);
  const [showAnamnesis, setShowAnamnesis] = useState(false);
  const { crmUser } = useCrmUser();
  const [copied, setCopied] = useState(false);

  // Fallback for missing nps_token in type definition for now, assuming it comes from DB
  const npsLink = client && (client as any).nps_token
    ? `${window.location.origin}/nps/${(client as any).nps_token}`
    : null;

  const handleCopyNps = () => {
    if (npsLink) {
      navigator.clipboard.writeText(npsLink);
      setCopied(true);
      toast.success("Link de NPS copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!client) return null;

  const daysUntilReturn = client.next_return_at
    ? differenceInDays(new Date(client.next_return_at), new Date())
    : null;

  // Alert badges from anamnesis
  const hasAllergies = anamnesis?.allergies && anamnesis.allergies.trim().length > 0;
  const isPregnant = anamnesis?.is_pregnant_or_breastfeeding;

  const handleSaveNotes = () => {
    updateClient.mutate(
      { clientId: client.id, data: { notes } },
      { onSuccess: () => setEditingNotes(false) }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {client.name}
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary/20 hover:bg-primary/10"
                onClick={() => setShowAnamnesis(true)}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Anamnese
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-600 border-yellow-600/20 hover:bg-yellow-600/10"
                onClick={handleCopyNps}
                disabled={!npsLink}
                title="Copiar Link de NPS"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                Link NPS
              </Button>
            </div>
          </DialogHeader>

          {/* Alert Badges */}
          {(hasAllergies || isPregnant) && (
            <div className="flex flex-wrap gap-2">
              {hasAllergies && (
                <Badge className="bg-destructive text-destructive-foreground flex items-center gap-1 px-3 py-1">
                  <AlertTriangle className="w-3 h-3" />
                  ALÉRGICA: {anamnesis?.allergies?.toUpperCase()}
                </Badge>
              )}
              {isPregnant && (
                <Badge className="bg-pink-500 text-white flex items-center gap-1 px-3 py-1">
                  <Baby className="w-3 h-3" />
                  GESTANTE/LACTANTE
                </Badge>
              )}
            </div>
          )}

          <div className="space-y-6">
            {/* Info & Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {/* Info */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {client.phone}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {client.email}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Cliente desde{" "}
                    {client.converted_at
                      ? format(new Date(client.converted_at), "dd/MM/yyyy", { locale: ptBR })
                      : "N/A"}
                  </div>
                </CardContent>
              </Card>

              {/* Metrics */}
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Métricas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Receita Estimada</span>
                    <span className="font-bold text-success text-lg">
                      R$ {(client.estimated_revenue || 0).toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Atendimentos</span>
                    <span className="font-medium">{client.total_appointments || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Próximo Retorno</span>
                    {daysUntilReturn !== null ? (
                      <Badge
                        variant="secondary"
                        className={
                          daysUntilReturn <= 3
                            ? "bg-destructive/10 text-destructive"
                            : daysUntilReturn <= 7
                              ? "bg-warning/10 text-warning"
                              : ""
                        }
                      >
                        {daysUntilReturn <= 0 ? "Hoje" : `${daysUntilReturn} dias`}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="appointments">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments">Histórico</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="mt-4">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {appointments?.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum agendamento encontrado
                    </p>
                  )}
                  {appointments?.map((apt: any) => {
                    const status = statusConfig[apt.status || "scheduled"];
                    return (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {apt.procedure?.name || "Procedimento"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(apt.scheduled_at), "dd/MM/yyyy 'às' HH:mm", {
                                locale: ptBR,
                              })}{" "}
                              • {apt.professional?.name || "Profissional"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-success">
                            R$ {(apt.value || 0).toLocaleString("pt-BR")}
                          </span>
                          <Badge variant="secondary" className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {interactions?.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhuma interação encontrada
                    </p>
                  )}
                  {interactions?.map((interaction: any) => (
                    <div
                      key={interaction.id}
                      className="flex gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <div className="mt-0.5">
                        {interactionIcons[interaction.type] || (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{interaction.content || "Sem conteúdo"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {interaction.user?.name || "Automação"} •{" "}
                          {formatDistanceToNow(new Date(interaction.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setEditingNotes(true);
                    }}
                    placeholder="Adicione notas sobre o cliente..."
                    rows={4}
                  />
                  {editingNotes && (
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={updateClient.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Notas
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="gold-gradient text-secondary flex-1"
                onClick={() => onCreateAppointment?.(client.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Anamnesis Modal */}
      <AnamnesisModal
        open={showAnamnesis}
        onClose={() => setShowAnamnesis(false)}
        clientId={client.id}
        clientName={client.name}
      />
    </>
  );
}
