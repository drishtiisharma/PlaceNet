"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Camera } from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

export default function ProfilePage() {
    const [name, setName] = useState<string>("Loading...");
    const [email, setEmail] = useState<string>("Loading...");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [originalName, setOriginalName] = useState("");
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setEmail(user.email || "No email found");
                if (user.user_metadata && user.user_metadata.full_name) {
                    setName(user.user_metadata.full_name);
                    setOriginalName(user.user_metadata.full_name);
                } else {
                    setName("Unknown User");
                    setOriginalName("Unknown User");
                }
            } else {
                setName("Not authenticated");
                setEmail("Not authenticated");
            }
        });
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(originalName);
        setNewPassword("");
    };

    const handleSave = async () => {
        setIsSaving(true);
        const supabase = createClient();
        
        try {
            const updates: any = {
                data: { full_name: name }
            };
            
            if (newPassword) {
                updates.password = newPassword;
            }

            const { error } = await supabase.auth.updateUser(updates);

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Profile updated successfully");
                setOriginalName(name);
                setIsEditing(false);
                setNewPassword("");
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.")) {
            return;
        }

        setIsDeleting(true);
        const supabase = createClient();
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) {
                toast.error("Not authenticated");
                return;
            }

            const response = await fetchApi(`/auth/account/${session.user.id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to delete account");
            }

            await supabase.auth.signOut();
            toast.success("Account deleted successfully");
            router.push("/auth");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto mt-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your account details and settings.</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center gap-4 border-b">
                    <div className="relative group cursor-pointer rounded-full overflow-hidden w-16 h-16">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src="" alt="Profile" />
                            <AvatarFallback className="bg-muted">
                                <UserCircle className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
                            </AvatarFallback>
                        </Avatar>
                        
                        {/* Placeholder overlay for future image upload */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div>
                        <CardTitle className="text-xl">{name}</CardTitle>
                        <CardDescription>{email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                            id="name" 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            readOnly={!isEditing} 
                            className={!isEditing ? "bg-muted/50 cursor-default" : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            readOnly 
                            className="bg-muted/50 cursor-default"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type={isEditing ? "text" : "password"}
                            value={isEditing ? newPassword : "••••••••••••"}
                            onChange={(e) => setNewPassword(e.target.value)}
                            readOnly={!isEditing} 
                            placeholder={isEditing ? "Leave blank to keep current password" : ""}
                            className={!isEditing ? "bg-muted/50 cursor-default tracking-widest text-lg h-10 py-0" : ""}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            {isEditing ? "Enter a new password to change it, or leave it blank." : "Your password is securely hashed and cannot be displayed."}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} className="bg-orange-500 hover:bg-orange-600 text-white">
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" onClick={handleEdit}>
                            Edit Profile
                        </Button>
                    )}
                    
                    {!isEditing && (
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Account"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
