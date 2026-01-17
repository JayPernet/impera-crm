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
        <footer className="bg-navy border-t border-white/5 pt-24 pb-12">
            <div className="mx-auto max-w-[1400px] px-8">
                <div className="grid gap-16 md:grid-cols-4 lg:grid-cols-5 mb-24">
                    {/* Brand Column - Sovereign Pillar */}
                    <div className="md:col-span-2 lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 border border-gold/30 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-gold" strokeWidth={1} />
                            </div>
                            <span className="text-2xl font-display font-medium tracking-tight text-white uppercase">
                                Impera<span className="italic font-serif text-gold">.</span>
                            </span>
                        </div>
                        <p className="text-lg font-light leading-relaxed text-white/40 max-w-sm italic font-serif">
                            Elevando a mediação imobiliária ao patamar de arte e precisão cibernética.
                        </p>
                    </div>

                    {/* Navigation - Architectural Structure */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                            Ecossistema
                        </h3>
                        <ul className="space-y-4">
                            {['Solução', 'Planos', 'Metodologia', 'Painel de Controle'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`#${item.toLowerCase()}`}
                                        className="text-white/50 text-[11px] font-bold uppercase tracking-[1.5px] hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support - Specialized Service */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                            Suporte
                        </h3>
                        <ul className="space-y-4">
                            {['Privacidade', 'Termos de Uso', 'Compliance', 'Segurança'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`#${item.toLowerCase()}`}
                                        className="text-white/50 text-[11px] font-bold uppercase tracking-[1.5px] hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact - Direct Line */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                            Global
                        </h3>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[1.5px]">
                            <li className="flex items-center gap-3 text-white/50 group cursor-pointer hover:text-white transition-colors">
                                <Mail className="h-4 w-4 text-gold/60" strokeWidth={1} />
                                <span>contato@impera.ai</span>
                            </li>
                            <li className="flex items-center gap-3 text-white/50 group cursor-pointer hover:text-white transition-colors">
                                <MapPin className="h-4 w-4 text-gold/60" strokeWidth={1} />
                                <span>Salvador • Brasil</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Final Seal */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                        © {currentYear} Impera Corporation — SOBERANIA TECNOLÓGICA.
                    </p>
                    <div className="flex gap-12 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                        <span>MADE WITH PRECISION</span>
                        <span>v2.0.0 LUXE EDITION</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
