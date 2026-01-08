"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, Plus, Trash2, Phone, MessageSquare } from "lucide-react";
import { ChatConversation } from "@/app/dashboard/chat/page";
import { getContactsForChat } from "@/app/dashboard/leads/actions";
import { getConversations, deleteConversation } from "@/app/dashboard/chat/actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ChatListProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
    extraChat: ChatConversation | null;
}

export function ChatList({ onSelect, selectedId, extraChat }: ChatListProps) {
    const [localConversations, setLocalConversations] = useState<ChatConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // UI State for New Chat Modal
    const [showNewChat, setShowNewChat] = useState(false);
    const [newChatName, setNewChatName] = useState("");
    const [newChatPhone, setNewChatPhone] = useState("");

    // Contact Selection State
    const [contacts, setContacts] = useState<any[]>([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);

    // Delete Confirmation State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<ChatConversation | null>(null);

    // Fetch conversations on mount
    useEffect(() => {
        setIsLoading(true);
        getConversations()
            .then(data => {
                setLocalConversations(data);
            })
            .catch(err => console.error("Failed to load chats", err))
            .finally(() => setIsLoading(false));
    }, []);

    // Sync extraChat if provided via URL/Props
    useEffect(() => {
        if (extraChat) {
            setLocalConversations(prev => {
                const exists = prev.find(c => c.id === extraChat.id || c.phone === extraChat.phone);
                if (!exists) {
                    return [extraChat, ...prev];
                }
                return prev;
            });
        }
    }, [extraChat]);

    // Fetch contacts when modal opens
    useEffect(() => {
        if (showNewChat && contacts.length === 0) {
            setIsLoadingContacts(true);
            getContactsForChat()
                .then(data => setContacts(data || []))
                .catch(err => console.error("Failed to load contacts", err))
                .finally(() => setIsLoadingContacts(false));
        }
    }, [showNewChat]);

    const handleSelect = (id: string) => {
        onSelect(id);
    };

    const handleCreateChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChatName || !newChatPhone) return;

        const newChat: ChatConversation = {
            id: `new-${Date.now()}`,
            name: newChatName,
            phone: newChatPhone,
            lastMessage: "Iniciando conversa...",
            time: "Agora",
            unread: 0
        };

        setLocalConversations(prev => [newChat, ...prev]);
        onSelect(newChat.id);
        setShowNewChat(false);
        // Reset form
        setNewChatName("");
        setNewChatPhone("");
    };

    const handleContactSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const contactId = e.target.value;
        if (!contactId) return;

        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
            setNewChatName(contact.full_name);
            setNewChatPhone(contact.phone);
        }
    };

    const handleDeleteConversation = async () => {
        if (!chatToDelete) return;

        try {
            // Optimistic update
            setLocalConversations(prev => prev.filter(c => c.id !== chatToDelete.id));
            if (selectedId === chatToDelete.id) onSelect(""); // Deselect if current

            await deleteConversation(chatToDelete.id);
            setShowDeleteDialog(false);
            setChatToDelete(null);
        } catch (error) {
            console.error("Failed to delete conversation", error);
            // Optionally revert here
            alert("Erro ao excluir conversa.");
        }
    };

    return (
        <div className="w-80 border-r border-border flex flex-col h-full bg-background relative">
            {/* Header & Search */}
            <div className="p-4 border-b border-border space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-text-primary">Conversas</h2>
                    <button
                        onClick={() => setShowNewChat(true)}
                        className="p-1.5 hover:bg-surface-elevated rounded-md text-primary transition-colors shadow-sm shadow-primary/10"
                        title="Nova Conversa"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-tertiary" />
                    <input
                        placeholder="Buscar conversa..."
                        className="w-full h-9 bg-surface border border-border rounded-lg pl-9 pr-4 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="p-8 text-center text-xs text-text-tertiary">
                        Carregando...
                    </div>
                ) : localConversations.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center">
                        <MessageSquare className="h-8 w-8 text-text-disabled mb-2" />
                        <p className="text-sm text-text-secondary">Nenhuma conversa</p>
                        <p className="text-xs text-text-tertiary mt-1">Clique em + para iniciar</p>
                    </div>
                ) : (
                    localConversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleSelect(chat.id)}
                            className={cn(
                                "group relative p-4 border-b border-border/50 cursor-pointer hover:bg-surface transition-colors",
                                selectedId === chat.id && "bg-surface border-l-2 border-l-primary"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={cn("text-sm font-medium", selectedId === chat.id ? "text-text-primary" : "text-text-secondary")}>{chat.name}</span>
                                <span className="text-[10px] text-text-tertiary">{chat.time}</span>
                            </div>
                            <p className="text-xs text-text-tertiary truncate pr-6">{chat.lastMessage}</p>

                            {chat.unread > 0 && (
                                <div className="absolute right-4 top-1/2 mt-2 h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                                    {chat.unread}
                                </div>
                            )}

                            {/* Delete Button - Visible on Hover */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setChatToDelete(chat);
                                    setShowDeleteDialog(true);
                                }}
                                className="absolute right-2 top-2 p-1.5 rounded-md text-text-tertiary hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-surface/80 backdrop-blur-sm"
                                title="Excluir conversa"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* New Chat Modal Overlay */}
            {showNewChat && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
                    <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-[280px] p-4 animate-in fade-in zoom-in duration-200">
                        <h3 className="font-medium text-text-primary mb-3">Nova Conversa</h3>
                        <form onSubmit={handleCreateChat} className="space-y-3">
                            <div>
                                <label className="text-xs text-text-secondary mb-1 block">Selecionar Contato (Opcional)</label>
                                <select
                                    className="w-full h-9 bg-surface-elevated border border-border rounded-lg px-2 text-sm text-text-primary focus:border-primary focus:outline-none transition-all"
                                    onChange={handleContactSelect}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Selecione um contato...</option>
                                    {isLoadingContacts ? (
                                        <option value="" disabled>Carregando...</option>
                                    ) : (
                                        contacts.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.full_name} ({c.classification === 'cliente' ? 'Cliente' : 'Lead'})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-border"></div>
                                <span className="flex-shrink-0 mx-2 text-[10px] text-text-tertiary uppercase">Ou manual</span>
                                <div className="flex-grow border-t border-border"></div>
                            </div>

                            <div>
                                <label className="text-xs text-text-secondary mb-1 block">Nome do Cliente</label>
                                <input
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    className="w-full h-9 bg-surface-elevated border border-border rounded-lg px-3 text-sm text-text-primary focus:border-primary focus:outline-none transition-all"
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-text-secondary mb-1 block">Telefone / WhatsApp</label>
                                <input
                                    value={newChatPhone}
                                    onChange={(e) => setNewChatPhone(e.target.value)}
                                    className="w-full h-9 bg-surface-elevated border border-border rounded-lg px-3 text-sm text-text-primary focus:border-primary focus:outline-none transition-all"
                                    placeholder="Ex: 11999999999"
                                />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewChat(false)}
                                    className="flex-1 h-9 rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-elevated transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newChatName || !newChatPhone}
                                    className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Iniciar Conversa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setChatToDelete(null);
                }}
                onConfirm={handleDeleteConversation}
                title="Excluir Conversa"
                description={`Tem certeza que deseja apagar a conversa com "${chatToDelete?.name}"? Todas as mensagens serão perdidas permanentemente.`}
                confirmText="Sim, excluir"
                variant="danger"
            />
        </div>
    );
}
