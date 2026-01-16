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
            className="relative py-20 bg-background"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Top border accent */}
            <div
                className="absolute top-0 left-0 w-full h-px"
                style={{ background: 'linear-gradient(to right, transparent, var(--border-gold), transparent)' }}
            />

            <div className="mx-auto max-w-[1280px] px-6">
                <div className="flex flex-col items-center text-center">
                    {/* Header */}
                    <h2
                        style={{ marginBottom: 'var(--spacing-12)' }}
                        className="font-display text-[clamp(2rem,5vw,3rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-text-primary"
                    >
                        Você reconhece <span className="text-gold">esse dia?</span>
                    </h2>

                    {/* Pain Points Grid */}
                    <div
                        className="grid gap-4 md:grid-cols-2 max-w-4xl w-full"
                        style={{ marginBottom: 'var(--spacing-12)' }}
                    >
                        {painPoints.map((point, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-start gap-4 text-left bg-surface/60 border border-border"
                                style={{
                                    padding: 'var(--spacing-6)',
                                    borderRadius: 'var(--radius-xl)'
                                }}
                            >
                                <span className="text-danger text-xl">✗</span>
                                <p className="text-text-secondary leading-relaxed">
                                    {point}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Transition Statement */}
                    <div className="max-w-2xl">
                        <p className="text-xl text-text-secondary leading-relaxed">
                            Seu problema não é falta de organização.
                        </p>
                        <p className="mt-2 text-2xl text-text-primary font-bold">
                            É falta de <span className="text-gold">sistema.</span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
