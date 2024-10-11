'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const CreateWorkspaceModal = () => {
    const router = useRouter()
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState("")

    const { mutate, isPending } = useCreateWorkspace()

    const handleClose = () => {
        setOpen(false);
        // TODO: Clear Form
    }

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault()
        mutate({ name: name }, {
            onSuccess(id) {
                router.push(`/workspace/${id}`)
                handleClose()
            },
        })
    }

    return (
        <Dialog onOpenChange={handleClose} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form action="" className="space-y-4" onSubmit={handleForm}>
                    <Input
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    />
                    <div className="flex justify-end">

                        <Button disabled={isPending}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}