"use client";

import { toast } from "sonner";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Briefcase, Building2, Pencil, Trash2, Copy, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";

import { HiringProfileForm, HiringProfileData } from "./hiring-profile-form";

export type HiringProfile = HiringProfileData & {
    id: string;
    created_at: string;
};

export function HiringProfileManager() {
    const [profiles, setProfiles] = useState<HiringProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedProfile, setSelectedProfile] = useState<HiringProfile | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadProfiles = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching hiring profiles from http://127.0.0.1:8000/hiring-profile/");
            const response = await fetch("http://127.0.0.1:8000/hiring-profile/");
            if (!response.ok) {
                const errText = await response.text();
                console.error("API Error Response:", response.status, errText);
                let errMessage = "Failed to load profiles.";
                try {
                    const errJson = JSON.parse(errText);
                    errMessage = errJson.message || errMessage;
                } catch (e) {}
                toast.error(errMessage);
                return;
            }
            const data = await response.json();
            console.log("Hiring profiles loaded successfully:", data);
            
            // Unpack success wrapper if it exists
            const profilesList = data.success !== undefined ? data.data : data;
            setProfiles(profilesList);
        } catch (error) {
            console.error("Fetch error details:", error);
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                toast.error("Network error: Could not connect to the backend. Please verify FastAPI is running on port 8000 and CORS is configured.");
            } else {
                toast.error(`Error loading profiles: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfiles();
    }, []);

    const handleDelete = async () => {
        if (!selectedProfile) return;
        setIsDeleting(true);
        try {
            console.log(`Deleting hiring profile ${selectedProfile.id}...`);
            const response = await fetch(`http://127.0.0.1:8000/hiring-profile/${selectedProfile.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Profile deleted successfully.");
                setProfiles(prev => prev.filter(p => p.id !== selectedProfile.id));
                setIsDeleteModalOpen(false);
                setSelectedProfile(null);
            } else {
                const errText = await response.text();
                console.error("Delete API Error Response:", response.status, errText);
                let errMessage = "Failed to delete profile.";
                try {
                    const errJson = JSON.parse(errText);
                    errMessage = errJson.message || errMessage;
                } catch (e) {}
                toast.error(errMessage);
            }
        } catch (error) {
            console.error("Delete fetch error:", error);
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                toast.error("Network error: Could not connect to the backend to delete.");
            } else {
                toast.error("An unexpected error occurred while deleting.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFormSuccess = () => {
        setIsEditModalOpen(false);
        setIsDuplicateModalOpen(false);
        loadProfiles();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading profiles...</p>
            </div>
        );
    }

    if (profiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-muted/20 border-dashed">
                <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2">No Hiring Profiles Found</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                    You haven't created any hiring profiles yet. Use the Manual Entry or AI Autofill tabs to create your first one.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {profiles.map((profile) => (
                <Card key={profile.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <CardTitle className="text-xl leading-tight mb-1">
                                    {profile.job_title}
                                </CardTitle>
                                {profile.company && (
                                    <CardDescription className="flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5" />
                                        {profile.company}
                                    </CardDescription>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-4 flex-1">
                        <div className="flex flex-wrap gap-2 mt-2">
                            {profile.required_skills.slice(0, 3).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="font-normal text-xs">
                                    {skill}
                                </Badge>
                            ))}
                            {profile.required_skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{profile.required_skills.length - 3} more
                                </Badge>
                            )}
                        </div>
                        {profile.experience && (
                            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                {profile.experience} Experience
                            </p>
                        )}
                    </CardContent>

                    <CardFooter className="pt-4 border-t flex items-center justify-between gap-2">
                        <div className="text-xs text-muted-foreground">
                            {profile.created_at ? format(new Date(profile.created_at), 'MMM d, yyyy') : "Recently"}
                        </div>
                        <div className="flex gap-1.5">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => {
                                    setSelectedProfile(profile);
                                    setIsEditModalOpen(true);
                                }}
                            >
                                <Pencil className="h-3.5 w-3.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={() => {
                                    setSelectedProfile(profile);
                                    setIsDuplicateModalOpen(true);
                                }}
                            >
                                <Copy className="h-3.5 w-3.5 sm:mr-1.5" />
                                <span className="hidden sm:inline">Clone</span>
                            </Button>
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => {
                                    setSelectedProfile(profile);
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}

            {/* EDIT MODAL */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Hiring Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to the hiring profile requirements and keywords below.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProfile && (
                        <div className="mt-4">
                            <HiringProfileForm 
                                initialData={selectedProfile} 
                                profileId={selectedProfile.id}
                                onSuccess={handleFormSuccess}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* DUPLICATE MODAL */}
            <Dialog open={isDuplicateModalOpen} onOpenChange={setIsDuplicateModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Clone Hiring Profile</DialogTitle>
                        <DialogDescription>
                            Create a new profile based on this existing one.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedProfile && (
                        <div className="mt-4">
                            <HiringProfileForm 
                                initialData={{...selectedProfile, job_title: `${selectedProfile.job_title} (Copy)`}} 
                                onSuccess={handleFormSuccess}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* DELETE ALERT */}
            <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the <strong>{selectedProfile?.job_title}</strong> hiring profile.
                            This action cannot be undone and will remove it from all AI vector searches.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => { e.preventDefault(); handleDelete(); }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Deleting..." : "Delete Profile"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
