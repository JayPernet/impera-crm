import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Sparkles, Loader2 } from "lucide-react";
import { z } from "zod";
import loginHeroImage from "@/assets/login-hero.jpg";

const emailSchema = z.string().email("Email inválido");
const passwordSchema = z.string().min(6, "Senha deve ter pelo menos 6 caracteres");

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        return;
      }
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Email não confirmado. Verifique sua caixa de entrada.");
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={loginHeroImage}
          alt="Clínica de Estética Luxuosa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-8">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Gestão de Elite<br />para sua Clínica
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            O CRM definitivo para clínicas de estética. Gerencie leads, agendamentos, métricas financeiras e muito mais, com sofisticação e agilidade.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-background p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">ClinicPro</h2>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Acesse sua conta
            </h2>
            <p className="mt-2 text-muted-foreground">
              Digite suas credenciais para entrar no ClinicPro.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-md border-border"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  onClick={() => toast.info("Entre em contato com o administrador para redefinir sua senha.")}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-md border-border"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar no CRM"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ClinicPro • Ambiente Seguro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
