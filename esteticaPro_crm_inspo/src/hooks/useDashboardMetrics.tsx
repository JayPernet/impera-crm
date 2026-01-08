import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";

export interface DashboardMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  ticketMedio: number;
  leadsByStatus: Record<string, number>;
  revenueByDate: Array<{ date: string; value: number }>;
  leadsBySource: Array<{ source: string; count: number; appointments: number; revenue: number }>;
  appointmentsByStatus: Record<string, number>;
  productionByProfessional: Array<{ name: string; count: number; value: number }>;
}

export function useDashboardMetrics(periodDays: number, organizationId?: string | null) {
  const { crmUser, isSuperAdmin } = useCrmUser();

  // Determine which org to filter by
  const effectiveOrgId = organizationId ?? crmUser?.organization_id;

  return useQuery({
    queryKey: ["dashboard-metrics", effectiveOrgId, periodDays, isSuperAdmin],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startDateStr = startDate.toISOString();

      // Get leads
      let leadsQuery = supabase
        .from("crm_leads")
        .select("*")
        .gte("created_at", startDateStr);
      
      if (effectiveOrgId) {
        leadsQuery = leadsQuery.eq("organization_id", effectiveOrgId);
      }
      
      const { data: leads } = await leadsQuery;

      // Get clients
      let clientsQuery = supabase
        .from("crm_clients")
        .select("*")
        .gte("converted_at", startDateStr);
      
      if (effectiveOrgId) {
        clientsQuery = clientsQuery.eq("organization_id", effectiveOrgId);
      }
      
      const { data: clients } = await clientsQuery;

      // Get appointments
      let appointmentsQuery = supabase
        .from("crm_appointments")
        .select(`
          *,
          professional:crm_users(id, name)
        `)
        .gte("scheduled_at", startDateStr);
      
      if (effectiveOrgId) {
        appointmentsQuery = appointmentsQuery.eq("organization_id", effectiveOrgId);
      }
      
      const { data: appointments } = await appointmentsQuery;

      // Calculate metrics
      const totalLeads = leads?.length || 0;
      const convertedLeads = clients?.length || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      const completedAppointments = appointments?.filter((a) => a.status === "completed") || [];
      const totalRevenue = completedAppointments.reduce((sum, a) => sum + (a.value || 0), 0);
      
      const uniqueClients = new Set(completedAppointments.map((a) => a.client_id || a.lead_id));
      const ticketMedio = uniqueClients.size > 0 ? totalRevenue / uniqueClients.size : 0;

      // Leads by status
      const leadsByStatus: Record<string, number> = {};
      leads?.forEach((lead) => {
        const status = lead.status || "new";
        leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;
      });

      // Revenue by date
      const revenueByDateMap: Record<string, number> = {};
      completedAppointments.forEach((apt) => {
        const date = apt.scheduled_at?.split("T")[0] || "";
        revenueByDateMap[date] = (revenueByDateMap[date] || 0) + (apt.value || 0);
      });
      const revenueByDate = Object.entries(revenueByDateMap)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Leads by source
      const sourceMap: Record<string, { count: number; appointments: number; revenue: number }> = {};
      leads?.forEach((lead) => {
        const source = lead.source_detail || lead.source_type || "Outros";
        if (!sourceMap[source]) {
          sourceMap[source] = { count: 0, appointments: 0, revenue: 0 };
        }
        sourceMap[source].count += 1;
      });

      // Add appointment data to sources
      appointments?.forEach((apt) => {
        // Find lead to get source
        const lead = leads?.find((l) => l.id === apt.lead_id);
        const source = lead?.source_detail || lead?.source_type || "Outros";
        if (sourceMap[source]) {
          sourceMap[source].appointments += 1;
          if (apt.status === "completed") {
            sourceMap[source].revenue += apt.value || 0;
          }
        }
      });

      const leadsBySource = Object.entries(sourceMap).map(([source, data]) => ({
        source,
        ...data,
      }));

      // Appointments by status
      const appointmentsByStatus: Record<string, number> = {};
      appointments?.forEach((apt) => {
        const status = apt.status || "scheduled";
        appointmentsByStatus[status] = (appointmentsByStatus[status] || 0) + 1;
      });

      // Production by professional
      const professionalMap: Record<string, { name: string; count: number; value: number }> = {};
      completedAppointments.forEach((apt) => {
        const profId = apt.professional_id || "unknown";
        const profName = (apt.professional as any)?.name || "Não atribuído";
        if (!professionalMap[profId]) {
          professionalMap[profId] = { name: profName, count: 0, value: 0 };
        }
        professionalMap[profId].count += 1;
        professionalMap[profId].value += apt.value || 0;
      });
      const productionByProfessional = Object.values(professionalMap).sort((a, b) => b.value - a.value);

      return {
        totalLeads,
        convertedLeads,
        conversionRate,
        totalRevenue,
        ticketMedio,
        leadsByStatus,
        revenueByDate,
        leadsBySource,
        appointmentsByStatus,
        productionByProfessional,
      } as DashboardMetrics;
    },
    enabled: !!crmUser,
  });
}

export function useSuperAdminMetrics(periodDays: number) {
  const { isSuperAdmin } = useCrmUser();

  return useQuery({
    queryKey: ["superadmin-metrics", periodDays],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startDateStr = startDate.toISOString();

      // Get all organizations
      const { data: organizations } = await supabase
        .from("crm_organizations")
        .select("*")
        .eq("active", true);

      // Get metrics per organization
      const orgMetrics = await Promise.all(
        (organizations || []).map(async (org) => {
          const { data: leads } = await supabase
            .from("crm_leads")
            .select("*")
            .eq("organization_id", org.id)
            .gte("created_at", startDateStr);

          const { data: clients } = await supabase
            .from("crm_clients")
            .select("*")
            .eq("organization_id", org.id)
            .gte("converted_at", startDateStr);

          const { data: appointments } = await supabase
            .from("crm_appointments")
            .select("*")
            .eq("organization_id", org.id)
            .gte("scheduled_at", startDateStr);

          const totalLeads = leads?.length || 0;
          const convertedClients = clients?.length || 0;
          const conversionRate = totalLeads > 0 ? (convertedClients / totalLeads) * 100 : 0;

          const totalAppointments = appointments?.length || 0;
          const completedAppointments = appointments?.filter((a) => a.status === "completed") || [];
          const noShowCount = appointments?.filter((a) => a.status === "no_show").length || 0;
          const attendanceRate = totalAppointments > 0 
            ? ((completedAppointments.length / totalAppointments) * 100) 
            : 0;

          const revenue = completedAppointments.reduce((sum, a) => sum + (a.value || 0), 0);
          const ticketMedio = completedAppointments.length > 0 
            ? revenue / completedAppointments.length 
            : 0;

          return {
            id: org.id,
            name: org.name,
            totalLeads,
            conversionRate,
            totalAppointments,
            attendanceRate,
            revenue,
            ticketMedio,
          };
        })
      );

      // Aggregate totals
      const totals = {
        totalOrgs: organizations?.filter((o) => o.active).length || 0,
        totalLeads: orgMetrics.reduce((sum, o) => sum + o.totalLeads, 0),
        totalRevenue: orgMetrics.reduce((sum, o) => sum + o.revenue, 0),
        avgTicket: orgMetrics.length > 0 
          ? orgMetrics.reduce((sum, o) => sum + o.ticketMedio, 0) / orgMetrics.length 
          : 0,
      };

      // Leads by source (all orgs)
      const { data: allLeads } = await supabase
        .from("crm_leads")
        .select("source_type")
        .gte("created_at", startDateStr);

      const sourceCount: Record<string, number> = {};
      allLeads?.forEach((lead) => {
        const source = lead.source_type || "other";
        sourceCount[source] = (sourceCount[source] || 0) + 1;
      });

      const leadsBySourcePie = Object.entries(sourceCount).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        organizations: orgMetrics.sort((a, b) => b.revenue - a.revenue),
        totals,
        leadsBySourcePie,
      };
    },
    enabled: isSuperAdmin,
  });
}
