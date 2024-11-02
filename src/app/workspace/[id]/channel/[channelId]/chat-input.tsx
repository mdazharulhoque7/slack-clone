import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useCreateMessage } from "@/app/features/messages/api/use-create-message"
import { useWorkspaceId } from "@/hooks/use-workspace_id"
import { useChannelId } from "@/hooks/use-channel_id"
import { toast } from "sonner"

const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage, isPending: createMessagePending } = useCreateMessage();

  const handleSubmit = async (
    { body,
      image
    }:
      {
        body: string,
        image: File | null
      }
  ) => {
    console.log(body, image);
    try {
      setIsPending(true);
      await createMessage({
        workspaceId,
        channelId,
        body
      }, { throwError: true })
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
    }
  }
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  )
}

export default ChatInput