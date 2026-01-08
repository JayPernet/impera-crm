"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Building2, Users, MessageSquare, Settings, LogOut, ShieldCheck, Shield, UsersRound } from "lucide-react";

const getMenuItems = (role?: string) => {
    // If super_admin, they ONLY see the Admin/Organizations management
    if (role === "super_admin") {
        return [
            { icon: Home, label: "Painel", href: "/dashboard" },
            { icon: Shield, label: "Admin", href: "/dashboard/admin/organizations" },
            { icon: Settings, label: "Configurações", href: "/dashboard/settings" },
        ];
    }

    // Regular flow for Admins and Real Estate Agents
    const baseItems = [
        { icon: Home, label: "Painel", href: "/dashboard" },
        { icon: Building2, label: "Imóveis", href: "/dashboard/properties" },
        { icon: Users, label: "Leads", href: "/dashboard/leads" },
        { icon: Users, label: "Clientes", href: "/dashboard/clients" },
        { icon: MessageSquare, label: "Chat", href: "/dashboard/chat" },
    ];

    // Add Team management for admins only
    if (role === "admin") {
        baseItems.push({ icon: UsersRound, label: "Time", href: "/dashboard/team" });
    }

    baseItems.push({ icon: Settings, label: "Configurações", href: "/dashboard/settings" });

    return baseItems;
};

export function Sidebar({ role, fullName }: { role?: string; fullName?: string }) {
    const pathname = usePathname();
    const menuItems = getMenuItems(role);

    const initials = fullName
        ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";

    return (
        <aside className="w-64 h-screen bg-background border-r border-border flex flex-col fixed left-0 top-0">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tight text-text-primary block leading-none">IMPERA</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">CRM</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "bg-white/[0.02] text-primary border-l-2 border-primary"
                                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.01] border-l-2 border-transparent"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-primary")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/[0.03]">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-background border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text-primary leading-none truncate max-w-[120px]">
                                {fullName || "Usuário"}
                            </span>
                            <span className="text-[10px] text-primary font-medium uppercase mt-1">
                                {role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Corretor"}
                            </span>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button title="Sair" className="p-2 hover:bg-background rounded-md text-text-secondary hover:text-danger transition-colors">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    );
}
