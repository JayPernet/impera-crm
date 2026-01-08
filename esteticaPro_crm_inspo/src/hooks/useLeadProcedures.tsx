import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LeadProcedure {
  id: string;
  lead_id: string;
  procedure_id: string;
  created_at: string | null;
  procedure?: {
    id: string;
    name: string;
    suggested_price: number | null;
  };
}

export function useLeadProcedures(leadId: string | null) {
  return useQuery({
    queryKey: ["lead-procedures", leadId],
    queryFn: async () => {
      if (!leadId) return [];

      const { data, error } = await supabase
        .from("crm_lead_procedures")
        .select(`
          *,
          procedure:crm_procedures(id, name, suggested_price)
        `)
        .eq("lead_id", leadId);

      if (error) throw error;
      return data as LeadProcedure[];
    },
    enabled: !!leadId,
  });
}

export function useAddLeadProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, procedureId }: { leadId: string; procedureId: string }) => {
      const { error } = await supabase
        .from("crm_lead_procedures")
        .insert({ lead_id: leadId, procedure_id: procedureId });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Procedimento já associado a este lead");
        }
        throw error;
      }
    },
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["lead-procedures", leadId] });
      toast.success("Procedimento associado ao lead");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao associar procedimento");
    },
  });
}

export function useRemoveLeadProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, procedureId }: { leadId: string; procedureId: string }) => {
      const { error } = await supabase
        .from("crm_lead_procedures")
        .delete()
        .eq("lead_id", leadId)
        .eq("procedure_id", procedureId);

      if (error) throw error;
    },
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["lead-procedures", leadId] });
      toast.success("Procedimento removido do lead");
    },
    onError: () => {
      toast.error("Erro ao remover procedimento");
    },
  });
}
