
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center bg-muted/20 rounded-lg border border-border">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                        Ocorreu um erro ao carregar este componente. Tente recarregar a página ou tente novamente.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Recarregar Página
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
