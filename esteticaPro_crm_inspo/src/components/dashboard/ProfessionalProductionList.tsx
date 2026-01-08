import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";
import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProfessionalProductionListProps {
  metrics: DashboardMetrics | undefined;
}

export function ProfessionalProductionList({ metrics }: ProfessionalProductionListProps) {
  const professionals = metrics?.productionByProfessional || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...professionals.map((p) => p.value), 1);

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Produção por Profissional
        </CardTitle>
      </CardHeader>
      <CardContent>
        {professionals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum procedimento realizado no período
          </div>
        ) : (
          <div className="space-y-4">
            {professionals.slice(0, 6).map((professional, index) => {
              const percentage = (professional.value / maxValue) * 100;

              return (
                <div key={professional.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-primary text-primary-foreground"
                            : index === 1
                            ? "bg-muted-foreground/60 text-background"
                            : index === 2
                            ? "bg-amber-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm text-foreground">
                        {professional.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-sm text-foreground">
                        {formatCurrency(professional.value)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({professional.count} proc.)
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        )}

        {/* Total */}
        {professionals.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total produzido:</span>
              <span className="font-semibold text-primary">
                {formatCurrency(professionals.reduce((sum, p) => sum + p.value, 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Total de procedimentos:</span>
              <span className="font-semibold">
                {professionals.reduce((sum, p) => sum + p.count, 0)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
