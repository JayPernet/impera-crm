import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";
import { TrendingUp } from "lucide-react";

interface SalesFunnelChartProps {
  metrics: DashboardMetrics | undefined;
}

export function SalesFunnelChart({ metrics }: SalesFunnelChartProps) {
  const statusLabels: Record<string, string> = {
    new: "Novos",
    contacted: "Contatados",
    scheduled: "Agendados",
    lost: "Perdidos",
  };

  const statusColors: Record<string, string> = {
    new: "bg-blue-500",
    contacted: "bg-yellow-500",
    scheduled: "bg-green-500",
    lost: "bg-red-500",
  };

  const funnelOrder = ["new", "contacted", "scheduled"];
  const totalLeads = metrics?.totalLeads || 0;

  const funnelData = funnelOrder.map((status) => ({
    status,
    label: statusLabels[status],
    count: metrics?.leadsByStatus?.[status] || 0,
    color: statusColors[status],
  }));

  // Add converted clients at the end
  funnelData.push({
    status: "converted",
    label: "Convertidos",
    count: metrics?.convertedLeads || 0,
    color: "bg-primary",
  });

  const maxCount = Math.max(...funnelData.map((d) => d.count), 1);

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Funil de Vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {funnelData.map((item, index) => {
            const percentage = totalLeads > 0 ? (item.count / totalLeads) * 100 : 0;
            const widthPercentage = (item.count / maxCount) * 100;

            return (
              <div key={item.status} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{item.label}</span>
                  <span className="text-muted-foreground">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-8 bg-muted rounded-md overflow-hidden relative">
                  <div
                    className={`h-full ${item.color} transition-all duration-500 rounded-md flex items-center justify-center`}
                    style={{ width: `${Math.max(widthPercentage, 5)}%` }}
                  >
                    {widthPercentage > 20 && (
                      <span className="text-white text-sm font-medium">{item.count}</span>
                    )}
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-muted-foreground/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de conversão total:</span>
            <span className="font-semibold text-primary">
              {metrics?.conversionRate?.toFixed(1) || 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
