"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrganization(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Verify super_admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "super_admin") {
        return { message: "Unauthorized: Super Admin only" };
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const adminName = formData.get("adminName") as string;
    const adminEmail = formData.get("adminEmail") as string;
    const adminPassword = formData.get("adminPassword") as string;
    const whatsappAutomated = formData.get("whatsappAutomated") === "true";
    const whatsappType = formData.get("whatsappType") as string | null;
    const tokenId = formData.get("tokenId") as string | null;
    const instanceId = formData.get("instanceId") as string | null;

    if (!name || !slug || !adminName || !adminEmail || !adminPassword) {
        return { message: "Missing required fields" };
    }

    // 1. Create organization
    const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
            name,
            slug,
            subscription_status: "active",
            plan_id: "free",
            whatsapp_automated: whatsappAutomated,
            whatsapp_type: whatsappType,
            token_id: tokenId,
            instance_id: instanceId,
        })
        .select()
        .single();

    if (orgError) {
        console.error("Error creating organization:", orgError);
        return { message: orgError.message };
    }

    // 2. Create admin user in auth.users (Using Admin Client to bypass role restrictions)
    const adminClient = await createAdminClient();
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
    });

    if (authError) {
        // Rollback: delete organization
        await supabase.from("organizations").delete().eq("id", org.id);
        console.error("Error creating admin user:", authError);
        return { message: authError.message };
    }

    // 3. Create profile for admin (Using Admin Client to bypass RLS)
    const { error: profileError } = await adminClient
        .from("profiles")
        .insert({
            id: authData.user.id,
            organization_id: org.id,
            full_name: adminName,
            role: "admin",
        });

    if (profileError) {
        // Rollback: delete user and organization
        await supabase.auth.admin.deleteUser(authData.user.id);
        await supabase.from("organizations").delete().eq("id", org.id);
        console.error("Error creating profile:", profileError);
        return { message: profileError.message };
    }

    revalidatePath("/dashboard/admin/organizations");
    return { success: true };
}

export async function updateOrganization(formData: FormData) {
    const supabase = await createClient();

    // Verify super_admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "super_admin") {
        return { message: "Unauthorized: Super Admin only" };
    }

    const orgId = formData.get("orgId") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const adminName = formData.get("adminName") as string;
    const adminEmail = formData.get("adminEmail") as string;
    const adminPassword = formData.get("adminPassword") as string;
    const whatsappAutomated = formData.get("whatsappAutomated") === "true";
    const whatsappType = formData.get("whatsappType") as string | null;
    const tokenId = formData.get("tokenId") as string | null;
    const instanceId = formData.get("instanceId") as string | null;

    if (!orgId || !name || !slug) {
        return { message: "Missing required fields" };
    }

    // 1. Update organization
    const { error: orgError } = await supabase
        .from("organizations")
        .update({
            name,
            slug,
            whatsapp_automated: whatsappAutomated,
            whatsapp_type: whatsappType,
            token_id: tokenId,
            instance_id: instanceId,
        })
        .eq("id", orgId);

    if (orgError) {
        console.error("Error updating organization:", orgError);
        return { message: orgError.message };
    }

    // 2. Find admin user and update if provided
    const { data: adminProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("organization_id", orgId)
        .eq("role", "admin")
        .single();

    if (adminProfile) {
        // Update profile name (Using Admin Client to bypass RLS)
        if (adminName) {
            const adminClient = await createAdminClient();
            await adminClient
                .from("profiles")
                .update({ full_name: adminName })
                .eq("id", adminProfile.id);
        }

        // Update Auth User (Email and Password)
        const updateData: any = {};
        if (adminEmail) updateData.email = adminEmail;
        if (adminPassword) updateData.password = adminPassword;

        if (Object.keys(updateData).length > 0) {
            const adminClient = await createAdminClient();
            const { error: authError } = await adminClient.auth.admin.updateUserById(
                adminProfile.id,
                updateData
            );
            if (authError) {
                console.error("Error updating admin auth data:", authError);
                return { message: "Erro ao atualizar dados de acesso: " + authError.message };
            }
        }
    } else if (adminEmail && adminPassword) {
        // 3. If no admin exists for this org, try to find/create the user
        const adminClient = await createAdminClient();
        let authUser: any = null;

        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true,
        });

        if (authError) {
            // If user already exists in Auth, we try to find them to link the profile
            if (authError.message.includes("already been registered")) {
                const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
                if (!listError) {
                    authUser = users.find(u => u.email === adminEmail);
                }

                // Also update the password since it was provided
                if (authUser) {
                    await adminClient.auth.admin.updateUserById(authUser.id, { password: adminPassword });
                }
            }

            if (!authUser) {
                console.error("Error creating new admin in update:", authError);
                return { message: "Erro ao criar conta de acesso: " + authError.message };
            }
        } else {
            authUser = authData.user;
        }

        if (authUser) {
            const { error: profileError } = await adminClient.from("profiles").upsert({
                id: authUser.id,
                organization_id: orgId,
                full_name: adminName || "Administrador",
                role: "admin",
            });

            if (profileError) {
                console.error("Error creating profile in update:", profileError);
                return { message: "Organização atualizada, mas erro ao vincular gestor: " + profileError.message };
            }
        }
    }


    revalidatePath("/dashboard/admin/organizations");
    return { success: true };
}

export async function updateOrganizationStatus(orgId: string, status: string) {
    const supabase = await createClient();

    // Verify super_admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "super_admin") {
        return { message: "Unauthorized: Super Admin only" };
    }

    const { error } = await supabase
        .from("organizations")
        .update({ subscription_status: status })
        .eq("id", orgId);

    if (error) {
        console.error("Error updating organization status:", error);
        return { message: error.message };
    }

    revalidatePath("/dashboard/admin/organizations");
    return { success: true };
}

export async function updateOrganizationFeatures(
    orgId: string,
    whatsappAutomated: boolean,
    whatsappType: string | null,
    tokenId: string | null,
    instanceId: string | null
) {
    const supabase = await createClient();

    // Verify super_admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "super_admin") {
        return { message: "Unauthorized: Super Admin only" };
    }

    const { error } = await supabase
        .from("organizations")
        .update({
            whatsapp_automated: whatsappAutomated,
            whatsapp_type: whatsappType,
            token_id: tokenId,
            instance_id: instanceId,
        })
        .eq("id", orgId);

    if (error) {
        console.error("Error updating organization features:", error);
        return { message: error.message };
    }

    revalidatePath("/dashboard/admin/organizations");
    return { success: true };
}
export async function deleteOrganization(orgId: string) {
    const supabase = await createClient();

    // Verify super_admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "super_admin") {
        return { message: "Unauthorized: Super Admin only" };
    }

    // 1. Get all users linked to this organization
    const { data: linkedProfiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("organization_id", orgId);

    const adminClient = await createAdminClient();

    // 2. Delete each user from Supabase Auth
    if (linkedProfiles && linkedProfiles.length > 0) {
        for (const p of linkedProfiles) {
            // We don't want to delete the current super_admin if they somehow got linked (failsafe)
            if (p.id === user.id) continue;

            const { error: authError } = await adminClient.auth.admin.deleteUser(p.id);
            if (authError) {
                console.error(`Error deleting auth user ${p.id}:`, authError);
            }
        }
    }

    // 3. Delete organization (Cascade will handle profiles, leads, properties, and messages in DB)
    const { error: orgError } = await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);

    if (orgError) {
        console.error("Error deleting organization:", orgError);
        return { message: "Erro ao excluir imobiliária: " + orgError.message };
    }

    revalidatePath("/dashboard/admin/organizations");
    return { success: true };
}
