import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { useWorkspaceId } from '@/hooks/use-workspace_id';
import {useUpdateJoinCode} from "@/app/features/workspaces/api/use-update-join-code"
import { useConfirm } from '@/hooks/use-confirm';


interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    workspaceName: string,
    joinCode: string
}

const InviteModal = ({ open, setOpen, workspaceName, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const {mutate, isPending} = useUpdateJoinCode()
    const [ConfirmDialog, confim] = useConfirm(
        "Are you sure?",
        "This will deactivate the current invite code and generate a new one."
    );
    const handleGenerateCode = async ()=>{
        const ok = await confim();
        if(!ok) return;
        
        mutate({id:workspaceId}, {
            onSuccess() {
                toast.success("Invite code generated");
            },
            onError(){
                toast.error("failed to generate code!");
            }
        })
    }
    const handleCapy = ()=>{
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard
        .writeText(inviteLink)
        .then(()=> toast.success("Invite link copied to clipboard"));
    }
    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite people to {workspaceName}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Use the code below to invite people to your workspace
                </DialogDescription>
                <div className="flex flex-col items-center justify-center gap-y-4 py-10">
                    <p className="text-4xl font-bold tracking-widest uppercase">
                        {joinCode}
                    </p>
                    <Button variant="ghost" size="sm" onClick={handleCapy}>
                        Copy link
                        <CopyIcon className='size-4 ml-2' />
                    </Button>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Button variant="outline" disabled={isPending} onClick={handleGenerateCode}>
                        Generate Code
                        <RefreshCcw className='size-4 ml-2'/>
                    </Button>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        
        </>
    )
}


export default InviteModal