import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Search, MessageSquare, ArrowLeft, User, Send, Loader2, AlertCircle, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import {
  useInboxLeads,
  useLeadMessages,
  useUnreadCountByLead,
  useMarkAsRead,
  useSendMessage,
  InboxLead,
  ChatMessage,
} from "@/hooks/useInbox";
import { useUploadChatMedia } from "@/hooks/useChatMedia";
import { LeadDetailsModal } from "@/components/pipeline/LeadDetailsModal";
import { NewChatModal } from "@/components/messaging/NewChatModal";
import { WhatsAppConnectionModal } from "@/components/messaging/WhatsAppConnectionModal";
import { SquarePen, Plus, Link as LinkIcon, Smartphone, Paperclip, FileText, Music, Image as ImageIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function formatMessageTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Ontem";
  return format(date, "dd/MM", { locale: ptBR });
}

function formatFullTime(dateString: string | null): string {
  if (!dateString) return "";
  return format(new Date(dateString), "HH:mm", { locale: ptBR });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Conversation List Item
function ConversationItem({
  lead,
  isSelected,
  onClick,
  lastMessage,
}: {
  lead: InboxLead;
  isSelected: boolean;
  onClick: () => void;
  lastMessage?: string;
}) {
  const { data: unreadCount = 0 } = useUnreadCountByLead(lead.id);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-border/50",
        isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-muted/50"
      )}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-muted text-foreground font-medium text-sm">
          {getInitials(lead.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-foreground truncate">{lead.name}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatMessageTime(lead.last_interaction_at)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground truncate">
            {lastMessage || "Nenhuma mensagem"}
          </span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs shrink-0">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// Chat Header
function ChatHeader({
  lead,
  onBack,
  onViewDetails,
}: {
  lead: InboxLead;
  onBack: () => void;
  onViewDetails: () => void;
}) {
  const getStatusLabel = (status: string | null) => {
    const labels: Record<string, string> = {
      new: "Novo",
      contacted: "Contatado",
      scheduled: "Agendado",
      lost: "Perdido",
    };
    return labels[status || ""] || status || "Novo";
  };

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(lead.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-foreground">{lead.name}</h3>
          <span className="text-xs text-muted-foreground">{getStatusLabel(lead.status)}</span>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onViewDetails}>
        <Eye className="h-4 w-4 mr-2" />
        Ver Detalhes
      </Button>
    </div>
  );
}

// Message Bubble
function MessageBubble({
  content,
  time,
  isInbound,
  senderName,
  mediaUrl,
  mediaType,
  fileName,
}: {
  content: string;
  time: string;
  isInbound: boolean;
  senderName?: string;
  mediaUrl?: string | null;
  mediaType?: string | null;
  fileName?: string | null;
}) {
  const [imageOpen, setImageOpen] = useState(false);

  const renderContent = () => {
    if (mediaType === 'image' && mediaUrl) {
      return (
        <div className="space-y-2">
          <Dialog open={imageOpen} onOpenChange={setImageOpen}>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group rounded overflow-hidden max-w-[200px] md:max-w-[300px]">
                <img
                  src={mediaUrl}
                  alt="Imagem"
                  className="rounded-lg object-cover w-full h-auto max-h-[300px] border border-border/10"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="text-white w-6 h-6 drop-shadow-lg" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full p-0 border-none bg-transparent shadow-none overflow-hidden flex items-center justify-center">
              <img src={mediaUrl} alt="Zoom" className="max-w-full max-h-[90vh] rounded-md shadow-2xl" />
            </DialogContent>
          </Dialog>
          {content && <p className="whitespace-pre-wrap break-words">{content}</p>}
        </div>
      );
    }

    if (mediaType === 'audio' && mediaUrl) {
      return (
        <div className="space-y-2 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-xs opacity-70">Áudio</span>
          </div>
          <audio controls src={mediaUrl} className="w-full h-8" />
          {content && <p className="whitespace-pre-wrap break-words mt-1">{content}</p>}
        </div>
      );
    }

    if (mediaType === 'document' && mediaUrl) {
      return (
        <div className="space-y-2">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex items-center gap-3 p-3 rounded-md border transition-colors group",
              isInbound
                ? "bg-background border-border hover:bg-muted"
                : "bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20"
            )}
          >
            <div className="bg-primary/10 p-2 rounded text-primary group-hover:bg-primary/20 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName || "Documento"}</p>
              <p className="text-xs opacity-70">Clique para baixar</p>
            </div>
          </a>
          {content && <p className="whitespace-pre-wrap break-words">{content}</p>}
        </div>
      );
    }

    // Default Text
    return <p className="whitespace-pre-wrap break-words">{content}</p>;
  };

  return (
    <div className={cn("flex mb-2", isInbound ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm",
          isInbound
            ? "bg-muted text-foreground rounded-bl-none"
            : "bg-primary/20 text-foreground rounded-br-none"
        )}
      >
        {!isInbound && senderName && (
          <p className="text-xs text-primary font-medium mb-1">{senderName}</p>
        )}
        {renderContent()}
        <p className={cn("text-[10px] mt-1 block", isInbound ? "text-muted-foreground" : "text-primary/70")}>
          {time}
        </p>
      </div>
    </div>
  );
}

// Chat Window
function ChatWindow({
  lead,
  onBack,
  onViewDetails,
}: {
  lead: InboxLead;
  onBack: () => void;
  onViewDetails: () => void;
}) {
  const { organizationId } = useCrmUser();
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useLeadMessages(lead.id);
  const markAsRead = useMarkAsRead();
  const sendMessage = useSendMessage();
  const [newMessage, setNewMessage] = useState("");
  const [organization, setOrganization] = useState<{
    id_instancia_z_api: string | null;
    token_z_api: string | null;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch organization for Z-API credentials
  useEffect(() => {
    if (!organizationId) return;
    supabase
      .from("crm_organizations")
      .select("id_instancia_z_api, token_z_api")
      .eq("id", organizationId)
      .single()
      .then(({ data }) => setOrganization(data));
  }, [organizationId]);

  const uploadMedia = useUploadChatMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !lead.id || !hasZApiConfigured || !lead.phone) return;

    try {
      // 1. Upload
      const { publicUrl, mediaType, fileName, filePath } = await uploadMedia.mutateAsync({
        file,
        leadId: lead.id
      });

      // 2. Identify type for Z-API/Database mapping
      // media_type on DB: text, image, audio, video, document, voice
      let dbMediaType = 'document';
      if (mediaType.startsWith('image')) dbMediaType = 'image';
      else if (mediaType.startsWith('audio')) dbMediaType = 'audio';
      else if (mediaType.startsWith('video')) dbMediaType = 'video';

      // 3. Send Message
      sendMessage.mutate({
        leadId: lead.id,
        leadName: lead.name,
        phone: lead.phone,
        message: newMessage.trim() || fileName, // Caption or Filename
        zapiInstanceId: organization!.id_instancia_z_api!,
        zapiToken: organization!.token_z_api!,
        mediaUrl: publicUrl,
        mediaType: dbMediaType,
        fileName: fileName
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending media:", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Mark as read when opening chat
  useEffect(() => {
    if (lead.id) {
      markAsRead.mutate(lead.id);
    }
  }, [lead.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    if (!lead.id) return;

    const channel = supabase
      .channel(`chat-${lead.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "crm_interactions",
          filter: `lead_id=eq.${lead.id}`,
        },
        (payload) => {
          if (payload.new) {
            // Invalidate queries to refresh list and chat
            queryClient.invalidateQueries({ queryKey: ["lead-messages", lead.id] });
            queryClient.invalidateQueries({ queryKey: ["inbox-leads"] });
            // If it's an inbound message, play a sound? (Optional, skipping for now)
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lead.id, queryClient]);

  const hasZApiConfigured = organization?.id_instancia_z_api && organization?.token_z_api;

  const handleSend = () => {
    if (!newMessage.trim() || !lead.phone || !hasZApiConfigured) return;

    // Optimistic update - add message locally
    const tempMessage = {
      id: `temp-${Date.now()}`,
      lead_id: lead.id,
      type: "whatsapp",
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      is_inbound: false,
      read: true,
      media_url: null,
      user_id: null,
    };

    sendMessage.mutate({
      leadId: lead.id,
      leadName: lead.name,
      phone: lead.phone,
      message: newMessage.trim(),
      zapiInstanceId: organization!.id_instancia_z_api!,
      zapiToken: organization!.token_z_api!,
    });

    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatHeader lead={lead} onBack={onBack} onViewDetails={onViewDetails} />

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
            <p>Nenhuma mensagem WhatsApp</p>
            <p className="text-sm">Envie a primeira mensagem para iniciar a conversa</p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content || ""}
                time={formatFullTime(msg.created_at)}
                isInbound={msg.is_inbound || false}
                senderName={!msg.is_inbound ? msg.user?.name : undefined}
                mediaUrl={msg.media_url}
                mediaType={msg.media_type}
                fileName={msg.file_name}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        {!hasZApiConfigured ? (
          <div className="flex items-center gap-2 text-warning text-sm bg-warning/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Configure Z-API nas configurações da clínica para enviar mensagens.</span>
          </div>
        ) : !lead.phone ? (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Este lead não possui telefone cadastrado.</span>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,application/pdf,audio/*,video/*"
            />
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-10 w-10"
              onClick={() => fileInputRef.current?.click()}
              disabled={sendMessage.isPending || uploadMedia.isPending}
            >
              {uploadMedia.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <Paperclip className="h-5 w-5 text-muted-foreground hover:text-primary" />
              )}
            </Button>

            <div className="flex-1 flex items-end gap-2">
              <Textarea
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="resize-none min-h-10 max-h-32 py-2"
              />
              <Button
                onClick={handleSend}
                disabled={!newMessage.trim() || sendMessage.isPending}
                className="h-10 px-4 bg-success hover:bg-success/90 shrink-0"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State
function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/30 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Mensagens</h3>
      <p className="text-muted-foreground max-w-sm">
        Selecione uma conversa à esquerda para visualizar as mensagens
      </p>
    </div>
  );
}

export default function Inbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<InboxLead | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [waConnectionOpen, setWaConnectionOpen] = useState(false);
  const { data: leads = [], isLoading } = useInboxLeads();
  const { data: messages = [] } = useLeadMessages(selectedLead?.id || null);

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      (lead.phone && lead.phone.includes(query))
    );
  });

  // If selectedLead is not in the list (new/search result), prepend it visually
  const displayedLeads = [...filteredLeads];
  if (selectedLead && !displayedLeads.find(l => l.id === selectedLead.id)) {
    displayedLeads.unshift(selectedLead);
  }

  const getLastMessage = (leadId: string) => {
    // This is a simple approach - ideally we'd fetch last message per lead
    if (selectedLead?.id === leadId && messages.length > 0) {
      return messages[messages.length - 1]?.content || "";
    }
    return "";
  };

  const handleSelectLead = (lead: InboxLead) => {
    setSelectedLead(lead);
    setShowMobileChat(true);
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      {/* Conversation List - Left Column */}
      <div
        className={cn(
          "w-full md:w-[350px] lg:w-[400px] border-r border-border flex flex-col bg-card",
          showMobileChat && "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Inbox
            </h1>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setWaConnectionOpen(true)}>
                      <Smartphone className="w-4 h-4 text-muted-foreground hover:text-green-500 transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Conectar WhatsApp</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setNewChatModalOpen(true)}>
                      <SquarePen className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Nova Conversa</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou telefone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : displayedLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <User className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? "Nenhum lead encontrado" : "Nenhuma conversa"}
              </p>
            </div>
          ) : (
            displayedLeads.map((lead) => (
              <ConversationItem
                key={lead.id}
                lead={lead}
                isSelected={selectedLead?.id === lead.id}
                onClick={() => handleSelectLead(lead)}
                lastMessage={getLastMessage(lead.id)}
              />
            ))
          )}
        </ScrollArea>
      </div>

      {/* Chat Window - Right Column */}
      <div
        className={cn(
          "flex-1 flex flex-col",
          !showMobileChat && "hidden md:flex"
        )}
      >
        {selectedLead ? (
          <ChatWindow
            lead={selectedLead}
            onBack={handleBack}
            onViewDetails={() => setDetailsModalOpen(true)}
          />
        ) : (
          <EmptyChat />
        )}
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          leadId={selectedLead.id}
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          onCreateAppointment={() => { }}
        />
      )}

      {/* New Chat Modal */}
      <NewChatModal
        open={newChatModalOpen}
        onClose={() => setNewChatModalOpen(false)}
        onSelectContact={(contact) => {
          setSelectedLead(contact);
          setShowMobileChat(true);
        }}
      />

      <WhatsAppConnectionModal
        open={waConnectionOpen}
        onClose={() => setWaConnectionOpen(false)}
      />
    </div>
  );
}
