import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Send, Phone, User, Zap, Plus, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SendWhatsappModal } from "@/components/leads/SendWhatsappModal";
import { CreateLeadModal } from "@/components/pipeline/CreateLeadModal";
import { CreateAppointmentModal } from "@/components/appointments/CreateAppointmentModal";

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
  last_interaction_at: string | null;
  source_type: string | null;
  source_detail: string | null;
  status: string | null;
}

interface LeadForAppointment {
  id: string;
  name: string;
  phone?: string | null;
}

export default function SpeedToLead() {
  const { organizationId } = useCrmUser();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [leadForAppointment, setLeadForAppointment] = useState<LeadForAppointment | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Fetch leads awaiting response (new or contacted, ordered by last_interaction_at)
      const { data: leadsData, error: leadsError } = await supabase
        .from("crm_leads")
        .select("id, name, phone, created_at, last_interaction_at, source_type, source_detail, status")
        .eq("organization_id", organizationId)
        .in("status", ["new", "contacted"])
        .order("last_interaction_at", { ascending: true, nullsFirst: true });

      if (!leadsError && leadsData) {
        setLeads(leadsData);
      }

      setLoading(false);
    };

    fetchData();
  }, [organizationId]);

  const getHoursSinceLastInteraction = (lead: Lead): number => {
    const referenceDate = lead.last_interaction_at || lead.created_at;
    const now = new Date();
    const lastInteraction = new Date(referenceDate);
    return Math.floor((now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60));
  };

  const getUrgencyLevel = (hours: number): { color: string; bgColor: string; label: string } => {
    if (hours < 12) return { color: "text-success", bgColor: "bg-success", label: "< 12h" };
    if (hours < 24) return { color: "text-yellow-500", bgColor: "bg-yellow-500", label: "12-24h" };
    if (hours < 48) return { color: "text-orange-500", bgColor: "bg-orange-500", label: "24-48h" };
    if (hours < 72) return { color: "text-destructive", bgColor: "bg-destructive", label: "48-72h" };
    return { color: "text-destructive", bgColor: "bg-destructive animate-pulse", label: "> 72h" };
  };

  const handleResponder = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleAgendar = (lead: Lead) => {
    setLeadForAppointment({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
    });
    setShowAppointmentModal(true);
  };

  const handleWhatsappSuccess = () => {
    if (selectedLead) {
      // Refresh leads list with updated last_interaction_at
      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id
            ? { ...l, last_interaction_at: new Date().toISOString() }
            : l
        )
      );
    }
  };

  const filterLeads = (leads: Lead[], filter: string): Lead[] => {
    return leads.filter((lead) => {
      const hours = getHoursSinceLastInteraction(lead);
      switch (filter) {
        case "24h": return hours >= 24;
        case "48h": return hours >= 48;
        case "72h": return hours >= 72;
        default: return true;
      }
    });
  };

  const filteredLeads = filterLeads(leads, activeTab);

  const stats = {
    total: leads.length,
    over24h: leads.filter((l) => getHoursSinceLastInteraction(l) >= 24).length,
    over48h: leads.filter((l) => getHoursSinceLastInteraction(l) >= 48).length,
    over72h: leads.filter((l) => getHoursSinceLastInteraction(l) >= 72).length,
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Speed to Lead
          </h1>
          <p className="text-muted-foreground">
            Leads aguardando resposta - responda rápido para converter mais!
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateLead(true)} 
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Aguardando</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">&gt; 24 horas</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.over24h}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">&gt; 48 horas</p>
                <p className="text-2xl font-bold text-orange-500">{stats.over48h}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">&gt; 72 horas</p>
                <p className="text-2xl font-bold text-destructive">{stats.over72h}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
          <TabsTrigger value="24h">&gt;24h ({stats.over24h})</TabsTrigger>
          <TabsTrigger value="48h">&gt;48h ({stats.over48h})</TabsTrigger>
          <TabsTrigger value="72h">&gt;72h ({stats.over72h})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Leads List */}
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-lg font-medium text-success">
                    Excelente! Todos os leads foram contatados.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nenhum lead aguardando resposta nesta categoria.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredLeads.map((lead) => {
                const hours = getHoursSinceLastInteraction(lead);
                const urgency = getUrgencyLevel(hours);

                return (
                  <Card 
                    key={lead.id} 
                    className={`glass-card overflow-hidden border-l-4 ${
                      hours >= 72 ? "border-l-destructive" :
                      hours >= 48 ? "border-l-orange-500" :
                      hours >= 24 ? "border-l-yellow-500" :
                      "border-l-success"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Lead Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {lead.name}
                            </h3>
                            <Badge variant="secondary" className={`${urgency.color} text-xs shrink-0`}>
                              {urgency.label}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.phone || "Sem telefone"}
                            </span>
                            {lead.source_detail && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                {lead.source_detail}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground mt-1">
                            {hours < 1 
                              ? "Menos de 1 hora aguardando"
                              : `${hours} horas aguardando resposta`
                            }
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <Button
                            onClick={() => handleAgendar(lead)}
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            Agendar
                          </Button>
                          <Button
                            onClick={() => handleResponder(lead)}
                            disabled={!lead.phone}
                            size="sm"
                            className="shrink-0 bg-primary hover:bg-primary/90"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Responder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* WhatsApp Modal */}
      <SendWhatsappModal
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        onSuccess={handleWhatsappSuccess}
      />

      {/* Create Lead Modal */}
      <CreateLeadModal 
        open={showCreateLead} 
        onClose={() => setShowCreateLead(false)} 
      />

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setLeadForAppointment(null);
        }}
        preselectedLead={leadForAppointment}
        lockPerson={!!leadForAppointment}
      />
    </div>
  );
}
