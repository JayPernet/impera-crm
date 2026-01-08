"use server";

import { createClient } from "@/utils/supabase/server";

export async function getConversations() {
    const supabase = await createClient();

    // Fetch all messages ordered by time
    const { data: messages, error } = await supabase
        .from("messages")
        .select(`
            id,
            content,
            created_at,
            sender,
            is_read,
            leads (
                id,
                full_name,
                phone
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }

    // Group by lead to form conversations (Client-side grouping for MVP simplicity)
    const conversationsMap = new Map();

    messages.forEach((msg: any) => {
        if (!msg.leads) return;
        const leadId = msg.leads.id;

        if (!conversationsMap.has(leadId)) {
            conversationsMap.set(leadId, {
                id: leadId,
                name: msg.leads.full_name,
                phone: msg.leads.phone,
                lastMessage: msg.content,
                time: new Date(msg.created_at).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                unread: msg.is_read ? 0 : (msg.sender === 'lead' ? 1 : 0),
                rawTime: new Date(msg.created_at) // For sorting if needed
            });
        } else {
            // Aggregate unread count
            const conv = conversationsMap.get(leadId);
            if (!msg.is_read && msg.sender === 'lead') {
                conv.unread += 1;
            }
        }
    });

    return Array.from(conversationsMap.values());
}

export async function deleteConversation(leadId: string) {
    const supabase = await createClient();

    // Deletes all messages for this lead
    const { error } = await supabase
        .from("messages")
        .delete()
        .eq("lead_id", leadId);

    if (error) {
        console.error("Error deleting conversation:", error);
        throw new Error("Failed to delete conversation");
    }

    return { success: true };
}

export async function sendMessage(leadId: string, content: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("messages")
        .insert({
            lead_id: leadId,
            content: content,
            sender: 'user',
            is_read: true
        });

    if (error) throw error;
    return { success: true };
}
