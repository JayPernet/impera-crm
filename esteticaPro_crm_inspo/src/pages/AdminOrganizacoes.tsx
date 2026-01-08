import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Plus, Power, PowerOff, Loader2, Eye, EyeOff, Copy, Check, UserPlus, MessageSquare, Bot, Sparkles, Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import { Navigate } from "react-router-dom";

const createOrgSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  adminName: z.string().min(1, "Nome do admin é obrigatório"),
  adminEmail: z.string().email("Email inválido"),
  adminPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  enableWhatsapp: z.boolean().default(false),
  enableCopiloto: z.boolean().default(false),
  tokenZApi: z.string().optional(),
  idInstanciaZApi: z.string().optional(),
});

const editOrgSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().optional(),
  enableWhatsapp: z.boolean().default(false),
  enableCopiloto: z.boolean().default(false),
  tokenZApi: z.string().optional(),
  idInstanciaZApi: z.string().optional(),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;
type EditOrgFormData = z.infer<typeof editOrgSchema>;

interface Organization {
  id: string;
  name: string;
  address: string | null;
  active: boolean;
  created_at: string;
  token_z_api: string | null;
  id_instancia_z_api: string | null;
  feature_ai_assistant: boolean | null;
}

function generatePassword(length = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AdminOrganizacoes() {
  const { isSuperAdmin, loading: userLoading } = useCrmUser();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      address: "",
      adminName: "",
      adminEmail: "",
      adminPassword: generatePassword(),
      enableWhatsapp: false,
      enableCopiloto: false,
      tokenZApi: "",
      idInstanciaZApi: "",
    },
  });

  const editForm = useForm<EditOrgFormData>({
    resolver: zodResolver(editOrgSchema),
    defaultValues: {
      name: "",
      address: "",
      enableWhatsapp: false,
      enableCopiloto: false,
      tokenZApi: "",
      idInstanciaZApi: "",
    },
  });

  const enableWhatsapp = useWatch({ control: form.control, name: "enableWhatsapp" });
  const editEnableWhatsapp = useWatch({ control: editForm.control, name: "enableWhatsapp" });

  // Populate edit form when editing org changes
  useEffect(() => {
    if (editingOrg) {
      editForm.reset({
        name: editingOrg.name,
        address: editingOrg.address || "",
        enableWhatsapp: !!(editingOrg.token_z_api && editingOrg.id_instancia_z_api),
        enableCopiloto: editingOrg.feature_ai_assistant === true,
        tokenZApi: editingOrg.token_z_api || "",
        idInstanciaZApi: editingOrg.id_instancia_z_api || "",
      });
    }
  }, [editingOrg, editForm]);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["admin-organizations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("id, name, address, active, created_at, token_z_api, id_instancia_z_api, feature_ai_assistant")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Organization[];
    },
    enabled: isSuperAdmin,
  });

  const createOrgMutation = useMutation({
    mutationFn: async (data: CreateOrgFormData) => {
      // 1. Create organization
      const { data: org, error: orgError } = await supabase
        .from("crm_organizations")
        .insert({
          name: data.name,
          cnpj: data.cnpj || null,
          address: data.address || null,
          token_z_api: data.enableWhatsapp ? (data.tokenZApi || null) : null,
          id_instancia_z_api: data.enableWhatsapp ? (data.idInstanciaZApi || null) : null,
          feature_ai_assistant: data.enableCopiloto,
          active: true,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Create admin user via edge function
      const { error: userError } = await supabase.functions.invoke("create-user", {
        body: {
          email: data.adminEmail,
          password: data.adminPassword,
          name: data.adminName,
          role: "admin",
          organization_id: org.id,
        },
      });

      if (userError) {
        // Rollback: delete the organization if user creation fails
        await supabase.from("crm_organizations").delete().eq("id", org.id);
        throw userError;
      }

      return org;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast.success("Clínica criada com sucesso!");
      setDialogOpen(false);
      form.reset({
        name: "",
        cnpj: "",
        address: "",
        adminName: "",
        adminEmail: "",
        adminPassword: generatePassword(),
        enableWhatsapp: false,
        enableCopiloto: false,
        tokenZApi: "",
        idInstanciaZApi: "",
      });
    },
    onError: (error) => {
      console.error("Error creating organization:", error);
      toast.error("Erro ao criar clínica");
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("crm_organizations")
        .update({ active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, { active }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast.success(active ? "Clínica ativada!" : "Clínica desativada!");
    },
    onError: () => {
      toast.error("Erro ao atualizar status da clínica");
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: async (data: EditOrgFormData & { id: string }) => {
      const { error } = await supabase
        .from("crm_organizations")
        .update({
          name: data.name,
          address: data.address || null,
          token_z_api: data.enableWhatsapp ? (data.tokenZApi || null) : null,
          id_instancia_z_api: data.enableWhatsapp ? (data.idInstanciaZApi || null) : null,
          feature_ai_assistant: data.enableCopiloto,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-organizations"] });
      toast.success("Clínica atualizada com sucesso!");
      setEditDialogOpen(false);
      setEditingOrg(null);
    },
    onError: (error) => {
      console.error("Error updating organization:", error);
      toast.error("Erro ao atualizar clínica");
    },
  });

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setEditDialogOpen(true);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(form.getValues("adminPassword"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regeneratePassword = () => {
    form.setValue("adminPassword", generatePassword());
  };

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

  const hasWhatsapp = (org: Organization) => !!(org.id_instancia_z_api && org.token_z_api);
  const hasCopiloto = (org: Organization) => org.feature_ai_assistant === true;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Administração de Clínicas</h1>
          <p className="text-muted-foreground">Gerencie todas as clínicas do sistema</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Clínica
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Criar Nova Clínica
              </DialogTitle>
              <DialogDescription>
                Preencha os dados para criar uma nova clínica e seu administrador
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createOrgMutation.mutate(data))} className="space-y-6">
                {/* Clinic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Dados da Clínica
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Clínica *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Clínica Bella Estética" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="00.000.000/0000-00" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Endereço completo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Admin Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Administrador da Clínica
                  </h3>

                  <FormField
                    control={form.control}
                    name="adminName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Admin *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome completo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do Admin *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="admin@clinica.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="adminPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha do Admin *</FormLabel>
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
                </div>

                {/* Features Contratadas */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Features Contratadas
                  </h3>

                  <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                    <FormField
                      control={form.control}
                      name="enableWhatsapp"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2 cursor-pointer">
                              <MessageSquare className="h-4 w-4 text-green-600" />
                              Habilitar WhatsApp
                            </FormLabel>
                            <FormDescription>
                              Permite enviar e receber mensagens via WhatsApp através do CRM
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {enableWhatsapp && (
                      <div className="ml-6 pl-4 border-l-2 border-green-500/30 space-y-4">
                        <FormField
                          control={form.control}
                          name="idInstanciaZApi"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID da Instância WhatsApp</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="ID da instância" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tokenZApi"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Token da API WhatsApp</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Token de autenticação" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="enableCopiloto"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2 cursor-pointer">
                              <Bot className="h-4 w-4 text-purple-600" />
                              Habilitar Copiloto (IA)
                            </FormLabel>
                            <FormDescription>
                              Acesso ao assistente de IA interno do CRM para diversas tarefas
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createOrgMutation.isPending} className="gap-2">
                    {createOrgMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Criar Clínica
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clínicas Cadastradas</CardTitle>
          <CardDescription>
            {organizations?.length || 0} clínicas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : organizations?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma clínica cadastrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations?.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {org.address || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hasWhatsapp(org) && (
                          <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
                            <MessageSquare className="h-3 w-3" />
                            WhatsApp
                          </Badge>
                        )}
                        {hasCopiloto(org) && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600 gap-1">
                            <Bot className="h-3 w-3" />
                            Copiloto
                          </Badge>
                        )}
                        {!hasWhatsapp(org) && !hasCopiloto(org) && (
                          <span className="text-muted-foreground text-sm">Nenhuma</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={org.active ? "default" : "secondary"}>
                        {org.active ? "Ativa" : "Inativa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(org.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOrg(org)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveMutation.mutate({ id: org.id, active: !org.active })}
                          disabled={toggleActiveMutation.isPending}
                          className={org.active ? "text-destructive hover:text-destructive" : "text-green-600 hover:text-green-600"}
                        >
                          {org.active ? (
                            <>
                              <PowerOff className="h-4 w-4 mr-1" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Power className="h-4 w-4 mr-1" />
                              Ativar
                            </>
                          )}
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

      {/* Edit Organization Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setEditingOrg(null);
      }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Editar Clínica
            </DialogTitle>
            <DialogDescription>
              Atualize os dados da clínica {editingOrg?.name}
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit((data) => {
              if (editingOrg) {
                updateOrgMutation.mutate({ ...data, id: editingOrg.id });
              }
            })} className="space-y-6">
              {/* Clinic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Dados da Clínica
                </h3>
                
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Clínica *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Clínica Bella Estética" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Endereço completo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Features Contratadas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Features Contratadas
                </h3>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                  <FormField
                    control={editForm.control}
                    name="enableWhatsapp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            Habilitar WhatsApp
                          </FormLabel>
                          <FormDescription>
                            Permite enviar e receber mensagens via WhatsApp através do CRM
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {editEnableWhatsapp && (
                    <div className="ml-6 pl-4 border-l-2 border-green-500/30 space-y-4">
                      <FormField
                        control={editForm.control}
                        name="idInstanciaZApi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID da Instância WhatsApp</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="ID da instância" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="tokenZApi"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token da API WhatsApp</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Token de autenticação" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={editForm.control}
                    name="enableCopiloto"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="flex items-center gap-2 cursor-pointer">
                            <Bot className="h-4 w-4 text-purple-600" />
                            Habilitar Copiloto (IA)
                          </FormLabel>
                          <FormDescription>
                            Acesso ao assistente de IA interno do CRM para diversas tarefas
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setEditDialogOpen(false);
                  setEditingOrg(null);
                }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateOrgMutation.isPending} className="gap-2">
                  {updateOrgMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
