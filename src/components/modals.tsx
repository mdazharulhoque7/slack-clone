"use client";

import { useEffect, useState } from 'react';
import { CreateWorkspaceModal } from '@/app/features/workspaces/components/create-workspace-modal';

const Modals = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { 
    setMounted(true);
  }, [])

  if (!mounted) return null;

  return (
    <>
      <CreateWorkspaceModal/>
    </>
  )
}

export default Modals