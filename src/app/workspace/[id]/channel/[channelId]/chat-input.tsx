import { useRef } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"

const Editor = dynamic(()=> import ("@/components/editor/editor"),{ssr: false})

interface ChatInputProps {
  placeholder: string
}

const ChatInput = ({placeholder}:ChatInputProps) => {
  const editorRef = useRef<Quill|null>(null);

  const handleSubmit = (
    {body, 
      image
    }:
    {body:string, 
      image:File | null
    }
  )=>{
    console.log(body, image)
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