import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Star, ThumbsUp, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface ClientData {
    client_id: string;
    name: string;
    organization_id: string;
    organization_name: string;
    google_business_url: string | null;
}

export default function NpsRating() {
    const { token } = useParams<{ clinic_slug: string; token: string }>();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ClientData | null>(null);
    const [error, setError] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [hoveredScore, setHoveredScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchClient() {
            if (!token) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const { data: result, error: rpcError } = await (supabase.rpc as any)(
                    "get_client_for_nps",
                    { token_input: token }
                );

                if (rpcError || !result) {
                    console.error("Error fetching client:", rpcError);
                    setError(true);
                } else {
                    // Cast the JSON result to our interface
                    const clientData = result as unknown as ClientData;
                    setData(clientData);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchClient();
    }, [token]);

    const handleScoreClick = (val: number) => {
        setScore(val);
        if (val >= 9) {
            triggerConfetti();
        }
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#D4AF37", "#FFFFFF", "#000000"]
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#D4AF37", "#FFFFFF", "#000000"]
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const handleSubmit = async () => {
        if (score === null || !data) return;

        setSubmitting(true);
        try {
            const { error: insertError } = await (supabase.from("crm_nps_ratings" as any).insert({
                organization_id: data.organization_id,
                client_id: data.client_id,
                score,
                feedback,
                origin: "link_publico",
            }) as any);

            if (insertError) throw insertError;

            setSubmitted(true);
            if (score >= 9) triggerConfetti();
        } catch (err) {
            console.error("Error submitting rating:", err);
            alert("Houve um erro ao enviar sua avaliação. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const firstName = data?.name?.split(" ")[0] || "Cliente";

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white p-4 text-center">
                <h1 className="text-2xl font-bold mb-2">Link Expired or Invalid</h1>
                <p className="text-neutral-400">Não foi possível encontrar a avaliação solicitada.</p>
            </div>
        );
    }

    // Calculate NPS Color
    const getScoreColor = (s: number) => {
        if (s >= 9) return "bg-green-500 hover:bg-green-600";
        if (s >= 7) return "bg-yellow-500 hover:bg-yellow-600";
        return "bg-red-500 hover:bg-red-600";
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-neutral-950 -z-10" />

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <p className="text-[#D4AF37] tracking-widest text-sm uppercase font-semibold mb-2">
                        {data.organization_name}
                    </p>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                        Olá, {firstName}!
                    </h1>
                </div>

                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="rating-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <p className="text-lg text-neutral-300 mb-6">
                                    Em uma escala de 0 a 10, o quanto você recomendaria nossa clínica para um amigo ou familiar?
                                </p>

                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {Array.from({ length: 11 }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleScoreClick(i)}
                                            onMouseEnter={() => setHoveredScore(i)}
                                            onMouseLeave={() => setHoveredScore(null)}
                                            className={cn(
                                                "w-10 h-12 rounded-lg font-bold transition-all duration-200 transform hover:scale-110 flex items-center justify-center border border-neutral-800",
                                                score === i
                                                    ? getScoreColor(i) + " text-white border-transparent shadow-lg shadow-current/20"
                                                    : hoveredScore === i
                                                        ? "bg-neutral-800 text-white"
                                                        : "bg-neutral-900/50 text-neutral-400 hover:bg-neutral-800"
                                            )}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between text-xs text-neutral-500 px-2">
                                    <span>Não recomendaria</span>
                                    <span>Com certeza recomendaria</span>
                                </div>
                            </div>

                            {score !== null && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-4"
                                >
                                    <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            {score >= 9
                                                ? "O que mais te encantou?"
                                                : "O que podemos fazer para melhorar?"}
                                        </label>
                                        <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Deixe seu comentário (opcional)..."
                                            className="bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600 min-h-[100px] resize-none focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-black font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "Enviar Avaliação"
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                <ThumbsUp className="w-10 h-10 text-green-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    Obrigado, {firstName}!
                                </h2>
                                <p className="text-neutral-400">
                                    {score && score >= 9
                                        ? "Ficamos muito felizes em saber que você teve uma ótima experiência!"
                                        : "Agradecemos seu feedback sincero. Isso nos ajuda a evoluir."}
                                </p>
                            </div>

                            {score && score >= 9 && data.google_business_url && (
                                <Card className="bg-neutral-900/50 border-neutral-800 max-w-sm mx-auto overflow-hidden">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-neutral-300 mb-4">
                                            Que tal compartilhar essa experiência no Google? Leva menos de 1 minuto e nos ajuda muito! ✨
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full border-neutral-700 hover:bg-white hover:text-black hover:border-white transition-all gap-2 h-11"
                                            onClick={() => window.open(data.google_business_url!, "_blank")}
                                        >
                                            <MapPin className="w-4 h-4" />
                                            Avaliar no Google
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-4 text-center w-full">
                <p className="text-[10px] text-neutral-600 uppercase tracking-widest">
                    Powered by EstéticaPro
                </p>
            </div>
        </div>
    );
}
