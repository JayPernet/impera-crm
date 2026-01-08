"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-border bg-surface/40 backdrop-blur-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-surface-elevated text-text-secondary uppercase text-xs font-semibold tracking-wider">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-border">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} className="h-12 px-4 text-left align-middle font-medium">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-surface-elevated/50 transition-colors group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 align-middle">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center text-text-tertiary">
                                    Nenhum resultado encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple) */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <button
                    className="p-2 rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    className="p-2 rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
