"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Search, Trash2, Download, Eye, FileText, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Resume = {
    resume_id: string;
    full_name: string;
    original_filename: string;
    department: string;
    cgpa: string;
    skills: string[];
    created_at: string;
};

type Stats = {
    total: number;
    indexed: number;
    failed: number;
    last_indexed: string;
};

export function ResumeDataTable() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    // Filters
    const [search, setSearch] = useState("");
    const [branch, setBranch] = useState("all");
    const [year, setYear] = useState("all");
    const [cgpa, setCgpa] = useState("all");

    // Sorting
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    // Selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const loadData = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search,
                branch,
                year,
                cgpa,
                sort_by: sortBy,
                sort_order: sortOrder
            });
            const [listRes, statsRes] = await Promise.all([
                fetch(`http://127.0.0.1:8000/resume/library/list?${queryParams.toString()}`),
                fetch(`http://127.0.0.1:8000/resume/stats`)
            ]);
            const listData = await listRes.json();
            const statsData = await statsRes.json();
            
            setResumes(listData.items || []);
            setTotal(listData.total || 0);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to load resumes", error);
            toast.error("Failed to load resume library.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, limit, search, branch, year, cgpa, sortBy, sortOrder]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(resumes.map(r => r.resume_id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedIds(newSet);
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} resumes?`)) return;
        
        const toastId = toast.loading("Deleting resumes...");
        try {
            const res = await fetch("http://127.0.0.1:8000/resume/bulk-delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume_ids: Array.from(selectedIds) })
            });
            if (res.ok) {
                toast.success("Resumes deleted successfully.", { id: toastId });
                setSelectedIds(new Set());
                loadData();
            } else {
                toast.error("Failed to delete resumes.", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred.", { id: toastId });
        }
    };

    const handleDeleteOne = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resume?")) return;
        
        try {
            const res = await fetch(`http://127.0.0.1:8000/resume/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Resume deleted.");
                loadData();
            }
        } catch (error) {
            toast.error("Failed to delete.");
        }
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                    <div className="relative w-72">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search name, skills, branch..." 
                            className="pl-9"
                            value={search}
                            onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                        />
                    </div>
                    <Select value={branch} onValueChange={(v) => {setBranch(v); setPage(1);}}>
                        <SelectContent>
                            <SelectItem value="all">All Domains</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Information Technology">Information Technology</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Bulk Action Toolbar */}
            {selectedIds.size > 0 && (
                <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-3 rounded-md">
                    <span className="text-sm font-medium text-orange-800">{selectedIds.size} resume(s) selected</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>Clear Selection</Button>
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
                        </Button>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300"
                                    checked={resumes.length > 0 && selectedIds.size === resumes.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('full_name')}>Name</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('department')}>Domain</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('created_at')}>Uploaded</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && resumes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : resumes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No resumes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            resumes.map(resume => (
                                <TableRow key={resume.resume_id} className={selectedIds.has(resume.resume_id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-gray-300"
                                            checked={selectedIds.has(resume.resume_id)}
                                            onChange={(e) => handleSelectOne(resume.resume_id, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{resume.full_name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{resume.original_filename}</div>
                                    </TableCell>
                                    <TableCell>{resume.department || '-'}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(resume.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => window.open(`http://127.0.0.1:8000/resume/view/${resume.resume_id}`, "_blank")}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Resume
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => window.open(`http://127.0.0.1:8000/resume/download/${resume.resume_id}`)}>
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem variant="destructive" onClick={() => handleDeleteOne(resume.resume_id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select value={limit.toString()} onValueChange={(v) => {setLimit(Number(v)); setPage(1);}}>
                            <SelectTrigger className="w-[70px] h-8 text-sm"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
