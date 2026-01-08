import { createClient } from "@/utils/supabase/server";
import { PropertyForm } from "@/components/properties/property-form";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        if (error) console.error("Error fetching property:", error);
        notFound();
    }

    return <PropertyForm property={property} />;
}
