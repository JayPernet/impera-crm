import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Loader2, Eye, EyeOff, Copy, Check, Search, Pencil, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import { Navigate } from "react-router-dom";

const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["super_admin", "admin", "user", "professional"]),
  organizationId: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface GlobalUser {
  id: string;
  supabase_auth_id: string;
  name: string;
  email: string;
  organization_id: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
  organization_name?: string;
  created_by_name?: string;
  role?: string;
}

interface Organization {
  id: string;
  name: string;
}

function generatePassword(length = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AdminUsuariosGlobal() {
  const { isSuperAdmin, loading: userLoading } = useCrmUser();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<GlobalUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOrg, setFilterOrg] = useState<string>("all");

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: generatePassword(),
      role: "user",
      organizationId: "",
    },
  });

  const editForm = useForm<{ name: string; active: boolean }>({
    defaultValues: { name: "", active: true },
  });

  const selectedRole = form.watch("role");

  // Fetch all organizations
  const { data: organizations } = useQuery({
    queryKey: ["admin-all-organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("id, name")
        .eq("active", true)
        .order("name");

      if (error) throw error;
      return data as Organization[];
    },
    enabled: isSuperAdmin,
  });

  // Fetch all users with audit info
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-global-users"],
    queryFn: async () => {
      const { data: usersData, error } = await supabase
        .from("crm_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch roles, organization names, and creator names
      const usersWithDetails = await Promise.all(
        (usersData || []).map(async (user) => {
          const [roleResult, orgResult, creatorResult] = await Promise.all([
            supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", user.supabase_auth_id)
              .maybeSingle(),
            user.organization_id
              ? supabase
                .from("crm_organizations")
                .select("name")
                .eq("id", user.organization_id)
                .maybeSingle()
              : Promise.resolve({ data: null }),
            user.created_by
              ? supabase
                .from("crm_users")
                .select("name")
                .eq("id", user.created_by)
                .maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          return {
            ...user,
            role: roleResult.data?.role || "user",
            organization_name: orgResult.data?.name || null,
            created_by_name: creatorResult.data?.name || null,
          } as GlobalUser;
        })
      );

      return usersWithDetails;
    },
    enabled: isSuperAdmin,
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserFormData) => {
      // For super_admin, organization_id should be null (they're CRM owners)
      // For admin/user/professional, organization_id is required
      const orgId = data.role === "super_admin" ? null : data.organizationId || null;

      const { data: result, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
          organization_id: orgId, // snake_case for edge function
        },
      });

      if (error) throw error;
      if (result?.error) throw new Error(result.error);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-global-users"] });
      toast.success("Usuário criado com sucesso!");
      setDialogOpen(false);
      form.reset({
        name: "",
        email: "",
        password: generatePassword(),
        role: "user",
        organizationId: "",
      });
    },
    onError: (error: Error) => {
      console.error("Error creating user:", error);
      toast.error(error.message || "Erro ao criar usuário");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: { name: string; active: boolean } }) => {
      const { error } = await supabase
        .from("crm_users")
        .update(data)
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-global-users"] });
      toast.success("Usuário atualizado!");
      setEditDialogOpen(false);
      setEditingUser(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário");
    },
  });

  const copyPassword = () => {
    navigator.clipboard.writeText(form.getValues("password"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regeneratePassword = () => {
    form.setValue("password", generatePassword());
  };

  const openEditDialog = (user: GlobalUser) => {
    setEditingUser(user);
    editForm.reset({ name: user.name, active: user.active });
    setEditDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      super_admin: { label: "Super Admin", variant: "destructive" },
      admin: { label: "Admin", variant: "default" },
      professional: { label: "Profissional", variant: "secondary" },
      user: { label: "Secretária", variant: "outline" },
    };
    const config = roleConfig[role] || roleConfig.user;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Filter users
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg =
      filterOrg === "all" ||
        filterOrg === "no-org" ? !user.organization_id :
        user.organization_id === filterOrg;

    if (filterOrg === "all") return matchesSearch;
    if (filterOrg === "no-org") return matchesSearch && !user.organization_id;
    return matchesSearch && user.organization_id === filterOrg;
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuários Global</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários do sistema</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Criar Novo Usuário
              </DialogTitle>
              <DialogDescription>
                Crie usuários de qualquer tipo e vincule a uma organização
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createUserMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Usuário *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin (Sistema)</SelectItem>
                          <SelectItem value="admin">Admin (Clínica)</SelectItem>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="user">Secretária</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole !== "super_admin" && (
                  <FormField
                    control={form.control}
                    name="organizationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organização *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a clínica" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations?.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@exemplo.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="relative flex-1">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Senha"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-8 top-0 h-full"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={copyPassword}
                            >
                              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <Button type="button" variant="outline" onClick={regeneratePassword}>
                          Gerar
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createUserMutation.isPending} className="gap-2">
                    {createUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Criar Usuário
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterOrg} onValueChange={setFilterOrg}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filtrar por organização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas organizações</SelectItem>
                <SelectItem value="no-org">Sem organização (Super Admins)</SelectItem>
                {organizations?.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            {filteredUsers?.length || 0} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredUsers?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Organização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Criado por</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role || "user")}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.organization_name || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? "default" : "secondary"}>
                        {user.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at!).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.created_by_name || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere as informações do usuário
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editForm.handleSubmit((data) =>
              editingUser && updateUserMutation.mutate({ userId: editingUser.id, data })
            )}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input
                {...editForm.register("name")}
                placeholder="Nome completo"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Button
                type="button"
                variant={editForm.watch("active") ? "default" : "secondary"}
                size="sm"
                onClick={() => editForm.setValue("active", !editForm.watch("active"))}
                className="gap-2"
              >
                {editForm.watch("active") ? (
                  <>
                    <Power className="h-4 w-4" />
                    Ativo
                  </>
                ) : (
                  <>
                    <PowerOff className="h-4 w-4" />
                    Inativo
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending} className="gap-2">
                {updateUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
