import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { useEffect } from "react";

export interface Notification {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  message: string | null;
  read: boolean;
  type: "info" | "success" | "warning";
  link_url: string | null;
  created_at: string;
}

export function useNotifications() {
  const { crmUser } = useCrmUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", crmUser?.id],
    queryFn: async () => {
      if (!crmUser?.id) return [];

      const { data, error } = await supabase
        .from("crm_notifications")
        .select("*")
        .eq("user_id", crmUser.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as Notification[];
    },
    enabled: !!crmUser?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!crmUser?.id) return;

    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "crm_notifications",
          filter: `user_id=eq.${crmUser.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [crmUser?.id, queryClient]);

  const unreadCount = query.data?.filter((n) => !n.read).length || 0;

  return {
    notifications: query.data || [],
    unreadCount,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("crm_notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async () => {
      if (!crmUser?.id) return;

      const { error } = await supabase
        .from("crm_notifications")
        .update({ read: true })
        .eq("user_id", crmUser.id)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
