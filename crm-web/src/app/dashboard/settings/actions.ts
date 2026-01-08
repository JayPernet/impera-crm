"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
});

const passwordSchema = z.object({
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { message: "Unauthorized", success: false };

    const fullName = formData.get("fullName") as string;
    const parse = profileSchema.safeParse({ fullName });

    if (!parse.success) {
        return {
            message: "Erro de validação",
            errors: parse.error.flatten().fieldErrors,
            success: false
        };
    }

    // Try to update metadata as well mostly for UI consistency if used elsewhere
    await supabase.auth.updateUser({
        data: { full_name: fullName }
    });

    // Update profile table
    const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);
        return { message: "Erro ao atualizar perfil no banco de dados", success: false };
    }

    revalidatePath("/dashboard/settings");
    return { message: "Perfil atualizado com sucesso!", success: true };
}

export async function updateNotifications(preferences: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { message: "Unauthorized", success: false };

    const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: preferences })
        .eq("id", user.id);

    if (error) {
        console.error("Notification update error:", error);
        return { message: "Erro ao salvar preferências", success: false };
    }

    revalidatePath("/dashboard/settings");
    return { message: "Preferências salvas!", success: true };
}

export async function changePassword(prevState: any, formData: FormData) {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const parse = passwordSchema.safeParse({ password, confirmPassword });

    if (!parse.success) {
        return {
            message: "Erro de validação",
            errors: parse.error.flatten().fieldErrors,
            success: false
        };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { message: error.message || "Erro ao alterar senha", success: false };
    }

    return { message: "Senha alterada com sucesso!", success: true };
}
