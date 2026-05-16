"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export function SessionsTableSkeleton() {
    return (
        <div className="min-w-0">
            <Table>
                <TableHeader className="bg-muted/25 dark:bg-white/[0.02]">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="h-11 px-4 text-[11px] uppercase">Difficulty</TableHead>
                        <TableHead className="h-11 px-4 text-[11px] uppercase">Problem</TableHead>
                        <TableHead className="hidden h-11 px-4 text-[11px] uppercase sm:table-cell">Status</TableHead>
                        <TableHead className="h-11 px-4 text-[11px] uppercase">Started</TableHead>
                        <TableHead className="hidden h-11 px-4 text-right text-[11px] uppercase md:table-cell">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i} className="h-16">
                            <TableCell className="px-4 py-4">
                                <Skeleton className="h-5 w-14 rounded-[4px]" />
                            </TableCell>
                            <TableCell className="px-4 py-4">
                                <Skeleton className="h-5 w-40" />
                            </TableCell>
                            <TableCell className="hidden px-4 py-4 sm:table-cell">
                                <Skeleton className="h-6 w-24 rounded-[4px]" />
                            </TableCell>
                            <TableCell className="px-4 py-4">
                                <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell className="hidden px-4 py-4 text-right md:table-cell">
                                <Skeleton className="h-5 w-10 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
