"use client";

import { toast } from "sonner";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

export interface HiringProfileData {
    job_title: string;
    company?: string | null;
    required_skills: string[];
    preferred_skills: string[];
    experience?: string | null;
    education?: string | null;
    eligible_departments: string[];
    cgpa_requirement?: string | null;
    certifications: string[];
    responsibilities: string[];
    keywords: string[];
    job_summary?: string | null;
}

export function HiringProfileForm({
    initialData,
    profileId,
    onSuccess
}: {
    initialData?: HiringProfileData,
    profileId?: string,
    onSuccess?: () => void
}) {
    const router = useRouter();
    const [formData, setFormData] = useState<HiringProfileData>(initialData || {
        job_title: "",
        company: "",
        required_skills: [],
        preferred_skills: [],
        experience: "",
        education: "",
        eligible_departments: [],
        cgpa_requirement: "",
        certifications: [],
        responsibilities: [],
        keywords: [],
        job_summary: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    // In case initialData changes without remounting
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field: keyof HiringProfileData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleStringList = (field: keyof HiringProfileData, value: string) => {
        const list = value.split(",").map(i => i.trim()).filter(Boolean);
        handleChange(field, list);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        console.log("Form State on Submit (API Request Payload):", formData);
        try {
            const url = profileId
                ? `/hiring-profile/${profileId}`
                : "/hiring-profile/";

            const method = profileId ? "PUT" : "POST";

            const res = await fetchApi(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const resData = await res.json().catch(() => ({}));
            console.log("API Response:", resData);

            if (!res.ok) {
                toast.error(resData.detail || resData.message || `Failed to ${profileId ? 'update' : 'save'} Hiring Profile`);
                return;
            }
            toast.success(`Hiring Profile ${profileId ? 'updated' : 'saved'} successfully!`);
            if (onSuccess) onSuccess();
            router.push("/dashboard/hiring-profile");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("An unexpected error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel>Job Title</FieldLabel>
                    <Input
                        value={formData.job_title || ""}
                        onChange={e => handleChange("job_title", e.target.value)}
                        placeholder="Frontend Developer"
                        required
                    />
                </Field>

                <Field>
                    <FieldLabel>Company</FieldLabel>
                    <Input
                        value={formData.company || ""}
                        onChange={e => handleChange("company", e.target.value)}
                        placeholder="Company Name"
                    />
                </Field>

                <Field>
                    <FieldLabel>Experience</FieldLabel>
                    <Input
                        value={formData.experience || ""}
                        onChange={e => handleChange("experience", e.target.value)}
                        placeholder="2+ Years"
                    />
                </Field>

                <Field>
                    <FieldLabel>Education</FieldLabel>
                    <Input
                        value={formData.education || ""}
                        onChange={e => handleChange("education", e.target.value)}
                        placeholder="Bachelor's in CS"
                    />
                </Field>

                <Field>
                    <FieldLabel>CGPA Requirement</FieldLabel>
                    <Input
                        value={formData.cgpa_requirement || ""}
                        onChange={e => handleChange("cgpa_requirement", e.target.value)}
                        placeholder="7.5+"
                    />
                </Field>

                <Field>
                    <FieldLabel>Required Skills (comma separated)</FieldLabel>
                    <Textarea
                        className="resize-none"
                        value={(formData.required_skills || []).join(", ")}
                        onChange={e => handleStringList("required_skills", e.target.value)}
                        placeholder="React, TypeScript, Next.js..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Preferred Skills (comma separated)</FieldLabel>
                    <Textarea
                        className="resize-none"
                        value={(formData.preferred_skills || []).join(", ")}
                        onChange={e => handleStringList("preferred_skills", e.target.value)}
                        placeholder="Node.js, GraphQL..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Eligible Departments (comma separated)</FieldLabel>
                    <Input
                        value={(formData.eligible_departments || []).join(", ")}
                        onChange={e => handleStringList("eligible_departments", e.target.value)}
                        placeholder="CSE, IT..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Certifications (comma separated)</FieldLabel>
                    <Input
                        value={(formData.certifications || []).join(", ")}
                        onChange={e => handleStringList("certifications", e.target.value)}
                        placeholder="AWS Certified..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Responsibilities (comma separated)</FieldLabel>
                    <Textarea
                        className="resize-none"
                        value={(formData.responsibilities || []).join(", ")}
                        onChange={e => handleStringList("responsibilities", e.target.value)}
                        placeholder="Describe the responsibilities..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Keywords (comma separated)</FieldLabel>
                    <Input
                        value={(formData.keywords || []).join(", ")}
                        onChange={e => handleStringList("keywords", e.target.value)}
                        placeholder="Frontend, Web..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Job Summary</FieldLabel>
                    <Textarea
                        className="resize-none"
                        value={formData.job_summary || ""}
                        onChange={e => handleChange("job_summary", e.target.value)}
                        placeholder="Brief summary..."
                    />
                </Field>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isSaving} className="h-11 bg-orange-600 hover:bg-blue-600 text-white">
                        {isSaving ? "Saving..." : "Save JD"}
                    </Button>
                </div>

            </FieldGroup>
        </form>
    );
}
