import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member";
import { cn } from "@/lib/utils";
import { ToolTip } from "../../../../../components/ui/custom/tooltip";
import EmojiPopover from "@/components/editor/emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";


interface ReactionProps {
    data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
        count: number,
        memberIds: Id<"members">[]
    }
    >;
    onChange: (value:string)=>void
}

const Reactions = ({
    data,
    onChange
}:ReactionProps) => {
    const workspaceId = useWorkspaceId()
    const {data: currentMember} = useGetCurrentUserAsWorkspaceMember({workspaceId:workspaceId});    
    const currentMemberId = currentMember?._id;

    if(data.length === 0 || !currentMemberId){
        return null;
    }
  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
        {data.map((reaction)=>(
            <ToolTip key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? "person":"people"} reacted with ${reaction.value}`}>
            <button
            className={cn(
                "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1",
                reaction.memberIds.includes(currentMemberId) && "bg-blue-100/10 border-blue-500 test-white"
            )}
            onClick={()=>{onChange(reaction.value)}}
            >
                {reaction.value}
                <span
                className={cn(
                    "text-sm font-semibold text-muted-foreground",
                    reaction.memberIds.includes(currentMemberId) && "text-blue-500"
                )}
                >
                    {reaction.count}
                </span>
            </button>
            </ToolTip>
        ))}
        <EmojiPopover 
            hint="Add reaction"
            onEmojiSelect={(emoji)=>onChange(emoji.native)}
            >
                <button className="flex items-center gap-x-1 h-7 px-3 rounded-full bg-slate-200/70 text-slate-800 border border-transparent hover:border-slate-500">
                    <MdOutlineAddReaction className="size-4"/>
                </button>
        </EmojiPopover>
    </div>
  )
}

export default Reactions