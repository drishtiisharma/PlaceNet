import { CandidatesHeader } from "@/components/candidates/candidates-header";
import { CandidateSearch } from "@/components/candidates/candidates-search";
import { CandidateFilters } from "@/components/candidates/candidate-filters";
import { RankCandidatesPopover } from "@/components/candidates/rank-candidates-popover";
import { CandidatesTable } from "@/components/candidates/candidates-table";
import { CandidatesPagination } from "@/components/candidates/candidate-pagination";

import { CandidatesProvider } from "@/components/candidates/candidates-context";

export default function CandidatesPage() {
    return (
        <CandidatesProvider>
            <div className="flex flex-col gap-6 p-6">

            <CandidatesHeader />

            <div className="flex flex-col gap-4 rounded-lg border p-4">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <CandidateSearch />

                    <div className="flex items-center gap-2">
                        <CandidateFilters />
                        <RankCandidatesPopover />
                    </div>

                </div>

                <CandidatesTable />

                <CandidatesPagination />

            </div>

            </div>
        </CandidatesProvider>
    );
}