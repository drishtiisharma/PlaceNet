"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { HiringProfileForm } from "./hiring-profile-form";
import { AIAutofillPanel } from "./ai-autofill-panel";

import { HiringProfileManager } from "./hiring-profile-manager";

export function HiringProfileTabs() {
    return (
        <Tabs defaultValue="manage" className="w-full">

            <TabsList variant="line">
                <TabsTrigger value="manage">
                    Manage Profiles
                </TabsTrigger>

                <TabsTrigger value="manual">
                    Manual Entry
                </TabsTrigger>

                <TabsTrigger value="autofill">
                    AI Autofill
                </TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="mt-6">
                <HiringProfileManager />
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
                <HiringProfileForm />
            </TabsContent>

            <TabsContent value="autofill" className="mt-6">
                <AIAutofillPanel />
            </TabsContent>

        </Tabs>
    );
}
