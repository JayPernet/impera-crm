import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Appointment, useUpdateAppointmentStatus, useRescheduleAppointment } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Clock,
  User,
  Scissors,
  DollarSign,
  FileText,
  Check,
  X,
  AlertTriangle,
  CalendarCheck
} from "lucide-react";

interface AppointmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  scheduled: { label: "Agendado", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <CalendarCheck className="w-3 h-3" /> },
  completed: { label: "Concluído", color: "bg-success/10 text-success border-success/20", icon: <Check className="w-3 h-3" /> },
  cancelled: { label: "Cancelado", color: "bg-muted text-muted-foreground border-muted", icon: <X className="w-3 h-3" /> },
  no_show: { label: "Não Compareceu", color: "bg-destructive/10 text-destructive border-destructive/20", icon: <AlertTriangle className="w-3 h-3" /> },
};

export function AppointmentDetailsModal({
  open,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) {
  const updateStatus = useUpdateAppointmentStatus();
  const reschedule = useRescheduleAppointment();

  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>();
  const [newTime, setNewTime] = useState("09:00");
  const [confirmAction, setConfirmAction] = useState<{
    action: "completed" | "cancelled" | "no_show";
    title: string;
    description: string;
  } | null>(null);

  if (!appointment) return null;

  const clientOrLeadName = appointment.client?.name || appointment.lead?.name || "Desconhecido";
  const clientOrLeadPhone = appointment.client?.phone || appointment.lead?.phone;
  const status = statusConfig[appointment.status || "scheduled"];

  const handleStatusChange = (newStatus: "completed" | "cancelled" | "no_show") => {
    updateStatus.mutate(
      { appointmentId: appointment.id, status: newStatus },
      { onSuccess: () => setConfirmAction(null) }
    );
  };

  const handleReschedule = () => {
    if (!newDate) return;

    const scheduledAt = new Date(newDate);
    const [hours, minutes] = newTime.split(":").map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    reschedule.mutate(
      { appointmentId: appointment.id, scheduledAt: scheduledAt.toISOString() },
      { onSuccess: () => setShowReschedule(false) }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Detalhes do Agendamento</DialogTitle>
              <Badge variant="outline" className={cn("flex items-center gap-1", status.color)}>
                {status.icon}
                {status.label}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cliente/Lead */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{clientOrLeadName}</p>
                {clientOrLeadPhone && (
                  <p className="text-sm text-muted-foreground">{clientOrLeadPhone}</p>
                )}
                <Badge variant="secondary" className="mt-1 text-xs">
                  {appointment.client ? "Cliente" : "Lead"}
                </Badge>
              </div>
            </div>

            {/* Procedimento */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Scissors className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Procedimento</p>
                <p className="font-medium">{appointment.procedure?.name || "Não definido"}</p>
              </div>
            </div>

            {/* Profissional */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Profissional</p>
                <p className="font-medium">{appointment.professional?.name || "Não atribuído"}</p>
              </div>
            </div>

            {/* Data/Hora */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Data e Hora</p>
                <p className="font-medium">
                  {format(new Date(appointment.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Valor */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <DollarSign className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="font-medium text-success">
                  R$ {(appointment.value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Notas */}
            {appointment.notes && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="text-sm">{appointment.notes}</p>
                </div>
              </div>
            )}

            {/* Remarcar */}
            {showReschedule && (
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                <Label>Nova data e hora</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newDate ? format(newDate, "dd/MM/yyyy") : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newDate}
                        onSelect={setNewDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-24"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowReschedule(false)}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReschedule}
                    disabled={!newDate || reschedule.isPending}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-wrap gap-2">
            {appointment.status === "scheduled" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReschedule(true)}
                  disabled={showReschedule}
                  className="flex-1 min-w-[100px] sm:flex-none"
                >
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  Remarcar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/20 hover:bg-destructive/10 flex-1 min-w-[100px] sm:flex-none"
                  onClick={() =>
                    setConfirmAction({
                      action: "cancelled",
                      title: "Cancelar Agendamento",
                      description: "Tem certeza que deseja cancelar este agendamento?",
                    })
                  }
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Cancelar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-warning border-warning/20 hover:bg-warning/10 flex-1 min-w-[100px] sm:flex-none"
                  onClick={() =>
                    setConfirmAction({
                      action: "no_show",
                      title: "Marcar como Não Compareceu",
                      description: "O cliente não compareceu ao agendamento?",
                    })
                  }
                >
                  <AlertTriangle className="w-4 h-4 mr-1.5" />
                  No-Show
                </Button>
                <Button
                  size="sm"
                  className="gold-gradient text-secondary flex-1 min-w-[100px] sm:flex-none"
                  onClick={() =>
                    setConfirmAction({
                      action: "completed",
                      title: "Concluir Agendamento",
                      description:
                        appointment.lead && !appointment.client
                          ? "Ao concluir, o lead será convertido em cliente automaticamente!"
                          : "Confirma que o procedimento foi realizado com sucesso?",
                    })
                  }
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Concluir Atendimento
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirmAction?.action === "completed"
                  ? "gold-gradient text-secondary"
                  : confirmAction?.action === "cancelled"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-warning text-warning-foreground"
              }
              onClick={() => confirmAction && handleStatusChange(confirmAction.action)}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? "Salvando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
