import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  gender?: "male" | "female" | "other";
  specialties?: string[];
  working_days?: string[];
  organization_id: string;
  role: "user" | "admin" | "professional" | "super_admin";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Create regular client to verify the requester
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify the requesting user
    const { data: { user: requestingUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !requestingUser) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get requesting user's CRM data and role
    const { data: requesterCrmUser } = await supabaseAdmin
      .from("crm_users")
      .select("id, organization_id")
      .eq("supabase_auth_id", requestingUser.id)
      .single();

    const { data: requesterRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", requestingUser.id)
      .single();

    const isSuperAdmin = requesterRole?.role === "super_admin";

    // Super admins can create users without having an organization
    // Regular users must have an organization
    if (!isSuperAdmin && !requesterCrmUser?.organization_id) {
      return new Response(JSON.stringify({ error: "Usuário sem organização" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: CreateUserRequest = await req.json();
    
    // For super_admin role, organization_id can be null
    const effectiveOrgId = body.role === "super_admin" ? null : body.organization_id;
    
    // Validate required fields (except organization_id for super_admin)
    if (!body.email || !body.password || !body.name) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.role !== "super_admin" && !body.organization_id) {
      return new Response(JSON.stringify({ error: "Organização é obrigatória para este tipo de usuário" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify organization matches (security check) - super admins can create in any org
    if (!isSuperAdmin && body.organization_id !== requesterCrmUser?.organization_id) {
      return new Response(JSON.stringify({ error: "Não pode criar usuários em outra organização" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === body.email);
    
    let newAuthUserId: string;
    
    if (existingUser) {
      // User exists - update password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: body.password }
      );
      
      if (updateError) {
        console.error("Password update error:", updateError);
        return new Response(JSON.stringify({ error: "Erro ao atualizar senha: " + updateError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      newAuthUserId = existingUser.id;
      
      // Check if CRM user already exists for this auth user
      const { data: existingCrmUser } = await supabaseAdmin
        .from("crm_users")
        .select("id")
        .eq("supabase_auth_id", existingUser.id)
        .single();
      
      if (existingCrmUser) {
        // Update existing CRM user
        const { error: updateCrmError } = await supabaseAdmin
          .from("crm_users")
          .update({
            organization_id: effectiveOrgId,
            name: body.name,
            gender: body.gender || null,
            specialties: body.specialties || [],
            working_days: body.working_days || [],
            active: true,
          })
          .eq("id", existingCrmUser.id);
        
        if (updateCrmError) {
          console.error("CRM user update error:", updateCrmError);
        }
        
        // Update role
        const { error: roleUpdateError } = await supabaseAdmin
          .from("user_roles")
          .upsert({
            user_id: existingUser.id,
            role: body.role || "professional",
          }, { onConflict: "user_id" });
        
        if (roleUpdateError) {
          console.error("Role update error:", roleUpdateError);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Usuário atualizado com sucesso (senha e dados alterados)",
            user_id: existingUser.id,
            updated: true
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Create new auth user
      const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
      });

      if (createAuthError) {
        console.error("Auth creation error:", createAuthError);
        return new Response(JSON.stringify({ error: createAuthError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      newAuthUserId = authData.user.id;
    }

    // Create CRM user record with created_by for audit trail
    const { error: crmUserError } = await supabaseAdmin
      .from("crm_users")
      .insert({
        supabase_auth_id: newAuthUserId,
        organization_id: effectiveOrgId,
        email: body.email,
        name: body.name,
        gender: body.gender || null,
        specialties: body.specialties || [],
        working_days: body.working_days || [],
        active: true,
        created_by: requesterCrmUser?.id || null, // Audit: who created this user
      });

    if (crmUserError) {
      // Rollback: delete auth user if CRM user creation fails
      await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);
      console.error("CRM user creation error:", crmUserError);
      return new Response(JSON.stringify({ error: "Erro ao criar perfil do usuário" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: newAuthUserId,
        role: body.role || "professional",
      });

    if (roleError) {
      console.error("Role creation error:", roleError);
      // Continue anyway, role can be added later
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Usuário criado com sucesso",
        user_id: newAuthUserId 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
