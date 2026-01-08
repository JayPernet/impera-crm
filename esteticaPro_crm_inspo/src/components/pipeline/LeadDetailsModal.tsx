import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Phone,
  Mail,
  Copy,
  Calendar,
  Trash2,
  Edit2,
  Check,
  X,
  MessageSquare,
  PhoneCall,
  FileText,
  RefreshCw,
  Flame,
  Snowflake,
  Thermometer,
  Plus,
  Send,
  Bot,
} from "lucide-react";
import {
  Lead,
  LeadStatus,
  Temperature,
  SourceType,
  useUpdateLead,
  useDeleteLead,
  useLeadById,
} from "@/hooks/useLeads";
import { useInteractions, useCreateInteraction, InteractionType } from "@/hooks/useInteractions";
import { useCrmUser } from "@/hooks/useCrmUser";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { SendWhatsappModal } from "@/components/leads/SendWhatsappModal";
import { LOSS_REASONS } from "./LossReasonModal";
import { AlertTriangle } from "lucide-react";

interface LeadDetailsModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string | null;
  onCreateAppointment: (lead: Lead) => void;
}

interface Organization {
  id: string;
  id_instancia_z_api: string | null;
  token_z_api: string | null;
}

const statusLabels: Record<LeadStatus, string> = {
  new: "Novo",
  contacted: "Contatado",
  scheduled: "Agendado",
  attended: "Comparecimento",
  sold: "Vendas",
  lost: "Perdido",
};

const statusColors: Record<LeadStatus, string> = {
  new: "bg-temperature-cold text-white",
  contacted: "bg-warning text-warning-foreground",
  scheduled: "bg-orange-500 text-white",
  attended: "bg-purple-500 text-white",
  sold: "bg-success text-success-foreground",
  lost: "bg-destructive text-destructive-foreground",
};

const sourceLabels: Record<SourceType, string> = {
  ads: "Anúncios",
  organic: "Orgânico",
  indication: "Indicação",
  other: "Outro",
};

const interactionIcons: Record<InteractionType, React.ReactNode> = {
  whatsapp: <MessageSquare className="w-4 h-4 text-success" />,
  call: <PhoneCall className="w-4 h-4 text-primary" />,
  note: <FileText className="w-4 h-4 text-muted-foreground" />,
  status_change: <RefreshCw className="w-4 h-4 text-temperature-cold" />,
};

export function LeadDetailsModal({
  open,
  onClose,
  leadId,
  onCreateAppointment,
}: LeadDetailsModalProps) {
  const { data: lead, isLoading: leadLoading } = useLeadById(leadId);
  const { data: interactions, isLoading: interactionsLoading } = useInteractions(leadId);
  const { crmUser, userRole, organizationId } = useCrmUser();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const createInteraction = useCreateInteraction();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [editingProposal, setEditingProposal] = useState(false);
  const [newProposal, setNewProposal] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");

  // WhatsApp modal state
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  // AI toggle state
  const [aiActive, setAiActive] = useState<boolean>(true);
  const [togglingAi, setTogglingAi] = useState(false);

  const isAdmin = userRole?.role === "admin" || userRole?.role === "super_admin";

  // Sync AI active state from lead
  useEffect(() => {
    if (lead) {
      setAiActive(lead.ai_active !== false);
    }
  }, [lead]);

  const formatPhone = (phone: string | null): string => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("55")) return `+${digits}`;
    return `+55${digits}`;
  };

  const handleCopyPhone = () => {
    if (lead?.phone) {
      navigator.clipboard.writeText(lead.phone);
      toast.success("Telefone copiado");
    }
  };

  const handleSaveName = () => {
    if (lead && newName.trim()) {
      updateLead.mutate({ leadId: lead.id, data: { name: newName.trim() } });
      setEditingName(false);
    }
  };

  const handleSavePhone = () => {
    if (lead) {
      updateLead.mutate({ leadId: lead.id, data: { phone: newPhone.trim() } });
      setEditingPhone(false);
    }
  };

  const handleSaveEmail = () => {
    if (lead) {
      updateLead.mutate({ leadId: lead.id, data: { email: newEmail.trim() } });
      setEditingEmail(false);
    }
  };

  const handleSaveProposal = () => {
    if (lead) {
      updateLead.mutate({ leadId: lead.id, data: { current_proposal: newProposal } });
      setEditingProposal(false);
    }
  };

  const handleAddNote = () => {
    if (lead && newNote.trim()) {
      createInteraction.mutate({
        leadId: lead.id,
        type: "note",
        content: newNote.trim(),
      });
      setNewNote("");
      setShowAddNote(false);
    }
  };

  const handleStatusChange = (status: LeadStatus) => {
    if (lead) {
      updateLead.mutate({ leadId: lead.id, data: { status } });
    }
  };

  const handleTemperatureChange = (temperature: Temperature) => {
    if (lead) {
      updateLead.mutate({ leadId: lead.id, data: { temperature } });
    }
  };

  const handleDelete = (permanent: boolean) => {
    if (lead) {
      deleteLead.mutate({ leadId: lead.id, permanent });
      onClose();
    }
  };

  const handleToggleAi = async () => {
    if (!lead) return;

    setTogglingAi(true);
    const newValue = !aiActive;

    try {
      const { error } = await supabase
        .from("crm_leads")
        .update({ ai_active: newValue })
        .eq("id", lead.id);

      if (error) throw error;

      setAiActive(newValue);
      toast.success(newValue ? "IA ativada para este lead" : "IA pausada - humano assumiu");
    } catch (error) {
      toast.error("Erro ao alterar status da IA");
    } finally {
      setTogglingAi(false);
    }
  };

  if (!lead && !leadLoading) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="flex flex-col w-full h-full max-w-none md:max-w-2xl md:h-[90vh] md:max-h-[90vh] p-0 gap-0">
          <DialogHeader className="shrink-0 p-4 md:p-6 pb-4 md:pr-12 border-b">
            {/* Header with Name and Badges */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-xl font-bold"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={handleSaveName}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingName(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <DialogTitle
                    className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                    onClick={() => {
                      setNewName(lead?.name || "");
                      setEditingName(true);
                    }}
                  >
                    {lead?.name || "Carregando..."}
                    <Edit2 className="w-4 h-4 opacity-50" />
                  </DialogTitle>
                )}

                <div className="flex items-center gap-2 mt-2">
                  {/* Status Badge */}
                  {lead?.status && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge className={`${statusColors[lead.status]} cursor-pointer`}>
                          {statusLabels[lead.status]}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {(Object.keys(statusLabels) as LeadStatus[]).map((s) => (
                          <DropdownMenuItem key={s} onClick={() => handleStatusChange(s)}>
                            <Badge className={statusColors[s]}>{statusLabels[s]}</Badge>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Temperature Badge */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge variant="outline" className="cursor-pointer">
                        {lead?.temperature === "hot" && <Flame className="w-3 h-3 mr-1 text-temperature-hot" />}
                        {lead?.temperature === "warm" && <Thermometer className="w-3 h-3 mr-1 text-temperature-warm" />}
                        {lead?.temperature === "cold" && <Snowflake className="w-3 h-3 mr-1 text-temperature-cold" />}
                        {lead?.temperature === "hot" ? "Quente" : lead?.temperature === "warm" ? "Morno" : "Frio"}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleTemperatureChange("cold")}>
                        <Snowflake className="w-4 h-4 mr-2 text-temperature-cold" />
                        Frio
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTemperatureChange("warm")}>
                        <Thermometer className="w-4 h-4 mr-2 text-temperature-warm" />
                        Morno
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTemperatureChange("hot")}>
                        <Flame className="w-4 h-4 mr-2 text-temperature-hot" />
                        Quente
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* AI Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border">
                <Bot className={`w-4 h-4 ${aiActive ? "text-success" : "text-muted-foreground"}`} />
                <span className="text-sm font-medium">IA</span>
                <Switch
                  checked={aiActive}
                  onCheckedChange={handleToggleAi}
                  disabled={togglingAi}
                  className="data-[state=checked]:bg-success"
                />
                <span className={`text-xs ${aiActive ? "text-success" : "text-muted-foreground"}`}>
                  {aiActive ? "Ativa" : "Pausada"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowWhatsappModal(true)}
                  disabled={!lead?.phone}
                  className="border-success text-success hover:bg-success/10"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar WhatsApp
                </Button>
                <Button
                  className="gold-gradient text-secondary"
                  onClick={() => lead && onCreateAppointment(lead)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar
                </Button>
                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(true)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-6 pt-4 space-y-4 pb-8">
              {/* Main Info */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Informações</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Telefone</Label>
                    <div className="flex items-center gap-2 group">
                      <Phone className="w-4 h-4 shrink-0 text-muted-foreground" />
                      {editingPhone ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="h-8 py-0"
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSavePhone}>
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingPhone(false)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span
                            className="truncate cursor-pointer hover:text-primary"
                            onClick={() => {
                              setNewPhone(lead?.phone || "");
                              setEditingPhone(true);
                            }}
                          >
                            {lead?.phone || "-"}
                          </span>
                          {lead?.phone && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100" onClick={handleCopyPhone}>
                              <Copy className="w-3 h-3" />
                            </Button>
                          )}
                          <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50 cursor-pointer" onClick={() => {
                            setNewPhone(lead?.phone || "");
                            setEditingPhone(true);
                          }} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2 group">
                      <Mail className="w-4 h-4 shrink-0 text-muted-foreground" />
                      {editingEmail ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="h-8 py-0"
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEmail}>
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingEmail(false)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span
                            className="truncate cursor-pointer hover:text-primary"
                            onClick={() => {
                              setNewEmail(lead?.email || "");
                              setEditingEmail(true);
                            }}
                          >
                            {lead?.email || "-"}
                          </span>
                          <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50 cursor-pointer" onClick={() => {
                            setNewEmail(lead?.email || "");
                            setEditingEmail(true);
                          }} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Origem</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">
                        {lead?.source_type ? sourceLabels[lead.source_type] : "-"}
                      </Badge>
                      {lead?.source_detail && (
                        <span className="text-sm text-muted-foreground truncate">{lead.source_detail}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Responsável</Label>
                    <span className="truncate">{lead?.assigned_user?.name || "Não atribuído"}</span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Criado em</Label>
                    <span className="truncate">
                      {lead?.created_at
                        ? format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                        : "-"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <Label className="text-xs text-muted-foreground">Última interação</Label>
                    <span className={`truncate ${lead?.last_interaction_at ? "" : "text-destructive"}`}>
                      {lead?.last_interaction_at
                        ? formatDistanceToNow(new Date(lead.last_interaction_at), { addSuffix: true, locale: ptBR })
                        : "Sem interação"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Perdido Section */}
              {lead?.status === "lost" && (
                <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
                  <CardHeader className="py-3 bg-destructive/10">
                    <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                      <AlertTriangle className="w-4 h-4" />
                      Lead Perdido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div>
                      <Label className="text-xs text-destructive/70">Motivo Estruturado</Label>
                      <p className="font-semibold text-destructive">
                        {LOSS_REASONS.find(r => r.value === lead.loss_reason)?.label || lead.loss_reason || "Não especificado"}
                      </p>
                    </div>
                    {lead.loss_description && (
                      <div>
                        <Label className="text-xs text-destructive/70">Descrição da Perda</Label>
                        <p className="text-sm text-destructive/90 bg-destructive/5 p-2 rounded-md border border-destructive/10">
                          {lead.loss_description}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Proposal */}
              <Card>
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Proposta Atual</CardTitle>
                  {!editingProposal && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewProposal(lead?.current_proposal || "");
                        setEditingProposal(true);
                      }}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {editingProposal ? (
                    <div className="space-y-2">
                      <Textarea
                        value={newProposal}
                        onChange={(e) => setNewProposal(e.target.value)}
                        placeholder="Ex: Botox R$800, 3x cartão, validade 7 dias"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveProposal}>
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingProposal(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {lead?.current_proposal || "Nenhuma proposta registrada"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Procedures & Tags */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Procedimentos de Interesse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {lead?.lead_procedures?.length ? (
                        lead.lead_procedures.map((lp) => (
                          <Badge key={lp.procedure.id} variant="secondary">
                            {lp.procedure.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhum procedimento</span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {lead?.lead_tags?.length ? (
                        lead.lead_tags.map((lt) => (
                          <Badge
                            key={lt.tag.id}
                            style={{ backgroundColor: lt.tag.color || undefined }}
                          >
                            {lt.tag.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Nenhuma tag</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm">Timeline de Interações</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddNote(true)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar Nota
                  </Button>
                </CardHeader>
                <CardContent>
                  {showAddNote && (
                    <div className="mb-4 p-3 bg-muted rounded-lg space-y-2">
                      <Textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Digite sua nota..."
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddNote} disabled={createInteraction.isPending}>
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowAddNote(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {interactionsLoading ? (
                      <p className="text-sm text-muted-foreground">Carregando...</p>
                    ) : interactions?.length ? (
                      interactions.map((interaction) => (
                        <div
                          key={interaction.id}
                          className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="mt-1">{interactionIcons[interaction.type]}</div>
                          <div className="flex-1">
                            <p className="text-sm">{interaction.content}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span>{interaction.user?.name || "Automação"}</span>
                              <span>•</span>
                              <span>
                                {interaction.created_at
                                  ? formatDistanceToNow(new Date(interaction.created_at), {
                                    addSuffix: true,
                                    locale: ptBR,
                                  })
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma interação registrada
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* WhatsApp Modal */}
      <SendWhatsappModal
        open={showWhatsappModal}
        onClose={() => setShowWhatsappModal(false)}
        lead={lead ? { id: lead.id, name: lead.name, phone: lead.phone } : null}
      />
    </>
  );
}
