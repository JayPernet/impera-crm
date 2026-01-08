import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProcedureCount {
  procedure_id: string;
  procedure_name: string;
  count: number;
}

interface ProcedimentosMaisSolicitadosCardProps {
  organizationId: string | null;
}

export function ProcedimentosMaisSolicitadosCard({ organizationId }: ProcedimentosMaisSolicitadosCardProps) {
  const [procedures, setProcedures] = useState<ProcedureCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      // Get appointments from last 30 days grouped by procedure
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: appointments, error } = await supabase
        .from("crm_appointments")
        .select(`
          procedure_id,
          crm_procedures!inner(name)
        `)
        .eq("organization_id", organizationId)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (!error && appointments) {
        // Group and count by procedure
        const countMap = new Map<string, { name: string; count: number }>();
        
        appointments.forEach((apt: any) => {
          if (apt.procedure_id && apt.crm_procedures?.name) {
            const existing = countMap.get(apt.procedure_id);
            if (existing) {
              existing.count++;
            } else {
              countMap.set(apt.procedure_id, { 
                name: apt.crm_procedures.name, 
                count: 1 
              });
            }
          }
        });

        const sorted = Array.from(countMap.entries())
          .map(([id, data]) => ({
            procedure_id: id,
            procedure_name: data.name,
            count: data.count
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setProcedures(sorted);
      }
      setLoading(false);
    };

    fetchData();
  }, [organizationId]);

  const maxCount = procedures.length > 0 ? procedures[0].count : 1;

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Procedimentos Mais Solicitados
        </CardTitle>
        <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {procedures.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum agendamento no período
          </p>
        ) : (
          procedures.map((proc, index) => (
            <div key={proc.procedure_id} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium truncate flex-1">
                  {index + 1}. {proc.procedure_name}
                </span>
                <span className="text-muted-foreground ml-2">{proc.count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary/70 rounded-full transition-all duration-500"
                  style={{ width: `${(proc.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
