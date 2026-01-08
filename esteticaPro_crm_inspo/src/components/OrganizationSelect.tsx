import { useCrmUser } from "@/hooks/useCrmUser";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

interface OrganizationSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function OrganizationSelect({
  value,
  onChange,
  label = "Clínica",
  required = true,
}: OrganizationSelectProps) {
  const { isSuperAdmin, organizationId } = useCrmUser();
  const { data: organizations, isLoading } = useOrganizations();

  // Only show for super_admin
  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Building2 className="w-4 h-4 text-primary" />
        {label} {required && "*"}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione a clínica"} />
        </SelectTrigger>
        <SelectContent>
          {organizations?.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
