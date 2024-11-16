import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useCreateMessage } from "@/app/features/messages/api/use-create-message"
import { useWorkspaceId } from "@/hooks/use-workspace_id"
import { useChannelId } from "@/hooks/use-channel_id"
import { toast } from "sonner"
import { useGenerateUploadURL } from "@/app/features/upload/api/use-generate-upload-url"
import { Id } from "../../../../../../convex/_generated/dataModel"

const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false })

interface ChatInputProps {
  placeholder: string
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate:generateUploadUrl} = useGenerateUploadURL()
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
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      
      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image:undefined
      }

      // Uploading image started
      if (image) { 
        const url = await generateUploadUrl({}, { throwError: true })
        if (!url) { 
          throw new Error("Unable to generate url");
        }
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image
        });

        if (!result.ok) { 
          throw new Error("Failed to upload image");
        }
        const { storageId } = await result.json();
        values.image = storageId;
      }
      // End of image upload
      await createMessage(values, { throwError: true })
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
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