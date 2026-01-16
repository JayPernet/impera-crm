'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Hero Component
 * 
 * Main hero section with MVP copy.
 * "O CRM onde sua imobiliária Impera."
 * 
 * @component
 */
export function Hero() {
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
                        {/* Badge - Early Adopter */}
                        <div
                            style={{ marginBottom: 'var(--spacing-8)' }}
                            className="inline-flex items-center gap-2 rounded-md border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-md"
                        >
                            <span
                                className="h-1.5 w-1.5 rounded-full bg-gold"
                                style={{ boxShadow: 'var(--glow-gold)' }}
                            />
                            Apenas 5 Vagas de Lançamento
                        </div>

                        {/* Headline - Nova Copy MVP */}
                        <h1
                            style={{ marginBottom: 'var(--spacing-8)' }}
                            className="font-display text-[clamp(2.5rem,6.5vw,4rem)] font-bold uppercase leading-[1.1] tracking-[-0.04em] text-text-primary"
                        >
                            O CRM onde sua imobiliária <span className="text-gold">Impera.</span>
                        </h1>

                        {/* Subheader - Nova Copy MVP */}
                        <div
                            style={{ marginBottom: 'var(--spacing-16)' }}
                            className="max-w-2xl text-xl leading-relaxed text-text-secondary"
                        >
                            <p>
                                Pare de perder negócios no caos do WhatsApp.
                            </p>
                            <p className="mt-4">
                                Leads, imóveis e conversas <span className="text-text-primary font-bold">centralizados</span>.
                                WhatsApp integrado. <span className="text-text-primary font-bold">Sem trocar de tela.</span>
                            </p>
                        </div>

                        {/* CTAs - Nova Copy MVP */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                            <a
                                href="#candidatura"
                                className="btn btn-gold group inline-flex cursor-pointer items-center justify-center gap-2"
                            >
                                Quero ser um dos 5 primeiros
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>

                            <Link
                                href="/login"
                                className="btn btn-outline-gold"
                            >
                                Já sou cliente
                            </Link>
                        </div>

                        {/* Microcopy - Early Adopter Benefit */}
                        <p
                            className="text-sm text-text-tertiary"
                            style={{ marginTop: 'var(--spacing-6)' }}
                        >
                            Condições especiais + influência direta no produto
                        </p>
                    </div>

                    {/* Right Column - High Fidelity Asset */}
                    <div className="flex-1">
                        <div
                            className="relative aspect-[4/3] w-full overflow-hidden border border-border-gold"
                            style={{
                                borderRadius: 'var(--radius-2xl)',
                                boxShadow: 'var(--shadow-xl)'
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                                alt="Modern Luxury Architecture"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />

                            {/* Cinematic Overlay */}
                            <div
                                className="absolute inset-0 opacity-80"
                                style={{
                                    background: 'linear-gradient(to top, var(--abyss), var(--abyss)/20, transparent)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
