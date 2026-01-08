import { LayoutDashboard, GitBranch, Zap, Users, Calendar, Scissors, CheckSquare, Settings, Sparkles, Tag, List, ChevronDown, UserCircle, Building2, Shield, UsersRound, MessageSquare, Bot, AlertCircle, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useCrmUser } from "@/hooks/useCrmUser";
import { useUnreadCount } from "@/hooks/useInbox";
import { useSuperAdminOrg } from "@/contexts/SuperAdminOrgContext";

// Items that require organization selection for super_admin
const orgRequiredItems = [
  { title: "Mensagens", url: "/inbox", icon: MessageSquare, professionalAllowed: false, showBadge: true },
  { title: "Pipeline de Leads", url: "/pipeline-de-leads", icon: GitBranch, professionalAllowed: false, showBadge: false },
  { title: "Speed to Lead", url: "/speed-to-lead", icon: Zap, professionalAllowed: false, showBadge: false },
  { title: "Lista de Leads", url: "/leads", icon: List, professionalAllowed: false, showBadge: false },
  { title: "Clientes", url: "/clientes", icon: Users, professionalAllowed: false, showBadge: false },
  { title: "Agendamentos", url: "/agendamentos", icon: Calendar, professionalAllowed: true, showBadge: false },
  { title: "Anamnese", url: "/anamnese", icon: FileText, professionalAllowed: true, showBadge: false },
  { title: "Tarefas", url: "/tarefas", icon: CheckSquare, professionalAllowed: false, showBadge: false },
];

// Items that don't require organization selection
const alwaysVisibleItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, professionalAllowed: true, showBadge: false },
  { title: "Copiloto", url: "/assistente", icon: Bot, professionalAllowed: false, showBadge: false },
];

const configMenuItems = [
  { title: "Clínica", url: "/configuracoes/clinica", icon: Building2 },
  { title: "Usuários", url: "/configuracoes/usuarios", icon: UserCircle },
  { title: "Procedimentos", url: "/configuracoes/procedimentos", icon: Scissors },
  { title: "Tags", url: "/configuracoes/tags", icon: Tag },
  { title: "Geral", url: "/configuracoes", icon: Settings },
];

const adminMenuItems = [
  { title: "Organizações", url: "/admin/organizacoes", icon: Building2 },
  { title: "Usuários Global", url: "/admin/usuarios-global", icon: UsersRound },
];

export function AppSidebar() {
  const location = useLocation();
  const { isSuperAdmin, isProfessional } = useCrmUser();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { hasSelectedOrgs, selectedOrgIds } = useSuperAdminOrg();
  const [configOpen, setConfigOpen] = useState(location.pathname.startsWith("/configuracoes"));
  const [adminOpen, setAdminOpen] = useState(location.pathname.startsWith("/admin"));

  // Build menu items based on role and org selection
  const getVisibleMenuItems = () => {
    // For professionals: only show professional allowed items
    if (isProfessional) {
      return [...alwaysVisibleItems, ...orgRequiredItems].filter((item) => item.professionalAllowed);
    }
    
    // For super_admin: show always visible + org-required only if orgs are selected
    if (isSuperAdmin) {
      const items = [...alwaysVisibleItems];
      if (hasSelectedOrgs) {
        items.push(...orgRequiredItems);
      }
      return items;
    }
    
    // For admin/user: show all items
    return [...alwaysVisibleItems, ...orgRequiredItems];
  };

  const visibleMenuItems = getVisibleMenuItems();
  const isConfigActive = location.pathname.startsWith("/configuracoes");
  const isAdminActive = location.pathname.startsWith("/admin");

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sidebar" />
          </div>
          <span className="text-xl font-bold gold-text">ClinicPro</span>
          <span className="text-xl font-light text-sidebar-foreground">CRM</span>
        </NavLink>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                const showBadge = item.showBadge && unreadCount > 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        w-full transition-all duration-200 rounded-md
                        ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                      `}
                    >
                      <NavLink to={item.url} className="flex items-center justify-between px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </div>
                        {showBadge && (
                          <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {/* Configurações Collapsible - Hidden for Professionals */}
              {!isProfessional && (
                <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`
                          w-full transition-all duration-200 rounded-md cursor-pointer
                          ${isConfigActive ? "bg-sidebar-primary/50 text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                        `}
                      >
                        <div className="flex items-center justify-between w-full px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Configurações</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${configOpen ? "rotate-180" : ""}`} />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 mt-1 space-y-1">
                        {configMenuItems.map((item) => {
                          const isActive = location.pathname === item.url;
                          return (
                            <NavLink
                              key={item.title}
                              to={item.url}
                              className={`
                                flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                                ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                              `}
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {/* Admin Section - Super Admin Only */}
              {isSuperAdmin && (
                <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={`
                          w-full transition-all duration-200 rounded-md cursor-pointer
                          ${isAdminActive ? "bg-destructive/20 text-destructive" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                        `}
                      >
                        <div className="flex items-center justify-between w-full px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Super Admin</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 transition-transform ${adminOpen ? "rotate-180" : ""}`} />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-4 mt-1 space-y-1">
                        {adminMenuItems.map((item) => {
                          const isActive = location.pathname === item.url;
                          return (
                            <NavLink
                              key={item.title}
                              to={item.url}
                              className={`
                                flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200
                                ${isActive ? "bg-destructive/20 text-destructive" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}
                              `}
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60 text-center">© 2025 ClinicPro CRM</div>
      </SidebarFooter>
    </Sidebar>
  );
}