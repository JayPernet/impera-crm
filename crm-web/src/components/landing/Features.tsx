'use client';

import { Sparkles, MessageCircle, Database, Zap, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Features Component (Solution Section)
 * 
 * Grid of feature cards highlighting key CRM capabilities based on the new copy.
 * Features luxury card styling with hover micro-interactions.
 * 
 * @component
 */

const features = [
    {
        title: "Atendimento fulltime com IA",
        description: "Seu cliente manda mensagem de madrugada? Nosso sistema responde na hora. Qualifica o lead, responde dúvidas sobre imóveis, agenda visitas. Enquanto você dorme, ela trabalha.",
        icon: Sparkles,
        badge: "Plano Professional+"
    },
    {
        title: "WhatsApp Integrado",
        description: "Todas as conversas dos seus corretores em um lugar só. Você vê tudo, controla tudo, não perde nada. Histórico completo de cada cliente.",
        icon: MessageCircle
    },
    {
        title: "Gestão Real de Leads",
        description: "Follow-up automático. Lembretes. Nenhum lead fica sem resposta. O sistema cobra seus corretores pra você.",
        icon: Zap
    },
    {
        title: "Controle da Equipe",
        description: "Veja quantos leads cada corretor recebeu, quantos atendeu, quantos converteu. Quem tá vendendo e quem tá enrolando fica claro.",
        icon: BarChart3
    },
    {
        title: "Todos os Imóveis em Um Só Lugar",
        description: "Fotos, características, disponibilidade. Seu corretor não precisa te ligar pra saber se o AP 302 tá disponível.",
        icon: Database
    },
    {
        title: "Plugin Pro Seu Site",
        description: "Instale em seu site e cada lead de lá, vira lead no crm para você (ou nossa IA) entrar em contato em segundos.",
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
                        className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-white"
                    >
                        O Sistema Que Não Deixa <span className="text-gold">Dinheiro Escapar.</span>
                    </h2>
                    <p className="max-w-2xl text-center text-lg leading-relaxed text-[#9AA5B1]">
                        Unificamos toda a sua operação, do lead ao contrato, em uma única central de comando de alta performance para que você pare de perder vendas por desorganização.
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
                            className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#151A21]/80 p-8 backdrop-blur-md transition-all duration-500 hover:border-gold/40 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                        >
                            {feature.badge && (
                                <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-gold/60">
                                    {feature.badge}
                                </div>
                            )}
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold shadow-[0_0_15px_rgba(255,205,0,0.1)] transition-all duration-300 group-hover:bg-gold/20 group-hover:shadow-[0_0_20px_rgba(255,205,0,0.2)]">
                                <feature.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-white group-hover:text-gold transition-colors">{feature.title}</h3>
                            <p className="text-[#9AA5B1] leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
