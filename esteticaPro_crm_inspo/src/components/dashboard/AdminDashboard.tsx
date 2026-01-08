import { useState } from "react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useCrmUser } from "@/hooks/useCrmUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, TrendingUp, DollarSign, Users, Target, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SalesFunnelChart } from "./SalesFunnelChart";
import { AttendanceRateChart } from "./AttendanceRateChart";
import { SourcePerformanceTable } from "./SourcePerformanceTable";
import { ProfessionalProductionList } from "./ProfessionalProductionList";
import { ProcedimentosMaisSolicitadosCard } from "./ProcedimentosMaisSolicitadosCard";
import { ProcedimentosMaisRealizadosCard } from "./ProcedimentosMaisRealizadosCard";

type PeriodOption = "today" | "7d" | "30d" | "custom";

export function AdminDashboard() {
  const { crmUser, organizationId } = useCrmUser();
  const [period, setPeriod] = useState<PeriodOption>("today");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const getPeriodDays = () => {
    switch (period) {
      case "today":
        return 1;
      case "7d":
        return 7;
      case "30d":
        return 30;
      case "custom":
        if (customDateRange) {
          const diff = Math.ceil(
            (customDateRange.to.getTime() - customDateRange.from.getTime()) / (1000 * 60 * 60 * 24)
          );
          return diff || 1;
        }
        return 30;
      default:
        return 30;
    }
  };

  const { data: metrics, isLoading } = useDashboardMetrics(getPeriodDays());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">
            Métricas de performance da clínica
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={period === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("today")}
          >
            Hoje
          </Button>
          <Button
            variant={period === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("7d")}
          >
            7 dias
          </Button>
          <Button
            variant={period === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("30d")}
          >
            30 dias
          </Button>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={period === "custom" ? "default" : "outline"}
                size="sm"
                className={cn("gap-2")}
              >
                <CalendarIcon className="h-4 w-4" />
                {period === "custom" && customDateRange
                  ? `${format(customDateRange.from, "dd/MM")} - ${format(customDateRange.to, "dd/MM")}`
                  : "Personalizado"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={
                  customDateRange
                    ? { from: customDateRange.from, to: customDateRange.to }
                    : undefined
                }
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setCustomDateRange({ from: range.from, to: range.to });
                    setPeriod("custom");
                    setIsCalendarOpen(false);
                  }
                }}
                locale={ptBR}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

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
            <div className="text-2xl font-bold text-foreground">
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
            <div className="text-2xl font-bold text-foreground">
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
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(metrics?.ticketMedio || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por cliente atendido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesFunnelChart metrics={metrics} />
        <AttendanceRateChart metrics={metrics} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SourcePerformanceTable metrics={metrics} />
        <ProfessionalProductionList metrics={metrics} />
      </div>

      {/* Procedure Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProcedimentosMaisSolicitadosCard organizationId={organizationId ?? null} />
        <ProcedimentosMaisRealizadosCard organizationId={organizationId ?? null} />
      </div>
    </div>
  );
}
