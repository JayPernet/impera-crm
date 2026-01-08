import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Flame, Snowflake, Thermometer } from "lucide-react";
import { Temperature, SourceType } from "@/hooks/useLeads";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCrmUser } from "@/hooks/useCrmUser";

interface PipelineFiltersProps {
  selectedTemperatures: Temperature[];
  setSelectedTemperatures: (temps: Temperature[]) => void;
  selectedSourceType: SourceType | null;
  setSelectedSourceType: (source: SourceType | null) => void;
  selectedTagIds: string[];
  setSelectedTagIds: (ids: string[]) => void;
  selectedAssignedTo: string | null;
  setSelectedAssignedTo: (userId: string | null) => void;
  onClearFilters: () => void;
}

export function PipelineFilters({
  selectedTemperatures,
  setSelectedTemperatures,
  selectedSourceType,
  setSelectedSourceType,
  selectedTagIds,
  setSelectedTagIds,
  selectedAssignedTo,
  setSelectedAssignedTo,
  onClearFilters,
}: PipelineFiltersProps) {
  const { crmUser } = useCrmUser();

  const { data: tags } = useQuery({
    queryKey: ["tags", crmUser?.organization_id],
    queryFn: async () => {
      if (!crmUser?.organization_id) return [];
      const { data } = await supabase
        .from("crm_tags")
        .select("*")
        .eq("organization_id", crmUser.organization_id)
        .eq("active", true);
      return data || [];
    },
    enabled: !!crmUser?.organization_id,
  });

  const { data: users } = useQuery({
    queryKey: ["users", crmUser?.organization_id],
    queryFn: async () => {
      if (!crmUser?.organization_id) return [];
      const { data } = await supabase
        .from("crm_users")
        .select("*")
        .eq("organization_id", crmUser.organization_id)
        .eq("active", true);
      return data || [];
    },
    enabled: !!crmUser?.organization_id,
  });

  const toggleTemperature = (temp: Temperature) => {
    if (selectedTemperatures.includes(temp)) {
      setSelectedTemperatures(selectedTemperatures.filter((t) => t !== temp));
    } else {
      setSelectedTemperatures([...selectedTemperatures, temp]);
    }
  };

  const hasFilters =
    selectedTemperatures.length > 0 ||
    selectedSourceType ||
    selectedTagIds.length > 0 ||
    selectedAssignedTo;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-lg border border-border/50">
      {/* Temperature Toggle */}
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground mr-2">Temperatura:</span>
        <Button
          variant={selectedTemperatures.includes("cold") ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => toggleTemperature("cold")}
        >
          <Snowflake className="w-3 h-3 mr-1 text-temperature-cold" />
          Frio
        </Button>
        <Button
          variant={selectedTemperatures.includes("warm") ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => toggleTemperature("warm")}
        >
          <Thermometer className="w-3 h-3 mr-1 text-temperature-warm" />
          Morno
        </Button>
        <Button
          variant={selectedTemperatures.includes("hot") ? "default" : "outline"}
          size="sm"
          className="h-8"
          onClick={() => toggleTemperature("hot")}
        >
          <Flame className="w-3 h-3 mr-1 text-temperature-hot" />
          Quente
        </Button>
      </div>

      {/* Source Type */}
      <Select
        value={selectedSourceType || "all"}
        onValueChange={(v) => setSelectedSourceType(v === "all" ? null : (v as SourceType))}
      >
        <SelectTrigger className="w-[150px] h-8">
          <SelectValue placeholder="Origem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas origens</SelectItem>
          <SelectItem value="ads">Anúncios</SelectItem>
          <SelectItem value="organic">Orgânico</SelectItem>
          <SelectItem value="indication">Indicação</SelectItem>
          <SelectItem value="other">Outro</SelectItem>
        </SelectContent>
      </Select>

      {/* Tags */}
      <Select
        value={selectedTagIds[0] || "all"}
        onValueChange={(v) => setSelectedTagIds(v === "all" ? [] : [v])}
      >
        <SelectTrigger className="w-[150px] h-8">
          <SelectValue placeholder="Tags" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas tags</SelectItem>
          {tags?.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tag.color || undefined }}
                />
                {tag.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Assigned To */}
      <Select
        value={selectedAssignedTo || "all"}
        onValueChange={(v) => setSelectedAssignedTo(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-[150px] h-8">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {users?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8">
          <X className="w-3 h-3 mr-1" />
          Limpar
        </Button>
      )}
    </div>
  );
}
