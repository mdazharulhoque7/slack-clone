import { useRemoveChannel } from "@/app/features/channels/api/use-remove-channel"
import { useUpdateChannel } from "@/app/features/channels/api/use-update-channel"
import { useGetCurrentUserAsWorkspaceMember } from "@/app/features/workspaces/api/use-current-user-as-workspace-member"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useChannelId } from "@/hooks/use-channel_id"
import { useConfirm } from "@/hooks/use-confirm"
import { useWorkspaceId } from "@/hooks/use-workspace_id"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa"
import { toast } from "sonner"

interface HeaderProps {
    memberName?: string
    memberImage?: string
    onClick?: ()=> void
}

const Header = ({ 
    memberImage,
    memberName,
    onClick
 }: HeaderProps) => {
    const avaterFallback = memberName?.charAt(0).toUpperCase();

    return (
        <div className="flex h-[49px] bg-white border-b items-center px-4 overflow-hidden">
            <Button
                variant="ghost"
                size="sm"
                className="text-lg font-semibold px-2 overflow-hidden w-auto"
                onClick={onClick}
            >
                <Avatar className="size-6 mr-2 rounded-md">
                    <AvatarImage src={memberImage } className="rounded-md" />
                    <AvatarFallback className="bg-sky-500 text-white rounded-md">
                        { avaterFallback }
                    </AvatarFallback>
                </Avatar>
                <span className="truncate">{memberName}</span>
                <FaChevronDown className="size-2.5 ml-2"/>
            </Button>
        </div>
    )
}

export default Header