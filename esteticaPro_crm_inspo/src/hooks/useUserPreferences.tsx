import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "./useCrmUser";
import { toast } from "sonner";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    newLeads: boolean;
    taskReminders: boolean;
    dailySummary: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  notifications: {
    newLeads: true,
    taskReminders: true,
    dailySummary: false,
  },
};

export function useUserPreferences() {
  const { crmUser } = useCrmUser();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load preferences from database
  useEffect(() => {
    async function loadPreferences() {
      if (!crmUser?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("crm_users")
          .select("preferences")
          .eq("id", crmUser.id)
          .single();

        if (error) throw error;

        if (data?.preferences) {
          const dbPrefs = data.preferences as unknown as UserPreferences;
          setPreferences({
            theme: dbPrefs.theme || defaultPreferences.theme,
            notifications: {
              newLeads: dbPrefs.notifications?.newLeads ?? defaultPreferences.notifications.newLeads,
              taskReminders: dbPrefs.notifications?.taskReminders ?? defaultPreferences.notifications.taskReminders,
              dailySummary: dbPrefs.notifications?.dailySummary ?? defaultPreferences.notifications.dailySummary,
            },
          });
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [crmUser?.id]);

  // Apply theme effect
  useEffect(() => {
    if (isLoading) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (preferences.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      localStorage.setItem("theme", systemTheme);
    } else {
      root.classList.add(preferences.theme);
      localStorage.setItem("theme", preferences.theme);
    }
  }, [preferences.theme, isLoading]);

  // Save preferences to database
  const savePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!crmUser?.id) return;

    const updatedPreferences = {
      ...preferences,
      ...newPreferences,
      notifications: {
        ...preferences.notifications,
        ...(newPreferences.notifications || {}),
      },
    };

    setPreferences(updatedPreferences);
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("crm_users")
        .update({ preferences: JSON.parse(JSON.stringify(updatedPreferences)) })
        .eq("id", crmUser.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Erro ao salvar preferências");
    } finally {
      setIsSaving(false);
    }
  };

  const updateTheme = (theme: UserPreferences["theme"]) => {
    savePreferences({ theme });
  };

  const updateNotification = (key: keyof UserPreferences["notifications"], value: boolean) => {
    savePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: value,
      },
    });
  };

  return {
    preferences,
    isLoading,
    isSaving,
    updateTheme,
    updateNotification,
    savePreferences,
  };
}
