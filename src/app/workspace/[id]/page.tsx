"use client";

import { useCreateChannelModal } from "@/app/features/channels/store/use-create-channel-modal";
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member";
import { useGetCurrentWorkspaceChannels } from "@/app/features/workspaces/api/use-current-workspace-channels";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { AlertTriangle, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkspaceDetailPage = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const [open, setOpen] = useCreateChannelModal();
  const { data: currentMember, isLoading: currentMemberLoading } = useGetCurrentUserAsWorkspaceMember({ workspaceId });
  const { data: workspace, isLoading:workspaceLoading} = useGetWorkspace({id:workspaceId});
  const {data: channels, isLoading: channelLoading} = useGetCurrentWorkspaceChannels({workspaceId});

  const channelId = useMemo(()=> channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(()=> currentMember?.role === 'admin', [currentMember?.role])

  useEffect(()=>{
    if(workspaceLoading || channelLoading ||currentMemberLoading || !currentMember|| !workspace) {
      return
    };
    if(channelId){
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    }
    else if (!open && isAdmin){
      setOpen(true)
    }
  },[
    workspaceLoading,
    channelLoading,
    workspace,
    channelId,
    router,
    open,
    setOpen,
    currentMember,
    currentMemberLoading
  ])

  if(workspaceLoading || channelLoading){
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader 
          className="size-6 animate-spin text-muted-foreground"
        />
      </div>
    )
  }
  if(!workspace){
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <AlertTriangle 
          className="size-6 text-muted-foreground"
        />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    )    
  }
  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <AlertTriangle 
        className="size-6 text-muted-foreground"
      />
      <span className="text-sm text-muted-foreground">
        No channel found
      </span>
    </div>
  ) 
}

export default WorkspaceDetailPage