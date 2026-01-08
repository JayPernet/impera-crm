import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useClients } from "@/hooks/useClients";
import { useAnamnesis } from "@/hooks/useAnamnesis";
import { useCrmUser } from "@/hooks/useCrmUser";
import { AnamnesisModal } from "@/components/clients/AnamnesisModal";
import {
  Search,
  FileText,
  CheckCircle2,
  User,
  Phone,
  Baby,
  AlertCircle,
  Stethoscope,
  Info,
  Clock,
  Lock,
  AlertTriangle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { differenceInDays, parseISO } from "date-fns";

// Component to show anamnesis status for each client
function RiskAlerts({ clientId }: { clientId: string }) {
  const { data: anamnesis } = useAnamnesis(clientId);

  if (!anamnesis) return null;

  const hasAllergies = anamnesis.allergies && anamnesis.allergies.trim().length > 0;
  const isPregnant = anamnesis.is_pregnant_or_breastfeeding;
  const hasChronicDiseases = anamnesis.chronic_diseases && anamnesis.chronic_diseases.length > 0;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {isPregnant && (
          <Tooltip>
            <TooltipTrigger>
              <Baby className="w-5 h-5 text-pink-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Gestante ou Lactante</p>
            </TooltipContent>
          </Tooltip>
        )}

        {hasAllergies && (
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Alergias: {anamnesis.allergies}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {hasChronicDiseases && (
          <Tooltip>
            <TooltipTrigger>
              <Stethoscope className="w-5 h-5 text-orange-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Doenças Crônicas: {anamnesis.chronic_diseases?.join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

// Component to show anamnesis status for each client
function AnamnesisStatusBadge({ clientId }: { clientId: string }) {
  const { data: anamnesis, isLoading } = useAnamnesis(clientId);

  if (isLoading) return <Skeleton className="h-5 w-20" />;

  if (!anamnesis) {
    return (
      <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>
    );
  }

  const updatedAt = anamnesis.updated_at ? parseISO(anamnesis.updated_at) : new Date();
  const daysSinceUpdate = differenceInDays(new Date(), updatedAt);
  const isExpired = daysSinceUpdate >= 180;

  if (isExpired) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-600/20">
        <Clock className="w-3 h-3 mr-1" />
        Vencida (Atualizar)
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-success/10 text-success border-success/20">
      <CheckCircle2 className="w-3 h-3 mr-1" />
      Preenchida
    </Badge>
  );
}

export default function Anamnese() {
  const { userRole } = useCrmUser();
  const { data: clients, isLoading } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);

  const isReadOnly = userRole?.role === "user";

  const filteredClients = clients?.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatPhone = (phone: string | null) => {
    if (!phone) return "-";
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Anamnese / Prontuário
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os prontuários dos clientes da clínica
          </p>
        </div>
        {isReadOnly && (
          <Badge variant="secondary" className="flex items-center gap-1 bg-warning/10 text-warning px-3 py-1.5">
            <Lock className="w-4 h-4" />
            Modo Leitura (Apenas médicos podem editar)
          </Badge>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar cliente por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Clientes ({filteredClients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Alertas</TableHead>
                  <TableHead>Status Anamnese</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {formatPhone(client.phone)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <RiskAlerts clientId={client.id} />
                    </TableCell>
                    <TableCell>
                      <AnamnesisStatusBadge clientId={client.id} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClient({ id: client.id, name: client.name })}
                        className="border-primary/20 text-primary hover:bg-primary/10"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {isReadOnly ? "Visualizar" : "Abrir Prontuário"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Anamnesis Modal */}
      {selectedClient && (
        <AnamnesisModal
          open={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
        />
      )}
    </div>
  );
}
