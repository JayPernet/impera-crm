"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getTeamMembers() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado", data: [] };

    // Get user's profile to check role and organization
    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, role")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return { success: false, message: "Perfil não encontrado", data: [] };
    }

    // Only admins can manage team
    if (profile.role !== "admin" && profile.role !== "super_admin") {
        return { success: false, message: "Acesso negado", data: [] };
    }

    // Fetch all team members from the same organization, excluding super_admins
    const { data: members, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, created_at")
        .eq("organization_id", profile.organization_id)
        .neq("role", "super_admin")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching team members:", error);
        return { success: false, message: "Erro ao buscar membros da equipe", data: [], currentUserId: user.id };
    }

    // Fetch email from auth.users for each member
    const adminClient = createAdminClient();
    const membersWithEmail = await Promise.all(
        members.map(async (member) => {
            const { data: authUser } = await adminClient.auth.admin.getUserById(member.id);
            return {
                ...member,
                email: authUser.user?.email || "N/A",
            };
        })
    );

    return { success: true, data: membersWithEmail, currentUserId: user.id };
}

export async function addTeamMember(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado" };

    // Get user's profile to check role and organization
    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, role")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return { success: false, message: "Perfil não encontrado" };
    }

    // Only admins can add team members
    if (profile.role !== "admin" && profile.role !== "super_admin") {
        return { success: false, message: "Acesso negado" };
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;
    const role = formData.get("role") as string;

    if (!email || !password || !fullName) {
        return { success: false, message: "Preencha todos os campos obrigatórios" };
    }

    // Validate role
    if (role !== "agent" && role !== "admin") {
        return { success: false, message: "Função inválida" };
    }

    // Create user using admin client
    const adminClient = createAdminClient();
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
            full_name: fullName,
            organization_id: profile.organization_id,
            role: role,
        },
    });

    if (createError) {
        console.error("Error creating user:", createError);
        return { success: false, message: `Erro ao criar usuário: ${createError.message}` };
    }

    revalidatePath("/dashboard/team");
    return { success: true, message: "Corretor adicionado com sucesso!" };
}

export async function deleteTeamMember(memberId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado" };

    // Get user's profile to check role and organization
    const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, role")
        .eq("id", user.id)
        .single();

    if (!profile) {
        return { success: false, message: "Perfil não encontrado" };
    }

    // Only admins can delete team members
    if (profile.role !== "admin" && profile.role !== "super_admin") {
        return { success: false, message: "Acesso negado" };
    }

    // Verify the member belongs to the same organization
    const { data: memberProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", memberId)
        .single();

    if (!memberProfile || memberProfile.organization_id !== profile.organization_id) {
        return { success: false, message: "Membro não encontrado ou não pertence à sua organização" };
    }

    // Delete from auth.users (this will cascade to profiles)
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(memberId);

    if (deleteError) {
        console.error("Error deleting user:", deleteError);
        return { success: false, message: "Erro ao remover membro" };
    }

    revalidatePath("/dashboard/team");
    return { success: true, message: "Membro removido com sucesso!" };
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Não autorizado" };

    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;

    if (!currentPassword || !newPassword) {
        return { success: false, message: "Preencha todos os campos" };
    }

    if (newPassword.length < 6) {
        return { success: false, message: "A nova senha deve ter pelo menos 6 caracteres" };
    }

    // Verify current password by attempting to sign in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
    });

    if (verifyError) {
        return { success: false, message: "Senha atual incorreta" };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) {
        console.error("Error updating password:", updateError);
        return { success: false, message: "Erro ao atualizar senha" };
    }

    return { success: true, message: "Senha atualizada com sucesso!" };
}
