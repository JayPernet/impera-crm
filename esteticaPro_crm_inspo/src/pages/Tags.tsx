import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Search, Edit, Trash2, Tag } from "lucide-react";
import { useTags, useCreateTag, useUpdateTag, useMarkTagForDeletion, useDeleteTag, Tag as TagType } from "@/hooks/useTags";
import { useCrmUser } from "@/hooks/useCrmUser";

const presetColors = ["#D4AF37", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#06B6D4"];

export default function Tags() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMarked, setShowMarked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TagType | null>(null);
  const [formData, setFormData] = useState({ name: "", color: "#D4AF37" });

  const { isAdmin } = useCrmUser();
  const { data: tags, isLoading } = useTags(showMarked);
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const markForDeletion = useMarkTagForDeletion();
  const deleteTag = useDeleteTag();

  const filteredTags = (tags || []).filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingTag(null);
    setFormData({ name: "", color: "#D4AF37" });
    setShowModal(true);
  };

  const openEdit = (tag: TagType) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, color: tag.color || "#D4AF37" });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingTag) {
      updateTag.mutate({ tagId: editingTag.id, data: formData }, { onSuccess: () => setShowModal(false) });
    } else {
      createTag.mutate(formData, { onSuccess: () => setShowModal(false) });
    }
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (isAdmin) {
      deleteTag.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
    } else {
      markForDeletion.mutate(confirmDelete.id, { onSuccess: () => setConfirmDelete(null) });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Tags de Procedimentos</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={showMarked} onCheckedChange={setShowMarked} />
            <span className="text-sm text-muted-foreground">Mostrar marcadas</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-40" />
          </div>
          <Button className="gold-gradient text-secondary" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tag
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTags.map((tag) => (
          <Card
            key={tag.id}
            className={`glass-card overflow-hidden transition-all ${tag.marked_for_deletion ? "opacity-50" : ""}`}
            style={{ borderTopColor: tag.color || "#D4AF37", borderTopWidth: "3px" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color || "#D4AF37" }} />
                  <span className="font-semibold truncate">{tag.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">{tag.lead_count || 0} leads</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(tag)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setConfirmDelete(tag)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              {tag.marked_for_deletion && (
                <Badge variant="secondary" className="mt-2 text-xs bg-warning/10 text-warning">Aguardando exclusão</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? "Editar Tag" : "Nova Tag"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Procedimento *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex items-center gap-2">
                <Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-12 h-10 p-1" />
                <div className="flex gap-1">
                  {presetColors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <Label className="text-xs text-muted-foreground">Preview</Label>
              <Badge className="mt-2" style={{ backgroundColor: formData.color, color: "#fff" }}>
                <Tag className="w-3 h-3 mr-1" />
                {formData.name || "Nome da Tag"}
              </Badge>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button type="submit" className="gold-gradient text-secondary" disabled={createTag.isPending || updateTag.isPending}>Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isAdmin ? "Excluir Tag Permanentemente" : "Marcar para Exclusão"}</AlertDialogTitle>
            <AlertDialogDescription>
              {isAdmin
                ? `Tem certeza? ${confirmDelete?.lead_count || 0} leads estão usando esta tag.`
                : "A tag será marcada para exclusão. Um admin precisará confirmar."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className={isAdmin ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"}
            >
              {isAdmin ? "Excluir" : "Marcar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
