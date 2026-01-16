'use client';

import { MessageCircle, Users, Database, LayoutDashboard, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Features Component (Solution Section)
 * 
 * Grid of feature cards highlighting key CRM capabilities.
 * Updated with MVP copy.
 * 
 * @component
 */

const features = [
    {
        title: "WhatsApp Nativo",
        description: "Atenda clientes sem sair do CRM. Histórico completo. Zero apps abertos.",
        icon: MessageCircle
    },
    {
        title: "Gestão de Leads",
        description: "Da captura ao fechamento. Funil visual. Nada se perde.",
        icon: Users
    },
    {
        title: "Banco de Imóveis",
        description: "Portfólio organizado. Busca instantânea. Envio direto no chat.",
        icon: Database
    },
    {
        title: "Dashboard Real",
        description: "Visão geral do negócio. Leads quentes. Vendas do mês. Equipe em ação.",
        icon: LayoutDashboard
    },
    {
        title: "Integração com seu Site",
        description: "Leads direto do seu site pro CRM. Automático.",
        icon: Globe
    }
];

export function Features() {
    return (
        <motion.section
            id="features"
            className="relative py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="mx-auto max-w-[1280px] px-6">
                {/* Section Header */}
                <div
                    style={{ marginBottom: 'var(--spacing-16)' }}
                    className="flex flex-col items-center text-center"
                >
                    <h2
                        style={{ marginBottom: 'var(--spacing-8)' }}
                        className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-text-primary"
                    >
                        Impera CRM: <span className="text-gold">Comando Total</span> em Uma Tela.
                    </h2>
                    <p className="max-w-2xl text-center text-lg leading-relaxed text-text-secondary">
                        Todas as funcionalidades que você precisa para sua imobiliária vender mais.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="card group"
                        >
                            <div
                                className="inline-flex h-12 w-12 items-center justify-center text-gold bg-gold/10 transition-all duration-300 group-hover:bg-gold/20"
                                style={{
                                    marginBottom: 'var(--spacing-6)',
                                    borderRadius: 'var(--radius-lg)'
                                }}
                            >
                                <feature.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                            </div>
                            <h3
                                className="text-xl font-bold text-text-primary group-hover:text-gold transition-colors"
                                style={{ marginBottom: 'var(--spacing-3)' }}
                            >
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
