"use client";

import { CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

interface RecentSale {
    id: string;
    full_name: string;
    status: string;
    created_at: string;
}

interface RecentSalesProps {
    sales: RecentSale[];
}

export function RecentSales({ sales }: RecentSalesProps) {
    return (
        <div className="bg-white border border-marble shadow-sm relative overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-pearl/30">
                <h3 className="sub-header flex items-center gap-2 text-navy">
                    <TrendingUp className="h-4 w-4 text-gold" />
                    Vendas Recentes
                </h3>
                <Link href="/dashboard/clients" className="text-[10px] uppercase font-bold tracking-widest text-slate/60 hover:text-navy transition-colors">
                    Ver todos
                </Link>
            </div>

            <div className="p-4 space-y-2">
                {sales.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-text-tertiary text-xs border border-dashed border-white/5 rounded-xl">
                        <CheckCircle2 className="h-6 w-6 mb-2 opacity-20" />
                        Nenhuma venda registrada
                    </div>
                ) : (
                    sales.map((sale) => (
                        <Link
                            key={sale.id}
                            href={`/dashboard/leads/${sale.id}/edit`}
                            className="group flex items-center gap-4 p-3 rounded-sm hover:bg-pearl/50 transition-all border border-transparent hover:border-marble"
                        >
                            <div className="h-8 w-8 rounded-sm bg-navy text-gold flex items-center justify-center font-display italic text-[10px] shrink-0 border border-gold/20">
                                {sale.full_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                                    {sale.full_name}
                                </p>
                                <p className="text-[10px] text-text-tertiary font-mono mt-0.5">
                                    {new Date(sale.created_at).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: 'short'
                                    })}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <span className="text-[9px] uppercase tracking-wider font-bold text-success/80">
                                    Fechado
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
