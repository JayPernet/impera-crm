'use client';

import { motion } from 'framer-motion';

/**
 * ProblemSection Component
 * 
 * Section that agitates the pain points before presenting the solution.
 * "Você reconhece esse dia?"
 * 
 * @component
 */
export function ProblemSection() {
    const painPoints = [
        "Cliente pergunta sobre imóvel no WhatsApp. Você precisa abrir a planilha.",
        "Lead quente some porque você esqueceu de responder.",
        "Informação importante perdida em 200 conversas não lidas.",
        "Reunião de equipe para 'alinhar' o que cada um está fazendo."
    ];

    return (
        <motion.section
            className="relative py-32 bg-navy overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            {/* Architectural Accent Detail */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="mx-auto max-w-[1400px] px-8">
                <div className="flex flex-col items-center text-center">
                    {/* Header */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6"
                        >
                            Diagnóstico de Mercado
                        </motion.div>
                        <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-silk">
                            Você reconhece <span className="italic font-serif text-gold">esse dia?</span>
                        </h2>
                        <p className="mt-8 text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                            O caos operacional é o teto que impede sua imobiliária de crescer.
                        </p>
                    </div>

                    {/* Pain Points Grid - Architectural Style */}
                    <div className="grid gap-6 md:grid-cols-2 max-w-5xl w-full mb-20">
                        {painPoints.map((point, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                className="flex items-center gap-6 text-left bg-white/[0.03] border border-white/5 p-8 transition-all duration-500 hover:bg-white/[0.05]"
                                style={{ borderRadius: 'var(--radius-sm)' }}
                            >
                                <div className="h-10 w-10 flex-shrink-0 border border-gold/20 flex items-center justify-center font-display text-gold italic">
                                    0{index + 1}
                                </div>
                                <p className="text-white/80 text-sm font-medium leading-relaxed uppercase tracking-wider">
                                    {point}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Transition Statement - High Stakes */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl border-t border-white/10 pt-16 flex flex-col items-center"
                    >
                        <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">A Verdade Inevitável</p>
                        <p className="font-display text-2xl text-white leading-relaxed">
                            "Seu problema não é falta de organização. <br />
                            <span className="text-gold italic font-serif">É falta de sistema.</span>"
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
