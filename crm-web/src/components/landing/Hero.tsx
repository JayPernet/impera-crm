'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Hero Component
 * 
 * Main hero section with unified conversion links.
 * 
 * @component
 */
export function Hero() {
    const whatsappLink = 'https://wa.me/5571993623891?text=Tenho%20interesse%20no%20CRM%20Impera';

    return (
        <motion.section
            className="relative overflow-hidden py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="mx-auto max-w-[1280px] px-6">
                <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
                    {/* Left Column - Text Content */}
                    <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                        {/* Badge - Industrial Precision */}
                        <div
                            style={{ marginBottom: 'var(--spacing-8)' }}
                            className="inline-flex items-center gap-2 rounded-md border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-md"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(255,205,0,0.6)]"></span>
                            CRM Especialista em Imobiliárias
                        </div>

                        {/* Headline */}
                        <h1
                            style={{ marginBottom: 'var(--spacing-8)' }}
                            className="font-display text-[clamp(2.5rem,6.5vw,4rem)] font-bold uppercase leading-[1.1] tracking-[-0.04em] text-white"
                        >
                            Você Perde Mais de <span className="text-gold">50%</span> dos Seus Leads Antes do Primeiro Contato
                        </h1>

                        {/* Subheader - Clean & Brand Aligned */}
                        <div
                            style={{ marginBottom: 'var(--spacing-16)' }}
                            className="max-w-2xl text-xl leading-relaxed text-[#9AA5B1]"
                        >
                            <p>
                                O setor imobiliário é o <span className="text-white font-bold">mais competitivo do mundo</span> e é o que possui a <span className="text-white font-bold">menor taxa de conversão</span> do mercado.
                            </p>
                            <p className="mt-4">
                                O motivo é simples: <span className="text-white font-bold">falta de gestão</span>.
                            </p>
                            <p className="mt-4 font-bold text-gold uppercase tracking-wide">
                                Impera CRM veio para resolver isso.
                            </p>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#C9A24D] to-[#E6C685] px-9 py-[18px] text-base font-bold !text-[#060A0C] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#E6C685] hover:to-[#F5DCAF] hover:shadow-[0_10px_30px_rgba(201,162,77,0.3)]"
                            >
                                Agendar demonstrativo
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>

                            <Link
                                href="/login"
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border-[1.5px] border-[#C9A24D] bg-transparent px-9 py-[18px] text-base font-semibold text-[#C9A24D] transition-all duration-300 hover:border-[#E6C685] hover:bg-[rgba(201,162,77,0.1)]"
                            >
                                Acessar Sistema
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - High Fidelity Asset */}
                    <div className="flex-1">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                                alt="Modern Luxury Architecture"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />

                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1215] via-[#0B1215]/20 to-transparent opacity-80"></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
