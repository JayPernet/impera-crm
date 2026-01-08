import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function POST() {
    const supabase = await createClient()

    // Check if a user's logged in before attempting to log out
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    return redirect("/")
}
