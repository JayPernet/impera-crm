import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { useCrmUser } from "@/hooks/useCrmUser";
import { CreateAppointmentModal } from "@/components/appointments/CreateAppointmentModal";
import { AppointmentDetailsModal } from "@/components/appointments/AppointmentDetailsModal";

const statusColors: Record<string, string> = {
  scheduled: "#3B82F6",
  completed: "#059669",
  cancelled: "#6B7280",
  no_show: "#DC2626",
};

export default function Agendamentos() {
  const { isProfessional } = useCrmUser();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { data: appointments, isLoading } = useAppointments();

  const events = (appointments || []).map((apt) => ({
    id: apt.id,
    title: `${apt.lead?.name || apt.client?.name || "Cliente"} - ${apt.procedure?.name || "Procedimento"}`,
    start: apt.scheduled_at,
    backgroundColor: statusColors[apt.status || "scheduled"],
    borderColor: statusColors[apt.status || "scheduled"],
    extendedProps: { appointment: apt },
  }));

  const handleEventClick = (info: any) => {
    setSelectedAppointment(info.event.extendedProps.appointment);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {isProfessional ? "Minha Agenda" : "Agenda"}
        </h1>
        {!isProfessional && (
          <Button className="gold-gradient text-secondary" onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Button>
        )}
      </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locale="pt-br"
            locales={[ptBrLocale]}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            buttonText={{
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
            }}
          />
        </CardContent>
      </Card>

      <CreateAppointmentModal open={showCreate} onClose={() => setShowCreate(false)} />
      <AppointmentDetailsModal
        open={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
