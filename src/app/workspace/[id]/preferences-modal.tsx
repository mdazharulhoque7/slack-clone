import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateWorkspace } from "@/app/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/app/features/workspaces/api/use-remove-workspace ";


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
    const [value, setValue] = useState(initialValue)
    const {mutate: updateWorkspace, isPending: isUpdatingWorkspace} = useUpdateWorkspace();
    const {mutate: removeWorkspace, isPending: isRemovingWorkspace} = useRemoveWorkspace();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>
                        {value}
                    </DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <div className="text-sm px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                        <div className="font-semibold flex justify-between items-center">

                        <p>Workspace name</p>
                        <p className="text-[#1264a3] hover:underline">Edit</p>
                        </div>
                        <p>{value}</p>
                    </div>
                    <button 
                    className="flex gap-x-2 items-center bg-white rounded-lg border px-5 py-4 cursor-pointer hover:bg-gray-50 text-rose-600"
                    >
                        <TrashIcon className="size-4" />
                        <p className="text-sm font-semibold">Delete workspace</p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PreferencesModal