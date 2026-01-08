import { useState, useRef, useEffect } from "react";
import { useCrmUser } from "@/hooks/useCrmUser";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Assistente() {
  const { crmUser, organizationId, isSuperAdmin, loading: userLoading } = useCrmUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if feature is enabled for the organization
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ["organization-ai-feature", organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("feature_ai_assistant, name")
        .eq("id", organizationId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!organizationId && !isSuperAdmin,
  });

  // Super admin always has access, others need the feature enabled
  const isFeatureEnabled = isSuperAdmin || organization?.feature_ai_assistant === true;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing || !crmUser) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const payload: Record<string, unknown> = {
        messaget: userMessage.content,
        user_name: crmUser.name,
        organization_id: organizationId,
      };

      // Add super_admin flag when applicable
      if (isSuperAdmin) {
        payload.super_admin = true;
      }

      const webhookUrl = import.meta.env.VITE_N8N_AI_WEBHOOK;

      if (!webhookUrl) {
        throw new Error("URL do webhook do assistente não configurada");
      }

      const response = await fetch(
        webhookUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Falha na comunicação com o assistente");
      }

      const data = await response.text();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data || "Desculpe, não consegui processar sua solicitação.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Copiloto error:", error);
      toast.error("Erro ao comunicar com o Copiloto");

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Super admin doesn't need to wait for org loading
  if (userLoading || (!isSuperAdmin && orgLoading)) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Sparkles className="h-6 w-6 animate-pulse text-primary" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  // Feature locked screen
  if (!isFeatureEnabled) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-6">
        <Card className="max-w-md p-8 text-center bg-gradient-to-br from-background to-muted/30 border-primary/20">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Lock className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3">Funcionalidade Premium</h2>
          <p className="text-muted-foreground mb-6">
            O Copiloto IA é uma funcionalidade exclusiva.
            Entre em contato com o suporte para ativar este recurso para sua clínica.
          </p>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            Contatar Suporte
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Copiloto</h1>
          <p className="text-xs text-muted-foreground">Seu assistente inteligente</p>
        </div>
        <Sparkles className="h-4 w-4 text-primary ml-auto animate-pulse" />
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Olá! Sou o Copiloto</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Posso ajudar com informações sobre leads, agendamentos,
                relatórios e muito mais. Como posso ajudar?
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 border border-primary/20 h-fit">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/50 border border-border/50 rounded-bl-md"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span
                  className={cn(
                    "text-[10px] mt-1 block",
                    message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 p-2 rounded-lg bg-secondary h-fit">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 border border-primary/20 h-fit">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs text-muted-foreground">Processando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Diga o que você precisa..."
            className="min-h-[52px] max-h-32 resize-none bg-muted/30 border-border/50 focus:border-primary/50"
            disabled={isProcessing}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="h-[52px] px-4 bg-primary hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
