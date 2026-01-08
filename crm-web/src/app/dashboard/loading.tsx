import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-neutral-500">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="text-sm font-medium animate-pulse">Carregando...</span>
            </div>
        </div>
    );
}
