'use client';

import { TrendingUp, Target, TrendingDown, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * AiSection Component (Impact Section)
 * 
 * Highlighting the impact of the IA and automation on conversion rates.
 * Features data points and visual indicators of performance.
 * 
 * @component
 */
export function AiSection() {
    const whatsappLink = 'https://wa.me/5571993623891?text=Tenho%20interesse%20no%20CRM%20Impera';

    return (
        <motion.section
            className="relative py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="mx-auto max-w-[1280px] px-6">
                {/* Impact Container */}
                <div className="luxury-card relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-obsidian/90 to-abyss/90 p-12 backdrop-blur-xl">
                    {/* Background Glow Effect */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold/5 blur-3xl"></div>

                    {/* Content */}
                    <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center">
                        {/* Section Header */}
                        <div
                            style={{ marginBottom: 'var(--spacing-16)' }}
                            className="flex flex-col items-center text-center"
                        >
                            <h2
                                style={{ marginBottom: 'var(--spacing-8)' }}
                                className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-white"
                            >
                                O Que Acontece Quando Você <span className="text-gold">Para de Perder Leads.</span>
                            </h2>
                        </div>

                        {/* Impact Grid */}
                        <div className="grid w-full gap-8 md:grid-cols-3">
                            {/* Card 1 */}
                            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
                                <TrendingUp className="h-10 w-10 text-gold mb-4" strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-white mb-2">100x Mais</h3>
                                <p className="text-sm text-[#9AA5B1]">
                                    Lead atendido em 5 minutos converte 100x mais que lead atendido em 24h. A IA garante que ninguém fica esperando.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
                                <Target className="h-10 w-10 text-gold mb-4" strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-white mb-2">3% de Taxa</h3>
                                <p className="text-sm text-[#9AA5B1]">
                                    Esta é a taxa média do mercado. Quem usa automação e follow-up consistente multiplica esse número.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 border border-white/5">
                                <TrendingDown className="h-10 w-10 text-red-500/80 mb-4" strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-white mb-2">Pelo Menos 1</h3>
                                <p className="text-sm text-[#9AA5B1]">
                                    A cada 10 leads perdidos, você jogou fora pelo menos 1 venda. Quantas vendas você perdeu mês passado?
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div style={{ marginTop: 'var(--spacing-12)' }} className="flex justify-center">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#C9A24D] to-[#E6C685] px-9 py-[18px] text-base font-bold !text-[#060A0C] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#E6C685] hover:to-[#F5DCAF] hover:shadow-[0_10px_30px_rgba(201,162,77,0.3)]"
                            >
                                Agendar demonstrativo
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
