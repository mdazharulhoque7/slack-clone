import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { Info, Search } from "lucide-react";

const Toolbar = () => {
    const workspaceId = useWorkspaceId()
    const { data } = useGetWorkspace({id:workspaceId})


    return (
        <nav className="bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1"></div>
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button size="sm" className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
                    <Search className="size-4 text-white mr-2" />
                    <span className="text-white text-xs">Search { data?.name }</span>
                </Button>

            </div>
            <div className="flex flex-1 justify-end items-center ml-auto">
                <Button variant="transparent" size="iconSm">
                    <Info className="text-white size-5" />
                </Button>
            </div>
        </nav>
    );
}

export default Toolbar;
