import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useAnamnesis,
  useSaveAnamnesis,
  useLastOrganizationAnamnesis,
  useAnamnesisHistory,
  useDeleteAnamnesisHistory,
  Anamnesis
} from "@/hooks/useAnamnesis";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCrmUser } from "@/hooks/useCrmUser";
import { toast } from "sonner";
import {
  AlertTriangle,
  Save,
  FileText,
  Heart,
  Leaf,
  Sparkles,
  Eye,
  Lock,
  Copy,
  CheckCircle2,
  History,
  Trash2,
  Calendar,
  User as UserIcon,
} from "lucide-react";

interface AnamnesisModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string | null;
  clientName: string;
}

const chronicDiseaseOptions = [
  "Diabetes",
  "Hipertensão",
  "Tireoide",
  "Autoimune",
  "Cardíaca",
  "Renal",
  "Hepática",
];

const lifestyleOptions = [
  { value: "smoker", label: "Fumante" },
  { value: "alcohol", label: "Etilismo" },
  { value: "sedentary", label: "Sedentário" },
  { value: "athlete", label: "Atleta" },
];

const sunExposureOptions = ["Baixa", "Moderada", "Alta (diária)"];
const waterIntakeOptions = ["Baixa (<1L)", "Normal (2L)", "Alta (>3L)"];
const sleepQualityOptions = ["Boa", "Regular", "Insônia", "Ruim"];
const intestinalOptions = ["Regular", "Constipado", "Irregular"];
const skinPhototypes = ["I - Muito clara", "II - Clara", "III - Morena clara", "IV - Morena", "V - Morena escura", "VI - Negra"];
const skinTypes = ["Seca", "Normal", "Mista", "Oleosa", "Sensível"];

export function AnamnesisModal({ open, onClose, clientId, clientName }: AnamnesisModalProps) {
  const { crmUser, userRole } = useCrmUser();
  const { data: anamnesis, isLoading } = useAnamnesis(clientId);
  const { data: history, isLoading: isLoadingHistory } = useAnamnesisHistory(anamnesis?.id);
  const { data: lastAnamnesis } = useLastOrganizationAnamnesis(clientId);
  const saveAnamnesis = useSaveAnamnesis();
  const deleteHistory = useDeleteAnamnesisHistory();

  // Role check - 'user' role is read-only
  const isReadOnly = userRole?.role === "user";

  const [formData, setFormData] = useState<Partial<Anamnesis>>({
    main_complaint: "",
    expectation: "",
    history_current_problem: "",
    allergies: "",
    medications_in_use: "",
    chronic_diseases: [],
    surgeries_implants: "",
    is_pregnant_or_breastfeeding: false,
    lifestyle_habits: [],
    sun_exposure: "",
    water_intake: "",
    sleep_quality: "",
    intestinal_function: "",
    previous_procedures: "",
    adverse_reactions: "",
    home_care_routine: "",
    skin_phototype: "",
    skin_type: "",
    professional_notes: "",
    disclaimer_accepted: false,
  });

  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    if (anamnesis) {
      setFormData({
        main_complaint: anamnesis.main_complaint || "",
        expectation: anamnesis.expectation || "",
        history_current_problem: anamnesis.history_current_problem || "",
        allergies: anamnesis.allergies || "",
        medications_in_use: anamnesis.medications_in_use || "",
        chronic_diseases: anamnesis.chronic_diseases || [],
        surgeries_implants: anamnesis.surgeries_implants || "",
        is_pregnant_or_breastfeeding: anamnesis.is_pregnant_or_breastfeeding || false,
        lifestyle_habits: anamnesis.lifestyle_habits || [],
        sun_exposure: anamnesis.sun_exposure || "",
        water_intake: anamnesis.water_intake || "",
        sleep_quality: anamnesis.sleep_quality || "",
        intestinal_function: anamnesis.intestinal_function || "",
        previous_procedures: anamnesis.previous_procedures || "",
        adverse_reactions: anamnesis.adverse_reactions || "",
        home_care_routine: anamnesis.home_care_routine || "",
        skin_phototype: anamnesis.skin_phototype || "",
        skin_type: anamnesis.skin_type || "",
        professional_notes: anamnesis.professional_notes || "",
        disclaimer_accepted: anamnesis.disclaimer_accepted || false,
      });
      setDisclaimerAccepted(anamnesis.disclaimer_accepted || false);
    }
  }, [anamnesis]);

  const handleCopyLastAnamnesis = () => {
    if (!lastAnamnesis) {
      toast.error("Nenhuma anamnese anterior encontrada");
      return;
    }
    setFormData({
      ...formData,
      main_complaint: lastAnamnesis.main_complaint || "",
      expectation: lastAnamnesis.expectation || "",
      history_current_problem: lastAnamnesis.history_current_problem || "",
      allergies: lastAnamnesis.allergies || "",
      medications_in_use: lastAnamnesis.medications_in_use || "",
      chronic_diseases: lastAnamnesis.chronic_diseases || [],
      surgeries_implants: lastAnamnesis.surgeries_implants || "",
      is_pregnant_or_breastfeeding: lastAnamnesis.is_pregnant_or_breastfeeding || false,
      lifestyle_habits: lastAnamnesis.lifestyle_habits || [],
      sun_exposure: lastAnamnesis.sun_exposure || "",
      water_intake: lastAnamnesis.water_intake || "",
      sleep_quality: lastAnamnesis.sleep_quality || "",
      intestinal_function: lastAnamnesis.intestinal_function || "",
      previous_procedures: lastAnamnesis.previous_procedures || "",
      adverse_reactions: lastAnamnesis.adverse_reactions || "",
      home_care_routine: lastAnamnesis.home_care_routine || "",
      skin_phototype: lastAnamnesis.skin_phototype || "",
      skin_type: lastAnamnesis.skin_type || "",
      // Not copying professional_notes as it's specific to each patient
      professional_notes: formData.professional_notes || "",
      disclaimer_accepted: false,
    });
    setDisclaimerAccepted(false);
    toast.success("Dados copiados! Revise e confirme o termo de responsabilidade.");
  };

  const handleSave = () => {
    if (!clientId) return;
    if (!disclaimerAccepted) {
      toast.error("É necessário aceitar o termo de responsabilidade");
      return;
    }
    saveAnamnesis.mutate({
      clientId,
      data: {
        ...formData,
        disclaimer_accepted: true,
        disclaimer_accepted_at: new Date().toISOString(),
      }
    });
  };

  const toggleChronicDisease = (disease: string) => {
    const current = formData.chronic_diseases || [];
    if (current.includes(disease)) {
      setFormData({ ...formData, chronic_diseases: current.filter((d) => d !== disease) });
    } else {
      setFormData({ ...formData, chronic_diseases: [...current, disease] });
    }
  };

  const toggleLifestyle = (habit: string) => {
    const current = formData.lifestyle_habits || [];
    if (current.includes(habit)) {
      setFormData({ ...formData, lifestyle_habits: current.filter((h) => h !== habit) });
    } else {
      setFormData({ ...formData, lifestyle_habits: [...current, habit] });
    }
  };

  const hasAllergies = formData.allergies && formData.allergies.trim().length > 0;
  const isPregnant = formData.is_pregnant_or_breastfeeding;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Anamnese - {clientName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isReadOnly && lastAnamnesis && !anamnesis && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary/20 hover:bg-primary/10"
                  onClick={handleCopyLastAnamnesis}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Última
                </Button>
              )}
              {isReadOnly && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-warning/10 text-warning">
                  <Lock className="w-3 h-3" />
                  Modo Leitura
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="current" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Anamnese Atual
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
                {/* Alerta de Alergias */}
                {hasAllergies && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">⚠️ ALERTA DE ALERGIAS</p>
                      <p className="text-sm text-destructive/80">{formData.allergies}</p>
                    </div>
                  </div>
                )}

                <Accordion type="multiple" defaultValue={["grupo-a", "grupo-b"]} className="space-y-2">
                  {/* Grupo A: Queixa Principal */}
                  <AccordionItem value="grupo-a" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span>Queixa Principal & Expectativas</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="space-y-2">
                        <Label>O que mais incomoda o paciente hoje?</Label>
                        <Textarea
                          value={formData.main_complaint || ""}
                          onChange={(e) => setFormData({ ...formData, main_complaint: e.target.value })}
                          placeholder="Ex: Rugas na testa, manchas de sol..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>O que espera de resultado?</Label>
                        <Textarea
                          value={formData.expectation || ""}
                          onChange={(e) => setFormData({ ...formData, expectation: e.target.value })}
                          placeholder="Expectativas do paciente..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Há quanto tempo isso incomoda? Piora com algo?</Label>
                        <Textarea
                          value={formData.history_current_problem || ""}
                          onChange={(e) => setFormData({ ...formData, history_current_problem: e.target.value })}
                          placeholder="Histórico do problema..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Grupo B: Histórico Clínico */}
                  <AccordionItem value="grupo-b" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-destructive" />
                        <span>Histórico Clínico (Segurança)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          Alergias (Campo Crítico)
                        </Label>
                        <Textarea
                          value={formData.allergies || ""}
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                          placeholder="Medicamentos, cosméticos, látex, anestésicos, alimentos..."
                          disabled={isReadOnly}
                          className={hasAllergies ? "border-destructive" : ""}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Medicamentos em uso contínuo</Label>
                        <Textarea
                          value={formData.medications_in_use || ""}
                          onChange={(e) => setFormData({ ...formData, medications_in_use: e.target.value })}
                          placeholder="Ex: Roacutan, Anticoagulantes..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Doenças Crônicas</Label>
                        <div className="flex flex-wrap gap-2">
                          {chronicDiseaseOptions.map((disease) => (
                            <Badge
                              key={disease}
                              variant={formData.chronic_diseases?.includes(disease) ? "default" : "outline"}
                              className={`cursor-pointer ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
                              onClick={() => !isReadOnly && toggleChronicDisease(disease)}
                            >
                              {disease}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Cirurgias/Implantes (placas, pinos, marcapasso)</Label>
                        <Textarea
                          value={formData.surgeries_implants || ""}
                          onChange={(e) => setFormData({ ...formData, surgeries_implants: e.target.value })}
                          placeholder="Cirurgias prévias na face/corpo..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="pregnant"
                          checked={formData.is_pregnant_or_breastfeeding || false}
                          onCheckedChange={(checked) =>
                            !isReadOnly && setFormData({ ...formData, is_pregnant_or_breastfeeding: !!checked })
                          }
                          disabled={isReadOnly}
                        />
                        <Label htmlFor="pregnant" className="cursor-pointer">
                          Gestante ou Lactante
                        </Label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Grupo C: Hábitos & Estilo de Vida */}
                  <AccordionItem value="grupo-c" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-success" />
                        <span>Hábitos & Estilo de Vida</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="space-y-2">
                        <Label>Hábitos</Label>
                        <div className="flex flex-wrap gap-2">
                          {lifestyleOptions.map((option) => (
                            <Badge
                              key={option.value}
                              variant={formData.lifestyle_habits?.includes(option.value) ? "default" : "outline"}
                              className={`cursor-pointer ${isReadOnly ? "cursor-not-allowed opacity-70" : ""}`}
                              onClick={() => !isReadOnly && toggleLifestyle(option.value)}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Exposição Solar</Label>
                          <Select
                            value={formData.sun_exposure || ""}
                            onValueChange={(v) => setFormData({ ...formData, sun_exposure: v })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {sunExposureOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Consumo de Água</Label>
                          <Select
                            value={formData.water_intake || ""}
                            onValueChange={(v) => setFormData({ ...formData, water_intake: v })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {waterIntakeOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Qualidade do Sono</Label>
                          <Select
                            value={formData.sleep_quality || ""}
                            onValueChange={(v) => setFormData({ ...formData, sleep_quality: v })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {sleepQualityOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Função Intestinal</Label>
                          <Select
                            value={formData.intestinal_function || ""}
                            onValueChange={(v) => setFormData({ ...formData, intestinal_function: v })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {intestinalOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Grupo D: Histórico Estético */}
                  <AccordionItem value="grupo-d" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>Histórico Estético</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="space-y-2">
                        <Label>Procedimentos anteriores (Botox, Preenchimento, Laser...)</Label>
                        <Textarea
                          value={formData.previous_procedures || ""}
                          onChange={(e) => setFormData({ ...formData, previous_procedures: e.target.value })}
                          placeholder="O que já foi feito? Quando foi o último?"
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reações adversas em procedimentos anteriores</Label>
                        <Textarea
                          value={formData.adverse_reactions || ""}
                          onChange={(e) => setFormData({ ...formData, adverse_reactions: e.target.value })}
                          placeholder="Nódulo, queloide, complicações..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rotina de cuidados em casa</Label>
                        <Textarea
                          value={formData.home_care_routine || ""}
                          onChange={(e) => setFormData({ ...formData, home_care_routine: e.target.value })}
                          placeholder="Ácidos, Vitamina C, protetor solar..."
                          disabled={isReadOnly}
                          rows={2}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Grupo E: Avaliação Física */}
                  <AccordionItem value="grupo-e" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <span>Avaliação Física (Exame Clínico)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Fototipo de Pele (Fitzpatrick)</Label>
                          <Select
                            value={formData.skin_phototype || ""}
                            onValueChange={(v) => setFormData({ ...formData, skin_phototype: v })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {skinPhototypes.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo de Pele</Label>
                          <Select
                            value={formData.skin_type || ""}
                            onValueChange={(v) => setFormData({ ...formData, skin_type: v })}
                            disabled={isReadOnly}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {skinTypes.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Observações do Profissional</Label>
                        <Textarea
                          value={formData.professional_notes || ""}
                          onChange={(e) => setFormData({ ...formData, professional_notes: e.target.value })}
                          placeholder="Anotações sobre assimetrias, flacidez, manchas específicas..."
                          disabled={isReadOnly}
                          rows={4}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Termo de Responsabilidade */}
                {!isReadOnly && (
                  <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="disclaimer"
                        checked={disclaimerAccepted}
                        onCheckedChange={(checked) => setDisclaimerAccepted(!!checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="disclaimer" className="cursor-pointer font-medium text-sm">
                          Termo de Responsabilidade
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Ao preencher, o paciente declara que as informações acima são verdadeiras e
                          assume a responsabilidade por eventuais omissões ou informações incorretas.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!isReadOnly && (
                  <div className="flex justify-end mt-4 pb-4">
                    <Button
                      className="gold-gradient text-secondary"
                      onClick={handleSave}
                      disabled={saveAnamnesis.isPending || !disclaimerAccepted}
                    >
                      {disclaimerAccepted ? (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {saveAnamnesis.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history">
              <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
                <div className="space-y-4">
                  {isLoadingHistory ? (
                    <div className="space-y-3">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : history && history.length > 0 ? (
                    history.map((version) => (
                      <Card key={version.id} className="border-muted">
                        <CardHeader className="py-3 px-4 bg-muted/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Calendar className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">
                                  {format(parseISO(version.archived_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <UserIcon className="w-3 h-3" />
                                  <span>{version.created_by_name}</span>
                                </div>
                              </div>
                            </div>
                            {!isReadOnly && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  if (confirm("Tem certeza que deseja remover esta versão do histórico?")) {
                                    deleteHistory.mutate({ historyId: version.id, anamnesisId: anamnesis!.id });
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 text-xs space-y-2">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div>
                              <span className="font-medium text-muted-foreground">Queixa: </span>
                              <span className="line-clamp-1">{version.data_snapshot.main_complaint || "-"}</span>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Fototipo: </span>
                              <span>{version.data_snapshot.skin_phototype || "-"}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-muted-foreground">Alergias: </span>
                              <span className={version.data_snapshot.allergies ? "text-destructive font-semibold" : ""}>
                                {version.data_snapshot.allergies || "Nenhuma"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Nenhuma versão anterior no histórico</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog >
  );
}
