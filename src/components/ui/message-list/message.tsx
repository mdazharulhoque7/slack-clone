import dynamic from "next/dynamic";
import { format, isToday, isYesterday } from "date-fns"
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { ToolTip } from "../custom/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import Thumbnail from "./thumbnail";

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

    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <ToolTip label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 
                                        group-hover:opacity-100 w-[40px] leading-[22px] 
                                        text-center hover:underline"
                        >
                            {format(createdAt, "hh:mm")}
                        </button>
                    </ToolTip>
                <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                    <span className="text-xs text-muted-foreground">
                        (edited)
                    </span>
                ):null}
                </div>    
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <button>
                    <Avatar className="size-9 rounded-md mr-1">
                        <AvatarImage className="rounded-md" src={authorImage} />
                        <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </button>
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
                    
                </div>
            </div>
        </div>
    )
}

export default Message