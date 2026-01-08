import { useEffect, useState } from "react";
import { RefreshCw, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "./DashboardCard";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, format } from "date-fns";

interface Client {
  id: string;
  name: string;
  next_return_at: string;
}

interface RetornosProximosCardProps {
  organizationId: string | null;
}

export function RetornosProximosCard({ organizationId }: RetornosProximosCardProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchClients = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const threeDaysLater = new Date(today);
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);

      const { data, error, count: totalCount } = await supabase
        .from("crm_clients")
        .select("id, name, next_return_at", { count: "exact" })
        .eq("organization_id", organizationId)
        .gte("next_return_at", today.toISOString())
        .lte("next_return_at", threeDaysLater.toISOString())
        .order("next_return_at", { ascending: true })
        .limit(5);

      if (!error) {
        setClients((data || []) as Client[]);
        setCount(totalCount || 0);
      }
      setLoading(false);
    };

    fetchClients();
  }, [organizationId]);

  const getDaysRemaining = (returnDate: string) => {
    const days = differenceInDays(new Date(returnDate), new Date());
    if (days === 0) return "Hoje";
    if (days === 1) return "Amanhã";
    return `${days} dias`;
  };

  const getBadgeVariant = (returnDate: string) => {
    const days = differenceInDays(new Date(returnDate), new Date());
    if (days === 0) return "bg-primary/20 text-primary";
    if (days === 1) return "bg-yellow-500/20 text-yellow-500";
    return "bg-muted text-muted-foreground";
  };

  return (
    <DashboardCard title="Retornos Próximos" icon={RefreshCw} count={count} loading={loading}>
      <div className="space-y-2 mt-2">
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum retorno nos próximos 3 dias
          </p>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-sm truncate">{client.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">
                    {format(new Date(client.next_return_at), "dd/MM")}
                  </span>
                </div>
                <Badge className={`text-[10px] px-1.5 py-0 ${getBadgeVariant(client.next_return_at)}`}>
                  {getDaysRemaining(client.next_return_at)}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
}
