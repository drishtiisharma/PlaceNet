"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function HiringProfileForm() {
    return (
        <form>

            <FieldGroup>

                <Field>
                    <FieldLabel>Job Title</FieldLabel>
                    <Input placeholder="Frontend Developer" />
                </Field>

                <Field>
                    <FieldLabel>Company</FieldLabel>
                    <Input placeholder="Company Name" />
                </Field>

                <Field>
                    <FieldLabel>Experience</FieldLabel>
                    <Input placeholder="2+ Years" />
                </Field>

                <Field>
                    <FieldLabel>Required Skills</FieldLabel>
                    <Textarea
                        className="resize-none"
                        placeholder="React, TypeScript, Next.js..."
                    />
                </Field>

                <Field>
                    <FieldLabel>Responsibilities</FieldLabel>
                    <Textarea
                        className="resize-none"
                        placeholder="Describe the responsibilities..."
                    />
                </Field>

                <div className="mt-6 flex justify-end">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        Save JD
                    </Button>
                </div>

            </FieldGroup>

        </form>
    );
}