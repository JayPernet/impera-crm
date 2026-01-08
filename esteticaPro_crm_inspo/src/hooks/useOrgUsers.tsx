import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface OrgUser {
  id: string;
  supabase_auth_id: string;
  organization_id: string | null;
  email: string;
  name: string;
  gender: "male" | "female" | "other" | null;
  specialties: string[] | null;
  working_days: string[] | null;
  active: boolean | null;
  created_at: string | null;
  role?: string;
}

export function useOrgUsers() {
  const { crmUser, isSuperAdmin } = useCrmUser();

  return useQuery({
    queryKey: ["org-users", crmUser?.organization_id],
    queryFn: async () => {
      if (!crmUser?.organization_id && !isSuperAdmin) return [];

      let query = supabase
        .from("crm_users")
        .select("*")
        .order("name");

      if (!isSuperAdmin && crmUser?.organization_id) {
        query = query.eq("organization_id", crmUser.organization_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch roles for each user
      const usersWithRoles = await Promise.all(
        (data || []).map(async (user) => {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", user.supabase_auth_id)
            .maybeSingle();

          return {
            ...user,
            role: roleData?.role || "user",
          } as OrgUser;
        })
      );

      return usersWithRoles;
    },
    enabled: !!(crmUser?.organization_id || isSuperAdmin),
  });
}

export function useCreateOrgUser() {
  const queryClient = useQueryClient();
  const { crmUser } = useCrmUser();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      gender?: "male" | "female" | "other";
      specialties?: string[];
      working_days?: string[];
      role?: "user" | "admin" | "professional";
    }) => {
      if (!crmUser?.organization_id) throw new Error("Sem organização");

      const { data: result, error } = await supabase.functions.invoke("create-user", {
        body: {
          ...data,
          organization_id: crmUser.organization_id,
          role: data.role || "professional",
        },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
      toast.success("Usuário criado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar usuário");
    },
  });
}

export function useDeleteOrgUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data: result, error } = await supabase.functions.invoke("delete-user", {
        body: { user_id: userId },
      });

      if (error) throw error;
      if (result.error) throw new Error(result.error);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
      toast.success("Usuário removido com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao remover usuário");
    },
  });
}

export function useUpdateOrgUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<Pick<OrgUser, "name" | "gender" | "specialties" | "working_days" | "active">>;
    }) => {
      const { error } = await supabase
        .from("crm_users")
        .update(data)
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-users"] });
      toast.success("Usuário atualizado");
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário");
    },
  });
}
