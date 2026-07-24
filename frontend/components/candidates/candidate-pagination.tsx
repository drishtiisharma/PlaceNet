"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useCandidates } from "./candidates-context";

export function CandidatesPagination() {
    const { page, total, fetchCandidates, isLoading } = useCandidates();
    const limit = 20;
    const totalPages = Math.ceil(total / limit);

    if (total === 0 || totalPages <= 1) return null;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== page && !isLoading) {
            fetchCandidates(newPage);
        }
    };

    const renderPages = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 3) {
                pages.push(1, 2, 3, 4, -1, totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, -1, page - 1, page, page + 1, -1, totalPages);
            }
        }

        return pages.map((p, index) => {
            if (p === -1) {
                return (
                    <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            return (
                <PaginationItem key={p}>
                    <PaginationLink 
                        href="#" 
                        isActive={page === p}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(p);
                        }}
                    >
                        {p}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    return (
        <Pagination className="justify-end mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page - 1);
                        }}
                        className={page === 1 || isLoading ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {renderPages()}

                <PaginationItem>
                    <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page + 1);
                        }}
                        className={page === totalPages || isLoading ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
