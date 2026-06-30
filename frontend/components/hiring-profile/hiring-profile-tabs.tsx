"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { HiringProfileForm } from "./hiring-profile-form";
import { AIAutofillPanel } from "./ai-autofill-panel";

export function HiringProfileTabs() {
    return (
        <Tabs defaultValue="manual" className="w-full">

            <TabsList variant="line">
                <TabsTrigger value="manual">
                    Manual Entry
                </TabsTrigger>

                <TabsTrigger value="autofill">
                    AI Autofill
                </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
                <HiringProfileForm />
            </TabsContent>

            <TabsContent value="autofill" className="mt-6">
                <AIAutofillPanel />
            </TabsContent>

        </Tabs>
    );
}