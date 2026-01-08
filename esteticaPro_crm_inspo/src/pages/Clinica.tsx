import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, MapPin, Phone, Mail, Clock, Package, Tag, Save, Loader2, FileText, Instagram, MessageSquare, Eye, EyeOff, Bot, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import { useProcedures } from "@/hooks/useProcedures";
import { useTags } from "@/hooks/useTags";

const DAYS_OF_WEEK = [
  { key: "monday", label: "Segunda" },
  { key: "tuesday", label: "Terça" },
  { key: "wednesday", label: "Quarta" },
  { key: "thursday", label: "Quinta" },
  { key: "friday", label: "Sexta" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
    enabled: boolean;
  };
}

interface OrgFeatures {
  hasWhatsapp: boolean;
  hasCopiloto: boolean;
}

const clinicSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  cnpj: z.string().optional(),
  instagram: z.string().optional(),
  id_instancia_z_api: z.string().optional(),
  token_z_api: z.string().optional(),
});

type ClinicFormData = z.infer<typeof clinicSchema>;

export default function Clinica() {
  const { crmUser, isAdmin, loading: userLoading } = useCrmUser();
  const { data: procedures } = useProcedures();
  const { data: tags } = useTags();
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({});
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [showInstanceId, setShowInstanceId] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [features, setFeatures] = useState<OrgFeatures>({ hasWhatsapp: false, hasCopiloto: false });

  const canEditAll = isAdmin;

  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      cnpj: "",
      instagram: "",
      id_instancia_z_api: "",
      token_z_api: "",
    },
  });

  useEffect(() => {
    if (!userLoading && crmUser?.organization_id) {
      fetchOrganization(crmUser.organization_id);
    } else if (!userLoading && !crmUser?.organization_id) {
      setDataLoading(false);
    }
  }, [crmUser?.organization_id, userLoading]);

  const fetchOrganization = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from("crm_organizations")
        .select("*")
        .eq("id", orgId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOrganizationId(data.id);
        form.reset({
          name: data.name || "",
          address: (data as any).address || "",
          phone: (data as any).phone || "",
          email: (data as any).email || "",
          cnpj: (data as any).cnpj || "",
          instagram: (data as any).instagram || "",
          id_instancia_z_api: (data as any).id_instancia_z_api || "",
          token_z_api: (data as any).token_z_api || "",
        });

        // Check features
        setFeatures({
          hasWhatsapp: !!(data as any).id_instancia_z_api && !!(data as any).token_z_api,
          hasCopiloto: (data as any).feature_ai_assistant === true,
        });

        const defaultHours: BusinessHours = {};
        DAYS_OF_WEEK.forEach(day => {
          defaultHours[day.key] = { open: "08:00", close: "18:00", enabled: day.key !== "saturday" && day.key !== "sunday" };
        });

        setBusinessHours((data as any).business_hours as BusinessHours || defaultHours);
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
      toast.error("Erro ao carregar dados da clínica");
    } finally {
      setDataLoading(false);
    }
  };

  const handleBusinessHoursChange = (day: string, field: "open" | "close" | "enabled", value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const onSubmit = async (data: ClinicFormData) => {
    if (!organizationId) return;

    setSaving(true);
    try {
      const updateData: Record<string, unknown> = {
        business_hours: businessHours,
      };

      if (canEditAll) {
        updateData.name = data.name;
        updateData.address = data.address || null;
        updateData.phone = data.phone || null;
        updateData.email = data.email || null;
        updateData.cnpj = data.cnpj || null;
        updateData.instagram = data.instagram || null;
        updateData.id_instancia_z_api = data.id_instancia_z_api || null;
        updateData.token_z_api = data.token_z_api || null;
      }

      const { error } = await supabase
        .from("crm_organizations")
        .update(updateData)
        .eq("id", organizationId);

      if (error) throw error;

      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving organization:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalProcedures = procedures?.length || 0;
  const totalTags = tags?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações da Clínica</h1>
        <p className="text-muted-foreground">Gerencie as informações da sua clínica</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Procedimentos Cadastrados</p>
              <p className="text-3xl font-bold text-foreground">{totalProcedures}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-primary/10">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tags Cadastradas</p>
              <p className="text-3xl font-bold text-foreground">{totalTags}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                {canEditAll 
                  ? "Dados gerais da clínica" 
                  : "Apenas administradores podem editar estas informações"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Nome da Clínica
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!canEditAll}
                        placeholder="Nome da clínica"
                      />
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
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Endereço
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={!canEditAll}
                        placeholder="Endereço completo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!canEditAll}
                          placeholder="(00) 00000-0000"
                        />
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
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!canEditAll}
                          placeholder="contato@clinica.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        CNPJ
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!canEditAll}
                          placeholder="00.000.000/0000-00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!canEditAll}
                          placeholder="@suaclinica"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features Ativas Card */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Features Contratadas
              </CardTitle>
              <CardDescription>
                Recursos habilitados para sua clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`h-5 w-5 ${features.hasWhatsapp ? "text-green-600" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-foreground">WhatsApp Integrado</p>
                      <p className="text-xs text-muted-foreground">Enviar e receber mensagens via CRM</p>
                    </div>
                  </div>
                  {features.hasWhatsapp ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground gap-1">
                      <XCircle className="h-3 w-3" />
                      Não contratado
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Bot className={`h-5 w-5 ${features.hasCopiloto ? "text-purple-600" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-foreground">Copiloto (IA)</p>
                      <p className="text-xs text-muted-foreground">Assistente de inteligência artificial</p>
                    </div>
                  </div>
                  {features.hasCopiloto ? (
                    <Badge variant="outline" className="text-purple-600 border-purple-600 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground gap-1">
                      <XCircle className="h-3 w-3" />
                      Não contratado
                    </Badge>
                  )}
                </div>

                {!features.hasWhatsapp && !features.hasCopiloto && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    Entre em contato com o suporte para contratar recursos adicionais.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Integration Card - Admin Only, show only if WhatsApp contracted */}
          {canEditAll && features.hasWhatsapp && (
            <Card className="border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Integração WhatsApp
                </CardTitle>
                <CardDescription>
                  Configure as credenciais para enviar mensagens via WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="id_instancia_z_api"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID da Instância WhatsApp</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showInstanceId ? "text" : "password"}
                            placeholder="ID da instância"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowInstanceId(!showInstanceId)}
                          >
                            {showInstanceId ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Encontre no painel do provedor de WhatsApp em Configurações
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="token_z_api"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token da API WhatsApp</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showToken ? "text" : "password"}
                            placeholder="Token de autenticação"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowToken(!showToken)}
                          >
                            {showToken ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Token de segurança disponível no painel do provedor
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Business Hours Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Horário de Funcionamento
              </CardTitle>
              <CardDescription>
                Configure os horários de atendimento da clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div 
                    key={day.key} 
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      businessHours[day.key]?.enabled 
                        ? "border-primary/30 bg-primary/5" 
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <Switch
                      checked={businessHours[day.key]?.enabled || false}
                      onCheckedChange={(checked) => 
                        handleBusinessHoursChange(day.key, "enabled", checked)
                      }
                    />
                    <span className={`w-24 font-medium ${
                      businessHours[day.key]?.enabled ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {day.label}
                    </span>
                    
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={businessHours[day.key]?.open || "08:00"}
                        onChange={(e) => 
                          handleBusinessHoursChange(day.key, "open", e.target.value)
                        }
                        disabled={!businessHours[day.key]?.enabled}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">às</span>
                      <Input
                        type="time"
                        value={businessHours[day.key]?.close || "18:00"}
                        onChange={(e) => 
                          handleBusinessHoursChange(day.key, "close", e.target.value)
                        }
                        disabled={!businessHours[day.key]?.enabled}
                        className="w-32"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
