'use client';

import { Calculator, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * UrgencySection Component
 * 
 * Financial calculation of the cost of delay.
 * Redesigned for visual excellence (Premium Aesthetic).
 * 
 * @component
 */
export function UrgencySection() {
    const whatsappLink = 'https://wa.me/5571993623891?text=Tenho%20interesse%20no%20CRM%20Impera';

    return (
        <motion.section
            className="relative py-24 bg-[#060A0C]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Background elements for depth */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>

            <div className="mx-auto max-w-[1280px] px-6">
                <div className="flex flex-col items-center">
                    {/* Header */}
                    <div
                        style={{ marginBottom: 'var(--spacing-16)' }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                            </span>
                            Alerta de Perda Financeira
                        </div>
                        <h2
                            style={{ marginBottom: 'var(--spacing-8)' }}
                            className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-white"
                        >
                            Quanto Custa <span className="text-gold">NÃO Ter Isso?</span>
                        </h2>
                    </div>

                    {/* Highly Professional Calculation Box */}
                    <div className="w-full max-w-5xl relative">
                        {/* Main Container */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1215] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                            {/* Inner Glow/Accent */}
                            <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%] bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.03)_0%,transparent_70%)] opacity-50"></div>

                            <div className="grid lg:grid-cols-12 items-stretch">
                                {/* Left Side - Logic (Pillars) */}
                                <div className="lg:col-span-7 p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5 space-y-10 relative">
                                    <div className="space-y-8">
                                        <div className="group flex items-start gap-6">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1 transition-all group-hover:border-gold/30 group-hover:bg-gold/5">
                                                <span className="text-gold font-bold">01</span>
                                            </div>
                                            <div>
                                                <p className="text-lg text-[#9AA5B1] leading-relaxed">
                                                    Você recebe 100 leads/mês e perde metade por demora. <br />
                                                    <span className="text-white font-bold text-xl">+50 Oportunidades Descartadas</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="group flex items-start gap-6">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1 transition-all group-hover:border-gold/30 group-hover:bg-gold/5">
                                                <span className="text-gold font-bold">02</span>
                                            </div>
                                            <div>
                                                <p className="text-lg text-[#9AA5B1] leading-relaxed">
                                                    Se 4% desses 50 virassem venda, você <br />
                                                    <span className="text-white font-bold text-xl">Perdeu 2 Vendas de Comissão</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="group flex items-start gap-6">
                                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-1 transition-all group-hover:border-gold/30 group-hover:bg-gold/5">
                                                <span className="text-gold font-bold">03</span>
                                            </div>
                                            <div>
                                                <p className="text-lg text-[#9AA5B1] leading-relaxed">
                                                    Comissão média de R$ 10.000 por venda <br />
                                                    <span className="text-white font-bold text-xl">Prejuízo Mensal: R$ 20.000</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Total Impact (The "Hero" part of the card) */}
                                <div className="lg:col-span-5 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#0D1518] to-[#060A0C] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                                    <div className="relative z-10 text-center">
                                        <div className="mb-2">
                                            <span className="text-xs font-black uppercase tracking-[0.3em] text-gold/70">Impacto Anual</span>
                                        </div>

                                        <div className="relative inline-block">
                                            <div className="text-6xl md:text-7xl font-display font-bold text-white tracking-tight">
                                                <span className="text-2xl font-bold align-top mr-2 text-gold/80">R$</span>
                                                240.000
                                            </div>
                                            <div className="absolute -bottom-2 left-0 w-full h-px bg-gold/50"></div>
                                        </div>

                                        <p className="mt-8 text-sm font-medium text-neutral-500 max-w-[200px] mx-auto leading-relaxed">
                                            Capital deixado na mesa por não automatizar o seu atendimento hoje.
                                        </p>
                                    </div>

                                    {/* Subtle Calculator Icon */}
                                    <Calculator className="absolute bottom-6 right-6 h-12 w-12 text-white/5 rotate-12" />
                                </div>
                            </div>

                            {/* Footer comparison */}
                            <div className="p-8 bg-black/40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 px-10 md:px-16">
                                <div className="text-center md:text-left">
                                    <p className="text-[#9AA5B1]">O investimento em gestão de elite é irrisório:</p>
                                    <p className="text-2xl text-white font-bold mt-1">
                                        Apenas <span className="text-gold underline decoration-gold/30 underline-offset-4">R$ 697/mês</span>
                                    </p>
                                </div>

                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-[#C9A24D] to-[#E6C685] px-9 py-4 text-base font-bold !text-[#060A0C] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#E6C685] hover:to-[#F5DCAF] hover:shadow-[0_10px_30px_rgba(201,162,77,0.3)]"
                                >
                                    Agendar demonstrativo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
