import { ShieldOff, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function SuspendedPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-center">
                            <ShieldOff className="h-7 w-7 text-danger" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold tracking-tight text-text-primary block leading-none">IMPERA</span>
                            <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">CRM</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="p-8 rounded-xl border border-danger/30 bg-surface/30 backdrop-blur-xl shadow-2xl space-y-6">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-danger/10 border-2 border-danger/30 mb-2">
                            <ShieldOff className="h-8 w-8 text-danger" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">Acesso Suspenso</h1>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Sua conta foi temporariamente suspensa. Entre em contato com o suporte para regularizar sua situação.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-text-tertiary uppercase tracking-wider">Email</p>
                                <a href="mailto:suporte@impera.com" className="text-sm font-medium text-primary hover:text-primary-light transition-colors">
                                    suporte@impera.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border">
                            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                                <Phone className="h-5 w-5 text-success" />
                            </div>
                            <div>
                                <p className="text-xs text-text-tertiary uppercase tracking-wider">WhatsApp</p>
                                <a href="https://wa.me/5511999999999" className="text-sm font-medium text-success hover:text-success/80 transition-colors">
                                    (11) 99999-9999
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 space-y-3">
                        <Link
                            href="/login"
                            className="block w-full h-10 px-4 rounded-md bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm text-center leading-10 transition-all active:scale-[0.98]"
                        >
                            Voltar ao Login
                        </Link>
                        <p className="text-xs text-center text-text-tertiary">
                            Problemas? Entre em contato com nosso suporte.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-text-tertiary">
                        © 2026 IMPERA CRM. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
