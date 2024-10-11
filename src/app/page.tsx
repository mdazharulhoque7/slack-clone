'use client';

import { useEffect, useMemo } from 'react';
import { UserButton } from './features/auth/components/user-button';
import { useGetWorkspaces } from './features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from './features/workspaces/store/use-create-workspace-modal';
import { useRouter } from 'next/navigation';
import { log } from 'console';


export default function Home() {
  const router = useRouter()
  const [open, setOpen] = useCreateWorkspaceModal()
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);
  // console.log('Workspace ID: ', workspaceId)

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router])

  return (
    <div className="flex flex-col items-center w-full h-full justify-center gap-y-5">
      <UserButton />
    </div>
  );
}
