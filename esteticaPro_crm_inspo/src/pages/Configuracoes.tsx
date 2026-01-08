import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Palette, Shield, Loader2, Eye, EyeOff, Sun, Moon, Monitor } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Configuracoes() {
  const { preferences, isLoading, isSaving, updateTheme, updateNotification } = useUserPreferences();
  
  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos de senha");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast.success("Sua senha foi atualizada com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar senha";
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências pessoais</p>
      </div>

      {/* Notifications */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Notificações</CardTitle>
          </div>
          <CardDescription>Configure suas preferências de notificação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Novos Leads</Label>
              <p className="text-sm text-muted-foreground">Receber notificação quando um novo lead chegar</p>
            </div>
            <Switch 
              checked={preferences.notifications.newLeads}
              onCheckedChange={(checked) => updateNotification("newLeads", checked)}
              disabled={isSaving}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Lembretes de Tarefas</Label>
              <p className="text-sm text-muted-foreground">Receber lembretes de tarefas pendentes</p>
            </div>
            <Switch 
              checked={preferences.notifications.taskReminders}
              onCheckedChange={(checked) => updateNotification("taskReminders", checked)}
              disabled={isSaving}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Resumo Diário</Label>
              <p className="text-sm text-muted-foreground">Receber resumo diário por email</p>
            </div>
            <Switch 
              checked={preferences.notifications.dailySummary}
              onCheckedChange={(checked) => updateNotification("dailySummary", checked)}
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>Aparência</CardTitle>
          </div>
          <CardDescription>Personalize a aparência do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-3 block">Tema</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTheme("light")}
                disabled={isSaving}
                className={cn(
                  "flex-1 gap-2",
                  preferences.theme === "light" && "border-primary bg-primary/10"
                )}
              >
                <Sun className="w-4 h-4" />
                Claro
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTheme("dark")}
                disabled={isSaving}
                className={cn(
                  "flex-1 gap-2",
                  preferences.theme === "dark" && "border-primary bg-primary/10"
                )}
              >
                <Moon className="w-4 h-4" />
                Escuro
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateTheme("system")}
                disabled={isSaving}
                className={cn(
                  "flex-1 gap-2",
                  preferences.theme === "system" && "border-primary bg-primary/10"
                )}
              >
                <Monitor className="w-4 h-4" />
                Sistema
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>Segurança</CardTitle>
          </div>
          <CardDescription>Altere sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleChangePassword}
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              className="gold-gradient text-secondary"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Senha"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
