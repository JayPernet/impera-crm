"use client";

import { Send, Bot, User } from "lucide-react";
import { useState } from "react";
import { ChatConversation } from "@/app/dashboard/chat/page";

export function ChatWindow({ chatId, extraChat }: { chatId: string | null, extraChat: ChatConversation | null }) {
    const [messages, setMessages] = useState([
        { id: 1, text: "Olá! Gostaria de saber mais sobre o apartamento no Jardins.", sender: "lead", time: "09:30" },
        { id: 2, text: "Claro! É uma excelente oportunidade. Ele tem 3 suítes.", sender: "me", time: "09:32" },
        { id: 3, text: "Podemos agendar para amanhã?", sender: "lead", time: "09:41" }
    ]);
    const [iaActive, setIaActive] = useState(true);

    // Derived state for display
    const isExtra = chatId === extraChat?.id;
    const displayTitle = isExtra ? extraChat?.name : "Roberto Justus";
    const displayInitials = isExtra ? extraChat?.name.substring(0, 2).toUpperCase() : "RJ";

    // Clearer messages for new chat
    const displayMessages = isExtra ? [] : messages;

    if (!chatId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background text-text-tertiary">
                <div className="text-center">
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
                        <span className="text-xs text-success">Online</span>
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
                {displayMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
                        <p>Inicie a conversa com {displayTitle}</p>
                    </div>
                ) : (
                    displayMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.sender === 'me' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-surface-elevated text-text-primary rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'me' ? 'text-primary-foreground/80' : 'text-text-tertiary'}`}>{msg.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-surface">
                <div className="relative">
                    <input
                        className="w-full h-11 bg-surface-elevated border border-border rounded-lg pl-4 pr-12 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                        placeholder="Digite sua mensagem..."
                    />
                    <button className="absolute right-2 top-2 p-1.5 bg-primary rounded-md text-primary-foreground hover:bg-primary-light transition-colors">
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
