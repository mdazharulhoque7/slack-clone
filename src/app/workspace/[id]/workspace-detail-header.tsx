import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Doc } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { ChevronDown, ListFilter, SquarePen } from "lucide-react"
import { ToolTip } from "@/components/ui/custom/tooltip"

interface WorkspaceDetailHeaderProps{
    workspace : Doc<"workspaces">
    isAdmin: boolean
}

const WorkspaceDetailHeader = ({workspace, isAdmin}:WorkspaceDetailHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="transparent"
                size="sm"
                className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
                >
                    <span className="truncate">{workspace.name}</span>
                    <ChevronDown className="ml-1 size-4 shrink-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem
                className="cursor-pointer capitalize"
                >
                    <div className="bg-[#616061] text-white size-9 relative flex items-center justify-center rounded-md font-semibold text-xl mr-2">
                        {workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="font-bold">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground">Active Workspace</p>
                    </div>
                </DropdownMenuItem>
                {isAdmin && (
                <>
                    <DropdownMenuSeparator/>
                <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={()=>{}}
                >
                    Invite people to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                className="cursor-pointer py-2"
                onClick={()=>{}}
                >
                    Perferences
                </DropdownMenuItem>
                </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
        <div className="gap-0.5 flex items-center">
            <ToolTip label="Filter conversations" side="bottom">
            <Button variant="transparent" size='iconSm'>
                <ListFilter className="size-4"/>
            </Button>
            </ToolTip>
            <ToolTip label="New message" side="bottom">
            <Button variant="transparent" size='iconSm'>
                <SquarePen className="size-4"/>
            </Button>
            </ToolTip>
        </div>
    </div>
  )
}

export default WorkspaceDetailHeader