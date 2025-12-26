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
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i} className="h-16">
                            <TableCell className="py-4">
                                <Skeleton className="h-5 w-14 rounded-full" />
                            </TableCell>
                            <TableCell className="py-4">
                                <Skeleton className="h-5 w-40" />
                            </TableCell>
                            <TableCell className="py-4 hidden sm:table-cell">
                                <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell className="py-4">
                                <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell className="text-right py-4 hidden md:table-cell">
                                <Skeleton className="h-5 w-10 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
