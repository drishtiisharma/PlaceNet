"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, MessageSquare, Trash2, Edit2, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fetchApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";

interface ChatSession {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

interface ChatDropdownProps {
    currentSessionId: string | null;
    onSelectSession: (id: string) => void;
    onCreateNewChat: () => void;
}

export function ChatDropdown({ currentSessionId, onSelectSession, onCreateNewChat }: ChatDropdownProps) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    
    // Alert Dialog state
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    // Edit state
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const fetchSessions = () => {
        fetchApi("/chat/sessions")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSessions(data);
                }
            })
            .catch(err => console.error("Failed to load sessions", err));
    };

    // Fetch when dropdown opens or when currentSessionId changes (meaning a new message was sent possibly generating a title)
    useEffect(() => {
        fetchSessions();
    }, [isOpen, currentSessionId]);

    const handleDelete = async () => {
        if (!sessionToDelete) return;
        
        try {
            await fetchApi(`/chat/sessions/${sessionToDelete}`, {
                method: "DELETE",
            });
            
            setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
            
            if (currentSessionId === sessionToDelete) {
                onCreateNewChat();
            }
        } catch (error) {
            console.error("Failed to delete session", error);
        } finally {
            setSessionToDelete(null);
        }
    };

    const handleRename = async (id: string) => {
        if (!editTitle.trim()) {
            setEditingSessionId(null);
            return;
        }

        try {
            await fetchApi(`/chat/sessions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editTitle }),
            });
            fetchSessions();
        } catch (error) {
            console.error("Failed to rename session", error);
        } finally {
            setEditingSessionId(null);
        }
    };

    const activeSession = sessions.find(s => s.id === currentSessionId);
    
    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="gap-2 text-lg font-semibold max-w-[300px] justify-start"
                    >
                        <span className="truncate">
                            {activeSession ? activeSession.title : "New Chat"}
                        </span>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="start" className="w-[300px] p-2">
                    <DropdownMenuItem 
                        onClick={onCreateNewChat}
                        className="cursor-pointer gap-2 mb-2 bg-primary/10 text-primary font-medium focus:bg-primary/20"
                    >
                        <Plus className="h-4 w-4" />
                        Start New Chat
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <div className="max-h-[300px] overflow-y-auto scrollbar-hide py-1">
                        {sessions.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No previous chats</p>
                        ) : (
                            sessions.map((session) => (
                                <div key={session.id} className="flex items-center group mb-1">
                                    <DropdownMenuItem 
                                        onClick={() => onSelectSession(session.id)}
                                        className={`flex-1 cursor-pointer flex-col items-start gap-1 p-2 ${session.id === currentSessionId ? "bg-accent" : ""}`}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                                            {editingSessionId === session.id ? (
                                                <Input 
                                                    value={editTitle}
                                                    onChange={e => setEditTitle(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") {
                                                            e.stopPropagation();
                                                            handleRename(session.id);
                                                        }
                                                    }}
                                                    onClick={e => e.stopPropagation()}
                                                    autoFocus
                                                    className="h-6 text-sm py-0 px-1"
                                                />
                                            ) : (
                                                <span className="text-sm font-medium truncate w-[200px]">
                                                    {session.title || "Untitled Chat"}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground pl-6">
                                            {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                                        </span>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem onClick={() => {
                                                setEditingSessionId(session.id);
                                                setEditTitle(session.title);
                                            }}>
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                Rename
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => setSessionToDelete(session.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </div>
                            ))
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={!!sessionToDelete} onOpenChange={(open) => !open && setSessionToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this chat session and all its messages. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
