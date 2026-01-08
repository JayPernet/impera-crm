import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface Tag {
  id: string;
  organization_id: string;
  name: string;
  procedure_name: string | null;
  color: string | null;
  marked_for_deletion: boolean | null;
  active: boolean | null;
  created_at: string | null;
  lead_count?: number;
}

export function useTags(showMarkedForDeletion = false) {
  const { crmUser } = useCrmUser();

  return useQuery({
    queryKey: ["tags", crmUser?.organization_id, showMarkedForDeletion],
    queryFn: async () => {
      if (!crmUser?.organization_id) return [];

      let query = supabase
        .from("crm_tags")
        .select("*, crm_lead_tags(count)")
        .eq("organization_id", crmUser.organization_id)
        .eq("active", true)
        .order("name");

      if (!showMarkedForDeletion) {
        query = query.eq("marked_for_deletion", false);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((tag: any) => ({
        ...tag,
        lead_count: tag.crm_lead_tags?.[0]?.count || 0,
      })) as Tag[];
    },
    enabled: !!crmUser?.organization_id,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      procedure_name?: string;
      color?: string;
    }) => {
      if (!crmUser?.organization_id) throw new Error("Sem organização");

      const { error, data: newTag } = await supabase
        .from("crm_tags")
        .insert({
          organization_id: crmUser.organization_id,
          name: data.name,
          procedure_name: data.procedure_name || data.name,
          color: data.color || "#D4AF37",
          active: true,
          marked_for_deletion: false,
        })
        .select()
        .single();

      if (error) throw error;
      return newTag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar tag");
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      data,
    }: {
      tagId: string;
      data: Partial<Tag>;
    }) => {
      const { error } = await supabase
        .from("crm_tags")
        .update(data)
        .eq("id", tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag atualizada");
    },
    onError: () => {
      toast.error("Erro ao atualizar tag");
    },
  });
}

export function useMarkTagForDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from("crm_tags")
        .update({ marked_for_deletion: true })
        .eq("id", tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag marcada para exclusão");
    },
    onError: () => {
      toast.error("Erro ao marcar tag");
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      // First delete lead_tags associations
      await supabase
        .from("crm_lead_tags")
        .delete()
        .eq("tag_id", tagId);

      // Then delete the tag
      const { error } = await supabase
        .from("crm_tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag excluída permanentemente");
    },
    onError: () => {
      toast.error("Erro ao excluir tag");
    },
  });
}
