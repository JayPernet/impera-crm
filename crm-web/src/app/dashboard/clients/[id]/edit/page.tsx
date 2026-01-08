import { createClient } from "@/utils/supabase/server";
import { ClientForm } from "@/components/clients/client-form";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: client, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .eq("classification", "cliente")
        .single();

    if (error || !client) {
        notFound();
    }

    const initialData = {
        id: client.id,
        name: client.full_name,
        phone: client.phone,
        email: client.email || "",
        interest_type: (client.interest_type as any) || "compra",
        budget: client.budget || undefined,
        summary: client.summary || "",
    };

    return (
        <ClientForm initialData={initialData} />
    );
}
