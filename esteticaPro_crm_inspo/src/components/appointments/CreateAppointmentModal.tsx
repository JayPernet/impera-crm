import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { OrganizationSelect } from "@/components/OrganizationSelect";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, User, Users } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone?: string | null;
}

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  preselectedLeadId?: string | null;
  preselectedClientId?: string | null;
  preselectedLead?: Lead | null;
  lockPerson?: boolean; // If true, disable changing the person (used when coming from /clientes)
}

interface PersonOption {
  id: string;
  name: string;
  phone: string | null;
  type: "lead" | "client";
}

export function CreateAppointmentModal({
  open,
  onClose,
  preselectedLeadId,
  preselectedClientId,
  preselectedLead,
  lockPerson = false,
}: CreateAppointmentModalProps) {
  const { crmUser, isSuperAdmin, organizationId } = useCrmUser();
  const createAppointment = useCreateAppointment();

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(null);
  const [personPopoverOpen, setPersonPopoverOpen] = useState(false);
  const [procedureId, setProcedureId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  // Effective organization: for super_admin use selected, otherwise use user's org
  const effectiveOrgId = isSuperAdmin ? selectedOrgId : organizationId;

  // Fetch leads and clients for combobox
  const { data: people } = useQuery({
    queryKey: ["people-for-appointment", effectiveOrgId],
    queryFn: async () => {
      if (!effectiveOrgId) return [];

      const [leadsRes, clientsRes] = await Promise.all([
        supabase
          .from("crm_leads")
          .select("id, name, phone")
          .eq("organization_id", effectiveOrgId)
          .eq("marked_for_deletion", false),
        supabase
          .from("crm_clients")
          .select("id, name, phone")
          .eq("organization_id", effectiveOrgId),
      ]);

      const leads: PersonOption[] = (leadsRes.data || []).map((l) => ({
        ...l,
        type: "lead" as const,
      }));
      const clients: PersonOption[] = (clientsRes.data || []).map((c) => ({
        ...c,
        type: "client" as const,
      }));

      return [...clients, ...leads];
    },
    enabled: !!effectiveOrgId && open,
  });

  // Fetch procedures
  const { data: procedures } = useQuery({
    queryKey: ["procedures", effectiveOrgId],
    queryFn: async () => {
      if (!effectiveOrgId) return [];
      const { data } = await supabase
        .from("crm_procedures")
        .select("*")
        .eq("organization_id", effectiveOrgId)
        .eq("active", true);
      return data || [];
    },
    enabled: !!effectiveOrgId && open,
  });

  // Fetch professionals (admin or professional roles)
  const { data: professionals } = useQuery({
    queryKey: ["professionals-for-appointment", effectiveOrgId],
    queryFn: async () => {
      if (!effectiveOrgId) return [];

      // Get users from organization
      const { data: users } = await supabase
        .from("crm_users")
        .select("id, name")
        .eq("organization_id", effectiveOrgId)
        .eq("active", true);

      return users || [];
    },
    enabled: !!effectiveOrgId && open,
  });

  // Reset dependent fields when org changes (for super_admin)
  useEffect(() => {
    if (isSuperAdmin) {
      setSelectedPerson(null);
      setProcedureId("");
      setProfessionalId("");
      setValue("");
    }
  }, [selectedOrgId, isSuperAdmin]);

  // Pre-select person if provided
  useEffect(() => {
    if (preselectedLead) {
      setSelectedPerson({
        id: preselectedLead.id,
        name: preselectedLead.name,
        phone: preselectedLead.phone || null,
        type: "lead",
      });
    } else if (people && preselectedLeadId) {
      const lead = people.find((p) => p.id === preselectedLeadId && p.type === "lead");
      if (lead) setSelectedPerson(lead);
    } else if (people && preselectedClientId) {
      const client = people.find((p) => p.id === preselectedClientId && p.type === "client");
      if (client) setSelectedPerson(client);
    }
  }, [people, preselectedLeadId, preselectedClientId, preselectedLead]);

  // Update value when procedure changes
  useEffect(() => {
    if (procedureId && procedures) {
      const proc = procedures.find((p) => p.id === procedureId);
      if (proc?.suggested_price) {
        setValue(String(proc.suggested_price));
      }
    }
  }, [procedureId, procedures]);

  const resetForm = () => {
    setSelectedOrgId("");
    setSelectedPerson(null);
    setProcedureId("");
    setProfessionalId("");
    setSelectedDate(undefined);
    setSelectedTime("09:00");
    setValue("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (isSuperAdmin && !selectedOrgId) {
      toast.error("Selecione uma clínica");
      return;
    }
    if (!selectedPerson) {
      toast.error("Selecione quem será atendido");
      return;
    }
    if (!procedureId) {
      toast.error("Selecione um procedimento");
      return;
    }
    if (!selectedDate) {
      toast.error("Selecione uma data");
      return;
    }
    if (!professionalId) {
      toast.error("Selecione um profissional");
      return;
    }
    const numValue = parseFloat(value);
    if (!value || numValue <= 0) {
      toast.error("Informe um valor maior que zero");
      return;
    }

    // Check if date is in the past
    const scheduledAt = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    scheduledAt.setHours(hours, minutes, 0, 0);

    if (scheduledAt < new Date()) {
      toast.error("Data/hora não pode ser no passado");
      return;
    }

    createAppointment.mutate(
      {
        lead_id: selectedPerson.type === "lead" ? selectedPerson.id : undefined,
        client_id: selectedPerson.type === "client" ? selectedPerson.id : undefined,
        procedure_id: procedureId,
        professional_id: professionalId,
        scheduled_at: scheduledAt.toISOString(),
        value: numValue,
        notes,
        organization_id: isSuperAdmin ? selectedOrgId : undefined,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-full h-full sm:h-auto p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Novo Agendamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Organization selector for super_admin */}
          <OrganizationSelect
            value={selectedOrgId}
            onChange={setSelectedOrgId}
          />

          {/* Quem? */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Quem? *
            </Label>
            <Popover open={personPopoverOpen} onOpenChange={setPersonPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={personPopoverOpen}
                  className="w-full justify-between"
                  disabled={(isSuperAdmin && !selectedOrgId) || (lockPerson && !!selectedPerson)}
                >
                  {selectedPerson ? (
                    <span className="flex items-center gap-2">
                      {selectedPerson.name}
                      <Badge variant="secondary" className="text-xs">
                        {selectedPerson.type === "client" ? "Cliente" : "Lead"}
                      </Badge>
                      {lockPerson && (
                        <Badge variant="outline" className="text-xs ml-1">
                          Fixo
                        </Badge>
                      )}
                    </span>
                  ) : isSuperAdmin && !selectedOrgId ? (
                    "Selecione a clínica primeiro"
                  ) : (
                    "Selecione lead ou cliente..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Buscar por nome ou telefone..." />
                  <CommandList>
                    <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                    <CommandGroup heading="Clientes">
                      {people
                        ?.filter((p) => p.type === "client")
                        .map((person) => (
                          <CommandItem
                            key={person.id}
                            value={`${person.name} ${person.phone}`}
                            onSelect={() => {
                              setSelectedPerson(person);
                              setPersonPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPerson?.id === person.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <Users className="mr-2 h-4 w-4 text-success" />
                            <span>{person.name}</span>
                            {person.phone && (
                              <span className="ml-2 text-muted-foreground text-sm">
                                ({person.phone})
                              </span>
                            )}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandGroup heading="Leads">
                      {people
                        ?.filter((p) => p.type === "lead")
                        .map((person) => (
                          <CommandItem
                            key={person.id}
                            value={`${person.name} ${person.phone}`}
                            onSelect={() => {
                              setSelectedPerson(person);
                              setPersonPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPerson?.id === person.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <User className="mr-2 h-4 w-4 text-primary" />
                            <span>{person.name}</span>
                            {person.phone && (
                              <span className="ml-2 text-muted-foreground text-sm">
                                ({person.phone})
                              </span>
                            )}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* O que? */}
          <div className="space-y-2">
            <Label>O que? (Procedimento) *</Label>
            <Select value={procedureId} onValueChange={setProcedureId} disabled={isSuperAdmin && !selectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder={isSuperAdmin && !selectedOrgId ? "Selecione a clínica primeiro" : "Selecione um procedimento"} />
              </SelectTrigger>
              <SelectContent>
                {procedures?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                    {p.suggested_price ? ` (R$ ${p.suggested_price})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quando? */}
          <div className="space-y-2">
            <Label>Quando? *</Label>
            <div className="flex gap-2">
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setDatePopoverOpen(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-28"
              />
            </div>
          </div>

          {/* Com quem? */}
          <div className="space-y-2">
            <Label>Com quem? (Profissional) *</Label>
            <Select value={professionalId} onValueChange={setProfessionalId} disabled={isSuperAdmin && !selectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder={isSuperAdmin && !selectedOrgId ? "Selecione a clínica primeiro" : "Selecione um profissional"} />
              </SelectTrigger>
              <SelectContent>
                {professionals?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="value">Valor (R$) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0,00"
                className="pl-10"
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o agendamento..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="gold-gradient text-secondary"
              disabled={createAppointment.isPending || (isSuperAdmin && !selectedOrgId)}
            >
              {createAppointment.isPending ? "Salvando..." : "Salvar Agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
