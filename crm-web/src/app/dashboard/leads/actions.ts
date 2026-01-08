"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LeadStatus } from "@/components/leads/types";

const leadSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    phone: z.string().min(10, "Telefone inválido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    source: z.enum(["Whatsapp", "Site", "Indicação", "Manual"]).default("Manual"),
    status: z.enum(["Novo", "Em Contato", "Visita Agendada", "Visita Realizada", "Em Negociação", "Fechado", "Perdido"]).default("Novo"),
    interest_type: z.enum(["compra", "aluguel", "ambos"]).default("compra"),
    budget: z.coerce.number().optional(),
    summary: z.string().optional(),
});

export async function createLead(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile?.organization_id) {
        return { message: "No organization found" };
    }

    const rawData = Object.fromEntries(formData.entries());
    const parse = leadSchema.safeParse(rawData);

    if (!parse.success) {
        return { message: "Validation error", errors: parse.error.flatten().fieldErrors };
    }

    // Insert into DB
    const { error } = await supabase.from("leads").insert({
        organization_id: profile.organization_id,
        full_name: parse.data.name,
        phone: parse.data.phone,
        email: parse.data.email || null,
        source: parse.data.source,
        status: parse.data.status,
        interest_type: parse.data.interest_type,
        budget: parse.data.budget || null,
        summary: parse.data.summary || null,
        pipeline_step: 0,
    });

    if (error) {
        console.error("Supabase Create Lead Error:", error);
        return { message: "Erro ao criar lead. Verifique se o telefone já existe na organização." };
    }

    // Trigger n8n Webhook (Stub)
    try {
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_LEAD_CREATED;
        if (n8nWebhookUrl) {
            fetch(n8nWebhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    lead_id: parse.data.phone, // using phone as key
                    name: parse.data.name,
                    phone: parse.data.phone,
                    email: parse.data.email,
                    source: parse.data.source,
                    interest: parse.data.interest_type,
                    budget: parse.data.budget,
                    notes: parse.data.summary,
                    timestamp: new Date().toISOString()
                })
            }).catch(err => console.error("n8n Trigger Failed:", err));
        }
    } catch (e) {
        console.error("n8n Trigger Error", e);
    }

    revalidatePath("/dashboard/leads");
    redirect("/dashboard/leads");
}

export async function updateLead(leadId: string, formData: FormData) {
    const supabase = await createClient();

    const rawData = Object.fromEntries(formData.entries());
    const parse = leadSchema.safeParse(rawData);

    if (!parse.success) {
        return { message: "Validation error", errors: parse.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("leads")
        .update({
            full_name: parse.data.name,
            phone: parse.data.phone,
            email: parse.data.email || null,
            source: parse.data.source,
            status: parse.data.status,
            interest_type: parse.data.interest_type,
            budget: parse.data.budget || null,
            summary: parse.data.summary || null,
        })
        .eq("id", leadId);

    if (error) {
        console.error("Supabase Update Lead Error:", error);
        return { message: "Erro ao atualizar lead." };
    }

    revalidatePath("/dashboard/leads");
    redirect("/dashboard/leads");
}

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus) {
    const supabase = await createClient();

    // Auth check implicitly handled by RLS, but organization check is good practice if we want strictness.
    // For speed, relying on RLS: user can only update leads in their org.

    const { error } = await supabase
        .from("leads")
        .update({ status: newStatus, last_contact_at: new Date().toISOString() })
        .eq("id", leadId);

    if (error) {
        console.error("Error updating status:", error);
        throw new Error("Failed to update status");
    }

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/leads");
}

export async function deleteLead(leadId: string) {
    const supabase = await createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

    if (error) {
        console.error("Error deleting lead:", error);
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/leads");
    return { success: true };
}

export async function getContactsForChat() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("leads")
        .select("id, full_name, phone, classification")
        .order("full_name");

    if (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
    return data;
}

export async function associatePropertyWithLead(leadId: string, propertyId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

    if (!profile?.organization_id) {
        return { success: false, message: "No organization found" };
    }

    const { error } = await supabase
        .from("lead_property_interests")
        .insert({
            lead_id: leadId,
            property_id: propertyId,
            organization_id: profile.organization_id,
        });

    if (error) {
        console.error("Error associating property:", error);
        return { success: false, message: "Erro ao vincular imóvel. Pode já estar vinculado." };
    }

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/properties");
    return { success: true };
}

export async function disassociatePropertyFromLead(leadId: string, propertyId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("lead_property_interests")
        .delete()
        .eq("lead_id", leadId)
        .eq("property_id", propertyId);

    if (error) {
        console.error("Error disassociating property:", error);
        return { success: false, message: "Erro ao desvincular imóvel." };
    }

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard/properties");
    return { success: true };
}

export async function getLeadPropertyInterests(leadId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("lead_property_interests")
        .select(`
            property_id,
            properties (
                id,
                title,
                type,
                transaction_type,
                price,
                status,
                address_city,
                address_bairro
            )
        `)
        .eq("lead_id", leadId);

    if (error) {
        console.error("Error fetching lead property interests:", error);
        return [];
    }

    // Map and flatten the nested structure
    return (data || [])
        .map((item: any) => item.properties)
        .filter(Boolean) as any[];
}

export async function getPropertyLeadInterests(propertyId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("lead_property_interests")
        .select(`
            lead_id,
            leads (
                id,
                full_name,
                phone,
                email,
                status,
                classification,
                budget
            )
        `)
        .eq("property_id", propertyId);

    if (error) {
        console.error("Error fetching property lead interests:", error);
        return [];
    }

    return data.map(item => item.leads).filter(Boolean);
}
