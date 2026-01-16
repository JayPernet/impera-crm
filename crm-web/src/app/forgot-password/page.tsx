"use client";

import { useState } from "react";
import { Mail, Loader2, AlertCircle, CheckCircle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { resetPassword } from "./actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [activeField, setActiveField] = useState<"email" | null>(null);

    async function handleReset(formData: FormData) {
        setIsLoading(true);
        setError("");
        setSuccess(false);

        const result = await resetPassword(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen w-full bg-background text-text-primary flex font-sans">

            {/* LEFT PANEL (HERO) - Hidden on Mobile */}
            <section className="hidden md:flex w-1/2 relative items-center justify-center p-12 overflow-hidden border-r border-border">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("/images/login-hero.png")' }}
                />
                <div className="absolute inset-0 z-0 bg-background/60" />

                {/* Background Mesh Gradient (Subtle) */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-[1]" />

                {/* Abstract Glass Object (CSS Art) */}
                <div className="relative z-10 p-12 rounded-3xl bg-surface/30 backdrop-blur-xl border border-white/5 shadow-2xl shadow-primary/10 max-w-lg">
                    <div className="flex flex-col gap-6">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Crown className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-2">IMPERA</h2>
                            <p className="text-text-secondary text-lg leading-relaxed">
                                Sistema de Inteligência Imobiliária.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <div className="text-xs text-text-tertiary font-mono opacity-50">
                                v3.6.0 stable
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* RIGHT PANEL (FORM) */}
            <section className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-[400px] space-y-8 relative z-10">

                    {/* Header */}
                    <div className="space-y-2 text-center md:text-left">
                        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Recuperar Senha</h1>
                        <p className="text-text-secondary">Enviaremos um link de recuperação para seu email.</p>
                    </div>

                    {/* Reset Card */}
                    {!success ? (
                        <form
                            action={handleReset}
                            className={cn(
                                "p-8 rounded-2xl border border-border bg-surface/40 backdrop-blur-md transition-all duration-300",
                                error && "animate-shake border-danger/50"
                            )}
                        >
                            <div className="space-y-6">

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider ml-1">Email</label>
                                    <div className={cn(
                                        "relative group transition-all duration-200 rounded-lg",
                                        activeField === "email" ? "ring-2 ring-primary/20" : ""
                                    )}>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className={cn("h-5 w-5 transition-colors", activeField === "email" ? "text-primary" : "text-text-tertiary")} />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="nome@imobiliaria.com.br"
                                            className={cn(
                                                "w-full h-12 bg-surface-elevated/50 border border-border text-text-primary text-sm rounded-lg focus:outline-none pl-11 placeholder:text-text-tertiary transition-colors",
                                                "focus:border-primary focus:bg-surface-elevated",
                                                error && "border-danger/50 focus:border-danger"
                                            )}
                                            onFocus={() => setActiveField("email")}
                                            onBlur={() => setActiveField(null)}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={cn(
                                        "w-full h-12 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm transition-all duration-200 mt-2",
                                        "shadow-[0_0_20px_-5px_rgba(201,162,77,0.4)] hover:shadow-[0_0_25px_-5px_rgba(201,162,77,0.6)]",
                                        "active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    )}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <span>Enviar Link de Recuperação</span>
                                    )}
                                </button>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Back to Login */}
                                <div className="text-center pt-4">
                                    <Link
                                        href="/login"
                                        className="text-xs text-text-secondary hover:text-primary transition-colors"
                                    >
                                        Voltar para o login
                                    </Link>
                                </div>

                            </div>
                        </form>
                    ) : (
                        /* Success State */
                        <div className="p-8 rounded-2xl border border-success/20 bg-surface/40 backdrop-blur-md">
                            <div className="space-y-6 text-center">
                                <div className="flex justify-center">
                                    <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                                        <CheckCircle className="h-8 w-8 text-success" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-text-primary">Email Enviado!</h3>
                                    <p className="text-text-secondary text-sm">
                                        Verifique sua caixa de entrada. Enviamos um link para redefinir sua senha.
                                    </p>
                                </div>
                                <Link
                                    href="/login"
                                    className={cn(
                                        "inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary hover:bg-primary-light text-primary-foreground font-medium text-sm transition-all duration-200",
                                        "shadow-[0_0_20px_-5px_rgba(201,162,77,0.4)] hover:shadow-[0_0_25px_-5px_rgba(201,162,77,0.6)]"
                                    )}
                                >
                                    Voltar para o Login
                                </Link>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Absolute */}
                <div className="absolute bottom-6 w-full text-center">
                    <p className="text-xs text-text-tertiary font-medium tracking-wide">POWERED BY STARIAUP</p>
                </div>
            </section>

        </main>
    );
}
