import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";

export interface Professional {
  id: string;
  name: string;
  email: string;
  active: boolean | null;
}

export function useProfessionals() {
  const { crmUser } = useCrmUser();

  return useQuery({
    queryKey: ["professionals", crmUser?.organization_id],
    queryFn: async () => {
      if (!crmUser?.organization_id) return [];

      const { data, error } = await supabase
        .from("crm_users")
        .select("id, name, email, active")
        .eq("organization_id", crmUser.organization_id)
        .eq("active", true)
        .order("name");

      if (error) throw error;

      return data as Professional[];
    },
    enabled: !!crmUser?.organization_id,
  });
}
