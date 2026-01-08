import { createClient } from "@/utils/supabase/server";
import { LeadForm } from "@/components/leads/lead-form";
import { notFound } from "next/navigation";
import { getLeadPropertyInterests } from "../../actions";

export default async function EditLeadPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !lead) {
        notFound();
    }

    // Fetch property interests
    const propertyInterests = await getLeadPropertyInterests(id);

    const initialData = {
        id: lead.id,
        name: lead.full_name,
        phone: lead.phone,
        email: lead.email || "",
        source: lead.source as any,
        status: lead.status as any,
        interest_type: (lead.interest_type as any) || "compra",
        budget: lead.budget || undefined,
        summary: lead.summary || "",
    };

    return (
        <LeadForm initialData={initialData} propertyInterests={propertyInterests} />
    );
}
