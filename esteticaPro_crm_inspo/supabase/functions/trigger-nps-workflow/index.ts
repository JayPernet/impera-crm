
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { record, old_record } = await req.json();

        // Trigger only on completion
        if (record.status !== "completed" || (old_record && old_record.status === "completed")) {
            return new Response(JSON.stringify({ message: "Not a completion event" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        const appointmentId = record.id;
        const organizationId = record.organization_id;

        // Fetch related data
        const { data: appointmentData, error: aptError } = await supabase
            .from("crm_appointments")
            .select(`
        *,
        client:crm_clients(*),
        professional:crm_users(name),
        procedure:crm_procedures(name)
      `)
            .eq("id", appointmentId)
            .single();

        if (aptError || !appointmentData) {
            console.error("Error fetching appointment:", aptError);
            return new Response(JSON.stringify({ error: "Appointment not found" }), { status: 400 });
        }

        const { data: orgData, error: orgError } = await supabase
            .from("crm_organizations")
            .select("name, zapi_instance_id, zapi_token, google_business_link")
            .eq("id", organizationId)
            .single();

        if (orgError || !orgData) {
            console.error("Error fetching org:", orgError);
            return new Response(JSON.stringify({ error: "Organization not found" }), { status: 400 });
        }

        const client = appointmentData.client;

        // Construct payload
        const payload = {
            event: "appointment_completed",
            clinic: {
                name: orgData.name,
                whatsapp_instance_id: orgData.zapi_instance_id,
                whatsapp_token: orgData.zapi_token,
                google_business_url: orgData.google_business_link,
            },
            client: {
                name: client.name,
                phone: client.phone,
                nps_token: client.nps_token,
            },
            appointment: {
                id: appointmentData.id,
                professional_name: appointmentData.professional?.name,
                procedure_name: appointmentData.procedure?.name,
            },
        };

        // Send to n8n
        const webhookUrl = "https://n8n.gbmarketingdigital.com.br/webhook/39f34470-nps4eb6-clinicPROcrm-d9f2eb5ecc6a";

        try {
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("Failed to call n8n webhook:", err);
            // Fail silently for the user
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: unknown) {
        console.error("Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
