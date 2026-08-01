"use client";

import { useEffect, useState } from "react";
import { fetchApi, API_BASE_URL } from "@/lib/api";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    const [sortBy, setSortBy] = useState("full_name");
    const [sortOrder, setSortOrder] = useState("asc");

    // Selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Deletion Modal States
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
    const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
                fetchApi(`/resume/library/list?${queryParams.toString()}`),
                fetchApi(`/resume/stats`)
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

    const confirmBulkDelete = () => {
        setBulkDeleteConfirmOpen(true);
    };

    const executeBulkDelete = async () => {
        setIsDeleting(true);
        const toastId = toast.loading("Deleting resumes...");
        try {
            const res = await fetchApi("/resume/bulk-delete", {
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
        } finally {
            setIsDeleting(false);
            setBulkDeleteConfirmOpen(false);
        }
    };

    const handleViewResume = async (resumeId: string) => {
        const toastId = toast.loading("Opening resume...");
        const newWindow = window.open('about:blank', '_blank');
        try {
            const res = await fetchApi(`/resume/view/${resumeId}`);
            if (res.status === 401 || res.status === 403) {
                toast.error("Session expired. Please log in again.", { id: toastId });
                newWindow?.close();
                return;
            }
            if (!res.ok) throw new Error("Failed to view");
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            if (newWindow) {
                newWindow.location.href = url;
            } else {
                window.location.href = url;
            }
            toast.dismiss(toastId);
        } catch (error) {
            newWindow?.close();
            toast.error("Failed to open resume.", { id: toastId });
        }
    };

    const handleDownloadResume = async (resumeId: string, filename: string) => {
        const toastId = toast.loading("Downloading resume...");
        try {
            const res = await fetchApi(`/resume/download/${resumeId}`);
            if (res.status === 401 || res.status === 403) {
                toast.error("Session expired. Please log in again.", { id: toastId });
                return;
            }
            if (!res.ok) throw new Error("Failed to download");
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || `resume-${resumeId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.dismiss(toastId);
        } catch (error) {
            toast.error("Failed to download resume.", { id: toastId });
        }
    };

    const confirmDeleteOne = (id: string) => {
        setResumeToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const executeDeleteOne = async () => {
        if (!resumeToDelete) return;
        setIsDeleting(true);
        const toastId = toast.loading("Deleting resume...");
        try {
            const res = await fetchApi(`/resume/${resumeToDelete}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Resume deleted.", { id: toastId });
                loadData();
            } else {
                toast.error("Failed to delete.", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to delete.", { id: toastId });
        } finally {
            setIsDeleting(false);
            setDeleteConfirmOpen(false);
            setResumeToDelete(null);
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
                <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2 bg-white border border-input px-3 py-2 rounded-md h-10">
                        <input 
                            type="checkbox" 
                            id="selectAll"
                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                            checked={resumes.length > 0 && selectedIds.size === resumes.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label htmlFor="selectAll" className="text-sm cursor-pointer select-none text-muted-foreground font-medium">Select All</label>
                    </div>
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
                        <Button variant="destructive" size="sm" onClick={confirmBulkDelete}>
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
                            <TableHead className="w-[100px]">S.No</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('full_name')}>Name</TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('created_at')}>Uploaded On</TableHead>
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
                            resumes.map((resume, index) => (
                                <TableRow key={resume.resume_id} className={selectedIds.has(resume.resume_id) ? "bg-muted/50" : ""}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-gray-300"
                                                checked={selectedIds.has(resume.resume_id)}
                                                onChange={(e) => handleSelectOne(resume.resume_id, e.target.checked)}
                                            />
                                            <span className="font-medium text-muted-foreground">{(page - 1) * limit + index + 1}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{resume.full_name || 'Unknown'}</div>
                                        <div className="text-xs text-muted-foreground">{resume.original_filename}</div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(resume.created_at).toLocaleDateString()} {new Date(resume.created_at).toLocaleTimeString('en-GB')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewResume(resume.resume_id)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Resume
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDownloadResume(resume.resume_id, resume.original_filename)}>
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem variant="destructive" onClick={() => confirmDeleteOne(resume.resume_id)}>
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

            {/* Modals */}
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this resume? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => { e.preventDefault(); executeDeleteOne(); }} 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Multiple Resumes</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedIds.size} resumes? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => { e.preventDefault(); executeBulkDelete(); }} 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    );
}
