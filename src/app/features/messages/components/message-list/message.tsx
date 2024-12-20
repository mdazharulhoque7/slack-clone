import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns"
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { ToolTip } from "../../../../../components/ui/custom/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";
import Thumbnail from "./thumbnail";
import Toolbar from "./toolbar";
import { useUpdateMessage } from "@/app/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/app/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/app/features/reactions/api/use-toggle-reaction";
import Reactions from "./reactions";
import { usePanel } from "@/hooks/use-panel";

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor?: boolean;
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[];
    }>;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;

};

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

const Renderer = dynamic(() => import("@/components/editor/renderer"), { ssr: false })
const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false })

const Message = (
    {
        id,
        memberId,
        authorName = "Member",
        authorImage,
        isAuthor,
        reactions,
        body,
        image,
        createdAt,
        updatedAt,
        isEditing,
        isCompact,
        setEditingId,
        hideThreadButton,
        threadCount,
        threadImage,
        threadTimestamp
    }: MessageProps
) => {

    const avatarFallback = authorName.charAt(0).toUpperCase();
    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete message?",
        "Are you sure you want to delete this message? This can't be undone."
    )
    const {mutate: toggleReaction, isPending:isToggleReaction} = useToggleReaction()

    const isPending = isUpdatingMessage;

    const { parentMessageId, onOpenMessage, onClose} = usePanel()

    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;
        removeMessage({ id }, {
            onSuccess: () => {
                toast.success("Message deleted");
                // Close thread if opened
                if (parentMessageId === id) { 
                    onClose();
                }

            },
            onError: () => {
                toast.error("Failed to delete message");
            }
        })
    }

    const handleReaction = (value:string)=>{
        toggleReaction({
            messageId:id,
            value: value
        },{
            onError:()=>{
                toast.error("Failed to send reaction!")
            }
        });
    }

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ id, body }, {
            onSuccess: () => {
                toast.success("Message updated");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message")
            }
        })
    }

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}>
                    <div className="flex items-start gap-2">
                        <ToolTip label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 
                                        group-hover:opacity-100 w-[40px] leading-[22px] 
                                        text-center hover:underline"
                            >
                                {format(createdAt, "hh:mm")}
                            </button>
                        </ToolTip>
                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    variant="update"
                                    onSubmit={handleUpdate}
                                    onCancel={() => setEditingId(null)}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">
                                        (edited)
                                    </span>
                                ) : null}
                                <Reactions data={reactions} onChange={handleReaction} />
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            hideThreadButton={hideThreadButton}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => { onOpenMessage(id)}}
                            handleReaction={handleReaction}
                            handleDelete={handleRemove}
                        />
                    )}
                </div>
            </>
        )
    }

    return (
        <>
            <ConfirmDialog />
            <div className={cn(
                "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
            )}>
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar className="size-9 rounded-md mr-1">
                            <AvatarImage className="rounded-md" src={authorImage} />
                            <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                variant="update"
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingId(null)}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                            />
                        </div>
                    ) : (

                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-xs">
                                <button onClick={() => { }} className="font-bold test-primary hover:underline">
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <ToolTip label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "h:mm a")}
                                    </button>
                                </ToolTip>
                            </div>
                            <Renderer value={body} />
                            <Thumbnail url={image} />
                            {updatedAt ? (
                                <span className="text-sm text-muted-foreground">
                                    (edited)
                                </span>
                            ) : null}
                            <Reactions data={reactions} onChange={handleReaction} />

                        </div>
                    )}
                </div>
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        hideThreadButton={hideThreadButton}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => { onOpenMessage(id)}}
                        handleReaction={handleReaction}
                        handleDelete={handleRemove}
                    />
                )}
            </div>
        </>
    )
}

export default Message