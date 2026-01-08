import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, User, Phone, Loader2, MessageSquare } from "lucide-react";
import { useSearchContacts, InboxLead } from "@/hooks/useInbox";
import { useCreateLead } from "@/hooks/useLeads";
import { useCrmUser } from "@/hooks/useCrmUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewChatModalProps {
    open: boolean;
    onClose: () => void;
    onSelectContact: (contact: InboxLead) => void;
}

export function NewChatModal({ open, onClose, onSelectContact }: NewChatModalProps) {
    const { crmUser } = useCrmUser();
    const searchContacts = useSearchContacts();
    const createLead = useCreateLead();

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<InboxLead[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        type: "lead" as "lead" | "client",
    });

    // Phone mask: (99) 99999-9999
    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 11) {
            return digits
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .substring(0, 15);
        }
        return value.substring(0, 15);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const data = await searchContacts.mutateAsync(searchQuery);
                    setResults(data);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleCreateContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            toast.error("Preencha nome e telefone");
            return;
        }

        try {
            // 1. Create Lead
            const newLeadData = await createLead.mutateAsync({
                name: formData.name,
                phone: formData.phone,
            });

            if (!newLeadData) throw new Error("Erro ao criar lead");

            // 2. If type is Client, create Client record linked to this lead
            if (formData.type === "client") {
                const { error: clientError } = await supabase
                    .from("crm_clients")
                    .insert({
                        organization_id: crmUser!.organization_id,
                        lead_id: newLeadData.id,
                        name: formData.name,
                        phone: formData.phone,
                        active: true,
                    });

                if (clientError) {
                    console.error("Error creating client:", clientError);
                    // We continue anyway since lead is created
                }
            }

            const newContact: InboxLead = {
                id: newLeadData.id,
                name: newLeadData.name,
                phone: newLeadData.phone,
                status: newLeadData.status,
                temperature: newLeadData.temperature,
                last_interaction_at: null,
                type: formData.type,
            };

            onSelectContact(newContact);
            resetAndClose();
        } catch (error) {
            console.error("Creation error:", error);
        }
    };

    const resetAndClose = () => {
        setSearchQuery("");
        setResults([]);
        setShowCreateForm(false);
        setFormData({ name: "", phone: "", type: "lead" });
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={resetAndClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden gap-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Nova Conversa
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col">
                    {!showCreateForm ? (
                        <div className="p-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar nome ou telefone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-11"
                                    autoFocus
                                />
                            </div>

                            <ScrollArea className="h-[300px] -mx-4 px-4">
                                {isSearching ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((contact) => (
                                            <button
                                                key={contact.id}
                                                onClick={() => {
                                                    onSelectContact(contact);
                                                    resetAndClose();
                                                }}
                                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 p-2 rounded-full">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-foreground">{contact.name}</p>
                                                        <p className="text-xs text-muted-foreground">{contact.phone || "Sem telefone"}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground">
                                                    {contact.type === 'client' ? 'Cliente' : 'Lead'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : searchQuery.length >= 2 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <p className="text-muted-foreground mb-4">Nenhum contato encontrado</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCreateForm(true)}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Cadastrar Novo
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
                                        <User className="h-10 w-10 mb-2" />
                                        <p className="text-sm">Digite pelo menos 2 caracteres para buscar</p>
                                    </div>
                                )}
                            </ScrollArea>

                            <div className="pt-4 border-t">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 h-11 text-primary hover:text-primary hover:bg-primary/5"
                                    onClick={() => setShowCreateForm(true)}
                                >
                                    <Plus className="h-5 w-5" />
                                    Iniciar com novo contato
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleCreateContact} className="p-4 space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
                            <div className="space-y-2">
                                <Label htmlFor="new-name">Nome Completo</Label>
                                <Input
                                    id="new-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nome do contato"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-phone">Telefone (WhatsApp)</Label>
                                <Input
                                    id="new-phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                                    placeholder="(99) 99999-9999"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Tipo de Contato</Label>
                                <RadioGroup
                                    value={formData.type}
                                    onValueChange={(v: any) => setFormData({ ...formData, type: v })}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <div>
                                        <RadioGroupItem value="lead" id="type-lead" className="peer sr-only" />
                                        <Label
                                            htmlFor="type-lead"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                            <User className="mb-2 h-6 w-6" />
                                            <span className="text-sm font-medium">Lead</span>
                                            <span className="text-[10px] text-muted-foreground">Interessado</span>
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="client" id="type-client" className="peer sr-only" />
                                        <Label
                                            htmlFor="type-client"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                            <User className="mb-2 h-6 w-6" />
                                            <span className="text-sm font-medium">Cliente</span>
                                            <span className="text-[10px] text-muted-foreground">Já é paciente</span>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="flex-1"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Voltar
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 gold-gradient text-secondary"
                                    disabled={createLead.isPending}
                                >
                                    {createLead.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                    )}
                                    Iniciar Conversa
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
