"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface ParsedProfileDialogProps {
    resumeId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ParsedProfileDialog({ resumeId, open, onOpenChange }: ParsedProfileDialogProps) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && resumeId) {
            loadProfile();
        } else {
            setProfile(null);
        }
    }, [open, resumeId]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await fetchApi(`/resume/library/list?search=${resumeId}`);
            const data = await res.json();
            // Since we can't easily fetch a single profile by ID without a dedicated endpoint right now,
            // we'll filter it from the list. (Alternatively, we could have a /resume/{id} endpoint).
            const found = data.items?.find((i: any) => i.resume_id === resumeId);
            setProfile(found);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{profile?.full_name || 'Candidate Profile'}</DialogTitle>
                    <DialogDescription>Extracted structured information from the resume.</DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : profile ? (
                    <div className="space-y-6 mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
                            <div><strong>Branch:</strong> {profile.department || "N/A"}</div>
                            <div><strong>CGPA:</strong> {profile.cgpa || "N/A"}</div>
                            <div><strong>Original File:</strong> {profile.original_filename}</div>
                        </div>

                        <Separator />

                        {profile.skills?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills</span>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}
                                </div>
                            </div>
                        )}

                        {profile.education?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education</span>
                                <ul className="text-sm space-y-2 list-disc pl-5">
                                    {profile.education.map((e: string, i: number) => <li key={i} className="leading-relaxed">{e}</li>)}
                                </ul>
                            </div>
                        )}

                        {profile.experience?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Experience</span>
                                <ul className="text-sm space-y-2 list-disc pl-5">
                                    {profile.experience.map((e: string, i: number) => <li key={i} className="leading-relaxed">{e}</li>)}
                                </ul>
                            </div>
                        )}

                        {profile.projects?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Projects</span>
                                <ul className="text-sm space-y-2 list-disc pl-5">
                                    {profile.projects.map((p: string, i: number) => <li key={i} className="leading-relaxed">{p}</li>)}
                                </ul>
                            </div>
                        )}

                        {profile.certifications?.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Certifications</span>
                                <ul className="text-sm space-y-2 list-disc pl-5">
                                    {profile.certifications.map((c: string, i: number) => <li key={i} className="leading-relaxed">{c}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-20 text-center text-muted-foreground">Could not load profile.</div>
                )}
            </DialogContent>
        </Dialog>
    );
}
