import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
                        Termos de Serviço
                    </h1>
                    <p className="text-neutral-400">
                        Última atualização: Janeiro de 2026
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-8 text-neutral-300">
                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            1. Aceitação dos Termos
                        </h2>
                        <p className="leading-relaxed">
                            Ao acessar e usar a plataforma Impera CRM ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não poderá acessar o Serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            2. Descrição do Serviço
                        </h2>
                        <p className="leading-relaxed">
                            O Impera CRM é uma plataforma de gestão de relacionamento com clientes (CRM) projetada especificamente para o mercado imobiliário. O Serviço inclui funcionalidades de gestão de leads, clientes, propriedades, equipes e integração com inteligência artificial para automação de atendimento.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            3. Conta de Usuário
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            Para usar o Serviço, você deve:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Criar uma conta fornecendo informações precisas e completas</li>
                            <li>Manter a segurança de sua senha e conta</li>
                            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                            <li>Ser responsável por todas as atividades que ocorrem em sua conta</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            4. Uso Aceitável
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            Você concorda em NÃO:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Usar o Serviço para qualquer finalidade ilegal ou não autorizada</li>
                            <li>Violar leis locais, estaduais, nacionais ou internacionais</li>
                            <li>Interferir ou interromper o Serviço ou servidores conectados</li>
                            <li>Tentar obter acesso não autorizado a qualquer parte do Serviço</li>
                            <li>Usar o Serviço para transmitir vírus, malware ou código malicioso</li>
                            <li>Fazer engenharia reversa ou tentar extrair o código-fonte</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            5. Propriedade Intelectual
                        </h2>
                        <p className="leading-relaxed">
                            O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da Impera CRM e seus licenciadores. O Serviço é protegido por direitos autorais, marcas registradas e outras leis. Você recebe uma licença limitada, não exclusiva e intransferível para usar o Serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            6. Dados do Cliente
                        </h2>
                        <p className="leading-relaxed">
                            Você retém todos os direitos sobre os dados que insere no Serviço ("Dados do Cliente"). Concedemos a você permissão para usar nossa infraestrutura para armazenar e processar seus Dados do Cliente. Você é responsável pela precisão, qualidade e legalidade dos Dados do Cliente e pelos meios pelos quais os adquiriu.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            7. Pagamento e Assinatura
                        </h2>
                        <p className="mb-4 leading-relaxed">
                            Alguns aspectos do Serviço são fornecidos mediante pagamento. Você concorda em:
                        </p>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Fornecer informações de pagamento precisas e atualizadas</li>
                            <li>Pagar todas as taxas conforme especificado no plano escolhido</li>
                            <li>Autorizar cobranças recorrentes (se aplicável)</li>
                            <li>Notificar-nos sobre mudanças nas informações de pagamento</li>
                        </ul>
                        <p className="mt-4 leading-relaxed">
                            Reservamo-nos o direito de modificar preços mediante aviso prévio de 30 dias.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            8. Cancelamento e Suspensão
                        </h2>
                        <p className="leading-relaxed">
                            Você pode cancelar sua assinatura a qualquer momento através das configurações da conta. Reservamo-nos o direito de suspender ou encerrar sua conta se você violar estes Termos, sem aviso prévio e sem reembolso.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            9. Limitação de Responsabilidade
                        </h2>
                        <p className="leading-relaxed">
                            O Serviço é fornecido "como está" e "conforme disponível". Não garantimos que o Serviço será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância a Impera CRM será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            10. Indenização
                        </h2>
                        <p className="leading-relaxed">
                            Você concorda em indenizar e isentar a Impera CRM de quaisquer reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas, e despesas decorrentes de: (i) seu uso do Serviço; (ii) violação destes Termos; (iii) violação de direitos de terceiros.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            11. Modificações dos Termos
                        </h2>
                        <p className="leading-relaxed">
                            Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, forneceremos aviso prévio de pelo menos 30 dias. O que constitui uma mudança material será determinado a nosso exclusivo critério.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            12. Lei Aplicável
                        </h2>
                        <p className="leading-relaxed">
                            Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar suas disposições sobre conflito de leis. Qualquer disputa será resolvida nos tribunais de Salvador, BA.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            13. Contato
                        </h2>
                        <p className="leading-relaxed">
                            Para questões sobre estes Termos de Serviço, entre em contato:
                        </p>
                        <p className="mt-4 leading-relaxed">
                            E-mail:{' '}
                            <a href="mailto:legal@impera.com" className="text-gold hover:underline">
                                legal@impera.com
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
