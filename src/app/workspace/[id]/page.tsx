
"use client";

import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace_id";

const WorkspaceDetailPage = () => {
  const id = useWorkspaceId()
  const { data} = useGetWorkspace({id:id})
  return (
      <div>WorkspaceDetail: { JSON.stringify(data) }</div>
  )
}

export default WorkspaceDetailPage