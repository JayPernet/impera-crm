import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface ProfessionalProcedure {
  id: string;
  professional_id: string;
  procedure_id: string;
  created_at: string | null;
  procedure?: {
    id: string;
    name: string;
    suggested_price: number | null;
  };
  professional?: {
    id: string;
    name: string;
    email: string;
  };
}

export function useProfessionalProcedures(professionalId: string | null) {
  return useQuery({
    queryKey: ["professional-procedures", professionalId],
    queryFn: async () => {
      if (!professionalId) return [];

      const { data, error } = await supabase
        .from("crm_professional_procedures")
        .select(`
          *,
          procedure:crm_procedures(id, name, suggested_price)
        `)
        .eq("professional_id", professionalId);

      if (error) throw error;
      return data as ProfessionalProcedure[];
    },
    enabled: !!professionalId,
  });
}

export function useProcedureProfessionals(procedureId: string | null) {
  return useQuery({
    queryKey: ["procedure-professionals", procedureId],
    queryFn: async () => {
      if (!procedureId) return [];

      const { data, error } = await supabase
        .from("crm_professional_procedures")
        .select(`
          *,
          professional:crm_users(id, name, email)
        `)
        .eq("procedure_id", procedureId);

      if (error) throw error;
      return data as ProfessionalProcedure[];
    },
    enabled: !!procedureId,
  });
}

export function useAllProfessionalProcedures() {
  const { crmUser } = useCrmUser();

  return useQuery({
    queryKey: ["all-professional-procedures", crmUser?.organization_id],
    queryFn: async () => {
      if (!crmUser?.organization_id) return [];

      const { data, error } = await supabase
        .from("crm_professional_procedures")
        .select(`
          *,
          procedure:crm_procedures(id, name, suggested_price),
          professional:crm_users(id, name, email)
        `);

      if (error) throw error;
      return data as ProfessionalProcedure[];
    },
    enabled: !!crmUser?.organization_id,
  });
}

export function useAddProfessionalProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ professionalId, procedureId }: { professionalId: string; procedureId: string }) => {
      const { error } = await supabase
        .from("crm_professional_procedures")
        .insert({ professional_id: professionalId, procedure_id: procedureId });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Procedimento já associado a este profissional");
        }
        throw error;
      }
    },
    onSuccess: (_, { professionalId, procedureId }) => {
      queryClient.invalidateQueries({ queryKey: ["professional-procedures", professionalId] });
      queryClient.invalidateQueries({ queryKey: ["procedure-professionals", procedureId] });
      queryClient.invalidateQueries({ queryKey: ["all-professional-procedures"] });
      toast.success("Procedimento associado ao profissional");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao associar procedimento");
    },
  });
}

export function useRemoveProfessionalProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ professionalId, procedureId }: { professionalId: string; procedureId: string }) => {
      const { error } = await supabase
        .from("crm_professional_procedures")
        .delete()
        .eq("professional_id", professionalId)
        .eq("procedure_id", procedureId);

      if (error) throw error;
    },
    onSuccess: (_, { professionalId, procedureId }) => {
      queryClient.invalidateQueries({ queryKey: ["professional-procedures", professionalId] });
      queryClient.invalidateQueries({ queryKey: ["procedure-professionals", procedureId] });
      queryClient.invalidateQueries({ queryKey: ["all-professional-procedures"] });
      toast.success("Procedimento removido do profissional");
    },
    onError: () => {
      toast.error("Erro ao remover procedimento");
    },
  });
}
