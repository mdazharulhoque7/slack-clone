import { differenceInMinutes, format, isToday, isYesterday } from "date-fns"
import { GetMessagesReturnType } from "@/app/features/messages/api/use-get-messages";
import Message from "./message";
import ChannelHero from "./channel-hero";
import { useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetCurrentWorkspaceMembers } from "@/app/features/workspaces/api/use-current-workspace-members";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member";
import { Loader } from "lucide-react";

interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    channelName?: string;
    channelCreationTime?: number;
    variant?: "channel" | "thread" | "conversation";
    data: GetMessagesReturnType | undefined;
    loadMore: () => void;
    isLoadingMore: boolean;
    canLoadMore: boolean;
};

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM d");
}

const TIME_THRESHOLD = 5;
const MessageList = ({
    memberName,
    memberImage,
    channelName,
    channelCreationTime,
    variant = "channel",
    data,
    loadMore,
    isLoadingMore,
    canLoadMore
}: MessageListProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useGetCurrentUserAsWorkspaceMember({ workspaceId: workspaceId });

    const groupedMessages = data?.reduce(
        (groups, message) => {
            const date = new Date(message._creationTime);
            const dateKey = format(date, "yyyy-MM-dd");
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].unshift(message);
            return groups;
        },
        {} as Record<string, typeof data>
    )
    return (
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
                                hideThreadButton={variant === "thread"}
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
            {/* Render channel hero */}
            {variant === 'channel' && channelName && channelCreationTime && (
                <ChannelHero name={channelName} creationTime={channelCreationTime} />
            )}
        </div>
    )
}

export default MessageList