import { json } from "stream/consumers";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import dynamic from "next/dynamic";

interface MessageProps{
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor?: boolean;
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
        count:number;
        memberIds: Id<"members">[];
    }>;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null)=> void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;

}

const Renderer = dynamic(()=>import("@/components/editor/renderer"), {ssr:false})

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
    }:MessageProps
) => {
  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover: bg-gray-100/60 group relative">
        <Renderer value={body} />
    </div>
  )
}

export default Message