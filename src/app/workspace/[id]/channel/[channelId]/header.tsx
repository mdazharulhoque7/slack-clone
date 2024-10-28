import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import { TrashIcon } from "lucide-react"
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"

interface HeaderProps {
    title: string
}

const Header = ({ title }: HeaderProps) => {
    const [value, setValue] = useState(title);
    const [editOpen, setEditOpen] = useState(false)
    return (
        <div className="flex h-[49px] bg-white border-b items-center px-4 overflow-hidden">
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
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-4 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>
                                        <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                                            Edit
                                        </p>
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4">
                                    <Input 
                                    value={value}
                                    disabled={false}
                                    onChange={()=>{}}
                                    required
                                    autoFocus
                                    min={3}
                                    max={80}
                                    placeholder="e.g plan-budget"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={false}>Cancel</Button>
                                        </DialogClose>
                                        <Button disabled={false}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button
                            className="flex items-center px-4 py-4 gap-x-2
                             bg-white rounded-lg cursor-pointer border
                              hover:bg-gray-50 text-rose-600"
                        >
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold">
                                Delete channel
                            </p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header