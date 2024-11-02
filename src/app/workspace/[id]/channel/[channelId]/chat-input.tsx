import { useRef } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useCreateMessage } from "@/app/features/messages/api/use-create-message"
import { useWorkspaceId } from "@/hooks/use-workspace_id"
import { useChannelId } from "@/hooks/use-channel_id"

const Editor = dynamic(()=> import ("@/components/editor/editor"),{ssr: false})

interface ChatInputProps {
  placeholder: string
}

const ChatInput = ({placeholder}:ChatInputProps) => {
  const editorRef = useRef<Quill|null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const {mutate: createMessage, isPending:createMessagePending} = useCreateMessage();

  const handleSubmit = (
    {body, 
      image
    }:
    {body:string, 
      image:File | null
    }
  )=>{
    console.log(body, image)
    createMessage({
      workspaceId,
      channelId,
      body
    })
  }
  return (
    <div className="px-5 w-full">
        <Editor 
        variant="create"
        onSubmit={handleSubmit}
        placeholder={placeholder}
        disabled={false}
        innerRef={editorRef}
        />
        </div>
  )
}

export default ChatInput