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
            className="relative overflow-hidden py-24 bg-background"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {/* Luxury Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <div className="mx-auto max-w-[1400px] px-8">
                <div className="flex flex-col items-center justify-between gap-16 lg:flex-row">
                    {/* Left Column - Sophisticated Content */}
                    <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">
                        {/* Elite Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-3 rounded-sm border border-gold/30 bg-gold/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-sm mb-12"
                        >
                            <span className="h-1 w-1 rounded-full bg-gold shadow-[0_0_8px_rgba(210,182,138,0.8)]" />
                            Apenas 5 Vagas de Lançamento
                        </motion.div>

                        {/* Title - Editorial Style */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-navy mb-10"
                        >
                            O CRM onde sua <br />
                            imobiliária <span className="italic font-serif text-navy">Impera.</span>
                        </motion.h1>

                        {/* Subheader - Technical Clarity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="max-w-xl text-lg leading-relaxed text-slate/80 mb-14"
                        >
                            <p className="font-medium">
                                Pare de perder negócios no caos do WhatsApp.
                            </p>
                            <p className="mt-4">
                                Leads, imóveis e conversas <span className="text-navy font-bold">centralizados</span>. WhatsApp integrado. <span className="text-navy font-bold">Sem trocar de tela.</span>
                            </p>
                        </motion.div>

                        {/* CTAs - Precision Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="flex flex-col items-center gap-6 sm:flex-row lg:items-start"
                        >
                            <a
                                href="#candidatura"
                                className="h-14 px-10 bg-navy text-white text-xs font-bold uppercase tracking-[0.1em] rounded-sm flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-navy-dark active:translate-y-0"
                            >
                                Quero ser um dos 5 primeiros
                            </a>

                            <Link
                                href="/login"
                                className="h-14 px-10 border border-marble bg-transparent text-navy text-xs font-bold uppercase tracking-[0.1em] rounded-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:border-navy"
                            >
                                Já sou cliente
                            </Link>
                        </motion.div>

                        {/* Microcopy */}
                        <p
                            className="text-[10px] text-muted uppercase tracking-[0.15em] font-bold mt-10"
                        >
                            Condições especiais + influência direta no produto
                        </p>
                    </div>

                    {/* Right Column - Architectural Asset */}
                    <motion.div
                        className="flex-1 w-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                    >
                        <div
                            className="relative aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden border border-white/10 shadow-2xl"
                            style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
                                alt="Elite Architecture"
                                className="h-full w-full object-cover grayscale-[0.2] contrast-[1.1]"
                            />

                            {/* Luxe Gradient Overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent"
                            />

                            {/* Accent Detail */}
                            <div className="absolute bottom-10 left-10 right-10 p-8 border border-white/10 backdrop-blur-md bg-white/5 rounded-sm">
                                <div className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Impera Insights</div>
                                <div className="text-white font-display text-xl leading-snug">A precisão que o <br />alto padrão exige.</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
