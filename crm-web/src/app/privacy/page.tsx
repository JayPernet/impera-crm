import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-abyss text-white">
            <div className="mx-auto max-w-4xl px-6 py-16">
                {/* Back Button */}
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-gold"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Home
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <h1 className="mb-4 text-4xl font-bold uppercase tracking-tight">
                        Política de Privacidade
                    </h1>
                    <p className="text-neutral-400">
                        Última atualização: Janeiro de 2026
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-8 text-neutral-300">
                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            1. Introdução
                        </h2>
                        <p className="leading-relaxed">
                            A Impera CRM ("nós", "nosso" ou "Impera") está comprometida em proteger a privacidade e segurança dos dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            2. Dados Coletados
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            Coletamos as seguintes categorias de dados pessoais:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Dados de identificação (nome, e-mail, telefone)</li>
                            <li>Dados de acesso (endereço IP, logs de navegação)</li>
                            <li>Dados de uso da plataforma (interações, preferências)</li>
                            <li>Dados de clientes e leads (quando inseridos pelo usuário)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            3. Finalidade do Tratamento
                        </h2>
                        <p className="leading-relaxed">
                            Utilizamos seus dados pessoais para: (i) fornecer e melhorar nossos serviços de CRM; (ii) processar transações e pagamentos; (iii) enviar comunicações relevantes sobre o produto; (iv) garantir a segurança da plataforma; (v) cumprir obrigações legais e regulatórias.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            4. Compartilhamento de Dados
                        </h2>
                        <p className="leading-relaxed">
                            Não vendemos seus dados pessoais. Podemos compartilhar informações com prestadores de serviços terceirizados (ex: processadores de pagamento, serviços de hospedagem) sob rigorosos acordos de confidencialidade e apenas na medida necessária para a prestação dos serviços.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            5. Segurança
                        </h2>
                        <p className="leading-relaxed">
                            Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados em trânsito e em repouso, controles de acesso baseados em função (RLS) e auditorias regulares de segurança.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            6. Seus Direitos (LGPD)
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            Você tem o direito de:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Confirmar a existência de tratamento de seus dados</li>
                            <li>Acessar seus dados pessoais</li>
                            <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                            <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                            <li>Revogar o consentimento</li>
                            <li>Portabilidade dos dados</li>
                        </ul>
                        <p className="mt-4 leading-relaxed">
                            Para exercer esses direitos, entre em contato através de{' '}
                            <a href="mailto:privacidade@impera.com" className="text-gold hover:underline">
                                privacidade@impera.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            7. Retenção de Dados
                        </h2>
                        <p className="leading-relaxed">
                            Retemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, salvo quando um período de retenção mais longo for exigido ou permitido por lei.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            8. Alterações nesta Política
                        </h2>
                        <p className="leading-relaxed">
                            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do e-mail cadastrado ou por meio de aviso destacado em nossa plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            9. Contato
                        </h2>
                        <p className="leading-relaxed">
                            Para questões relacionadas a esta Política de Privacidade ou ao tratamento de seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados (DPO):
                        </p>
                        <p className="mt-4 leading-relaxed">
                            E-mail:{' '}
                            <a href="mailto:dpo@impera.com" className="text-gold hover:underline">
                                dpo@impera.com
                            </a>
                            <br />
                            Endereço: Salvador, BA - Brasil
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
