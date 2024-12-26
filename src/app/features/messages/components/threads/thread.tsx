import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { AlertTriangleIcon, Loader, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useGetMessage } from "../../api/use-get-message";
import Message from "../message-list/message";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member";
import { useChannelId } from "@/hooks/use-channel_id";
import { useGenerateUploadURL } from "@/app/features/upload/api/use-generate-upload-url";
import { useCreateMessage } from "../../api/use-create-message";
import { toast } from "sonner";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useGetMessages } from "../../api/use-get-messages";

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentId: Id<"messages">;
    body: string;
    image?: Id<"_storage"> | undefined;
}


const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
}

const TIME_THRESHOLD = 5;

const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false })

const Thread = ({ messageId, onClose }: ThreadProps) => {
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);
    const editorRef = useRef<Quill | null>(null);
    const { mutate: generateUploadUrl } = useGenerateUploadURL()
    const { mutate: createMessage, isPending: createMessagePending } = useCreateMessage();
    const { results, status, loadMore } = useGetMessages({ channelId, parentId: messageId });
    const { data: currentMember } = useGetCurrentUserAsWorkspaceMember({ workspaceId: workspaceId });
    const { data: message, isLoading: messageLoading } = useGetMessage({ id: messageId });

    const isLoadingMore = status === "LoadingMore"
    const canLoadMore = status === "CanLoadMore"

    const groupedMessages = results?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "yyyy-MM-dd");
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].unshift(message);
            return groups;
        },
        {} as Record<string, typeof results>
    )

    const handleSubmit = async (
        { body,
            image
        }:
            {
                body: string,
                image: File | null
            }
    ) => {
        try {
            setIsPending(true);
            editorRef.current?.enable(false);


            const values: CreateMessageValues = {
                channelId,
                workspaceId,
                parentId: messageId,
                body,
                image: undefined
            }

            // Uploading image started
            if (image) {
                const url = await generateUploadUrl({}, { throwError: true })
                if (!url) {
                    throw new Error("Unable to generate url");
                }
                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": image.type },
                    body: image
                });

                if (!result.ok) {
                    throw new Error("Failed to upload image");
                }
                const { storageId } = await result.json();
                values.image = storageId;
            }
            // End of image upload
            await createMessage(values, { throwError: true })
            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            editorRef.current?.enable(true);
        }
    }

    // If data is loading
    if (messageLoading || status === "LoadingFirstPage") {
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
            <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto message-scrollbar">
                {Object.entries(groupedMessages || {}).map(([datekey, messages]) => (
                    <div>
                        <div className="text-center my-2 relative">
                            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 shadow-sm">
                                {formatDateLabel(datekey)}
                            </span>
                        </div>
                        {messages.map((message, index) => {
                            const prevMessage = messages[index - 1];
                            const isCompact = prevMessage &&
                                prevMessage.user._id === message.user._id &&
                                differenceInMinutes(
                                    new Date(message._creationTime),
                                    new Date(prevMessage._creationTime)
                                ) < TIME_THRESHOLD
                            return (
                                <Message
                                    key={message._id}
                                    id={message._id}
                                    memberId={message.memberId}
                                    authorName={message.user.name}
                                    authorImage={message.user.image}
                                    isAuthor={message.memberId === currentMember?._id}
                                    reactions={message.reactions}
                                    body={message.body}
                                    image={message.image}
                                    updatedAt={message.updatedAt}
                                    createdAt={message._creationTime}
                                    isEditing={message._id === editingId}
                                    isCompact={isCompact}
                                    setEditingId={setEditingId}
                                    hideThreadButton
                                    threadCount={message.threadCount}
                                    threadImage={message.threadImage}
                                    threadTimestamp={message.threadTimestamp}
                                />
                            )
                        })}
                    </div>
                ))}
                {/* Load More messages */}
                <div className="h-1"
                    ref={(el) => {
                        if (el) {
                            const observer = new IntersectionObserver(
                                // Callback
                                ([entry]) => {
                                    if (entry.isIntersecting && canLoadMore) {
                                        loadMore();
                                    }
                                },
                                // Options
                                { threshold: 1.0 }
                            );
                            observer.observe(el);
                            return () => observer.disconnect();
                        }
                    }}
                />
                {isLoadingMore && (
                    <div className="text-center my-2 relative">
                        <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                        <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border-gray-300 shadow-sm">
                            <Loader className="size-4 animate-spin" />
                        </span>
                    </div>
                )}
                <Message
                    hideThreadButton
                    key={message._id}
                    id={message._id}
                    memberId={message.memberId}
                    authorName={message.user.name}
                    authorImage={message.user.image}
                    isAuthor={message.memberId === currentMember?._id}
                    reactions={message.reactions}
                    body={message.body}
                    image={message.image}
                    updatedAt={message.updatedAt}
                    createdAt={message._creationTime}
                    isEditing={message._id === editingId}
                    setEditingId={setEditingId}

                />
            </div>
            <div className="px-4">
                <Editor
                    key={editorKey}
                    innerRef={editorRef}
                    onSubmit={handleSubmit}
                    disabled={isPending}
                    placeholder="Replay..."
                />
            </div>
        </div>
    )
}

export default Thread