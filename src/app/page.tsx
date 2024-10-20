'use client';

import { useEffect, useMemo } from 'react';
import { UserButton } from './features/auth/components/user-button';
import { useGetWorkspaces } from './features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from './features/workspaces/store/use-create-workspace-modal';
import { useRouter } from 'next/navigation';
import { log } from 'console';
import { useCurrentUser } from './features/auth/api/use-current-user';


export default function Home() {
  const router = useRouter()
  const currentUser = useCurrentUser();
  const [open, setOpen] = useCreateWorkspaceModal()
  const { data, isLoading } = useGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);


  useEffect(() => {
    if (!currentUser) { 
      router.replace("/auth")
    }
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router, currentUser])

  return (
    <div className="flex flex-col items-center w-full h-full justify-center gap-y-5">
      <UserButton />
    </div>
  );
}
