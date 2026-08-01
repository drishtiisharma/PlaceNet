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
import { useState } from "react";

export function HiringProfileTabs() {
    const [activeTab, setActiveTab] = useState("manage");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setActiveTab("manage");
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

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
                <HiringProfileManager key={refreshKey} />
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
                <HiringProfileForm onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="autofill" className="mt-6">
                <AIAutofillPanel onSuccess={handleSuccess} />
            </TabsContent>

        </Tabs>
    );
}
