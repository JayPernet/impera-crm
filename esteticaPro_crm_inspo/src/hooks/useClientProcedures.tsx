import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClientProcedure {
  id: string;
  client_id: string;
  procedure_id: string;
  created_at: string | null;
  procedure?: {
    id: string;
    name: string;
    suggested_price: number | null;
  };
}

export function useClientProcedures(clientId: string | null) {
  return useQuery({
    queryKey: ["client-procedures", clientId],
    queryFn: async () => {
      if (!clientId) return [];

      const { data, error } = await supabase
        .from("crm_client_procedures")
        .select(`
          *,
          procedure:crm_procedures(id, name, suggested_price)
        `)
        .eq("client_id", clientId);

      if (error) throw error;
      return data as ClientProcedure[];
    },
    enabled: !!clientId,
  });
}

export function useAddClientProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, procedureId }: { clientId: string; procedureId: string }) => {
      const { error } = await supabase
        .from("crm_client_procedures")
        .insert({ client_id: clientId, procedure_id: procedureId });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Procedimento já associado a este cliente");
        }
        throw error;
      }
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["client-procedures", clientId] });
      toast.success("Procedimento associado ao cliente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao associar procedimento");
    },
  });
}

export function useRemoveClientProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, procedureId }: { clientId: string; procedureId: string }) => {
      const { error } = await supabase
        .from("crm_client_procedures")
        .delete()
        .eq("client_id", clientId)
        .eq("procedure_id", procedureId);

      if (error) throw error;
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["client-procedures", clientId] });
      toast.success("Procedimento removido do cliente");
    },
    onError: () => {
      toast.error("Erro ao remover procedimento");
    },
  });
}
