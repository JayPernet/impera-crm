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
        <nav className="sticky top-0 z-50 w-full border-b border-luxury bg-abyss/80 backdrop-blur-md">
            <div className="mx-auto max-w-[1280px] px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                        <Building2 className="h-6 w-6 text-gold" strokeWidth={1.5} />
                        <span className="text-xl font-semibold leading-none tracking-tight text-gold">
                            Impera
                        </span>
                    </Link>

                    {/* Login Link */}
                    <Link
                        href="/login"
                        className="cursor-pointer rounded-md border border-gold/40 bg-transparent px-4 py-2 text-sm font-semibold text-gold transition-all hover:border-gold/60 hover:bg-gold/10"
                    >
                        Acessar Sistema
                    </Link>
                </div>
            </div>
        </nav>
    );
}
