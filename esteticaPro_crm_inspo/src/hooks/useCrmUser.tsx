import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

interface CrmUser {
  id: string;
  organization_id: string | null;
  email: string;
  name: string;
  active: boolean;
}

interface UserRole {
  role: "super_admin" | "admin" | "user" | "professional";
}

export function useCrmUser() {
  const { user } = useAuth();
  const [crmUser, setCrmUser] = useState<CrmUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCrmUser(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    const fetchCrmUser = async () => {
      try {
        // Fetch CRM user
        const { data: crmUserData } = await supabase
          .from("crm_users")
          .select("*")
          .eq("supabase_auth_id", user.id)
          .maybeSingle();

        setCrmUser(crmUserData);

        // Fetch user role
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        setUserRole(roleData as UserRole | null);
      } catch (error) {
        console.error("Error fetching CRM user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrmUser();
  }, [user]);

  return {
    crmUser,
    userRole,
    loading,
    organizationId: crmUser?.organization_id,
    isSuperAdmin: userRole?.role === "super_admin",
    isAdmin: userRole?.role === "admin" || userRole?.role === "super_admin",
    isUser: userRole?.role === "user",
    isProfessional: userRole?.role === "professional",
  };
}
