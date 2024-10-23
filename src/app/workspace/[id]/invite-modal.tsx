import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { useWorkspaceId } from '@/hooks/use-workspace_id';
import { CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    workspaceName: string,
    joinCode: string
}

const InviteModal = ({ open, setOpen, workspaceName, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const handleCapy = ()=>{
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard
        .writeText(inviteLink)
        .then(()=> toast.success("Invite link copied to clipboard"));
    }
    return (
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
            </DialogContent>
        </Dialog>
    )
}


export default InviteModal