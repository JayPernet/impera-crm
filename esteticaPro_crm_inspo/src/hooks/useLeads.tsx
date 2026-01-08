import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { useSuperAdminOrg } from "@/contexts/SuperAdminOrgContext";
import { toast } from "sonner";

export type LeadStatus = "new" | "contacted" | "scheduled" | "attended" | "sold" | "lost";
export type Temperature = "cold" | "warm" | "hot";
export type SourceType = "ads" | "organic" | "indication" | "other";

export interface Lead {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source_type: SourceType | null;
  source_detail: string | null;
  status: LeadStatus | null;
  temperature: Temperature | null;
  assigned_to: string | null;
  marked_for_deletion: boolean | null;
  first_contact_at: string | null;
  last_interaction_at: string | null;
  current_proposal: string | null;
  created_at: string | null;
  updated_at: string | null;
  notes: string | null;
  loss_reason: string | null;
  loss_description: string | null;
  ai_active: boolean;
  // Joined data
  assigned_user?: { id: string; name: string } | null;
  lead_tags?: Array<{ tag: { id: string; name: string; color: string | null } }>;
  lead_procedures?: Array<{ procedure: { id: string; name: string } }>;
}

export function useLeads(filters?: {
  temperature?: Temperature[];
  source_type?: SourceType[];
  tag_ids?: string[];
  assigned_to?: string;
}) {
  const { crmUser, isSuperAdmin } = useCrmUser();
  const { selectedOrgIds } = useSuperAdminOrg();

  return useQuery({
    queryKey: ["leads", crmUser?.organization_id, isSuperAdmin, selectedOrgIds, filters],
    queryFn: async () => {
      let query = supabase
        .from("crm_leads")
        .select(`
          *,
          assigned_user:crm_users!crm_leads_assigned_to_fkey(id, name),
          lead_tags:crm_lead_tags(tag:crm_tags(id, name, color)),
          lead_procedures:crm_lead_procedures(procedure:crm_procedures(id, name))
        `)
        .eq("marked_for_deletion", false)
        .order("created_at", { ascending: false });

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

      if (filters?.temperature?.length) {
        query = query.in("temperature", filters.temperature);
      }
      if (filters?.source_type?.length) {
        query = query.in("source_type", filters.source_type);
      }
      if (filters?.assigned_to) {
        query = query.eq("assigned_to", filters.assigned_to);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by tags if needed (need to do this client-side due to nested structure)
      let leads = data as Lead[];
      if (filters?.tag_ids?.length) {
        leads = leads.filter((lead) =>
          lead.lead_tags?.some((lt) => filters.tag_ids!.includes(lt.tag.id))
        );
      }

      return leads;
    },
    enabled: isSuperAdmin ? selectedOrgIds.length > 0 : !!crmUser?.organization_id,
  });
}

export function useLeadById(leadId: string | null) {
  return useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      if (!leadId) return null;

      const { data, error } = await supabase
        .from("crm_leads")
        .select(`
          *,
          assigned_user:crm_users!crm_leads_assigned_to_fkey(id, name),
          lead_tags:crm_lead_tags(tag:crm_tags(id, name, color)),
          lead_procedures:crm_lead_procedures(procedure:crm_procedures(id, name))
        `)
        .eq("id", leadId)
        .maybeSingle();

      if (error) throw error;
      return data as Lead | null;
    },
    enabled: !!leadId,
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leadId,
      status,
      lossReason,
      lossDescription,
    }: {
      leadId: string;
      status: LeadStatus;
      lossReason?: string;
      lossDescription?: string;
    }) => {
      const { error } = await supabase
        .from("crm_leads")
        .update({
          status,
          loss_reason: lossReason || null,
          loss_description: lossDescription || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Status atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });
}

export function useUpdateLeadTemperature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leadId,
      temperature,
    }: {
      leadId: string;
      temperature: Temperature;
    }) => {
      const { error } = await supabase
        .from("crm_leads")
        .update({ temperature, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Temperatura atualizada");
    },
    onError: () => {
      toast.error("Erro ao atualizar temperatura");
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      leadId,
      data,
    }: {
      leadId: string;
      data: Partial<Lead>;
    }) => {
      const { error } = await supabase
        .from("crm_leads")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead"] });
      toast.success("Lead atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar lead");
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone?: string;
      email?: string;
      source_type?: SourceType;
      source_detail?: string;
      temperature?: Temperature;
      notes?: string;
      organization_id?: string; // Optional override for super_admin
    }) => {
      const orgId = data.organization_id || crmUser?.organization_id;
      if (!orgId) throw new Error("Sem organização");

      const { error, data: newLead } = await supabase
        .from("crm_leads")
        .insert({
          organization_id: orgId,
          name: data.name,
          phone: data.phone,
          email: data.email,
          source_type: data.source_type || "other",
          source_detail: data.source_detail,
          temperature: data.source_type === "indication" ? "hot" : (data.temperature || "cold"),
          notes: data.notes,
          status: "new",
        })
        .select()
        .single();

      if (error) throw error;
      return newLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead criado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar lead");
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, permanent }: { leadId: string; permanent: boolean }) => {
      if (permanent) {
        const { error } = await supabase
          .from("crm_leads")
          .delete()
          .eq("id", leadId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("crm_leads")
          .update({ marked_for_deletion: true, updated_at: new Date().toISOString() })
          .eq("id", leadId);
        if (error) throw error;
      }
    },
    onSuccess: (_, { permanent }) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success(permanent ? "Lead excluído" : "Lead marcado para exclusão");
    },
    onError: () => {
      toast.error("Erro ao excluir lead");
    },
  });
}
