'use client';

import Link from 'next/link';
import { Building2, Mail, MapPin } from 'lucide-react';

/**
 * Footer Component
 * 
 * Updated footer with the new brand positioning.
 * 
 * @component
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-luxury bg-abyss/50 backdrop-blur-md">
            <div className="mx-auto max-w-[1280px] px-6 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-gold" strokeWidth={1.5} />
                            <span className="text-xl font-semibold tracking-tight text-white uppercase">
                                Impera
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-400">
                            IMPERA.<br />
                            O CRM que transforma sua imobiliária.
                        </p>
                    </div>

                    {/* Links Column */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
                            Navegação
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="#features"
                                    className="text-sm text-neutral-400 transition-colors hover:text-gold"
                                >
                                    Solução
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#pricing"
                                    className="text-sm text-neutral-400 transition-colors hover:text-gold"
                                >
                                    Planos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-sm text-neutral-400 transition-colors hover:text-gold"
                                >
                                    Painel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
                            Contato
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-neutral-400">
                                <Mail className="mt-0.5 h-4 w-4 text-gold" strokeWidth={1.5} />
                                <span>contato@impera.com</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-neutral-400">
                                <MapPin className="mt-0.5 h-4 w-4 text-gold" strokeWidth={1.5} />
                                <span>Salvador, BA - Brasil</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-luxury pt-8">
                    <div className="flex flex-col items-center justify-between gap-4 text-sm text-neutral-500 md:flex-row">
                        <p>© {currentYear} Impera — Alta Performance Imobiliária.</p>
                        <div className="flex gap-6">
                            <Link
                                href="/privacy"
                                className="transition-colors hover:text-gold"
                            >
                                Privacidade
                            </Link>
                            <Link
                                href="/terms"
                                className="transition-colors hover:text-gold"
                            >
                                Termos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
