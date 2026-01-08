import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { useSuperAdminOrg } from "@/contexts/SuperAdminOrgContext";
import { toast } from "sonner";

export interface Client {
  id: string;
  organization_id: string;
  lead_id: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  converted_at: string | null;
  last_appointment_at: string | null;
  next_return_at: string | null;
  total_appointments: number | null;
  estimated_revenue: number | null;
  notes: string | null;
  created_at: string | null;
  active: boolean;
  // Joined data
  lead?: { id: string; name: string } | null;
  nps_token?: string | null;
}

export function useClients(filters?: {
  conversionStartDate?: string;
  conversionEndDate?: string;
  lastAppointmentStartDate?: string;
  lastAppointmentEndDate?: string;
  returnDays?: number;
  procedureIds?: string[];
}) {
  const { crmUser, isSuperAdmin } = useCrmUser();
  const { selectedOrgIds } = useSuperAdminOrg();

  return useQuery({
    queryKey: ["clients", crmUser?.organization_id, isSuperAdmin, selectedOrgIds, filters],
    queryFn: async () => {
      let query = supabase
        .from("crm_clients")
        .select(`
          *,
          lead:crm_leads(id, name)
        `)
        .order("last_appointment_at", { ascending: false });

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

      if (filters?.conversionStartDate) {
        query = query.gte("converted_at", filters.conversionStartDate);
      }
      if (filters?.conversionEndDate) {
        query = query.lte("converted_at", filters.conversionEndDate);
      }
      if (filters?.lastAppointmentStartDate) {
        query = query.gte("last_appointment_at", filters.lastAppointmentStartDate);
      }
      if (filters?.lastAppointmentEndDate) {
        query = query.lte("last_appointment_at", filters.lastAppointmentEndDate);
      }
      if (filters?.returnDays) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + filters.returnDays);
        query = query
          .gte("next_return_at", new Date().toISOString())
          .lte("next_return_at", futureDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as Client[];
    },
    enabled: isSuperAdmin ? selectedOrgIds.length > 0 : !!crmUser?.organization_id,
  });
}

export function useClientById(clientId: string | null) {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from("crm_clients")
        .select(`
          *,
          lead:crm_leads(id, name)
        `)
        .eq("id", clientId)
        .maybeSingle();

      if (error) throw error;
      return data as Client | null;
    },
    enabled: !!clientId,
  });
}

export function useClientAppointments(clientId: string | null) {
  return useQuery({
    queryKey: ["client-appointments", clientId],
    queryFn: async () => {
      if (!clientId) return [];

      const { data, error } = await supabase
        .from("crm_appointments")
        .select(`
          *,
          procedure:crm_procedures(id, name),
          professional:crm_users(id, name)
        `)
        .eq("client_id", clientId)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clientId,
      data,
    }: {
      clientId: string;
      data: Partial<Client>;
    }) => {
      const { error } = await supabase
        .from("crm_clients")
        .update(data)
        .eq("id", clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client"] });
      toast.success("Cliente atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar cliente");
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase.rpc("delete_client", {
        p_client_id: clientId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client"] });
      toast.success("Cliente excluído");
    },
    onError: () => {
      toast.error("Erro ao excluir cliente");
    },
  });
}
