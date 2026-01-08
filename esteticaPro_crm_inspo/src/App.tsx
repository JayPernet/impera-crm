import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SuperAdminOrgProvider } from "@/contexts/SuperAdminOrgContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleGuard } from "@/components/RoleGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pipeline from "./pages/Pipeline";
import PipelineDeLeads from "./pages/PipelineDeLeads";
import SpeedToLead from "./pages/SpeedToLead";
import Leads from "./pages/Leads";
import Clientes from "./pages/Clientes";
import Agendamentos from "./pages/Agendamentos";
import Procedimentos from "./pages/Procedimentos";
import Tags from "./pages/Tags";
import Tarefas from "./pages/Tarefas";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import Clinica from "./pages/Clinica";
import AdminOrganizacoes from "./pages/AdminOrganizacoes";
import AdminUsuariosGlobal from "./pages/AdminUsuariosGlobal";
import Inbox from "./pages/Inbox";
import Assistente from "./pages/Assistente";
import Anamnese from "./pages/Anamnese";
import NotFound from "./pages/NotFound";
import NpsRating from "./pages/NpsRating";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <SuperAdminOrgProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/:clinic_slug/nps/:token" element={<NpsRating />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inbox" element={<RoleGuard><Inbox /></RoleGuard>} />
                <Route path="/pipeline" element={<RoleGuard><Pipeline /></RoleGuard>} />
                <Route path="/pipeline-de-leads" element={<RoleGuard><PipelineDeLeads /></RoleGuard>} />
                <Route path="/speed-to-lead" element={<RoleGuard><SpeedToLead /></RoleGuard>} />
                <Route path="/leads" element={<RoleGuard><Leads /></RoleGuard>} />
                <Route path="/clientes" element={<RoleGuard><Clientes /></RoleGuard>} />
                <Route path="/agendamentos" element={<RoleGuard allowedRoles={["super_admin", "admin", "user", "professional"]}><Agendamentos /></RoleGuard>} />
                <Route path="/anamnese" element={<RoleGuard allowedRoles={["super_admin", "admin", "user", "professional"]}><Anamnese /></RoleGuard>} />
                <Route path="/tarefas" element={<RoleGuard><Tarefas /></RoleGuard>} />
                <Route path="/assistente" element={<RoleGuard><Assistente /></RoleGuard>} />
                <Route path="/configuracoes" element={<RoleGuard><Configuracoes /></RoleGuard>} />
                <Route path="/configuracoes/clinica" element={<RoleGuard><Clinica /></RoleGuard>} />
                <Route path="/configuracoes/procedimentos" element={<RoleGuard><Procedimentos /></RoleGuard>} />
                <Route path="/configuracoes/tags" element={<RoleGuard><Tags /></RoleGuard>} />
                <Route path="/configuracoes/usuarios" element={<RoleGuard><Usuarios /></RoleGuard>} />
                <Route path="/admin/organizacoes" element={<RoleGuard allowedRoles={["super_admin"]}><AdminOrganizacoes /></RoleGuard>} />
                <Route path="/admin/usuarios-global" element={<RoleGuard allowedRoles={["super_admin"]}><AdminUsuariosGlobal /></RoleGuard>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SuperAdminOrgProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
