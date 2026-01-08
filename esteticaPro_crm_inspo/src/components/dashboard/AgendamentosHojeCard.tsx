import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "./DashboardCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  scheduled_at: string;
  lead_name: string | null;
  client_name: string | null;
  procedure_name: string | null;
}

interface AgendamentosHojeCardProps {
  organizationId: string | null;
}

export function AgendamentosHojeCard({ organizationId }: AgendamentosHojeCardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error, count: totalCount } = await supabase
        .from("crm_appointments")
        .select(`
          id,
          scheduled_at,
          crm_leads!crm_appointments_lead_id_fkey(name),
          crm_clients!crm_appointments_client_id_fkey(name),
          crm_procedures!crm_appointments_procedure_id_fkey(name)
        `, { count: "exact" })
        .eq("organization_id", organizationId)
        .gte("scheduled_at", today.toISOString())
        .lt("scheduled_at", tomorrow.toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5);

      if (!error && data) {
        const formatted = data.map((apt: any) => ({
          id: apt.id,
          scheduled_at: apt.scheduled_at,
          lead_name: apt.crm_leads?.name || null,
          client_name: apt.crm_clients?.name || null,
          procedure_name: apt.crm_procedures?.name || null,
        }));
        setAppointments(formatted);
        setCount(totalCount || 0);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [organizationId]);

  return (
    <DashboardCard title="Agendamentos de Hoje" icon={Calendar} count={count} loading={loading}>
      <div className="space-y-2 mt-2">
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum agendamento hoje
          </p>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-primary">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {format(new Date(apt.scheduled_at), "HH:mm")}
                  </span>
                </div>
                <span className="font-medium text-sm truncate">
                  {apt.client_name || apt.lead_name || "Sem nome"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                {apt.procedure_name || "Sem procedimento"}
              </span>
            </div>
          ))
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 border-primary/30 hover:bg-primary/10"
          onClick={() => navigate("/agendamentos")}
        >
          Ver Calendário
        </Button>
      </div>
    </DashboardCard>
  );
}
