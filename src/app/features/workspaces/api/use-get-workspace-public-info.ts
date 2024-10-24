import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface GetWorkspaceProps { 
    id: Id<"workspaces">
}

export const useGetPublicInfoById = ({ id }:GetWorkspaceProps) => {
    const data = useQuery(api.workspaces.getPublicInfoById, { id });
    const isLoading = data === undefined;

    return {data, isLoading};
}