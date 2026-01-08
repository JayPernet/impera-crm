import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, UserPlus, Trash2, Copy, RefreshCw, Users, Edit } from "lucide-react";
import { useCrmUser } from "@/hooks/useCrmUser";
import { useOrgUsers, useCreateOrgUser, useDeleteOrgUser, useUpdateOrgUser, OrgUser } from "@/hooks/useOrgUsers";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Segunda" },
  { value: "tuesday", label: "Terça" },
  { value: "wednesday", label: "Quarta" },
  { value: "thursday", label: "Quinta" },
  { value: "friday", label: "Sexta" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  user: "Secretária",
  professional: "Profissional",
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: "bg-red-500/20 text-red-500",
  admin: "bg-primary/20 text-primary",
  user: "bg-blue-500/20 text-blue-500",
  professional: "bg-green-500/20 text-green-500",
};

export default function Usuarios() {
  const { isAdmin, isSuperAdmin, userRole } = useCrmUser();
  const canManageRoles = isAdmin || isSuperAdmin; // Only admin/super_admin can change roles and delete
  const { data: users, isLoading } = useOrgUsers();
  const createUser = useCreateOrgUser();
  const deleteUser = useDeleteOrgUser();
  const updateUser = useUpdateOrgUser();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<OrgUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<OrgUser | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "" as "male" | "female" | "other" | "",
    specialties: "",
    working_days: [] as string[],
    role: "professional" as "user" | "admin" | "professional",
  });

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
    toast.success("Senha gerada! Copie antes de salvar.");
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    toast.success("Senha copiada para a área de transferência");
  };

  const openCreate = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      gender: "",
      specialties: "",
      working_days: [],
      role: "professional",
    });
    setShowCreateModal(true);
  };

  const openEdit = (user: OrgUser) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      name: user.name,
      gender: user.gender || "",
      specialties: user.specialties?.join(", ") || "",
      working_days: user.working_days || [],
      role: (user.role as any) || "professional",
    });
    setShowEditModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Preencha email, senha e nome");
      return;
    }

    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await createUser.mutateAsync({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      gender: formData.gender || undefined,
      specialties: specialtiesArray,
      working_days: formData.working_days,
      role: formData.role,
    });

    setShowCreateModal(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const specialtiesArray = formData.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Build update payload - only include role if user is admin/super_admin
    const updateData: {
      name: string;
      gender: "male" | "female" | "other" | null;
      specialties: string[];
      working_days: string[];
    } = {
      name: formData.name,
      gender: formData.gender || null,
      specialties: specialtiesArray,
      working_days: formData.working_days,
    };

    // Security: Only admin/super_admin can change roles - 'user' role is ignored
    // Role update logic would go here if implemented in useUpdateOrgUser

    await updateUser.mutateAsync({
      userId: editingUser.id,
      data: updateData,
    });

    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await deleteUser.mutateAsync(deleteConfirm.id);
    setDeleteConfirm(null);
  };

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const getGenderPrefix = (gender: string | null) => {
    return "";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da sua clínica</p>
        </div>
        <Button className="gold-gradient text-secondary" onClick={openCreate}>
          <UserPlus className="w-4 h-4 mr-2" />
          Cadastrar Profissional
        </Button>
      </div>

      {/* Users Table */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Lista de Usuários ({users?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário cadastrado ainda
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Especialidades</TableHead>
                    <TableHead>Dias de Atendimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={ROLE_COLORS[user.role || "user"]}>
                          {ROLE_LABELS[user.role || "user"]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.specialties?.slice(0, 2).map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {(user.specialties?.length || 0) > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(user.specialties?.length || 0) - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.working_days?.map((day) => (
                            <Badge key={day} variant="secondary" className="text-xs">
                              {DAYS_OF_WEEK.find((d) => d.value === day)?.label.slice(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {(isAdmin || isSuperAdmin) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirm(user)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Profissional</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Jaqueline Silva"
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Senha *</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Senha de acesso"
                    required
                  />
                  <Button type="button" variant="outline" size="icon" onClick={generatePassword}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyPassword}
                    disabled={!formData.password}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clique no ícone para gerar senha automática
                </p>
              </div>

              <div className="space-y-2">
                <Label>Gênero</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Acesso</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="user">Secretária</SelectItem>
                    {(isAdmin || isSuperAdmin) && <SelectItem value="admin">Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Especialidades</Label>
                <Input
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Ex: Botox, Preenchimento, Limpeza de Pele"
                />
                <p className="text-xs text-muted-foreground">Separe por vírgulas</p>
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Dias de Atendimento</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={formData.working_days.includes(day.value)}
                        onCheckedChange={() => toggleWorkingDay(day.value)}
                      />
                      <label htmlFor={day.value} className="text-sm cursor-pointer">
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="gold-gradient text-secondary"
                disabled={createUser.isPending}
              >
                {createUser.isPending ? "Criando..." : "Criar Usuário"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Nome Completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Email</Label>
                <Input value={formData.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
              </div>

              <div className="space-y-2">
                <Label>Gênero</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                {canManageRoles ? (
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="user">Secretária</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={ROLE_LABELS[editingUser?.role || "user"]}
                    disabled
                    className="bg-muted"
                  />
                )}
                {!canManageRoles && (
                  <p className="text-xs text-muted-foreground">Apenas Admins podem alterar o cargo</p>
                )}
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Especialidades</Label>
                <Input
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Ex: Botox, Preenchimento"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label>Dias de Atendimento</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${day.value}`}
                        checked={formData.working_days.includes(day.value)}
                        onCheckedChange={() => toggleWorkingDay(day.value)}
                      />
                      <label htmlFor={`edit-${day.value}`} className="text-sm cursor-pointer">
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              {canManageRoles && editingUser && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setShowEditModal(false);
                    setDeleteConfirm(editingUser);
                  }}
                  className="sm:mr-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover Usuário
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="gold-gradient text-secondary"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{deleteConfirm?.name}</strong>? Esta ação não
              pode ser desfeita e o usuário perderá acesso ao sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUser.isPending ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
