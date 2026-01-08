"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const propertySchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    type: z.string().min(1, "Tipo é obrigatório"),
    transaction_type: z.enum(["venda", "aluguel"]).optional(),
    price: z.coerce.number().min(0),
    status: z.enum(["disponivel", "reservado", "vendido", "alugado"]).default("disponivel"),
    description: z.string().optional(),

    // Address
    address_logradouro: z.string().optional(),
    address_number: z.string().optional(),
    address_bairro: z.string().optional(),
    address_city: z.string().optional(),
    address_state: z.string().optional(),
    address_cep: z.string().optional(),

    // Details
    bedrooms: z.coerce.number().optional(),
    suites: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    parking_spaces: z.coerce.number().optional(),

    // Areas (all optional text fields as per DB)
    area_m2: z.string().optional(),
    area_privativa: z.string().optional(),
    area_construida: z.string().optional(),

    // Financial (optional)
    iptu: z.string().optional(),
    condominio_fee: z.string().optional(),
    aceita_financiamento: z.coerce.boolean().optional(),
    accept_exchange: z.coerce.boolean().optional(),

    // Visibility Toggles
    mostrar_endereco: z.coerce.boolean().optional(),
    mostrar_bairro: z.coerce.boolean().optional(),
    mostrar_preco: z.coerce.boolean().optional(),

    // Marketing
    tarja_texto: z.string().optional(),
    tarja_cor: z.string().optional(),

    // Admin
    internal_notes: z.string().optional(),
    tipo_negociacao: z.enum(["publico", "privado"]).optional(),
});

export async function createProperty(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Get the organization_id from the user's profile
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

    // Parse Data
    const rawData = Object.fromEntries(formData.entries());
    const parse = propertySchema.safeParse(rawData);

    if (!parse.success) {
        return { message: "Validation error", errors: parse.error.flatten().fieldErrors };
    }

    // Handle Image Uploads
    const images = formData.getAll("images") as File[];
    const uploadedImageUrls: string[] = [];

    if (images && images.length > 0) {
        for (const image of images) {
            if (image.size === 0 || !(image instanceof File)) continue;

            const fileExt = image.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            const filePath = `${profile.organization_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('fotos_imoveis')
                .upload(filePath, image);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('fotos_imoveis')
                .getPublicUrl(filePath);

            uploadedImageUrls.push(publicUrl);
        }
    }

    const { error } = await supabase.from("properties").insert({
        organization_id: profile.organization_id,
        ...parse.data,
        type: parse.data.type,
        images_urls: uploadedImageUrls,
    });

    if (error) {
        return { message: error.message };
    }

    revalidatePath("/dashboard/properties");
    redirect("/dashboard/properties");
}

export async function deleteProperty(id: string) {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Unauthorized" };

    // Ideally verify organization ownership here too

    const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting property:", error);
        return { success: false, message: error.message };
    }

    revalidatePath("/dashboard/properties");
    return { success: true };
}

export async function updateProperty(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const rawData = Object.fromEntries(formData.entries());
    // We need to handle 'images' separately as it's not in the schema in the same way for parsing
    // But for schema validation of text fields we can use valid params

    // Partial validation or full validation? Full validation makes sense.
    const parse = propertySchema.safeParse(rawData);

    if (!parse.success) {
        return { message: "Validation error", errors: parse.error.flatten().fieldErrors };
    }

    // Handle Image Uploads (New images)
    const images = formData.getAll("images") as File[];
    const uploadedImageUrls: string[] = [];

    if (images && images.length > 0) {
        // Need to refetch profile for organization_id or just assume user has one (we can get it anyway)
        const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
        if (profile?.organization_id) {
            for (const image of images) {
                if (image.size === 0 || !(image instanceof File)) continue;

                const fileExt = image.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
                const filePath = `${profile.organization_id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('fotos_imoveis')
                    .upload(filePath, image);

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('fotos_imoveis')
                    .getPublicUrl(filePath);

                uploadedImageUrls.push(publicUrl);
            }
        }
    }

    // Prepare update data
    const updateData: any = {
        ...parse.data,
        type: parse.data.type,
    };

    // Parse kept images from client state
    const keptImagesJson = formData.get('kept_images') as string;
    let keptImages: string[] = [];
    if (keptImagesJson) {
        try {
            keptImages = JSON.parse(keptImagesJson);
        } catch (e) {
            console.error("Error parsing kept_images", e);
        }
    } else {
        // Fallback or logic for when field is missing (maybe fetch current if not passed?)
        // If not passed, we assume we keep all? Or if passed as empty array we keep none.
        // Given we changed the form, it should always be passed.
        // But for safety/robustness:
        const { data: currentProp } = await supabase.from("properties").select("images_urls").eq("id", id).single();
        keptImages = currentProp?.images_urls || [];
    }

    // Combine kept images with new images
    updateData.images_urls = [...keptImages, ...uploadedImageUrls];

    // Check if we need to remove images (handled by a separate list of kept images ideally, but let's skip for now unless requested)

    const { error } = await supabase
        .from("properties")
        .update(updateData)
        .eq("id", id);

    if (error) {
        return { message: error.message };
    }

    revalidatePath("/dashboard/properties");
    redirect("/dashboard/properties");
}

export async function getPropertyLeadInterests(propertyId: string) {
    const supabase = await createClient();

    // TODO: This requires a join table (lead_property_interests) to track which leads are interested in which properties
    // For now, returning empty array to prevent errors
    // Future implementation should query: SELECT leads.* FROM leads JOIN lead_property_interests ON leads.id = lead_property_interests.lead_id WHERE lead_property_interests.property_id = propertyId

    return [];
}
