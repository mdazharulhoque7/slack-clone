import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { Id } from "../../../../convex/_generated/dataModel";

const WorkspaceMemberItemVariants = cva(
    "flex items-center justify-start font-normal h-7 px-4 text-sm overflow-hidden",
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


interface WorkspaceMemberItemProps { 
    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof WorkspaceMemberItemVariants>["variant"];
}

const WorkspaceMemberItem = ({
    id,
    label,
    image,
    variant }: WorkspaceMemberItemProps) => {
    const workspaceId = useWorkspaceId()
  return (
    <Button
    variant="transparent"
    className={cn(WorkspaceMemberItemVariants({variant:variant}))}
    size="sm"
    asChild
    >
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
            <Avatar className="size-5 rounded-md mr-2">
                <AvatarImage className="rounded-md" src={image} />
                <AvatarFallback className="bg-sky-500 text-white rounded-md text-xs">
                    {label?.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm truncate">{label}</span>
        </Link>
    </Button>
  )
}

export default WorkspaceMemberItem