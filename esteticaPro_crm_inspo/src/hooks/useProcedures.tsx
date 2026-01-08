import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface Procedure {
  id: string;
  organization_id: string;
  name: string;
  suggested_price: number | null;
  return_days: number | null;
  active: boolean | null;
  created_at: string | null;
}

export function useProcedures(showInactive = false) {
  const { crmUser } = useCrmUser();

  return useQuery({
    queryKey: ["procedures", crmUser?.organization_id, showInactive],
    queryFn: async () => {
      if (!crmUser?.organization_id) return [];

      let query = supabase
        .from("crm_procedures")
        .select("*")
        .eq("organization_id", crmUser.organization_id)
        .order("name");

      if (!showInactive) {
        query = query.eq("active", true);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as Procedure[];
    },
    enabled: !!crmUser?.organization_id,
  });
}

export function useCreateProcedure() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      suggested_price?: number;
      return_days?: number;
      active?: boolean;
    }) => {
      if (!crmUser?.organization_id) throw new Error("Sem organização");

      const { error, data: newProcedure } = await supabase
        .from("crm_procedures")
        .insert({
          organization_id: crmUser.organization_id,
          name: data.name,
          suggested_price: data.suggested_price || 0,
          return_days: data.return_days || 0,
          active: data.active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return newProcedure;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedimento criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar procedimento");
    },
  });
}

export function useUpdateProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      procedureId,
      data,
    }: {
      procedureId: string;
      data: Partial<Procedure>;
    }) => {
      const { error } = await supabase
        .from("crm_procedures")
        .update(data)
        .eq("id", procedureId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success("Procedimento atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar procedimento");
    },
  });
}

export function useToggleProcedureActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      procedureId,
      active,
    }: {
      procedureId: string;
      active: boolean;
    }) => {
      const { error } = await supabase
        .from("crm_procedures")
        .update({ active })
        .eq("id", procedureId);

      if (error) throw error;
    },
    onSuccess: (_, { active }) => {
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      toast.success(active ? "Procedimento ativado" : "Procedimento desativado");
    },
    onError: () => {
      toast.error("Erro ao alterar status");
    },
  });
}
