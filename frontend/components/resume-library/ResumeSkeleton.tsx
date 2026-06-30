"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ResumeSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="grid grid-cols-5 items-center gap-6 rounded-lg border p-4"
                >
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <Skeleton className="h-4 w-24" />

                    <Skeleton className="h-4 w-16" />

                    <Skeleton className="h-6 w-24 rounded-full" />

                    <div className="flex justify-end">
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}