import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SpeedToLeadWidgetProps {
  organizationId: string | null;
}

export function SpeedToLeadWidget({ organizationId }: SpeedToLeadWidgetProps) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchStaleLeads = async () => {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { count: totalCount, error } = await supabase
        .from("crm_leads")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .eq("status", "new")
        .lte("created_at", twentyFourHoursAgo.toISOString());

      if (!error) {
        setCount(totalCount || 0);
      }
      setLoading(false);
    };

    fetchStaleLeads();
  }, [organizationId]);

  if (loading) {
    return (
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="p-4">
          <div className="animate-pulse h-12" />
        </CardContent>
      </Card>
    );
  }

  if (count === 0) {
    return (
      <Card className="bg-success/5 border-success/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <AlertTriangle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-success">Todos os leads foram contatados!</p>
                <p className="text-sm text-muted-foreground">
                  Nenhum lead aguardando resposta há mais de 24h
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-destructive/5 border-destructive/20 hover:border-destructive/40 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-destructive">
                {count} {count === 1 ? "lead aguardando" : "leads aguardando"} resposta há mais de 24h
              </p>
              <p className="text-sm text-muted-foreground">
                Leads sem interação precisam de atenção urgente
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/speed-to-lead")}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shrink-0"
          >
            Responder Agora
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
