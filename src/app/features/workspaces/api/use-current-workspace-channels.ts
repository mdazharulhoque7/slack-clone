import { useQueries, useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"

interface GetCurrentWorkspaceChannelsProps { 
    workspaceId: Id<"workspaces">
}

export const useGetCurrentWorkspaceChannels = ({ workspaceId }: GetCurrentWorkspaceChannelsProps) => {
    const data = useQuery(api.channels.get, { workspaceId })
    const isLoading = data === undefined;
    return {data, isLoading}
 }
