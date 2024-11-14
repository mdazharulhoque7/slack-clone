import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../convex/_generated/dataModel"
import { XIcon } from "lucide-react";

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold">
                    Thread
                </p>
                <Button variant="ghost" size="iconSm" onClick={onClose}>
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
        </div>
    )
}

export default Thread