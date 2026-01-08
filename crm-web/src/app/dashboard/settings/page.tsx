import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./components/profile-form";
import { NotificationsForm } from "./components/notifications-form";
import { SecurityForm } from "./components/security-form";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Não autorizado</div>;
    }

    // Fetch profile
    let { data: profile } = await supabase
        .from("profiles")
        .select("full_name, notification_preferences")
        .eq("id", user.id)
        .single();

    const initialName = profile?.full_name || user?.user_metadata?.full_name || "";
    const initialEmail = user?.email || "";

    // Default preferences if null
    const defaultPreferences = { leads: true, team: false, security: true };
    const initialPreferences = profile?.notification_preferences
        ? { ...defaultPreferences, ...profile.notification_preferences }
        : defaultPreferences;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-text-primary">Configurações</h1>
                <p className="text-text-secondary mt-1">Gerencie seu perfil e preferências do sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Settings Column */}
                <div className="md:col-span-2 space-y-6">
                    <ProfileForm initialName={initialName} email={initialEmail} />
                    <NotificationsForm initialPreferences={initialPreferences} />
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <SecurityForm />
                </div>
            </div>
        </div>
    );
}
