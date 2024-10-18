import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from 'class-variance-authority';
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { cn } from "@/lib/utils";


const SidebarDetailItemVariants = cva(
    "flex items-center justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover: bd-white/90",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    },

);
interface SidebarDetailItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType
    variant?: VariantProps<typeof SidebarDetailItemVariants>["variant"];
};


const SidebarDetailItem = ({ label, id, icon:Icon, variant }: SidebarDetailItemProps) => {
    const workspaceId = useWorkspaceId()
    return (
        <Button
            asChild
            variant="transparent"
            size="sm"
            className={cn(SidebarDetailItemVariants({variant})) }
        >
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon className="size-3.5 mr-1 shrink-0" />
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}

export default SidebarDetailItem