import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { useSuperAdminOrg } from "@/contexts/SuperAdminOrgContext";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed";
  task_type: "manual" | "auto_return" | "system";
  lead_id: string | null;
  client_id: string | null;
  user_id: string;
  organization_id: string;
  created_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  lead?: { name: string } | null;
  client?: { name: string } | null;
  creator?: { name: string } | null;
  assignee?: { name: string } | null;
}

export function useTasks() {
  const { crmUser, isSuperAdmin, isAdmin } = useCrmUser();
  const { selectedOrgIds } = useSuperAdminOrg();

  return useQuery({
    queryKey: ["tasks", crmUser?.id, isSuperAdmin, isAdmin, selectedOrgIds],
    queryFn: async () => {
      if (!crmUser?.id) return [];

      let query = supabase
        .from("crm_tasks")
        .select(`
          *,
          lead:crm_leads(name),
          client:crm_clients(name),
          creator:crm_users!crm_tasks_created_by_fkey(name),
          assignee:crm_users!crm_tasks_user_id_fkey(name)
        `);

      // Super Admin: show tasks from selected organizations
      if (isSuperAdmin && selectedOrgIds.length > 0) {
        query = query.in("organization_id", selectedOrgIds);
      }
      // Admin: show all tasks from their organization
      else if (isAdmin && crmUser.organization_id) {
        query = query.eq("organization_id", crmUser.organization_id);
      }
      // User: show only their own tasks
      else {
        query = query.eq("user_id", crmUser.id);
      }

      const { data, error } = await query.order("due_date", { ascending: true });

      if (error) throw error;
      
      // Sort to prioritize doctor requests (created_by not null) at the top
      const sortedData = (data || []).sort((a, b) => {
        // First: doctor requests (created_by not null) come first
        if (a.created_by && !b.created_by) return -1;
        if (!a.created_by && b.created_by) return 1;
        // Then sort by due_date (ascending)
        if (a.due_date && b.due_date) {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (a.due_date) return -1;
        if (b.due_date) return 1;
        return 0;
      });
      
      return sortedData as Task[];
    },
    enabled: !!crmUser?.id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      due_date?: string;
      priority: "low" | "medium" | "high";
      lead_id?: string;
      client_id?: string;
      organization_id?: string; // Optional override for super_admin
      user_id?: string; // Optional override for super_admin
    }) => {
      const orgId = task.organization_id || crmUser?.organization_id;
      const userId = task.user_id || crmUser?.id;
      
      if (!userId || !orgId) {
        throw new Error("Usuário ou organização não encontrada");
      }

      const { error } = await supabase.from("crm_tasks").insert({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        lead_id: task.lead_id,
        client_id: task.client_id,
        user_id: userId,
        organization_id: orgId,
        task_type: "manual",
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar tarefa");
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const { error } = await supabase
        .from("crm_tasks")
        .update({
          status: completed ? "completed" : "pending",
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar tarefa");
    },
  });
}

export function useSoftDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("crm_tasks")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa movida para a lixeira!");
    },
    onError: () => {
      toast.error("Erro ao excluir tarefa");
    },
  });
}
