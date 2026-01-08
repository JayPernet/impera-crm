import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export type InteractionType = "whatsapp" | "call" | "note" | "status_change";

export interface Interaction {
  id: string;
  lead_id: string;
  user_id: string | null;
  type: InteractionType;
  content: string | null;
  created_at: string | null;
  user?: { id: string; name: string } | null;
}

export function useInteractions(leadId: string | null) {
  return useQuery({
    queryKey: ["interactions", leadId],
    queryFn: async () => {
      if (!leadId) return [];

      const { data, error } = await supabase
        .from("crm_interactions")
        .select(`
          *,
          user:crm_users(id, name)
        `)
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Interaction[];
    },
    enabled: !!leadId,
  });
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async ({
      leadId,
      type,
      content,
    }: {
      leadId: string;
      type: InteractionType;
      content: string;
    }) => {
      const { error } = await supabase
        .from("crm_interactions")
        .insert({
          lead_id: leadId,
          user_id: crmUser?.id,
          type,
          content,
        });

      if (error) throw error;
    },
    onSuccess: (_, { leadId }) => {
      queryClient.invalidateQueries({ queryKey: ["interactions", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead"] });
      toast.success("Interação registrada");
    },
    onError: () => {
      toast.error("Erro ao registrar interação");
    },
  });
}
