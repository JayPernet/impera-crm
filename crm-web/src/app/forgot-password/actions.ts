"use server";

import { createClient } from "@/utils/supabase/server";

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`,
    });

    if (error) {
        return { error: "Erro ao enviar email de recuperação. Verifique o endereço." };
    }

    return { success: true };
}
