import { useMemberId } from "@/hooks/use-member-id"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useGetMember } from "@/app/features/members/api/use-get-member";
import { useGetMessages } from "@/app/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import MessageList from "@/app/features/messages/components/message-list/message-list";

interface ConversationProps {
    id: Id<"conversations">
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading || status==="LoadingFirstPage") { 
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
  )
  }
  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => { }}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberName={member?.user.name}
        memberImage={member?.user.image}
        loadMore={loadMore}
        canLoadMore={status === "CanLoadMore"}
        isLoadingMore={status === "LoadingMore" }
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  )
}

export default Conversation