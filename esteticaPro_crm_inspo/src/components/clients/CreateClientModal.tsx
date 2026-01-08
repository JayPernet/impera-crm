import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import { OrganizationSelect } from "@/components/OrganizationSelect";
import { toast } from "sonner";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateClientModal({ open, onClose }: CreateClientModalProps) {
  const { crmUser, isSuperAdmin, organizationId } = useCrmUser();
  const queryClient = useQueryClient();

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const effectiveOrgId = isSuperAdmin ? selectedOrgId : organizationId;

  const createClient = useMutation({
    mutationFn: async () => {
      if (!effectiveOrgId) throw new Error("Sem organização");

      const { error } = await supabase.from("crm_clients").insert({
        organization_id: effectiveOrgId,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
        notes: formData.notes || null,
        converted_at: new Date().toISOString(),
        total_appointments: 0,
        estimated_revenue: 0,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente criado com sucesso!");
      handleClose();
    },
    onError: () => {
      toast.error("Erro ao criar cliente");
    },
  });

  const handleClose = () => {
    setFormData({ name: "", phone: "", email: "", notes: "" });
    setSelectedOrgId("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (isSuperAdmin && !selectedOrgId) {
      toast.error("Selecione uma clínica");
      return;
    }
    createClient.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization selector for super_admin */}
          <OrganizationSelect
            value={selectedOrgId}
            onChange={setSelectedOrgId}
          />

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações sobre o cliente"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="gold-gradient text-secondary" 
              disabled={createClient.isPending || (isSuperAdmin && !selectedOrgId)}
            >
              {createClient.isPending ? "Criando..." : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
