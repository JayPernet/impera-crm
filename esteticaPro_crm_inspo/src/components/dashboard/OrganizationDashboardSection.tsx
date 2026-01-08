import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DollarSign, Target, TrendingUp, ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SalesFunnelChart } from "./SalesFunnelChart";
import { AttendanceRateChart } from "./AttendanceRateChart";
import { SourcePerformanceTable } from "./SourcePerformanceTable";
import { ProfessionalProductionList } from "./ProfessionalProductionList";

interface OrganizationDashboardSectionProps {
  organizationId: string;
  organizationName: string;
  periodDays: number;
}

export function OrganizationDashboardSection({
  organizationId,
  organizationName,
  periodDays,
}: OrganizationDashboardSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { data: metrics, isLoading } = useDashboardMetrics(periodDays, organizationId);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border border-primary/30 bg-card overflow-hidden">
        {/* Header */}
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                {organizationName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {formatCurrency(metrics?.totalRevenue || 0)} receita
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Estimada
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(metrics?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics?.appointmentsByStatus?.completed || 0} agendamentos concluídos
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taxa de Conversão
                  </CardTitle>
                  <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">
                    {metrics?.conversionRate?.toFixed(1) || 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics?.convertedLeads || 0} de {metrics?.totalLeads || 0} leads
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ticket Médio
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(metrics?.ticketMedio || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Por cliente atendido
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SalesFunnelChart metrics={metrics} />
              <AttendanceRateChart metrics={metrics} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SourcePerformanceTable metrics={metrics} />
              <ProfessionalProductionList metrics={metrics} />
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
