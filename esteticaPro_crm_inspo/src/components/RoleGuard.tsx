import { Navigate } from "react-router-dom";
import { useCrmUser } from "@/hooks/useCrmUser";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: ("super_admin" | "admin" | "user" | "professional")[];
  redirectTo?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles = ["super_admin", "admin", "user"], 
  redirectTo = "/dashboard" 
}: RoleGuardProps) {
  const { userRole, loading } = useCrmUser();

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const currentRole = userRole?.role || "user";
  
  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
