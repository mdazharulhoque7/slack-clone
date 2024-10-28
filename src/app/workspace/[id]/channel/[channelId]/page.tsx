"use client";

import { useGetChannel } from "@/app/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel_id";
import { AlertTriangle, Loader } from "lucide-react";
import Header from "./header";

const ChannelPage = () => {
  const channelId = useChannelId();
  const {data:channel, isLoading: channelLoading} = useGetChannel({id:channelId});
  if(channelLoading){
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
      <Header title={channel.name} />
      </div>
  )
}

export default ChannelPage