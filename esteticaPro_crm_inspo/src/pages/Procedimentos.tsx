import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Scissors, DollarSign, RotateCcw, Edit } from "lucide-react";
import { useProcedures, useCreateProcedure, useUpdateProcedure, useToggleProcedureActive, Procedure } from "@/hooks/useProcedures";

export default function Procedimentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<Procedure | null>(null);

  const [formData, setFormData] = useState({ name: "", suggested_price: "", return_days: "0", active: true });

  const { data: procedures, isLoading } = useProcedures(true);
  const createProcedure = useCreateProcedure();
  const updateProcedure = useUpdateProcedure();
  const toggleActive = useToggleProcedureActive();

  const filteredProcedures = (procedures || []).filter((proc) =>
    proc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingProcedure(null);
    setFormData({ name: "", suggested_price: "", return_days: "0", active: true });
    setShowModal(true);
  };

  const openEdit = (proc: Procedure) => {
    setEditingProcedure(proc);
    setFormData({
      name: proc.name,
      suggested_price: String(proc.suggested_price || ""),
      return_days: String(proc.return_days || 0),
      active: proc.active ?? true,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const data = {
      name: formData.name.trim(),
      suggested_price: formData.suggested_price ? parseFloat(formData.suggested_price) : 0,
      return_days: parseInt(formData.return_days) || 0,
      active: formData.active,
    };

    if (editingProcedure) {
      updateProcedure.mutate({ procedureId: editingProcedure.id, data }, { onSuccess: () => setShowModal(false) });
    } else {
      createProcedure.mutate(data, { onSuccess: () => setShowModal(false) });
    }
  };

  const handleToggle = () => {
    if (confirmToggle) {
      toggleActive.mutate(
        { procedureId: confirmToggle.id, active: !confirmToggle.active },
        { onSuccess: () => setConfirmToggle(null) }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Procedimentos</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-48" />
          </div>
          <Button className="gold-gradient text-secondary" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProcedures.map((proc) => (
          <Card key={proc.id} className={`glass-card ${!proc.active ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-semibold break-words line-clamp-2" title={proc.name}>{proc.name}</h3>
                    <Badge variant={proc.active ? "default" : "secondary"} className="text-xs mt-1">
                      {proc.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(proc)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Switch checked={proc.active ?? true} onCheckedChange={() => setConfirmToggle(proc)} />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4" />Preço</span>
                  <span className="font-medium text-success">R$ {(proc.suggested_price || 0).toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><RotateCcw className="w-4 h-4" />Retorno</span>
                  <span className="font-medium">{proc.return_days && proc.return_days > 0 ? `${proc.return_days} dias` : "Sem retorno"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProcedure ? "Editar Procedimento" : "Novo Procedimento"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Preço Sugerido (R$)</Label>
              <Input type="number" step="0.01" value={formData.suggested_price} onChange={(e) => setFormData({ ...formData, suggested_price: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Dias para Retorno</Label>
              <Input type="number" min="0" value={formData.return_days} onChange={(e) => setFormData({ ...formData, return_days: e.target.value })} />
              <p className="text-xs text-muted-foreground">0 = sem retorno necessário</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="gold-gradient text-secondary" disabled={createProcedure.isPending || updateProcedure.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmToggle} onOpenChange={() => setConfirmToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmToggle?.active ? "Desativar" : "Ativar"} Procedimento</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmToggle?.active ? "O procedimento não aparecerá mais nas opções de agendamento." : "O procedimento voltará a aparecer nas opções."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggle}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
