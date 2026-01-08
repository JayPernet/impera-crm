"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message === "Invalid login credentials") {
            return { error: "Credenciais de acesso inválidas." };
        }
        return { error: "Erro ao acessar a conta. Verifique seus dados." };
    }

    redirect("/dashboard");
}
