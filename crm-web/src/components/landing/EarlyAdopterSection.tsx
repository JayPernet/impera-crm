'use client';

import { useState } from 'react';
import { ArrowRight, Check, Users, Percent, Headphones, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * EarlyAdopterSection Component
 * 
 * Section for the Early Adopter program with application form.
 * "Estamos selecionando apenas 5 imobiliárias para o lançamento."
 * 
 * @component
 */

const benefits = [
    { icon: Percent, title: "Preço fundador", description: "60% off permanente" },
    { icon: Sparkles, title: "Acesso vitalício", description: "Mesmo com aumento futuro" },
    { icon: MessageSquare, title: "Influência no produto", description: "Suas necessidades viram features" },
    { icon: Headphones, title: "Suporte direto", description: "Linha direta com os fundadores" },
    { icon: Users, title: "Co-criação", description: "Seu feedback molda o Impera" }
];

export function EarlyAdopterSection() {
    const [formData, setFormData] = useState({
        nome: '',
        imobiliaria: '',
        whatsapp: '',
        corretores: '',
        problema: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch(process.env.NEXT_PUBLIC_EARLY_ADOPTER_WEBHOOK_URL || '', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setIsSubmitted(true);
        } catch {
            console.error('Erro ao enviar formulário');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.section
            id="candidatura"
            className="relative py-24 bg-background"
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
                <div className="flex flex-col items-center">
                    {/* Header */}
                    <div
                        style={{ marginBottom: 'var(--spacing-16)' }}
                        className="flex flex-col items-center text-center"
                    >
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.2em]"
                            style={{ marginBottom: 'var(--spacing-8)' }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                            </span>
                            Programa Early Adopter
                        </div>
                        <h2
                            style={{ marginBottom: 'var(--spacing-8)' }}
                            className="font-display text-[clamp(2rem,5vw,3rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-text-primary"
                        >
                            Estamos selecionando apenas <span className="text-gold">5 imobiliárias</span> para o lançamento.
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 w-full max-w-5xl">
                        {/* Benefits Column */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-text-primary" style={{ marginBottom: 'var(--spacing-6)' }}>
                                O que você ganha:
                            </h3>

                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div
                                        className="flex-shrink-0 h-10 w-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold"
                                    >
                                        <benefit.icon className="h-5 w-5" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-primary">{benefit.title}</p>
                                        <p className="text-sm text-text-secondary">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Commitment */}
                            <div
                                className="border border-border bg-surface/40 text-text-secondary text-sm"
                                style={{
                                    padding: 'var(--spacing-6)',
                                    borderRadius: 'var(--radius-lg)',
                                    marginTop: 'var(--spacing-8)'
                                }}
                            >
                                <p className="font-bold text-text-primary mb-2">Em troca, pedimos:</p>
                                <p>Feedback honesto e disponibilidade para 1 call semanal de 30min nas primeiras 4 semanas.</p>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div
                            className="card-luxury"
                            style={{ padding: 'var(--spacing-8)' }}
                        >
                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div
                                        className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center text-success mb-6"
                                    >
                                        <Check className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">Candidatura enviada!</h3>
                                    <p className="text-text-secondary">Analisaremos e responderemos em até 48h.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <h3 className="text-xl font-bold text-text-primary text-center mb-6">
                                        Candidate-se para ser um dos 5 primeiros
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Nome completo
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.nome}
                                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
                                            placeholder="Seu nome"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Imobiliária / Atuação
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.imobiliaria}
                                            onChange={(e) => setFormData({ ...formData, imobiliaria: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
                                            placeholder="Nome da imobiliária ou 'Corretor autônomo'"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Quantos corretores na equipe?
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.corretores}
                                            onChange={(e) => setFormData({ ...formData, corretores: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors"
                                            placeholder="Ex: 5, 10, Só eu..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-2">
                                            Qual seu maior problema hoje?
                                        </label>
                                        <textarea
                                            required
                                            value={formData.problema}
                                            onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none transition-colors resize-none"
                                            placeholder="Descreva brevemente..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-gold w-full justify-center"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Enviar Candidatura'}
                                        {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                                    </button>

                                    <p className="text-xs text-text-muted text-center">
                                        Analisaremos todas as candidaturas e responderemos em até 48h.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
