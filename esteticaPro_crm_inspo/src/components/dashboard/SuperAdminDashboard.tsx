import { useState } from "react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useOrganizations, Organization } from "@/hooks/useOrganizations";
import { useSuperAdminOrg } from "@/contexts/SuperAdminOrgContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Building2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrganizationDashboardSection } from "./OrganizationDashboardSection";

type PeriodOption = "today" | "7d" | "30d" | "custom";

export function SuperAdminDashboard() {
  const [period, setPeriod] = useState<PeriodOption>("today");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isOrgSelectorOpen, setIsOrgSelectorOpen] = useState(false);

  const { selectedOrgIds, setSelectedOrgIds } = useSuperAdminOrg();
  const { data: organizations, isLoading: orgsLoading } = useOrganizations();

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

  const periodDays = getPeriodDays();

  const handleOrgToggle = (orgId: string) => {
    setSelectedOrgIds((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId]
    );
  };

  const handleSelectAll = () => {
    if (organizations) {
      if (selectedOrgIds.length === organizations.length) {
        setSelectedOrgIds([]);
      } else {
        setSelectedOrgIds(organizations.map((org) => org.id));
      }
    }
  };

  const selectedOrgs = organizations?.filter((org) => selectedOrgIds.includes(org.id)) || [];

  if (orgsLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-60" />
          <Skeleton className="h-10 w-80" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Super Admin
          </h1>
          <p className="text-muted-foreground">
            Visão consolidada de todas as clínicas
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          {/* Organization Multi-Select */}
          <Popover open={isOrgSelectorOpen} onOpenChange={setIsOrgSelectorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[240px] justify-between"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="truncate">
                    {selectedOrgIds.length === 0
                      ? "Selecione clínicas"
                      : selectedOrgIds.length === 1
                      ? selectedOrgs[0]?.name
                      : `${selectedOrgIds.length} clínicas selecionadas`}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      organizations?.length === selectedOrgIds.length &&
                      selectedOrgIds.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Selecionar todas
                  </label>
                </div>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="p-2 space-y-1">
                  {organizations?.map((org) => (
                    <div
                      key={org.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => handleOrgToggle(org.id)}
                    >
                      <Checkbox
                        checked={selectedOrgIds.includes(org.id)}
                        onCheckedChange={() => handleOrgToggle(org.id)}
                      />
                      <span className="text-sm">{org.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Content */}
      {selectedOrgIds.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma clínica selecionada
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Selecione uma ou mais clínicas no filtro acima para visualizar os dados do dashboard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {selectedOrgs.map((org) => (
            <OrganizationDashboardSection
              key={org.id}
              organizationId={org.id}
              organizationName={org.name}
              periodDays={periodDays}
            />
          ))}
        </div>
      )}
    </div>
  );
}
