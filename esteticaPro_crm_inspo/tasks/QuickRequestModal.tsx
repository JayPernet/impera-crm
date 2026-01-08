import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCrmUser } from "@/hooks/useCrmUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

interface QuickRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkedClientId?: string | null;
  linkedClientName?: string | null;
}

interface ReceptionUser {
  id: string;
  name: string;
  role: string;
}

export function QuickRequestModal({ 
  open, 
  onOpenChange, 
  linkedClientId, 
  linkedClientName 
}: QuickRequestModalProps) {
  const { crmUser } = useCrmUser();
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [receptionUsers, setReceptionUsers] = useState<ReceptionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    if (open && crmUser?.organization_id) {
      fetchReceptionUsers();
    }
  }, [open, crmUser?.organization_id]);

  const fetchReceptionUsers = async () => {
    if (!crmUser?.organization_id) return;
    
    setLoadingUsers(true);
    try {
      // Get users with 'user' or 'admin' role from the same organization
      const { data: users, error } = await supabase
        .from("crm_users")
        .select("id, name, supabase_auth_id")
        .eq("organization_id", crmUser.organization_id)
        .eq("active", true)
        .neq("id", crmUser.id); // Exclude self

      if (error) throw error;

      // Now get roles for these users
      const userIds = users?.map(u => u.supabase_auth_id) || [];
      
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds)
        .eq("role", "user"); // Only secretaries (user role)

      if (rolesError) throw rolesError;

      // Filter users that have user role (secretaries only)
      const roleSet = new Set(roles?.map(r => r.user_id) || []);
      const filteredUsers: ReceptionUser[] = users
        ?.filter(u => roleSet.has(u.supabase_auth_id))
        .map(u => ({
          id: u.id,
          name: u.name,
          role: "user"
        })) || [];

      setReceptionUsers(filteredUsers);
      
      // Auto-select first user with 'user' role (receptionist)
      const firstReceptionist = filteredUsers.find(u => u.role === "user");
      if (firstReceptionist) {
        setSelectedUserId(firstReceptionist.id);
      } else if (filteredUsers.length > 0) {
        setSelectedUserId(filteredUsers[0].id);
      }
    } catch (error) {
      console.error("Error fetching reception users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Digite uma mensagem");
      return;
    }
    if (!selectedUserId) {
      toast.error("Selecione um destinatário");
      return;
    }
    if (!crmUser?.id || !crmUser?.organization_id) {
      toast.error("Erro de autenticação");
      return;
    }

    setLoading(true);
    try {
      // Create truncated title from message (first 50 chars)
      const title = `Solicitação: ${message.slice(0, 50)}${message.length > 50 ? "..." : ""}`;

      const { error } = await supabase.from("crm_tasks").insert({
        title,
        description: message,
        user_id: selectedUserId,
        created_by: crmUser.id,
        organization_id: crmUser.organization_id,
        priority: "high",
        status: "pending",
        task_type: "manual",
        client_id: linkedClientId || null,
      });

      if (error) throw error;

      toast.success("Solicitação enviada para recepção!");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating request:", error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            Avisar Recepção
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="message">O que precisa?</Label>
            <Textarea
              id="message"
              placeholder="Ex: Marcia pediu para remarcar para semana que vem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Para quem?</Label>
            <Select 
              value={selectedUserId} 
              onValueChange={setSelectedUserId}
              disabled={loadingUsers}
            >
              <SelectTrigger id="recipient">
                <SelectValue placeholder={loadingUsers ? "Carregando..." : "Selecione"} />
              </SelectTrigger>
              <SelectContent>
                {receptionUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {linkedClientName && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                📋 Vinculado ao paciente: <strong className="text-foreground">{linkedClientName}</strong>
              </p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !message.trim() || !selectedUserId}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Enviar Solicitação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
