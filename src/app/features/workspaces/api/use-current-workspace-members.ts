import { useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"



interface CurrentWorkspaceMemberProps {
    workspaceId: Id<"workspaces">
}

export const useGetCurrentWorkspaceMembers = ({workspaceId}:CurrentWorkspaceMemberProps)=>{
    const data = useQuery(api.workspaces.workspaceMembers, {workspaceId});
    const isLoading = data === undefined;
    return {data, isLoading}
}