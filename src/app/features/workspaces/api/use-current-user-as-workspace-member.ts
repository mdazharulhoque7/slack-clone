import { useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"



interface useCurrentUserAsWorkspaceMemberProps {
    workspaceId: Id<"workspaces">
}

export const useGetCurrentUserAsWorkspaceMember = ({workspaceId}:useCurrentUserAsWorkspaceMemberProps)=>{
    const data = useQuery(api.workspaces.currentUserAsWorkspaceMember, {workspaceId});
    const isLoading = data === undefined;
    return {data, isLoading}
}