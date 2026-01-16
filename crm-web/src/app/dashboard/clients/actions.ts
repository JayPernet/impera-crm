"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const clientSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    phone: z.string().min(10, "Telefone inválido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    interest_type: z.enum(["compra", "aluguel", "ambos"]).default("compra"),
    budget: z.coerce.number().optional(),
    summary: z.string().optional(),
});

export async function createClientRecord(prevState: any, formData: FormData) {
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
    const parse = clientSchema.safeParse(rawData);

    if (!parse.success) {
        return { message: "Validation error", errors: parse.error.flatten().fieldErrors };
    }

    // Insert into DB with classification = 'cliente'
    const { error } = await supabase.from("leads").insert({
        organization_id: profile.organization_id,
        owner_id: user.id, // Auto-assign to creator
        full_name: parse.data.name,
        phone: parse.data.phone,
        email: parse.data.email || null,
        source: "Manual",
        status: "Novo",
        interest_type: parse.data.interest_type,
        budget: parse.data.budget || null,
        summary: parse.data.summary || null,
        classification: 'cliente',
        pipeline_step: 0,
    });

    if (error) {
        console.error("Supabase Create Client Error:", error);
        return { message: "Erro ao criar cliente. Verifique se o telefone já existe na organização." };
    }

    revalidatePath("/dashboard/clients");
    redirect("/dashboard/clients");
}

export async function updateClientRecord(clientId: string, formData: FormData) {
    const supabase = await createClient();

    const rawData = Object.fromEntries(formData.entries());
    const parse = clientSchema.safeParse(rawData);

    if (!parse.success) {
        return { message: "Validation error", errors: parse.error.flatten().fieldErrors };
    }

    const { error } = await supabase
        .from("leads")
        .update({
            full_name: parse.data.name,
            phone: parse.data.phone,
            email: parse.data.email || null,
            interest_type: parse.data.interest_type,
            budget: parse.data.budget || null,
            summary: parse.data.summary || null,
        })
        .eq("id", clientId);

    if (error) {
        console.error("Supabase Update Client Error:", error);
        return { message: "Erro ao atualizar cliente." };
    }

    revalidatePath("/dashboard/clients");
    redirect("/dashboard/clients");
}

export async function archiveClientRecord(clientId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("leads")
        .update({ classification: 'arquivado' })
        .eq("id", clientId);

    if (error) {
        console.error("Error archiving client:", error);
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/clients");
    return { success: true };
}

export async function deleteClientRecord(clientId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", clientId);

    if (error) {
        console.error("Error deleting client:", error);
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/clients");
    return { success: true };
}
