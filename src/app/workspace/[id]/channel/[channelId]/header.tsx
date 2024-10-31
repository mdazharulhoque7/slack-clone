import { useRemoveChannel } from "@/app/features/channels/api/use-remove-channel"
import { useUpdateChannel } from "@/app/features/channels/api/use-update-channel"
import { useChannelId } from "@/hooks/use-channel_id"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import { TrashIcon } from "lucide-react"
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"
import { useWorkspaceId } from "@/hooks/use-workspace_id"
import { useRouter } from "next/navigation"
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member"

interface HeaderProps {
    title: string
}

const Header = ({ title }: HeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const [value, setValue] = useState(title);
    const [editOpen, setEditOpen] = useState(false)
    const { data: currentMember } = useGetCurrentUserAsWorkspaceMember({ workspaceId });
    const { mutate: updateChannel, isPending: isChannelUpdating } = useUpdateChannel()
    const { mutate: removeChannel, isPending: isChannelRemoving } = useRemoveChannel()
    const [ConfirmDialog, confirm] = useConfirm(
        "Remove this channel?",
        "You are about to remove this channel. This action is irreversible"
    )
    const handleEdit = (value: boolean) => {
        if (currentMember?.role === 'admin') {
            setEditOpen(value);
        }
    }
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }
    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateChannel(
            {
                id: channelId,
                name: value
            },
            {
                onSuccess: (data) => {
                    toast.success("Channel updated");
                    setEditOpen(false);
                },
                onError: () => {
                    toast.error("Failed to update channel");
                }
            })
    }
    const handleRemove = async () => {
        const ok = await confirm();
        if (!ok) return;
        removeChannel(
            {
                id: channelId
            },
            {
                onSuccess: () => {
                    toast.success("Channel removed");
                    router.push(`/workspace/${workspaceId}`);

                },
                onError: () => {
                    toast.error("Failed to remove channel");
                }
            })
    }

    return (
        <div className="flex h-[49px] bg-white border-b items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-lg w-auto px-2 font-semibold overflow-hidden"
                    >
                        <span className="truncate">
                            # {title}
                        </span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="bg-white p-4 border-b">
                        <DialogTitle># {title}</DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleEdit}>
                            <DialogTrigger asChild>
                                <div className="px-4 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>
                                        {currentMember?.role === 'admin' && (
                                            <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                                                Edit
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleUpdate}>
                                    <Input
                                        value={value}
                                        disabled={isChannelUpdating}
                                        onChange={handleNameChange}
                                        required
                                        autoFocus
                                        min={3}
                                        max={80}
                                        placeholder="e.g plan-budget"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isChannelUpdating}>Cancel</Button>
                                        </DialogClose>
                                        <Button disabled={isChannelUpdating}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {currentMember?.role === 'admin' && (
                            <button
                                className="flex items-center px-4 py-4 gap-x-2
                         bg-white rounded-lg cursor-pointer border
                          hover:bg-gray-50 text-rose-600"
                                onClick={handleRemove}
                                disabled={isChannelUpdating}
                            >
                                <TrashIcon className="size-4" />
                                <p className="text-sm font-semibold">
                                    Delete channel
                                </p>
                            </button>
                        )}

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header