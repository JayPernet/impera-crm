import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Lovable preview/runtime does not reliably inject VITE_* env vars.
// Use the Supabase project ref + anon (publishable) key directly.
const SUPABASE_URL = "https://itmpkyecrafenaxavbjm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXBreWVjcmFmZW5heGF2YmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MzM3NzgsImV4cCI6MjA3MzEwOTc3OH0.7jI91BSBdV1f9_ISrrp5U51jaP8p1pliO0-5Ggp3-3s";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
