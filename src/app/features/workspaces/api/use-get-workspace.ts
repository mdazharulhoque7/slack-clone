import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface GetWorkspaceProps { 
    id: Id<"workspaces">
}

export const useGetWorkspace = ({ id }:GetWorkspaceProps) => {
    const data = useQuery(api.workspaces.getById, { id });
    // console.log("Unauthorized:", data)
    const isLoading = data === undefined;

    return {data, isLoading};
}