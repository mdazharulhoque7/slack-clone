"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { Doc, Id } from "../../../../../../convex/_generated/dataModel";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace_id";
import { useCreateOrGetConversation } from "@/app/features/conversations/api/use-create-or-get-conversation";
import Conversation from "./conversation";

const memberIdPage = () => {

  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();
  const {mutate, isPending} = useCreateOrGetConversation();
  const [conversationId, setConversationId] = useState<Id<"conversations"> |null>(null)

  useEffect(() => {
    mutate({
      workspaceId,
      memberId
    },{
      onSuccess(data) {
        setConversationId(data)
      },
      onError(){
        toast.error("Failed to create or get conversation")
      }
    })
  }, [workspaceId, memberId, mutate])
  
  if(isPending){
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if(!conversationId){
    return (
      <div className="h-full flex items-center justify-center">
        <AlertTriangle className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found.
        </span>
      </div>
    )
  }
  return (
    <Conversation id={conversationId}/>
  )
}

export default memberIdPage