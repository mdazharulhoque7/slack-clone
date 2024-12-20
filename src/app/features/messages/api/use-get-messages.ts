import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";


const BATCH_SIZE = 10;

interface UseGetMessagesProps {
    channelId?: Id<"channels">;
    conversationId?: Id<"conversations">;
    parentId?: Id<"messages">;
}

export type GetMessagesReturnType = typeof api.messages.get._returnType["page"];

export const useGetMessages = (
    {
        channelId,
        conversationId,
        parentId
    }:UseGetMessagesProps
)=>{
    const {results, status, loadMore} = usePaginatedQuery(
        api.messages.get,
        {channelId, conversationId, parentId},
        {initialNumItems:BATCH_SIZE},
    )

    return {
        results,
        status,
        loadMore: ()=> loadMore(BATCH_SIZE)
    }
}