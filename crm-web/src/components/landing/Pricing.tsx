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
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    const whatsappLink = 'https://wa.me/5571993623891?text=Tenho%20interesse%20no%20CRM%20Impera';

    return (
        <motion.section
            id="pricing"
            className="relative py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="mx-auto max-w-[1280px] px-6">
                {/* Section Header */}
                <div
                    style={{ marginBottom: 'var(--spacing-20)' }}
                    className="flex flex-col items-center text-center"
                >
                    <h2
                        style={{ marginBottom: 'var(--spacing-8)' }}
                        className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-bold uppercase leading-[1.1] tracking-[-0.03em] text-white"
                    >
                        Investimento <span className="text-gold">Estratégico.</span>
                    </h2>
                    <p className="max-w-2xl text-center text-lg leading-relaxed text-[#9AA5B1]">
                        Sem letras miúdas ou taxas surpresa. Selecione a potência necessária para escala e controle total da sua operação.
                    </p>
                </div>

                {/* Pricing Grid */}
                <motion.div
                    className="grid gap-8 md:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {pricingTiers.map((tier, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`relative overflow-hidden rounded-lg border p-8 backdrop-blur-md transition-all duration-[400ms] ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] ${tier.highlighted
                                ? 'border-gold/50 bg-[#151A21]'
                                : 'border-[rgba(255,255,255,0.05)] bg-[rgba(21,26,33,0.6)] hover:border-[rgba(201,162,77,0.5)] hover:bg-[#151A21]'
                                }`}
                        >
                            {/* Highlighted Badge */}
                            {tier.highlighted && (
                                <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-[#C9A24D] to-[#E6C685] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-abyss">
                                    Mais Popular
                                </div>
                            )}

                            {/* Tier Name */}
                            <h3 className="mb-2 text-xl font-semibold uppercase tracking-wide text-white">
                                {tier.name}
                            </h3>

                            {/* Description */}
                            <p className="mb-6 text-sm text-[#9AA5B1]">{tier.description}</p>

                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-4xl font-bold text-white">{tier.price}</span>
                                {tier.period && <span className="text-[#9AA5B1]">{tier.period}</span>}
                            </div>

                            {/* Features List */}
                            <ul className="mb-8 space-y-3">
                                {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" strokeWidth={2} />
                                        <span className="text-sm text-neutral-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button - Verified Unified Link */}
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block w-full cursor-pointer rounded-lg px-6 py-3 text-center font-bold transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${tier.highlighted
                                    ? 'bg-gradient-to-r from-[#C9A24D] to-[#E6C685] !text-[#060A0C] hover:from-[#E6C685] hover:to-[#F5DCAF] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(201,162,77,0.3)]'
                                    : 'border border-gold bg-transparent text-gold hover:bg-gold/10'
                                    }`}
                            >
                                {tier.cta}
                            </a>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Note */}
                <p
                    style={{ marginTop: 'var(--spacing-12)' }}
                    className="text-center text-sm text-neutral-500"
                >
                    Cancele quando quiser.
                </p>
            </div>
        </motion.section>
    );
}
