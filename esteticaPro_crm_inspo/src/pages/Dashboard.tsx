import { useCrmUser } from "@/hooks/useCrmUser";
import { LeadsHojeCard } from "@/components/dashboard/LeadsHojeCard";
import { AgendamentosHojeCard } from "@/components/dashboard/AgendamentosHojeCard";
import { TarefasPendentesCard } from "@/components/dashboard/TarefasPendentesCard";
import { RetornosProximosCard } from "@/components/dashboard/RetornosProximosCard";
import { SpeedToLeadWidget } from "@/components/dashboard/SpeedToLeadWidget";
import { ProcedimentosMaisSolicitadosCard } from "@/components/dashboard/ProcedimentosMaisSolicitadosCard";
import { ProcedimentosMaisRealizadosCard } from "@/components/dashboard/ProcedimentosMaisRealizadosCard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { ProfessionalDashboard } from "@/components/dashboard/ProfessionalDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { crmUser, organizationId, loading, isAdmin, isSuperAdmin, isProfessional } = useCrmUser();

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[280px]" />
          ))}
        </div>
        <Skeleton className="h-20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[240px]" />
          <Skeleton className="h-[240px]" />
        </div>
      </div>
    );
  }

  // Show Super Admin Dashboard with clinic filter
  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  // Show Admin Dashboard for admin role
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Show Professional Dashboard for professional role
  if (isProfessional) {
    return <ProfessionalDashboard />;
  }

  // User Dashboard (secretary role)
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {crmUser?.name || "Usuário"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está o resumo do seu dia
          </p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeadsHojeCard organizationId={organizationId ?? null} />
        <AgendamentosHojeCard organizationId={organizationId ?? null} />
        <TarefasPendentesCard crmUserId={crmUser?.id ?? null} />
        <RetornosProximosCard organizationId={organizationId ?? null} />
      </div>

      {/* Speed to Lead Widget */}
      <SpeedToLeadWidget organizationId={organizationId ?? null} />

      {/* Rankings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProcedimentosMaisSolicitadosCard organizationId={organizationId ?? null} />
        <ProcedimentosMaisRealizadosCard organizationId={organizationId ?? null} />
      </div>
    </div>
  );
}
