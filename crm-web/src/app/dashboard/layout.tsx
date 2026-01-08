import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "sonner";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Get user role and organization status
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, organization_id, full_name, organizations(subscription_status)")
        .eq("id", user.id)
        .single();

    // Check if organization is blocked (only for non-super_admin)
    if (profile?.role !== "super_admin" && profile?.organizations) {
        const orgStatus = (profile.organizations as any).subscription_status;
        if (orgStatus === "blocked" || orgStatus === "inactive") {
            redirect("/suspended");
        }
    }

    return (
        <div className="flex bg-background h-screen overflow-hidden">
            <Sidebar role={profile?.role} fullName={profile?.full_name} />
            <main className="flex-1 ml-64 h-full overflow-y-auto p-8 text-text-primary scroll-smooth">
                {children}
            </main>
            <Toaster richColors theme="dark" position="bottom-right" />
        </div>
    );
}
