import { User, ChevronDown, Moon, Sun, LogOut, Shield, UserCog, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useCrmUser } from "@/hooks/useCrmUser";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NotificationsPopover } from "./NotificationsPopover";

const getRoleBadge = (role: string | undefined) => {
  switch (role) {
    case "super_admin":
      return { label: "Super Admin", variant: "default" as const, icon: Shield };
    case "admin":
      return { label: "Admin", variant: "secondary" as const, icon: UserCog };
    case "professional":
      return { label: "Profissional", variant: "outline" as const, icon: Stethoscope };
    case "user":
      return { label: "Usuário", variant: "outline" as const, icon: User };
    default:
      return { label: "Sem Role", variant: "outline" as const, icon: User };
  }
};

export function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { crmUser, userRole } = useCrmUser();
  
  const roleInfo = getRoleBadge(userRole?.role);
  const RoleIcon = roleInfo.icon;
  const displayName = crmUser?.name || user?.email?.split("@")[0] || "Usuário";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Bell */}
        <NotificationsPopover />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-auto py-2">
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start hidden md:flex">
                <span className="text-sm font-medium">{displayName}</span>
                <Badge variant={roleInfo.variant} className="text-xs h-5 px-1.5">
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {roleInfo.label}
                </Badge>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-2">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <Badge variant={roleInfo.variant} className="mt-1 text-xs">
                <RoleIcon className="w-3 h-3 mr-1" />
                {roleInfo.label}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
