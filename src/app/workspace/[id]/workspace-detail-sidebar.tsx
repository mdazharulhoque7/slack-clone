import { useGetCurrentUserAsWorkspaceMember } from '@/app/features/workspaces/api/use-current-user-as-workspace-member';
import { useGetWorkspace } from '@/app/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace_id';
import { Loader, Triangle } from 'lucide-react';
import WorkspaceDetailHeader from './workspace-detail-header';

const WorkspaceDetailSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: memberData, isLoading: memberLoading } = useGetCurrentUserAsWorkspaceMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

  if(workspaceLoading || memberLoading){
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className='size-5 animate-spin text-white' />
      </div>
    )
  }
  if(!workspace || !memberData){
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Triangle className='size-5 text-white' />
        <p className="text-white text-sm">
          Workspace not found.
        </p>
      </div>
    )
  }
  return (
    <div className='flex flex-col h-full'>
      <WorkspaceDetailHeader workspace={workspace} isAdmin={memberData.role === 'admin'} />
      </div>
  )
}

export default WorkspaceDetailSidebar