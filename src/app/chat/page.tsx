import { ChatWindow } from "@/components/chat/ChatWindow";
import { PageHeader } from "@/components/layout/PageHeader";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata(
    "Portfolio Chat",
    "AI assistant for Rihan's resume — streaming replies, markdown answers, and private in-browser chat."
);

export default function ChatPage() {
    return (
        <>
            <PageHeader
                title="Portfolio Chat"
                description={
                    <>
                        Chat with an AI assistant trained on Rihan&apos;s resume — skills, experience,
                        projects, and certifications. Streaming replies run entirely in your browser.
                    </>
                }
            />
            <div className="container">
                <ChatWindow />
            </div>
        </>
    );
}
