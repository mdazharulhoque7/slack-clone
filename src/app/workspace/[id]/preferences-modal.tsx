import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/app/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/app/features/workspaces/api/use-remove-workspace ";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { useConfirm } from "@/hooks/use-confirm";
import { time } from "console";
import { title } from "process";


interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
};

const PreferencesModal = ({
    open,
    setOpen,
    initialValue
}: PreferencesModalProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible.");
    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const handleRemove = async () => {
        const isConfirmed = await confirm();
        if (!isConfirmed) return;
        removeWorkspace({
            id: workspaceId,
        }, {
            onSuccess(data) {
                toast.success("Workspace removed");
                router.replace("/");
            },
            onError(error) {
                toast.error("Failed to remove workspace")
            },
            onSettled() {

            },
        })
    };

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateWorkspace({
            id: workspaceId,
            name: value
        }, {
            onSuccess(data) {
                toast.success("Workspace updated");
                setEditOpen(false)
            },
            onError(error) {
                toast.error("Failed to update workspace")
            },
            onSettled() {

            },
        })
    }
    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>
                        {value}
                    </DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>

                        <div className="text-sm px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                            <div className="font-semibold flex justify-between items-center">
                                <p>Workspace name</p>
                                <DialogTrigger asChild>

                                    <p className="text-[#1264a3] hover:underline">
                                        Edit
                                    </p>
                                </DialogTrigger>
                            </div>
                            <p>{value}</p>
                        </div>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Rename this workspace</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <Input
                                    value={value}
                                    disabled={isUpdatingWorkspace}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                    required
                                    autoFocus
                                    minLength={3}
                                    maxLength={80}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" disabled={isUpdatingWorkspace}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={isUpdatingWorkspace}>
                                        Save
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <button
                        className="flex gap-x-2 items-center bg-white rounded-lg border px-5 py-4 cursor-pointer hover:bg-gray-50 text-rose-600"
                        onClick={handleRemove}
                        disabled={isRemovingWorkspace}
                    >
                        <TrashIcon className="size-4" />
                        <p className="text-sm font-semibold">Delete workspace</p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default PreferencesModal