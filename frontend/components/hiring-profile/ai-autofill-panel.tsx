"use client";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { UploadArea } from "./upload-area";
import { HiringProfileForm } from "./hiring-profile-form";

export function AIAutofillPanel() {
    return (
        <div className="space-y-6">

            <Field>

                <FieldLabel>
                    Paste Job Description
                </FieldLabel>

                <FieldDescription>
                    Paste the complete Job Description below.
                </FieldDescription>

                <Textarea
                    rows={10}
                    placeholder="Paste the Job Description here..."
                />

            </Field>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <Separator />
                </div>

                <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-sm font-medium text-muted-foreground">
                        OR
                    </span>
                </div>
            </div>

            <UploadArea />

            <div className="mt-6 flex justify-center">
                <Button className="bg-orange-600 hover:bg-orange-700">
                    AutoFill Details
                </Button>
            </div>

            <Separator />

            {/* Hidden later until Generate Form is clicked */}

            <HiringProfileForm />

        </div>
    );
}