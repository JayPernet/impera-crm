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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "@/hooks/useTasks";
import { useLeads } from "@/hooks/useLeads";
import { useClients } from "@/hooks/useClients";
import { useCrmUser } from "@/hooks/useCrmUser";
import { OrganizationSelect } from "@/components/OrganizationSelect";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Loader2 } from "lucide-react";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const { isSuperAdmin, organizationId } = useCrmUser();
  const createTask = useCreateTask();
  
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [linkType, setLinkType] = useState<"none" | "lead" | "client">("none");
  const [linkedId, setLinkedId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // For regular users, use their organization
  const effectiveOrgId = isSuperAdmin ? selectedOrgId : organizationId;

  // Fetch leads for the selected organization
  const { data: leads } = useLeads();
  const { data: clients } = useClients();

  // Fetch users from selected organization (for super_admin to assign task)
  const { data: orgUsers } = useQuery({
    queryKey: ["org-users-for-task", effectiveOrgId],
    queryFn: async () => {
      if (!effectiveOrgId) return [];
      const { data, error } = await supabase
        .from("crm_users")
        .select("id, name")
        .eq("organization_id", effectiveOrgId)
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!effectiveOrgId && isSuperAdmin,
  });

  // Reset form when org changes
  useEffect(() => {
    if (isSuperAdmin) {
      setLinkType("none");
      setLinkedId("");
      setSelectedUserId("");
    }
  }, [selectedOrgId, isSuperAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isSuperAdmin && (!selectedOrgId || !selectedUserId)) return;

    createTask.mutate(
      {
        title,
        description: description || undefined,
        due_date: dueDate || undefined,
        priority,
        lead_id: linkType === "lead" ? linkedId : undefined,
        client_id: linkType === "client" ? linkedId : undefined,
        organization_id: isSuperAdmin ? selectedOrgId : undefined,
        user_id: isSuperAdmin ? selectedUserId : undefined,
      },
      {
        onSuccess: () => {
          onClose();
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setLinkType("none");
    setLinkedId("");
    setSelectedOrgId("");
    setSelectedUserId("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Nova Tarefa
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization selector for super_admin */}
          <OrganizationSelect
            value={selectedOrgId}
            onChange={setSelectedOrgId}
          />

          {/* User selector for super_admin */}
          {isSuperAdmin && selectedOrgId && (
            <div className="space-y-2">
              <Label>Atribuir para *</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent>
                  {orgUsers?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Ligar para cliente"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes da tarefa..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Only show link options for non-super_admin or if they have org selected */}
          {(!isSuperAdmin || !selectedOrgId) && (
            <>
              <div className="space-y-2">
                <Label>Vincular a</Label>
                <Select value={linkType} onValueChange={(v) => { setLinkType(v as any); setLinkedId(""); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {linkType === "lead" && leads && leads.length > 0 && (
                <div className="space-y-2">
                  <Label>Selecionar Lead</Label>
                  <Select value={linkedId} onValueChange={setLinkedId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {linkType === "client" && clients && clients.length > 0 && (
                <div className="space-y-2">
                  <Label>Selecionar Cliente</Label>
                  <Select value={linkedId} onValueChange={setLinkedId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gold-gradient text-secondary"
              disabled={
                createTask.isPending || 
                !title.trim() || 
                (isSuperAdmin && (!selectedOrgId || !selectedUserId))
              }
            >
              {createTask.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
