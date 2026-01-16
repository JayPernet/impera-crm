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
                className="luxury-card p-6 group hover:bg-white/[0.02] transition-all"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">
                            Imóveis Ativos
                        </p>
                        <h3 className="text-4xl font-extrabold text-primary tabular-nums">
                            {totalProperties}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Building2 className="h-5 w-5" />
                    </div>
                </div>
            </Link>

            <div className="luxury-card p-6 group hover:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] mb-1 group-hover:text-success transition-colors">
                            Novos (7 dias)
                        </p>
                        <h3 className="text-4xl font-extrabold text-primary tabular-nums">
                            {recentProperties}
                        </h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center text-success border border-success/20">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
