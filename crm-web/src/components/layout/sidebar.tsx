"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Building2, Users, MessageSquare, Settings, LogOut, ShieldCheck, Shield, UsersRound } from "lucide-react";
import { NotificationBadge } from "@/components/notifications/notification-badge";

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
        <aside className="w-64 h-screen bg-navy border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
            {/* Brand */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                        <span className="text-xl font-display font-semibold tracking-tight text-white block leading-none">IMPERA<span className="text-gold italic font-serif">.</span></span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">CRM</span>
                    </div>
                </div>
                <NotificationBadge />
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-sm text-[13px] font-medium transition-all duration-300 group relative",
                                isActive
                                    ? "bg-gold/10 text-gold border-l-2 border-gold shadow-[inset_4px_0_10px_rgba(210,182,138,0.05)]"
                                    : "text-white/60 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                            )}
                        >
                            <item.icon className={cn("h-4.5 w-4.5 transition-colors duration-300", isActive ? "text-gold" : "text-white/40 group-hover:text-white")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="p-4 bg-navy-dark/50 border-t border-white/5">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-md border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-[11px] font-bold text-gold">
                            {initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white leading-none truncate">
                                {fullName || "Usuário"}
                            </span>
                            <span className="text-[9px] text-gold/80 font-bold uppercase tracking-wider mt-1">
                                {role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Corretor"}
                            </span>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button title="Sair" className="p-2 hover:bg-white/5 rounded-sm text-white/40 hover:text-destructive transition-colors">
                            <LogOut className="h-3.5 w-3.5" />
                        </button>
                    </form>
                </div>
                <div className="mt-4 text-[9px] text-center text-white/20 uppercase tracking-[0.2em] font-medium">
                    v2.0 • Luxe Edition
                </div>
            </div>
        </aside>
    );
}
