import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Search, Users, DollarSign, Calendar, Phone, Plus, Eye, UserPlus, Pencil, Trash2 } from "lucide-react";
import { useClients, Client, useDeleteClient } from "@/hooks/useClients";
import { ClientDetailsModal } from "@/components/clients/ClientDetailsModal";
import { CreateClientModal } from "@/components/clients/CreateClientModal";
import { EditClientModal } from "@/components/clients/EditClientModal";
import { CreateAppointmentModal } from "@/components/appointments/CreateAppointmentModal";
import { useClientAppointments } from "@/hooks/useClients";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";

// Hook para buscar procedimentos únicos de cada cliente
function useClientsProcedures(clientIds: string[]) {
  return useQuery({
    queryKey: ["clients-procedures", clientIds],
    queryFn: async () => {
      if (clientIds.length === 0) return {};

      const { data, error } = await supabase
        .from("crm_appointments")
        .select(`
          client_id,
          procedure:crm_procedures(id, name)
        `)
        .in("client_id", clientIds)
        .eq("status", "completed");

      if (error) throw error;

      // Agrupa procedimentos únicos por cliente
      const proceduresByClient: Record<string, string[]> = {};
      data?.forEach((apt: any) => {
        if (apt.client_id && apt.procedure?.name) {
          if (!proceduresByClient[apt.client_id]) {
            proceduresByClient[apt.client_id] = [];
          }
          if (!proceduresByClient[apt.client_id].includes(apt.procedure.name)) {
            proceduresByClient[apt.client_id].push(apt.procedure.name);
          }
        }
      });

      return proceduresByClient;
    },
    enabled: clientIds.length > 0,
  });
}

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentClientId, setAppointmentClientId] = useState<string | null>(null);

  const { data: clients, isLoading } = useClients();
  const { userRole } = useCrmUser();
  const deleteClient = useDeleteClient();

  const isAdmin = userRole?.role === "admin" || userRole?.role === "super_admin";

  const clientIds = (clients || []).map((c) => c.id);
  const { data: proceduresByClient } = useClientsProcedures(clientIds);

  const handleDeleteClient = () => {
    if (deletingClient) {
      deleteClient.mutate(deletingClient.id, {
        onSuccess: () => setDeletingClient(null),
      });
    }
  };

  const filteredClients = (clients || []).filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  );

  const totalRevenue = (clients || []).reduce((acc, c) => acc + (c.estimated_revenue || 0), 0);
  const totalAppointments = (clients || []).reduce((acc, c) => acc + (c.total_appointments || 0), 0);

  const handleCreateAppointment = (clientId: string) => {
    setAppointmentClientId(clientId);
    setShowAppointmentModal(true);
    setSelectedClient(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <div className="hidden md:block">
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <div className="md:hidden space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button className="gold-gradient text-secondary" onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <p className="text-2xl font-bold">{clients?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-2xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR")}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Atendimentos</p>
              <p className="text-2xl font-bold">{totalAppointments}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Feed (Cards) */}
      <div className="md:hidden space-y-4">
        {filteredClients.length === 0 ? (
          <Card className="glass-card flex flex-col items-center justify-center p-8 text-center bg-muted/20">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </Card>
        ) : (
          filteredClients.map((client) => {
            const daysUntilReturn = client.next_return_at
              ? differenceInDays(new Date(client.next_return_at), new Date())
              : null;
            const procedures = proceduresByClient?.[client.id] || [];

            return (
              <Card
                key={client.id}
                className="glass-card hover:bg-muted/30 transition-colors active:scale-[0.99]"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{client.name}</h3>
                        {client.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleCreateAppointment(client.id)}>
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/50 p-2 rounded flex flex-col">
                      <span className="text-xs text-muted-foreground">Total Gasto</span>
                      <span className="font-medium text-success">R$ {(client.estimated_revenue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="bg-muted/50 p-2 rounded flex flex-col">
                      <span className="text-xs text-muted-foreground">Próximo Retorno</span>
                      {daysUntilReturn !== null ? (
                        <span className={daysUntilReturn <= 3 ? "text-destructive font-medium" : ""}>
                          {format(new Date(client.next_return_at!), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </div>

                  {procedures.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
                      {procedures.map((proc, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px]">
                          {proc}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedClient(client)}>
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="h-8" onClick={() => setEditingClient(client)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="h-8 text-destructive px-2" onClick={() => setDeletingClient(client)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Card className="glass-card hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorBoundary>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">Telefone</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">Procedimento(s)</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Último Atendimento</th>
                    <th className="text-center py-3 font-medium text-muted-foreground">Próximo Retorno</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Total Gasto</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const daysUntilReturn = client.next_return_at
                      ? differenceInDays(new Date(client.next_return_at), new Date())
                      : null;
                    const procedures = proceduresByClient?.[client.id] || [];

                    return (
                      <tr key={client.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3">
                          <p className="font-medium">{client.name}</p>
                        </td>
                        <td className="py-3">
                          {client.phone ? (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {procedures.length > 0 ? (
                              procedures.slice(0, 2).map((proc, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {proc}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                            {procedures.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{procedures.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {client.last_appointment_at
                            ? format(new Date(client.last_appointment_at), "dd/MM/yyyy", { locale: ptBR })
                            : "-"}
                        </td>
                        <td className="py-3 text-center">
                          {daysUntilReturn !== null ? (
                            <Badge
                              variant="secondary"
                              className={
                                daysUntilReturn <= 0
                                  ? "bg-destructive text-destructive-foreground animate-pulse"
                                  : daysUntilReturn <= 3
                                    ? "bg-destructive/10 text-destructive"
                                    : daysUntilReturn <= 7
                                      ? "bg-warning/10 text-warning"
                                      : ""
                              }
                            >
                              {daysUntilReturn <= 0
                                ? "URGENTE"
                                : format(new Date(client.next_return_at!), "dd/MM/yyyy", { locale: ptBR })}
                            </Badge>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-3 text-right font-medium text-success">
                          R$ {(client.estimated_revenue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedClient(client)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingClient(client)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => setDeletingClient(client)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-primary border-primary/20 hover:bg-primary/10"
                              onClick={() => handleCreateAppointment(client.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Agendar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Nenhum cliente encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </ErrorBoundary>
        </CardContent>
      </Card>

      <ClientDetailsModal
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        client={selectedClient}
        onCreateAppointment={handleCreateAppointment}
      />

      <CreateClientModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setAppointmentClientId(null);
        }}
        preselectedClientId={appointmentClientId}
        lockPerson={true}
      />

      <EditClientModal
        open={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
      />

      <AlertDialog open={!!deletingClient} onOpenChange={(open) => !open && setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza? Isso apagará todo o histórico deste cliente, incluindo agendamentos e anamnese.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClient.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
