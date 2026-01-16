'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

/**
 * FAQSection Component
 * 
 * Frequently asked questions addressing common objections.
 * 
 * @component
 */

const faqs = [
    {
        question: "Por que tão poucas vagas?",
        answer: "Estamos em estágio inicial. Queremos atender bem e desenvolver o melhor produto possível com feedback real de quem usa."
    },
    {
        question: "Quanto custa?",
        answer: "Depende do tamanho da sua equipe. O preço fundador será revelado na call de apresentação."
    },
    {
        question: "E se eu não gostar?",
        answer: "O produto está em desenvolvimento, algumas coisas podem não funcionar como esperado. Se mesmo assim você não gostar, agradeceremos seu tempo e você receberá reembolso 100%."
    },
    {
        question: "Preciso de treinamento?",
        answer: "Onboarding completo incluso. Em 10 minutos você já poderá usar tudo."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <motion.section
            className="relative py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="mx-auto max-w-[800px] px-6">
                {/* Header */}
                <div
                    style={{ marginBottom: 'var(--spacing-12)' }}
                    className="text-center"
                >
                    <h2 className="font-display text-[clamp(2rem,5vw,2.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-text-primary">
                        Perguntas <span className="text-gold">frequentes</span>
                    </h2>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="border border-border bg-surface/40 overflow-hidden"
                            style={{ borderRadius: 'var(--radius-lg)' }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between text-left text-text-primary font-medium hover:text-gold transition-colors"
                                style={{ padding: 'var(--spacing-5) var(--spacing-6)' }}
                            >
                                <span>{faq.question}</span>
                                <ChevronDown
                                    className={`h-5 w-5 text-text-tertiary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}
                            >
                                <p
                                    className="text-text-secondary"
                                    style={{ padding: '0 var(--spacing-6) var(--spacing-5)' }}
                                >
                                    {faq.answer}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA abaixo do FAQ */}
                <div className="text-center" style={{ marginTop: 'var(--spacing-12)' }}>
                    <a
                        href="#candidatura"
                        className="btn btn-outline-gold"
                    >
                        Quero me candidatar
                    </a>
                </div>
            </div>
        </motion.section>
    );
}
