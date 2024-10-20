import { useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"



interface CurrentWorkspaceMemberProps {
    workspaceId: Id<"workspaces">
}

export const useGetCurrentWorkspaceMembers = ({workspaceId}:CurrentWorkspaceMemberProps)=>{
    const data = useQuery(api.members.get, {workspaceId});
    const isLoading = data === undefined;
    return {data, isLoading}
}