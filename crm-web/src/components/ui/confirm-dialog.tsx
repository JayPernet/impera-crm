"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "warning" | "info"
    isLoading?: boolean
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    isLoading = false
}: ConfirmDialogProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!mounted) return null
    if (!isOpen) return null

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Dialog Panel */}
            <div className="relative transform overflow-hidden rounded-lg bg-surface border border-border text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-surface px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <div className={cn(
                            "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10",
                            variant === "danger" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                        )}>
                            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-lg font-semibold leading-6 text-text-primary" id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-text-secondary">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-surface-elevated px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-border">
                    <button
                        type="button"
                        disabled={isLoading}
                        className={cn(
                            "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                            variant === "danger"
                                ? "bg-danger hover:bg-danger/90"
                                : "bg-primary hover:bg-primary-light"
                        )}
                        onClick={onConfirm}
                    >
                        {isLoading ? "Processando..." : confirmText}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-surface px-3 py-2 text-sm font-semibold text-text-primary shadow-sm ring-1 ring-inset ring-border-strong hover:bg-surface-elevated sm:mt-0 sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                </div>

                {/* Close Button X */}
                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>,
        document.body
    )
}
