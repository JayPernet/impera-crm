"use client";

import { ChatList } from "@/components/chat/chat-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Define a type for a conversation
export type ChatConversation = {
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    time: string;
    unread: number;
}

function ChatPageContent() {
    const searchParams = useSearchParams();
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [extraChat, setExtraChat] = useState<ChatConversation | null>(null);

    // Initial load from params
    useEffect(() => {
        const phone = searchParams.get("phone");
        const name = searchParams.get("name");

        if (phone && name) {
            // Check if we need to create a temporary chat session context
            // We use the phone as ID for simplicity in this bridge or a distinct prefix
            const newChat: ChatConversation = {
                id: `lead-${phone}`,
                name: name,
                phone: phone,
                lastMessage: "Iniciando conversa...",
                time: "Agora",
                unread: 0
            };
            setExtraChat(newChat);
            setSelectedChatId(newChat.id);
        }
    }, [searchParams]);

    return (
        <div className="h-[calc(100vh-64px)] border border-border rounded-xl overflow-hidden flex shadow-2xl shadow-primary/5">
            <ChatList
                selectedId={selectedChatId}
                onSelect={setSelectedChatId}
                extraChat={extraChat}
            />
            <ChatWindow
                chatId={selectedChatId}
                extraChat={extraChat}
            />
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div className="p-8 text-text-secondary">Carregando chat...</div>}>
            <ChatPageContent />
        </Suspense>
    )
}
