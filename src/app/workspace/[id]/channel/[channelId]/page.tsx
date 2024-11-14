"use client";

import { useGetChannel } from "@/app/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel_id";
import { AlertTriangle, Loader } from "lucide-react";
import Header from "./header";
import ChatInput from "./chat-input";
import { useGetMessages } from "@/app/features/messages/api/use-get-messages";
import MessageList from "@/app/features/messages/components/message-list/message-list";

const ChannelPage = () => {
  const channelId = useChannelId();
  const {results, status, loadMore} = useGetMessages({channelId})
  const {data:channel, isLoading: channelLoading} = useGetChannel({id:channelId});
  if(channelLoading || status === "LoadingFirstPage"){
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if(!channel){
    return (
      <div className="flex flex-1 flex-col gap-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          No channel found
        </span>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name}/>
      <MessageList 
      channelName={channel.name}
      channelCreationTime={channel._creationTime}
      data={results}
      loadMore={loadMore}
      isLoadingMore={status === "LoadingMore"}
      canLoadMore={status==="CanLoadMore"}

      />
      <ChatInput placeholder={`Message # ${channel.name}`}/>
      </div>
  )
}

export default ChannelPage