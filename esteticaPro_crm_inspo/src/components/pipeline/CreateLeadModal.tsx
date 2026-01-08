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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateLead, SourceType, Temperature } from "@/hooks/useLeads";
import { useCrmUser } from "@/hooks/useCrmUser";
import { OrganizationSelect } from "@/components/OrganizationSelect";

interface CreateLeadModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateLeadModal({ open, onClose }: CreateLeadModalProps) {
  const { isSuperAdmin, organizationId } = useCrmUser();
  const createLead = useCreateLead();

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source_type: "other" as SourceType,
    source_detail: "",
    temperature: "cold" as Temperature,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (isSuperAdmin && !selectedOrgId) return;

    await createLead.mutateAsync({
      ...formData,
      organization_id: isSuperAdmin ? selectedOrgId : undefined,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      source_type: "other",
      source_detail: "",
      temperature: "cold",
      notes: "",
    });
    setSelectedOrgId("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-full h-full sm:h-auto p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
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
              placeholder="Nome do lead"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select
                value={formData.source_type}
                onValueChange={(v) => setFormData({ ...formData, source_type: v as SourceType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ads">Anúncios</SelectItem>
                  <SelectItem value="organic">Orgânico</SelectItem>
                  <SelectItem value="indication">Indicação</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source_detail">Detalhe da Origem</Label>
              <Input
                id="source_detail"
                value={formData.source_detail}
                onChange={(e) => setFormData({ ...formData, source_detail: e.target.value })}
                placeholder="Ex: Meta Ads - Botox"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Temperatura</Label>
            <Select
              value={formData.temperature}
              onValueChange={(v) => setFormData({ ...formData, temperature: v as Temperature })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold">❄️ Frio</SelectItem>
                <SelectItem value="warm">🌡️ Morno</SelectItem>
                <SelectItem value="hot">🔥 Quente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações sobre o lead..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="gold-gradient text-secondary"
              disabled={createLead.isPending || (isSuperAdmin && !selectedOrgId)}
            >
              {createLead.isPending ? "Criando..." : "Criar Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
