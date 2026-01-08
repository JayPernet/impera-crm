import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface InboxLead {
  id: string;
  name: string;
  phone: string | null;
  last_interaction_at: string | null;
  status: string | null;
  temperature: string | null;
  type?: 'lead' | 'client';
}

export interface ChatMessage {
  id: string;
  lead_id: string;
  type: string;
  content: string | null;
  created_at: string | null;
  is_inbound: boolean | null;
  read: boolean | null;
  media_url: string | null;
  media_type?: 'text' | 'image' | 'audio' | 'video' | 'document' | null;
  file_name?: string | null;
  user_id: string | null;
  user?: { id: string; name: string } | null;
}

export function useInboxLeads() {
  const { organizationId } = useCrmUser();

  return useQuery({
    queryKey: ["inbox-leads", organizationId],
    queryFn: async () => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("crm_leads")
        .select("id, name, phone, last_interaction_at, status, temperature")
        .eq("organization_id", organizationId)
        .order("last_interaction_at", { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as InboxLead[];
    },
    enabled: !!organizationId,
  });
}

export function useLeadMessages(leadId: string | null) {
  return useQuery({
    queryKey: ["lead-messages", leadId],
    queryFn: async () => {
      if (!leadId) return [];

      const { data, error } = await supabase
        .from("crm_interactions")
        .select(`
          *,
          user:crm_users(id, name)
        `)
        .eq("lead_id", leadId)
        .eq("type", "whatsapp")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!leadId,
  });
}

export function useUnreadCount() {
  const { organizationId } = useCrmUser();

  return useQuery({
    queryKey: ["unread-count", organizationId],
    queryFn: async () => {
      if (!organizationId) return 0;

      // Get all leads for the organization
      const { data: leads } = await supabase
        .from("crm_leads")
        .select("id")
        .eq("organization_id", organizationId);

      if (!leads || leads.length === 0) return 0;

      const leadIds = leads.map((l) => l.id);

      const { count, error } = await supabase
        .from("crm_interactions")
        .select("*", { count: "exact", head: true })
        .in("lead_id", leadIds)
        .eq("type", "whatsapp")
        .eq("read", false);

      if (error) return 0;
      return count || 0;
    },
    enabled: !!organizationId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useUnreadCountByLead(leadId: string | null) {
  return useQuery({
    queryKey: ["unread-count-lead", leadId],
    queryFn: async () => {
      if (!leadId) return 0;

      const { count, error } = await supabase
        .from("crm_interactions")
        .select("*", { count: "exact", head: true })
        .eq("lead_id", leadId)
        .eq("type", "whatsapp")
        .eq("read", false);

      if (error) return 0;
      return count || 0;
    },
    enabled: !!leadId,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leadId: string) => {
      const { error } = await supabase
        .from("crm_interactions")
        .update({ read: true })
        .eq("lead_id", leadId)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: (_, leadId) => {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count-lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead-messages", leadId] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { crmUser, organizationId } = useCrmUser();

  return useMutation({
    mutationFn: async ({
      leadId,
      leadName,
      phone,
      message,
      zapiInstanceId,
      zapiToken,
      mediaUrl,
      mediaType,
      fileName,
    }: {
      leadId: string;
      leadName: string;
      phone: string;
      message: string;
      zapiInstanceId: string;
      zapiToken: string;
      mediaUrl?: string;
      mediaType?: string;
      fileName?: string;
    }) => {
      const WEBHOOK_URL = import.meta.env.VITE_N8N_WHATSAPP_WEBHOOK;

      if (!WEBHOOK_URL) {
        throw new Error("Webhook do WhatsApp não configurado.");
      }

      // Format phone
      const digits = phone.replace(/\D/g, "");
      const formattedPhone = digits.startsWith("55") ? `+${digits}` : `+55${digits}`;

      const payload = {
        phone: formattedPhone,
        message,
        zapi_instance_id: zapiInstanceId,
        zapi_token: zapiToken,
        media_url: mediaUrl,
        media_type: mediaType,
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem");
      }

      // Register interaction
      const { data, error } = await supabase.from("crm_interactions").insert({
        lead_id: leadId,
        type: "whatsapp",
        content: message,
        user_id: crmUser?.id,
        is_inbound: false,
        read: true,
        media_url: mediaUrl,
        media_type: mediaType,
        file_name: fileName,
      }).select().single();

      if (error) throw error;

      return { leadId, message: data };
    },
    onMutate: async ({ leadId, message, mediaUrl, mediaType, fileName }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["lead-messages", leadId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(["lead-messages", leadId]);

      // Optimistically update to the new value
      const tempId = `temp-${Date.now()}`;
      const newMessage: ChatMessage = {
        id: tempId,
        lead_id: leadId,
        type: "whatsapp",
        content: message,
        created_at: new Date().toISOString(),
        is_inbound: false,
        read: true,
        media_url: mediaUrl || null,
        media_type: (mediaType as any) || null,
        file_name: fileName || null,
        user_id: crmUser?.id || null,
        user: crmUser ? { id: crmUser.id, name: crmUser.name } : null
      };

      queryClient.setQueryData<ChatMessage[]>(["lead-messages", leadId], (old) => {
        return [...(old || []), newMessage];
      });

      return { previousMessages, tempId };
    },
    onSuccess: (data, { leadId }, context) => {
      // Replace temp message with real one in cache
      queryClient.setQueryData<ChatMessage[]>(["lead-messages", leadId], (old) => {
        return (old || []).map(msg =>
          msg.id === context?.tempId ? (data.message as ChatMessage) : msg
        );
      });

      queryClient.invalidateQueries({ queryKey: ["inbox-leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      // toast.success("Mensagem enviada!"); // Toast optional for chat
    },
    onError: (err, { leadId }, context) => {
      // Rollback
      queryClient.setQueryData(["lead-messages", leadId], context?.previousMessages);
      toast.error("Erro ao enviar mensagem");
    },
  });
}

export function useSearchContacts() {
  const { organizationId } = useCrmUser();

  return useMutation({
    mutationFn: async (query: string) => {
      if (!organizationId || !query || query.length < 2) return [];

      const searchQuery = `%${query}%`;

      // Search leads
      const { data: leads, error: leadsError } = await supabase
        .from("crm_leads")
        .select("id, name, phone, status, temperature")
        .eq("organization_id", organizationId)
        .or(`name.ilike.${searchQuery},phone.ilike.${searchQuery}`)
        .eq("marked_for_deletion", false)
        .limit(10);

      if (leadsError) throw leadsError;

      // Search clients
      const { data: clients, error: clientsError } = await supabase
        .from("crm_clients")
        .select("id, name, phone, lead_id")
        .eq("organization_id", organizationId)
        .or(`name.ilike.${searchQuery},phone.ilike.${searchQuery}`)
        .limit(10);

      if (clientsError) throw clientsError;

      const results: InboxLead[] = [
        ...(leads || []).map(l => ({ ...l, last_interaction_at: null, type: 'lead' as const })),
        ...(clients || []).map(c => ({
          id: c.lead_id || c.id, // Prefer lead_id for chat, but fallback to client_id
          name: c.name,
          phone: c.phone,
          last_interaction_at: null,
          status: 'client',
          temperature: 'hot',
          type: 'client' as const
        })),
      ];

      // Remove duplicates by ID (if client and lead both found)
      return Array.from(new Map(results.map(item => [item.id, item])).values());
    }
  });
}
