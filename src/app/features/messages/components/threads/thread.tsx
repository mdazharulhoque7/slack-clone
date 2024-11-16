import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../convex/_generated/dataModel"
import { AlertTriangleIcon, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../../api/use-get-message";
import Message from "../message-list/message";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member";
import { useState } from "react";

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useGetCurrentUserAsWorkspaceMember({ workspaceId: workspaceId });    
    const { data: message, isLoading: messageLoading } = useGetMessage({ id: messageId })

    // If data is loading
    if (messageLoading) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">
                        Thread
                    </p>
                    <Button variant="ghost" size="iconSm" onClick={onClose}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>

                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )

    }
    // If data is loading
    if (!message) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold">
                        Thread
                    </p>
                    <Button variant="ghost" size="iconSm" onClick={onClose}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>

                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangleIcon className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muter-foreground">
                        Message not found
                    </p>
                </div>
            </div>
        )

    }
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">
                    Thread
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <div>
                <Message
                    hideThreadButton
                    id={message._id}
                    body={message.body}
                    image={message.image}
                    reactions={message.reactions}
                    memberId={message.memberId}
                    isAuthor={message.memberId === currentMember?._id}
                    authorName={message.user.name}
                    authorImage={message.user.image}
                    createdAt={message._creationTime}
                    updatedAt={message.updatedAt}
                    isEditing={editingId === message._id}
                    setEditingId={setEditingId}
                />
            </div>
        </div>
    )
}

export default Thread