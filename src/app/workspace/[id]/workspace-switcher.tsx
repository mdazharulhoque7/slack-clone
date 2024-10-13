import { useCreateWorkspace } from "@/app/features/workspaces/api/use-create-workspace";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/app/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/app/features/workspaces/store/use-create-workspace-modal";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWorkspaceId } from "@/hooks/use-workspace_id"
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateWorkspaceModal()
    const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: workspaces, isLoading: isWorkspacesLoading } = useGetWorkspaces()
    const filteredWorkspaces = workspaces?.filter(
        (workspace) => workspace._id !== workspaceId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-8 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl">
                    {isWorkspaceLoading ? (
                        <Loader className="size-4 animate-spin shrink-0" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase())}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem
                    key={workspaceId}
                    onClick={() => router.push(`/workspace/${workspaceId}`)}
                    className="flex-col justify-start items-start capitalize cursor-pointer">
                    {workspace?.name}
                    <span className="text-xs text-muted-foreground">
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {filteredWorkspaces?.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace._id}
                        onClick={() => router.push(`/workspace/${workspace._id}`)}
                        className="cursor-pointer capitalize overflow-hidden truncate"
                    >
                        <div className="size-8 relative overflow-hidden bg-[#616061] text-white font-semibold rounded-md flex items-center justify-center mr-2">
                            {workspace.name.charAt(0).toLocaleUpperCase()}
                        </div>
                        <p className="truncate">
                        {workspace.name}
                        </p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <div className="size-8 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold rounded-md flex items-center justify-center mr-2">
                        <Plus />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default WorkspaceSwitcher