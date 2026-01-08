import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  children: ReactNode;
  loading?: boolean;
}

export function DashboardCard({ title, icon: Icon, count, children, loading }: DashboardCardProps) {
  return (
    <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          </div>
          <span className="text-3xl font-bold gold-text">
            {loading ? "..." : count}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}
