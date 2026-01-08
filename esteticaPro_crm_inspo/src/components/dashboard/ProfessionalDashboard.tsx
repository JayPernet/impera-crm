import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay, isToday, isFuture, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, CheckCircle2, Clock, Loader2, User, Stethoscope, ClipboardList } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";

interface ProfessionalAppointment {
  id: string;
  scheduled_at: string;
  status: string | null;
  value: number | null;
  notes: string | null;
  lead?: { id: string; name: string; phone: string | null } | null;
  client?: { id: string; name: string; phone: string | null } | null;
  procedure?: { id: string; name: string } | null;
}

export function ProfessionalDashboard() {
  const { crmUser, loading: userLoading } = useCrmUser();
  const queryClient = useQueryClient();

  // Today's appointments for this professional
  const { data: todayAppointments, isLoading: loadingToday } = useQuery({
    queryKey: ["professional-today-appointments", crmUser?.id],
    queryFn: async () => {
      if (!crmUser?.id) return [];

      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();

      const { data, error } = await supabase
        .from("crm_appointments")
        .select(`
          *,
          lead:crm_leads(id, name, phone),
          client:crm_clients(id, name, phone),
          procedure:crm_procedures(id, name)
        `)
        .eq("professional_id", crmUser.id)
        .gte("scheduled_at", todayStart)
        .lte("scheduled_at", todayEnd)
        .order("scheduled_at", { ascending: true });

      if (error) throw error;
      return data as ProfessionalAppointment[];
    },
    enabled: !!crmUser?.id,
  });

  // Next appointment (today or future)
  const { data: nextAppointment, isLoading: loadingNext } = useQuery({
    queryKey: ["professional-next-appointment", crmUser?.id],
    queryFn: async () => {
      if (!crmUser?.id) return null;

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("crm_appointments")
        .select(`
          *,
          lead:crm_leads(id, name, phone),
          client:crm_clients(id, name, phone),
          procedure:crm_procedures(id, name)
        `)
        .eq("professional_id", crmUser.id)
        .eq("status", "scheduled")
        .gte("scheduled_at", now)
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as ProfessionalAppointment | null;
    },
    enabled: !!crmUser?.id,
  });

  // Month production count
  const { data: monthProduction, isLoading: loadingProduction } = useQuery({
    queryKey: ["professional-month-production", crmUser?.id],
    queryFn: async () => {
      if (!crmUser?.id) return 0;

      const monthStart = startOfMonth(new Date()).toISOString();
      const monthEnd = endOfMonth(new Date()).toISOString();

      const { count, error } = await supabase
        .from("crm_appointments")
        .select("*", { count: "exact", head: true })
        .eq("professional_id", crmUser.id)
        .eq("status", "completed")
        .gte("scheduled_at", monthStart)
        .lte("scheduled_at", monthEnd);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!crmUser?.id,
  });

  // Complete appointment mutation
  const completeAppointmentMutation = useMutation({
    mutationFn: async (appointmentId: string) => {
      const { error } = await supabase
        .from("crm_appointments")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", appointmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional-today-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["professional-next-appointment"] });
      queryClient.invalidateQueries({ queryKey: ["professional-month-production"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Atendimento concluído com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao concluir atendimento");
    },
  });

  // Pending appointments today
  const pendingToday = useMemo(() => {
    return todayAppointments?.filter((apt) => apt.status === "scheduled") || [];
  }, [todayAppointments]);

  const completedToday = useMemo(() => {
    return todayAppointments?.filter((apt) => apt.status === "completed") || [];
  }, [todayAppointments]);

  if (userLoading) {
    return (
      <div className="space-y-6 animate-fade-in p-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[120px]" />
      </div>
    );
  }

  const getPatientName = (apt: ProfessionalAppointment) => {
    return apt.client?.name || apt.lead?.name || "Paciente";
  };

  const getPatientPhone = (apt: ProfessionalAppointment) => {
    return apt.client?.phone || apt.lead?.phone || null;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, Dr(a). {crmUser?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      {/* Next Patient Card - Large */}
      <Card className="glass-card border-primary/30 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Meu Próximo Paciente</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loadingNext ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : nextAppointment ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {getPatientName(nextAppointment)}
                  </h3>
                  <p className="text-muted-foreground">
                    {nextAppointment.procedure?.name || "Procedimento"}
                  </p>
                  {getPatientPhone(nextAppointment) && (
                    <p className="text-sm text-muted-foreground">
                      📱 {getPatientPhone(nextAppointment)}
                    </p>
                  )}
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/30 text-base px-3 py-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {format(parseISO(nextAppointment.scheduled_at), "HH:mm")}
                </Badge>
              </div>

              {nextAppointment.notes && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Obs:</strong> {nextAppointment.notes}
                  </p>
                </div>
              )}

              <Button
                size="lg"
                className="w-full gold-gradient text-secondary font-semibold h-14 text-lg"
                onClick={() => {
                  // Could open a patient details modal in the future
                  toast.info("Em breve: Ver prontuário completo");
                }}
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                Ver Prontuário / Detalhes
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Nenhum agendamento pendente
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-lg">Minha Agenda de Hoje</CardTitle>
            </div>
            <Badge variant="outline" className="text-sm">
              {pendingToday.length} pendente(s)
            </Badge>
          </div>
          <CardDescription>
            {completedToday.length} de {todayAppointments?.length || 0} concluídos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingToday ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : todayAppointments?.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Nenhum agendamento para hoje
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-3">
                {todayAppointments?.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-lg border transition-all ${
                      apt.status === "completed"
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-card border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`text-lg font-mono font-semibold ${
                            apt.status === "completed"
                              ? "text-green-600"
                              : "text-primary"
                          }`}
                        >
                          {format(parseISO(apt.scheduled_at), "HH:mm")}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {getPatientName(apt)}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {apt.procedure?.name || "Procedimento"}
                          </p>
                        </div>
                      </div>

                      {apt.status === "completed" ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/30 whitespace-nowrap">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Concluído
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="default"
                          className="gold-gradient text-secondary whitespace-nowrap h-10 px-4"
                          onClick={() => completeAppointmentMutation.mutate(apt.id)}
                          disabled={completeAppointmentMutation.isPending}
                        >
                          {completeAppointmentMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Concluir
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Month Production Card */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/10">
              <Stethoscope className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                Minha Produção (Mês Atual)
              </p>
              {loadingProduction ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">
                    {monthProduction}
                  </span>
                  <span className="text-muted-foreground">
                    procedimento{monthProduction !== 1 ? "s" : ""} realizado{monthProduction !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
