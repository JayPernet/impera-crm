"use client";

import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ChatConversation } from "@/app/dashboard/chat/page";
import { createClient } from "@/utils/supabase/client";

interface ChatMessage {
    id: number;
    session_id: string;
    message: {
        type: "human" | "ai";
        content: string;
    };
    created_at: string;
}

export function ChatWindow({ chatId, extraChat }: { chatId: string | null, extraChat: ChatConversation | null }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [iaActive, setIaActive] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Derived state for display
    const isExtra = chatId === extraChat?.id;
    const displayTitle = isExtra ? extraChat?.name : "Selecione uma conversa";
    const displayInitials = isExtra ? extraChat?.name.substring(0, 2).toUpperCase() : "?";
    const displayPhone = isExtra ? extraChat?.phone : null;

    // Fetch messages when chatId changes
    useEffect(() => {
        if (!displayPhone) {
            setMessages([]);
            return;
        }

        const supabase = createClient();
        setIsLoading(true);

        async function fetchMessages() {
            const { data, error } = await supabase
                .from("n8n_historico_mensagens")
                .select("*")
                .eq("session_id", displayPhone)
                .order("created_at", { ascending: true });

            if (!error && data) {
                // Sanitize: Filter out LangChain system prompts
                const cleanMessages = data.filter((msg) => {
                    const content = msg.message?.content || "";
                    // Skip if it's a massive system prompt or contains LangChain tags
                    return !content.includes("<papel>") && content.length < 5000;
                });
                setMessages(cleanMessages);
            }
            setIsLoading(false);
        }

        fetchMessages();

        // Real-time subscription
        const channel = supabase
            .channel(`chat-${displayPhone}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "n8n_historico_mensagens",
                    filter: `session_id=eq.${displayPhone}`,
                },
                (payload) => {
                    const newMsg = payload.new as ChatMessage;
                    const content = newMsg.message?.content || "";
                    if (!content.includes("<papel>") && content.length < 5000) {
                        setMessages((prev) => [...prev, newMsg]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [displayPhone]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!chatId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background text-text-tertiary">
                <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Selecione uma conversa para iniciar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-background">
            {/* Header */}
            <div className="h-16 border-b border-border flex items-center px-6 justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                        {displayInitials}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-text-primary">{displayTitle}</h3>
                        <span className="text-xs text-text-tertiary">{displayPhone}</span>
                    </div>
                </div>

                {/* IA Toggle */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary uppercase tracking-wider">Modo:</span>
                    <button
                        onClick={() => setIaActive(!iaActive)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${iaActive
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-surface border-border text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        {iaActive ? (
                            <>
                                <Bot className="h-3.5 w-3.5" />
                                IA Ativa
                            </>
                        ) : (
                            <>
                                <User className="h-3.5 w-3.5" />
                                Manual
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-text-tertiary" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
                        <div className="text-center">
                            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p>Nenhuma mensagem</p>
                            <p className="text-xs mt-1">O histórico aparecerá aqui</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => {
                            const isInbound = msg.message.type === "human";
                            let content = msg.message.content;

                            // Try to parse if it's a JSON string (AI responses often are)
                            try {
                                const parsed = JSON.parse(content);
                                if (parsed.mensagem) content = parsed.mensagem;
                            } catch {
                                // Not JSON, use as-is
                            }

                            return (
                                <div key={msg.id} className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-xl text-sm ${isInbound ? 'bg-surface-elevated text-text-primary rounded-bl-none' : 'bg-primary text-primary-foreground rounded-br-none'}`}>
                                        <p className="whitespace-pre-wrap break-words">{content}</p>
                                        <span className={`text-[10px] block mt-1 text-right ${isInbound ? 'text-text-tertiary' : 'text-primary-foreground/80'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-surface">
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const input = form.elements.namedItem('message') as HTMLInputElement;
                    const content = input.value.trim();

                    if (!content || !displayPhone) return;

                    // Optimistic UI: Add message immediately
                    const optimisticMessage: ChatMessage = {
                        id: Date.now(), // Temporary ID
                        session_id: displayPhone,
                        message: {
                            type: 'ai',
                            content: content
                        },
                        created_at: new Date().toISOString()
                    };
                    setMessages(prev => [...prev, optimisticMessage]);
                    input.value = '';

                    // Insert into database
                    const supabase = createClient();
                    const { error } = await supabase
                        .from('n8n_historico_mensagens')
                        .insert({
                            session_id: displayPhone,
                            message: {
                                type: 'ai',
                                content: content
                            }
                        });

                    if (error) {
                        console.error('Error sending message:', error);
                        // Remove optimistic message on error
                        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
                        alert('Erro ao enviar mensagem. Tente novamente.');
                    }
                }} className="flex items-center gap-2">
                    <input
                        name="message"
                        type="text"
                        placeholder={iaActive ? "IA está ativa - mensagens manuais serão enviadas como IA" : "Digite sua mensagem..."}
                        className="flex-1 h-10 px-4 bg-surface-elevated border border-border rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
                        disabled={!displayPhone}
                    />
                    <button
                        type="submit"
                        disabled={!displayPhone}
                        className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
