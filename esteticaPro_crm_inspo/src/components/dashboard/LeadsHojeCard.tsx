import { useEffect, useState } from "react";
import { UserPlus, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "./DashboardCard";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
}

interface LeadsHojeCardProps {
  organizationId: string | null;
}

export function LeadsHojeCard({ organizationId }: LeadsHojeCardProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchLeads = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { data, error, count: totalCount } = await supabase
        .from("crm_leads")
        .select("id, name, phone, created_at", { count: "exact" })
        .eq("organization_id", organizationId)
        .gte("created_at", todayISO)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error) {
        setLeads(data || []);
        setCount(totalCount || 0);
      }
      setLoading(false);
    };

    fetchLeads();
  }, [organizationId]);

  return (
    <DashboardCard title="Leads Novos Hoje" icon={UserPlus} count={count} loading={loading}>
      <div className="space-y-2 mt-2">
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum lead novo hoje
          </p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => navigate("/pipeline")}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
            >
              <span className="font-medium text-sm truncate">{lead.name}</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span className="text-xs">{lead.phone || "Sem telefone"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardCard>
  );
}
