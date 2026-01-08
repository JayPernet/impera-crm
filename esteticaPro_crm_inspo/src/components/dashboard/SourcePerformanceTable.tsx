import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";
import { BarChart3 } from "lucide-react";

interface SourcePerformanceTableProps {
  metrics: DashboardMetrics | undefined;
}

export function SourcePerformanceTable({ metrics }: SourcePerformanceTableProps) {
  const sourceData = metrics?.leadsBySource || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const sortedData = [...sourceData].sort((a, b) => b.count - a.count).slice(0, 8);

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Performance por Origem
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado disponível para o período
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Origem</TableHead>
                  <TableHead className="text-xs text-center">Leads</TableHead>
                  <TableHead className="text-xs text-center">Agendamentos</TableHead>
                  <TableHead className="text-xs text-center">Conversão</TableHead>
                  <TableHead className="text-xs text-right">Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((source) => {
                  const sourceLabels: Record<string, string> = {
                    ads: "Anúncios",
                    organic: "Orgânico",
                    indication: "Indicação",
                    other: "Outros",
                  };

                  const conversionRate =
                    source.count > 0
                      ? ((source.appointments / source.count) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <TableRow key={source.source}>
                      <TableCell className="font-medium text-sm max-w-[150px] truncate">
                        {sourceLabels[source.source] || source.source}
                      </TableCell>
                      <TableCell className="text-center text-sm">{source.count}</TableCell>
                      <TableCell className="text-center text-sm">{source.appointments}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`text-sm font-medium ${parseFloat(conversionRate) >= 30
                              ? "text-green-500"
                              : parseFloat(conversionRate) >= 15
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                        >
                          {conversionRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(source.revenue)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
