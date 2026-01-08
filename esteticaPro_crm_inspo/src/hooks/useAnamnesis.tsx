import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface Anamnesis {
  id: string;
  client_id: string;
  organization_id: string;
  // Grupo A
  main_complaint: string | null;
  expectation: string | null;
  history_current_problem: string | null;
  // Grupo B
  allergies: string | null;
  medications_in_use: string | null;
  chronic_diseases: string[] | null;
  surgeries_implants: string | null;
  is_pregnant_or_breastfeeding: boolean | null;
  // Grupo C
  lifestyle_habits: string[] | null;
  sun_exposure: string | null;
  water_intake: string | null;
  sleep_quality: string | null;
  intestinal_function: string | null;
  // Grupo D
  previous_procedures: string | null;
  adverse_reactions: string | null;
  home_care_routine: string | null;
  // Grupo E
  skin_phototype: string | null;
  skin_type: string | null;
  professional_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Termo de responsabilidade
  disclaimer_accepted: boolean | null;
  disclaimer_accepted_at: string | null;
}

export interface AnamnesisHistory {
  id: string;
  original_anamnesis_id: string;
  data_snapshot: Anamnesis;
  archived_at: string;
  created_by: string | null;
  marked_for_deletion: boolean;
  created_by_name?: string;
}

export function useAnamnesis(clientId: string | null) {
  const { crmUser } = useCrmUser();

  return useQuery({
    queryKey: ["anamnesis", clientId],
    queryFn: async () => {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from("crm_anamnesis")
        .select("*")
        .eq("client_id", clientId)
        .maybeSingle();

      if (error) throw error;
      return data as Anamnesis | null;
    },
    enabled: !!clientId,
  });
}

// Fetch last anamnesis from organization (for copy feature)
export function useLastOrganizationAnamnesis(excludeClientId: string | null) {
  const { crmUser } = useCrmUser();

  return useQuery({
    queryKey: ["last-anamnesis", crmUser?.organization_id, excludeClientId],
    queryFn: async () => {
      if (!crmUser?.organization_id) return null;

      let query = supabase
        .from("crm_anamnesis")
        .select("*")
        .eq("organization_id", crmUser.organization_id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (excludeClientId) {
        query = query.neq("client_id", excludeClientId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data as Anamnesis | null;
    },
    enabled: !!crmUser?.organization_id,
  });
}

export function useSaveAnamnesis() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async ({
      clientId,
      data,
    }: {
      clientId: string;
      data: Partial<Anamnesis>;
    }) => {
      if (!crmUser?.organization_id) throw new Error("Sem organização");

      // Check if anamnesis already exists
      const { data: existing } = await supabase
        .from("crm_anamnesis")
        .select("id")
        .eq("client_id", clientId)
        .maybeSingle();

      if (existing) {
        // If expired (or even if not, depends on policy, but user said "Vencida")
        // User's specific rule: "Ao salvar uma Anamnese Vencida: ... Salve uma cópia ... antes de atualizar"

        const { data: currentData } = await supabase
          .from("crm_anamnesis")
          .select("*")
          .eq("id", existing.id)
          .single();

        if (currentData) {
          const updatedAt = currentData.updated_at ? new Date(currentData.updated_at) : new Date(0);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          if (updatedAt < sixMonthsAgo) {
            // Archive current data to history before updating
            await (supabase.from("crm_anamnesis_history" as any).insert({
              original_anamnesis_id: existing.id,
              data_snapshot: currentData,
              created_by: crmUser.id,
            }) as any);
          }
        }

        // Update
        const { error } = await supabase
          .from("crm_anamnesis")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("crm_anamnesis").insert({
          client_id: clientId,
          organization_id: crmUser.organization_id,
          ...data,
        });

        if (error) throw error;
      }
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["anamnesis", clientId] });
      queryClient.invalidateQueries({ queryKey: ["anamnesis-history", clientId] });
      queryClient.invalidateQueries({ queryKey: ["last-anamnesis"] });
      toast.success("Anamnese salva com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao salvar anamnese");
    },
  });
}

export function useAnamnesisHistory(anamnesisId: string | undefined) {
  return useQuery({
    queryKey: ["anamnesis-history", anamnesisId],
    queryFn: async () => {
      if (!anamnesisId) return [];

      const { data, error } = await (supabase
        .from("crm_anamnesis_history" as any)
        .select(`
          *,
          created_by_user:crm_users!crm_anamnesis_history_created_by_fkey(name)
        `)
        .eq("original_anamnesis_id", anamnesisId)
        .eq("marked_for_deletion", false)
        .order("archived_at", { ascending: false }) as any);

      if (error) throw error;

      return (data || []).map((h: any) => ({
        ...h,
        created_by_name: h.created_by_user?.name || "Desconhecido"
      })) as AnamnesisHistory[];
    },
    enabled: !!anamnesisId,
  });
}

export function useDeleteAnamnesisHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ historyId, anamnesisId }: { historyId: string; anamnesisId: string }) => {
      // Guardian Clause: Prevent deletion if it's the only one?
      // User: "IMPEDIR a exclusão se aquela for a ÚNICA anamnese existente para aquele cliente"
      // Wait, there is always the 'current' one in crm_anamnesis.
      // So history records are never the "only" one unless the current one is also considered.
      // But typically history is extra.

      const { data: currentAnamnesis } = await supabase
        .from("crm_anamnesis")
        .select("id")
        .eq("id", anamnesisId)
        .single();

      if (!currentAnamnesis) {
        throw new Error("Registro principal não encontrado. Impossível deletar histórico.");
      }

      const { data: otherHistory } = await (supabase
        .from("crm_anamnesis_history" as any)
        .select("id")
        .eq("original_anamnesis_id", anamnesisId)
        .eq("marked_for_deletion", false)
        .neq("id", historyId) as any);

      // If no other history AND we delete this, user only has the current one.
      // That's fine, they still have "one".

      const { error } = await (supabase
        .from("crm_anamnesis_history" as any)
        .update({ marked_for_deletion: true })
        .eq("id", historyId) as any);

      if (error) throw error;
    },
    onSuccess: (_, { anamnesisId }) => {
      queryClient.invalidateQueries({ queryKey: ["anamnesis-history", anamnesisId] });
      toast.success("Histórico removido");
    },
  });
}
