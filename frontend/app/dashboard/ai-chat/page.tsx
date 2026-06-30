import { ChatHeader } from "@/components/ai-chat/chat-header";
import { ChatLayout } from "@/components/ai-chat/chat-layout";
import { EmptyState } from "@/components/ai-chat/empty-state";
import { PromptBox } from "@/components/ai-chat/prompt-box";

export default function AIChatPage() {
    return (
        <ChatLayout>
            <ChatHeader />

            <div className="flex flex-1 flex-col items-center justify-center w-full">
                <EmptyState />
                <PromptBox />
            </div>
        </ChatLayout>
    );
}