'use client';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import WorkspaceDetailSidebar from "./workspace-detail-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import Thread from "@/app/features/messages/components/threads/thread";
import { Id } from "../../../../convex/_generated/dataModel";


interface WorkspaceLayoutProps {
    children: React.ReactNode
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
    const { parentMessageId, onClose } = usePanel();
    const showPanel = !!parentMessageId;

    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup
                    direction="horizontal"
                    autoSaveId="az-slack-clone-workspace-layout"
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-[#5e2c5f]"
                    >
                        <WorkspaceDetailSidebar />
                    </ResizablePanel>
                    <ResizableHandle></ResizableHandle>
                    <ResizablePanel minSize={20}>

                        {children}
                    </ResizablePanel>
                    {showPanel && (
                        <>
                            <ResizableHandle />
                            <ResizablePanel minSize={20} defaultSize={29}>
                                {parentMessageId ? (
                                    <Thread
                                        messageId={parentMessageId as Id<"messages">}
                                        onClose={onClose}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default WorkspaceLayout;