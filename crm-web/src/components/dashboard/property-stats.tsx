"use client";

import { Building2, TrendingUp } from "lucide-react";
import Link from "next/link";

interface PropertyStatsProps {
    totalProperties: number;
    recentProperties: number;
}

export function PropertyStats({ totalProperties, recentProperties }: PropertyStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
                href="/dashboard/properties?filter=ativos"
                className="bg-white border border-marble p-6 group hover:shadow-md transition-all relative overflow-hidden"
                style={{ borderRadius: 'var(--radius-sm)' }}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate/50 uppercase tracking-[0.2em] mb-1 group-hover:text-navy transition-colors">
                            Imóveis Ativos
                        </p>
                        <h3 className="text-4xl font-display font-medium text-navy tabular-nums">
                            {totalProperties}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-sm bg-navy flex items-center justify-center text-gold border border-gold/20">
                        <Building2 className="h-5 w-5" />
                    </div>
                </div>
            </Link>

            <div
                className="bg-white border border-marble p-6 group hover:shadow-md transition-all relative overflow-hidden"
                style={{ borderRadius: 'var(--radius-sm)' }}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-slate/50 uppercase tracking-[0.2em] mb-1 group-hover:text-gold transition-colors">
                            Novos (7 dias)
                        </p>
                        <h3 className="text-4xl font-display font-medium text-navy tabular-nums">
                            {recentProperties}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-sm bg-pearl flex items-center justify-center text-navy border border-marble shadow-sm">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
