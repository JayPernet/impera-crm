'use client';

import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Pricing Component
 * 
 * Pricing tiers for Impera CRM with motion animations.
 * Updated to use unified conversion links.
 */

interface PricingTier {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Starter',
        price: 'R$ 297',
        period: '/mês',
        description: 'Para corretores autônomos e pequenas equipes',
        features: [
            'Até 4 usuários',
            'Gestão de leads',
            'Gestão de propriedades',
            'Relatórios básicos',
            'Suporte por e-mail',
            'WhatsApp integrado',
        ],
        cta: 'Agendar Demonstrativo',
    },
    {
        name: 'Professional',
        price: 'R$ 697',
        period: '/mês',
        description: 'Para imobiliárias em crescimento',
        features: [
            'Até 10 usuários',
            'Tudo do Starter',
            'Secretária Digital (IA 24/7)',
            'Integrações avançadas',
            'Relatórios personalizados',
            'Suporte prioritário',
        ],
        cta: 'Conheça Como Funciona',
        highlighted: true,
    },
    {
        name: 'Enterprise',
        price: 'Personalizado',
        period: '',
        description: 'Para grandes imobiliárias e redes',
        features: [
            'Usuários ilimitados',
            'Tudo do Professional',
            'Onboarding dedicado',
            'SLA garantido',
            'Customizações',
            'Gerente de conta',
        ],
        cta: 'Falar com Time de Vendas',
    },
];

export function Pricing() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    const whatsappLink = 'https://wa.me/5571993623891?text=Tenho%20interesse%20no%20CRM%20Impera';

    return (
        <motion.section
            id="pricing"
            className="relative py-24 bg-pearl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Architectural Grid Background Overlay (Subtle) */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(var(--navy) 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <div className="mx-auto max-w-[1400px] px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6"
                    >
                        Investimento Estratégico
                    </motion.div>
                    <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-navy mb-8">
                        Investimento <span className="italic font-serif">Estratégico.</span>
                    </h2>
                    <p className="max-w-2xl text-lg leading-relaxed text-slate/80">
                        Sem letras miúdas ou taxas surpresa. Selecione a potência necessária para escala e controle total da sua operação.
                    </p>
                </div>

                {/* Pricing Grid */}
                <motion.div
                    className="grid gap-10 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`relative overflow-hidden group bg-white p-12 shadow-sm border border-marble transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${tier.highlighted ? 'border-gold/30 ring-1 ring-gold/10' : ''
                                }`}
                            style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                            {/* Stationery Top Detail */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 ${tier.highlighted ? 'bg-gold' : 'bg-marble group-hover:bg-navy/20'
                                }`} />

                            {/* Highlighted Badge - Subtle Branding */}
                            {tier.highlighted && (
                                <div className="absolute right-0 top-6 bg-gold text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-l-sm shadow-sm">
                                    Mais Popular
                                </div>
                            )}

                            {/* Tier Name */}
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-12">
                                {tier.name}
                            </h3>

                            {/* Price */}
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-display font-medium text-navy tracking-tight">{tier.price}</span>
                                {tier.period && <span className="text-xs font-bold text-muted uppercase tracking-widest">{tier.period}</span>}
                            </div>

                            {/* Description */}
                            <p className="mb-12 text-sm text-slate leading-relaxed font-medium">{tier.description}</p>

                            {/* Features List */}
                            <ul className="mb-14 space-y-5">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <div className="mt-1 h-3.5 w-3.5 flex-shrink-0 border border-gold/40 flex items-center justify-center p-0.5">
                                            <div className="h-full w-full bg-gold" />
                                        </div>
                                        <span className="text-[13px] text-slate/90 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button - Luxe Variation */}
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full py-5 text-center text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm ${tier.highlighted
                                    ? 'bg-navy text-white hover:bg-navy-dark shadow-lg hover:shadow-navy/20'
                                    : 'bg-white border border-marble text-navy hover:border-navy hover:shadow-md'
                                    }`}
                            >
                                {tier.cta}
                            </a>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Note */}
                <div className="mt-16 text-center">
                    <p className="text-[11px] text-muted uppercase tracking-[1.5px] font-bold">
                        Resultados reais para imobiliárias de alto padrão
                    </p>
                </div>
            </div>
        </motion.section>
    );
}
