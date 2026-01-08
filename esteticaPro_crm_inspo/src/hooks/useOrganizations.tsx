import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";

export interface Organization {
  id: string;
  name: string;
  active: boolean | null;
}

export function useOrganizations() {
  const { isSuperAdmin } = useCrmUser();

  return useQuery({
    queryKey: ["organizations-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("id, name, active")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      return data as Organization[];
    },
    enabled: isSuperAdmin,
  });
}
