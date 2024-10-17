import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

interface SidebarDetailItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType
}

const SidebarDetailItem = ({ label, id, icon:Icon }: SidebarDetailItemProps) => {
    const workspaceId = useWorkspaceId()
    return (
        <Button asChild variant="transparent" size="sm">
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon />
                <span>{label}</span>
            </Link>
        </Button>
    )
}

export default SidebarDetailItem