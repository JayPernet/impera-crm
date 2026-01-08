import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useLeads, Lead, LeadStatus, Temperature, SourceType, useDeleteLead } from "@/hooks/useLeads";
import { useCrmUser } from "@/hooks/useCrmUser";
import { useProcedures } from "@/hooks/useProcedures";
import { LeadDetailsModal } from "@/components/pipeline/LeadDetailsModal";
import { CreateLeadModal } from "@/components/pipeline/CreateLeadModal";
import { CreateAppointmentModal } from "@/components/appointments/CreateAppointmentModal";
import { format, parseISO, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Snowflake,
  Flame,
  Thermometer,
  Phone,
  Mail,
  User,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "Novo", color: "bg-blue-500/10 text-blue-500" },
  contacted: { label: "Contatado", color: "bg-warning/10 text-warning" },
  scheduled: { label: "Agendado", color: "bg-orange-500/10 text-orange-500" },
  attended: { label: "Comparecimento", color: "bg-purple-500/10 text-purple-500" },
  sold: { label: "Vendas", color: "bg-success/10 text-success" },
  lost: { label: "Perdido", color: "bg-destructive/10 text-destructive" },
};

const temperatureConfig: Record<Temperature, { label: string; icon: any; color: string }> = {
  cold: { label: "Frio", icon: Snowflake, color: "text-blue-500" },
  warm: { label: "Morno", icon: Thermometer, color: "text-warning" },
  hot: { label: "Quente", icon: Flame, color: "text-destructive" },
};

const sourceConfig: Record<SourceType, string> = {
  ads: "Tráfego Pago",
  organic: "Orgânico",
  indication: "Indicação",
  other: "Outro",
};

export default function Leads() {
  const { data: leads, isLoading } = useLeads();
  const { data: procedures } = useProcedures();
  const deleteLead = useDeleteLead();
  const { userRole } = useCrmUser();
  const isAdmin = userRole?.role === "admin" || userRole?.role === "super_admin";

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [temperatureFilter, setTemperatureFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [procedureFilter, setProcedureFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [leadForAppointment, setLeadForAppointment] = useState<Lead | null>(null);

  const handleCreateAppointment = (lead: Lead) => {
    setLeadForAppointment(lead);
    setShowAppointmentModal(true);
    setSelectedLead(null); // Close details modal
  };

  // Filter leads
  const filteredLeads = useMemo(() => {
    if (!leads) return [];

    return leads.filter((lead) => {
      // Search
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(searchLower) ||
          lead.phone?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;

      // Temperature
      if (temperatureFilter !== "all" && lead.temperature !== temperatureFilter) return false;

      // Source
      if (sourceFilter !== "all" && lead.source_type !== sourceFilter) return false;

      // Procedure
      if (procedureFilter !== "all") {
        const hasProcedure = lead.lead_procedures?.some(
          (lp) => lp.procedure.id === procedureFilter
        );
        if (!hasProcedure) return false;
      }

      // Date range
      if (dateFrom || dateTo) {
        const leadDate = lead.created_at ? parseISO(lead.created_at) : null;
        if (!leadDate) return false;

        if (dateFrom && dateTo) {
          const from = startOfDay(parseISO(dateFrom));
          const to = endOfDay(parseISO(dateTo));
          if (!isWithinInterval(leadDate, { start: from, end: to })) return false;
        } else if (dateFrom) {
          const from = startOfDay(parseISO(dateFrom));
          if (leadDate < from) return false;
        } else if (dateTo) {
          const to = endOfDay(parseISO(dateTo));
          if (leadDate > to) return false;
        }
      }

      return true;
    });
  }, [leads, search, statusFilter, temperatureFilter, sourceFilter, procedureFilter, dateFrom, dateTo]);

  // Paginated leads
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTemperatureFilter("all");
    setSourceFilter("all");
    setProcedureFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const handleDelete = (leadId: string, permanent: boolean) => {
    if (window.confirm(permanent ? "Tem certeza que deseja excluir definitivamente?" : "Arquivar este lead?")) {
      deleteLead.mutate({ leadId, permanent });
    }
  };

  const hasActiveFilters =
    search || statusFilter !== "all" || temperatureFilter !== "all" ||
    sourceFilter !== "all" || procedureFilter !== "all" || dateFrom || dateTo;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-20 w-full col-span-1" />
          <Skeleton className="h-20 w-full col-span-1" />
          <Skeleton className="h-20 w-full col-span-1" />
          <Skeleton className="h-20 w-full col-span-1" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lista de Leads</h1>
          <p className="text-muted-foreground text-sm">
            {filteredLeads.length} leads encontrados
          </p>
        </div>
        <Button
          className="gold-gradient text-secondary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, telefone ou email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="contacted">Contatado</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="attended">Comparecimento</SelectItem>
                <SelectItem value="sold">Vendas</SelectItem>
                <SelectItem value="lost">Perdido</SelectItem>
              </SelectContent>
            </Select>

            {/* Temperature */}
            <Select value={temperatureFilter} onValueChange={(v) => { setTemperatureFilter(v); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Temperatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Temperaturas</SelectItem>
                <SelectItem value="cold">❄️ Frio</SelectItem>
                <SelectItem value="warm">🌡️ Morno</SelectItem>
                <SelectItem value="hot">🔥 Quente</SelectItem>
              </SelectContent>
            </Select>

            {/* Source */}
            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Origens</SelectItem>
                <SelectItem value="ads">Tráfego Pago</SelectItem>
                <SelectItem value="organic">Orgânico</SelectItem>
                <SelectItem value="indication">Indicação</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>

            {/* Procedure */}
            <Select value={procedureFilter} onValueChange={(v) => { setProcedureFilter(v); setCurrentPage(1); }}>
              <SelectTrigger>
                <SelectValue placeholder="Procedimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Procedimentos</SelectItem>
                {procedures?.map((proc) => (
                  <SelectItem key={proc.id} value={proc.id}>
                    {proc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date From */}
            <Input
              type="date"
              placeholder="Data inicial"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
            />

            {/* Date To */}
            <Input
              type="date"
              placeholder="Data final"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mobile Feed (Cards) */}
      <div className="md:hidden space-y-4">
        {paginatedLeads.length === 0 ? (
          <Card className="glass-card flex flex-col items-center justify-center p-8 text-center bg-muted/20">
            <User className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Nenhum lead encontrado</p>
          </Card>
        ) : (
          paginatedLeads.map((lead) => {
            const status = statusConfig[lead.status || "new"];
            const temp = temperatureConfig[lead.temperature || "cold"];
            const TempIcon = temp.icon;

            return (
              <Card
                key={lead.id}
                className="glass-card hover:bg-muted/30 transition-colors active:scale-[0.99]"
                onClick={() => setSelectedLead(lead)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{lead.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="secondary" className={`text-[10px] h-5 px-1.5 ${status.color}`}>
                            {status.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TempIcon className={`w-3 h-3 ${temp.color}`} />
                            {temp.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(lead.id, false); }}>
                          <Archive className="w-4 h-4 mr-2" />
                          Arquivar
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); handleDelete(lead.id, true); }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir Definitivamente
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {lead.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-2 rounded">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </div>
                    )}
                    <span className="flex items-center gap-2 text-muted-foreground bg-muted/50 p-2 rounded">
                      <span className="truncate">{sourceConfig[lead.source_type || "other"]}</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {lead.created_at
                        ? format(parseISO(lead.created_at), "dd MMM yyyy", { locale: ptBR })
                        : "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      {lead.lead_procedures?.length ? `${lead.lead_procedures.length} procedimento(s)` : 'Sem procedimentos'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Desktop Table */}
      <Card className="glass-card hidden md:block">
        <CardContent className="p-0">
          <ErrorBoundary>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Temperatura</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Procedimentos</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map((lead) => {
                    const status = statusConfig[lead.status || "new"];
                    const temp = temperatureConfig[lead.temperature || "cold"];
                    const TempIcon = temp.icon;

                    return (
                      <TableRow
                        key={lead.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{lead.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </div>
                            )}
                            {lead.email && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TempIcon className={`w-4 h-4 ${temp.color}`} />
                            <span className={temp.color}>{temp.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {sourceConfig[lead.source_type || "other"]}
                          </span>
                          {lead.source_detail && (
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {lead.source_detail}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {lead.lead_procedures?.slice(0, 2).map((lp) => (
                              <Badge key={lp.procedure.id} variant="outline" className="text-xs">
                                {lp.procedure.name}
                              </Badge>
                            ))}
                            {(lead.lead_procedures?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(lead.lead_procedures?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {lead.created_at
                            ? format(parseISO(lead.created_at), "dd/MM/yyyy", { locale: ptBR })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(lead.id, false); }}>
                                <Archive className="w-4 h-4 mr-2" />
                                Arquivar
                              </DropdownMenuItem>
                              {isAdmin && (
                                <DropdownMenuItem
                                  onClick={(e) => { e.stopPropagation(); handleDelete(lead.id, true); }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir Definitivamente
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ErrorBoundary>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} de{" "}
                {filteredLeads.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          open={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          leadId={selectedLead.id}
          onCreateAppointment={handleCreateAppointment}
        />
      )}

      {/* Create Lead Modal */}
      <CreateLeadModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => {
          setShowAppointmentModal(false);
          setLeadForAppointment(null);
        }}
        preselectedLead={leadForAppointment}
        lockPerson={!!leadForAppointment}
      />
    </div>
  );
}
