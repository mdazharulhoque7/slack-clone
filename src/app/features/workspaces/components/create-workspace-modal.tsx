'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"


export const CreateWorkspaceModal = ()=>{
    const [open, setOpen] = useCreateWorkspaceModal();

    const handleClose = ()=> {
        setOpen(false);
        // TODO: Clear Form
    }

    return (
        <Dialog onOpenChange={handleClose} open={open}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a workspace</DialogTitle>
            </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}