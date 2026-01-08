import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { useSuperAdminOrg } from "@/contexts/SuperAdminOrgContext";
import { toast } from "sonner";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: string;
  organization_id: string;
  lead_id: string | null;
  client_id: string | null;
  procedure_id: string | null;
  professional_id: string | null;
  scheduled_at: string;
  status: AppointmentStatus | null;
  value: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Joined data
  lead?: { id: string; name: string; phone: string | null } | null;
  client?: { id: string; name: string; phone: string | null } | null;
  procedure?: { id: string; name: string } | null;
  professional?: { id: string; name: string } | null;
}

export function useAppointments(filters?: {
  startDate?: string;
  endDate?: string;
  status?: AppointmentStatus[];
  professionalId?: string;
  procedureId?: string;
}) {
  const { crmUser, isProfessional, isSuperAdmin } = useCrmUser();
  const { selectedOrgIds } = useSuperAdminOrg();

  return useQuery({
    queryKey: ["appointments", crmUser?.organization_id, crmUser?.id, isProfessional, isSuperAdmin, selectedOrgIds, filters],
    queryFn: async () => {
      let query = supabase
        .from("crm_appointments")
        .select(`
          *,
          lead:crm_leads(id, name, phone),
          client:crm_clients(id, name, phone),
          procedure:crm_procedures(id, name),
          professional:crm_users(id, name)
        `)
        .order("scheduled_at", { ascending: true });

      // Super Admin: show from selected organizations
      if (isSuperAdmin && selectedOrgIds.length > 0) {
        query = query.in("organization_id", selectedOrgIds);
      }
      // Admin/User: show from their organization
      else if (crmUser?.organization_id) {
        query = query.eq("organization_id", crmUser.organization_id);
      } else {
        return [];
      }

      // Professionals can only see their own appointments
      if (isProfessional) {
        query = query.eq("professional_id", crmUser?.id);
      }

      if (filters?.startDate) {
        query = query.gte("scheduled_at", filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte("scheduled_at", filters.endDate);
      }
      if (filters?.status?.length) {
        query = query.in("status", filters.status);
      }
      if (filters?.professionalId && !isProfessional) {
        query = query.eq("professional_id", filters.professionalId);
      }
      if (filters?.procedureId) {
        query = query.eq("procedure_id", filters.procedureId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as Appointment[];
    },
    enabled: isSuperAdmin ? selectedOrgIds.length > 0 : !!crmUser?.organization_id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async (data: {
      lead_id?: string;
      client_id?: string;
      procedure_id?: string;
      professional_id?: string;
      scheduled_at: string;
      value?: number;
      notes?: string;
      organization_id?: string; // Optional override for super_admin
    }) => {
      const orgId = data.organization_id || crmUser?.organization_id;
      if (!orgId) throw new Error("Sem organização");

      // Check for professional schedule conflict
      // A professional cannot have two appointments at the same time
      if (data.professional_id) {
        const scheduledDate = new Date(data.scheduled_at);
        // Check appointments within the same hour (you could adjust this window if needed)
        const startWindow = new Date(scheduledDate);
        startWindow.setMinutes(0, 0, 0);
        const endWindow = new Date(scheduledDate);
        endWindow.setMinutes(59, 59, 999);

        const { data: existingAppointments, error: checkError } = await supabase
          .from("crm_appointments")
          .select("id, scheduled_at")
          .eq("professional_id", data.professional_id)
          .eq("organization_id", orgId)
          .neq("status", "cancelled")
          .gte("scheduled_at", startWindow.toISOString())
          .lte("scheduled_at", endWindow.toISOString());

        if (checkError) throw checkError;

        // Check if any existing appointment is at the exact same time
        const exactConflict = existingAppointments?.some((apt) => {
          const existingTime = new Date(apt.scheduled_at);
          return existingTime.getHours() === scheduledDate.getHours() &&
                 existingTime.getMinutes() === scheduledDate.getMinutes();
        });

        if (exactConflict) {
          throw new Error("Este profissional já tem agendamento neste horário");
        }
      }

      const { error, data: newAppointment } = await supabase
        .from("crm_appointments")
        .insert({
          organization_id: orgId,
          lead_id: data.lead_id || null,
          client_id: data.client_id || null,
          procedure_id: data.procedure_id || null,
          professional_id: data.professional_id || null,
          scheduled_at: data.scheduled_at,
          value: data.value || 0,
          notes: data.notes || null,
          status: "scheduled",
        })
        .select()
        .single();

      if (error) throw error;
      return newAppointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar agendamento");
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      status,
    }: {
      appointmentId: string;
      status: AppointmentStatus;
    }) => {
      const { error } = await supabase
        .from("crm_appointments")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", appointmentId);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      
      const messages: Record<AppointmentStatus, string> = {
        scheduled: "Agendamento confirmado",
        completed: "Agendamento concluído!",
        cancelled: "Agendamento cancelado",
        no_show: "Marcado como não compareceu",
      };
      toast.success(messages[status]);
    },
    onError: () => {
      toast.error("Erro ao atualizar agendamento");
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      scheduledAt,
    }: {
      appointmentId: string;
      scheduledAt: string;
    }) => {
      const { error } = await supabase
        .from("crm_appointments")
        .update({ scheduled_at: scheduledAt, updated_at: new Date().toISOString() })
        .eq("id", appointmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento remarcado");
    },
    onError: () => {
      toast.error("Erro ao remarcar agendamento");
    },
  });
}
