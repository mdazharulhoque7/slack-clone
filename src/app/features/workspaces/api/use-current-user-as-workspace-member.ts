import { useQuery } from "convex/react"
import { Id } from "../../../../../convex/_generated/dataModel"
import { api } from "../../../../../convex/_generated/api"



interface CurrentUserAsWorkspaceMemberProps {
    workspaceId: Id<"workspaces">
}

export const useGetCurrentUserAsWorkspaceMember = ({workspaceId}:CurrentUserAsWorkspaceMemberProps)=>{
    const data = useQuery(api.workspaces.currentUserAsWorkspaceMember, {workspaceId});
    const isLoading = data === undefined;
    return {data, isLoading}
}