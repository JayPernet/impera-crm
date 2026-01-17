'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';

/**
 * Navbar Component
 * 
 * Sticky navigation bar with backdrop blur effect.
 * Features the Impera logo and login link.
 * 
 * @component
 */
export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-marble bg-navy/95 backdrop-blur-md">
            <div className="mx-auto max-w-[1400px] px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 transition-all hover:opacity-80 group"
                    >
                        <div className="h-10 w-10 border border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors">
                            <Building2 className="h-5 w-5 text-gold" strokeWidth={1} />
                        </div>
                        <span className="text-2xl font-display font-medium tracking-tight text-white group-hover:text-gold transition-colors">
                            Impera<span className="italic font-serif text-gold">.</span>
                        </span>
                    </Link>

                    {/* Navigation - Strategic Links */}
                    <div className="hidden md:flex items-center gap-10">
                        {['Solução', 'Planos', 'Metodologia'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-gold transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Access Button - Luxe Style */}
                    <Link
                        href="/login"
                        className="h-11 px-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-navy border border-marble hover:bg-navy hover:text-white hover:border-navy transition-all duration-300 rounded-sm shadow-sm"
                    >
                        Acessar Sistema
                    </Link>
                </div>
            </div>
        </nav>
    );
}
