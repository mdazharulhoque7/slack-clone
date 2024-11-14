import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { ToolTip } from "../../../../../components/ui/custom/tooltip";
import EmojiPopover from "@/components/editor/emoji-popover";

interface ToolbarProps {
    isAuthor: boolean | undefined;
    isPending: boolean;
    hideThreadButton?: boolean;
    handleEdit: () => void;
    handleDelete: () => void;
    handleThread: () => void;
    handleReaction: (value: string) => void;
}


const Toolbar = ({
    isAuthor,
    isPending,
    hideThreadButton,
    handleEdit,
    handleDelete,
    handleThread,
    handleReaction
}: ToolbarProps) => {
    return (
        <div className="absolute top-1 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                <EmojiPopover
                    hint="Add reaction"
                    onEmojiSelect={(emoji) => handleReaction(emoji.native)}>

                    <Button
                        variant="ghost"
                        size="iconSm"
                        disabled={isPending}
                    >
                        <Smile className="size-4" />
                    </Button>
                </EmojiPopover>
                {!hideThreadButton && (

                    <ToolTip label="Replay in thread">

                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={isPending}
                            onClick={handleThread}
                        >
                            <MessageSquareTextIcon className="size-4" />
                        </Button>
                    </ToolTip>
                )}
                {isAuthor && (
                    <>
                        <ToolTip label="Edit message">

                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={isPending}
                                onClick={handleEdit}
                            >
                                <Pencil className="size-4" />
                            </Button>
                        </ToolTip>
                        <ToolTip label="Delete message">

                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={isPending}
                                onClick={handleDelete}
                            >
                                <Trash className="size-4" />
                            </Button>
                        </ToolTip>
                    </>
                )}
            </div>
        </div>
    )
}

export default Toolbar