import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/hooks/useDashboardMetrics";
import { UserCheck } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface AttendanceRateChartProps {
  metrics: DashboardMetrics | undefined;
}

export function AttendanceRateChart({ metrics }: AttendanceRateChartProps) {
  const scheduled = metrics?.appointmentsByStatus?.scheduled || 0;
  const completed = metrics?.appointmentsByStatus?.completed || 0;
  const cancelled = metrics?.appointmentsByStatus?.cancelled || 0;
  const noShow = metrics?.appointmentsByStatus?.no_show || 0;

  const totalScheduled = scheduled + completed + cancelled + noShow;
  const attendanceRate = totalScheduled > 0 ? (completed / totalScheduled) * 100 : 0;
  const cancellationRate = totalScheduled > 0 ? (cancelled / totalScheduled) * 100 : 0;
  const noShowRate = totalScheduled > 0 ? (noShow / totalScheduled) * 100 : 0;

  const chartData = [
    { name: "Agendados", value: scheduled, fill: "hsl(var(--chart-1))" },
    { name: "Realizados", value: completed, fill: "hsl(var(--chart-2))" },
    { name: "Cancelados", value: cancelled, fill: "hsl(var(--chart-3))" },
    { name: "No-show", value: noShow, fill: "hsl(var(--chart-4))" },
  ];

  const chartConfig = {
    scheduled: { label: "Agendados", color: "hsl(var(--chart-1))" },
    completed: { label: "Realizados", color: "hsl(var(--chart-2))" },
    cancelled: { label: "Cancelados", color: "hsl(var(--chart-3))" },
    noShow: { label: "No-show", color: "hsl(var(--chart-4))" },
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          Taxa de Comparecimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Rates Summary */}
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de comparecimento:</span>
            <span className="font-semibold text-green-500">{attendanceRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de cancelamento:</span>
            <span className="font-semibold text-yellow-500">{cancellationRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de no-show:</span>
            <span className="font-semibold text-red-500">{noShowRate.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
