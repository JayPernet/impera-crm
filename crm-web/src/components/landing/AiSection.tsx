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
            className="relative py-24 bg-pearl overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="mx-auto max-w-[1400px] px-8">
                {/* Section Header */}
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6"
                    >
                        Impacto Direto
                    </motion.div>
                    <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-[-0.02em] text-navy mb-8">
                        Impera CRM: Comando total <br />
                        <span className="italic font-serif">em uma tela.</span>
                    </h2>
                </div>

                {/* Impact Grid - Stationery Style */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
                    {/* Feature 1 */}
                    <motion.div
                        className="bg-white p-8 border border-marble shadow-sm"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        <h3 className="text-xl font-display font-medium text-navy mb-4">WhatsApp Nativo</h3>
                        <p className="text-slate/90 text-sm leading-relaxed">
                            Atenda clientes sem sair do CRM. Histórico completo. Zero apps abertos.
                        </p>
                    </motion.div>

                    {/* Feature 2 */}
                    <motion.div
                        className="bg-white p-8 border border-marble shadow-sm"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        <h3 className="text-xl font-display font-medium text-navy mb-4">Gestão de Leads</h3>
                        <p className="text-slate/90 text-sm leading-relaxed">
                            Da captura ao fechamento. Funil visual. Nada se perde.
                        </p>
                    </motion.div>

                    {/* Feature 3 */}
                    <motion.div
                        className="bg-white p-8 border border-marble shadow-sm"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        <h3 className="text-xl font-display font-medium text-navy mb-4">Banco de Imóveis</h3>
                        <p className="text-slate/90 text-sm leading-relaxed">
                            Portfólio organizado. Busca instantânea. Envio direto no chat.
                        </p>
                    </motion.div>

                    {/* Feature 4 */}
                    <motion.div
                        className="bg-white p-8 border border-marble shadow-sm"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        <h3 className="text-xl font-display font-medium text-navy mb-4">Dashboard Real</h3>
                        <p className="text-slate/90 text-sm leading-relaxed">
                            Visão geral do negócio. Leads quentes. Vendas do mês. Equipe em ação.
                        </p>
                    </motion.div>

                    {/* Feature 5 */}
                    <motion.div
                        className="bg-white p-8 border border-marble shadow-sm"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                        <h3 className="text-xl font-display font-medium text-navy mb-4">Integração com seu Site</h3>
                        <p className="text-slate/90 text-sm leading-relaxed">
                            Leads direto do seu site pro CRM.
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}
