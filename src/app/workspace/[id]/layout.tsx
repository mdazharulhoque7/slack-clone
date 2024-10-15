'use client';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./sidebar";
import Toolbar from "./toolbar";
import WorkspaceDetailSidebar from "./workspace-detail-sidebar";


interface WorkspaceLayoutProps {
    children: React.ReactNode
}

const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
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
                </ResizablePanelGroup>
            </div>
        </div>
    );
}

export default WorkspaceLayout;