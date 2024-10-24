"use client"

import { useGetPublicInfoById } from '@/app/features/workspaces/api/use-get-workspace-public-info'
import { Button } from '@/components/ui/button'
import { useWorkspaceId } from '@/hooks/use-workspace_id'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import VerificationInput from 'react-verification-input'
import { Id } from '../../../../convex/_generated/dataModel'
import { useJoinWorkspaceMember } from '@/app/features/workspaces/api/use-join-workspace-member'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useEffect, useMemo } from 'react'


const JoinPage = () => {
    const params = useParams();
    const router = useRouter()
    const workspaceId = params.workspaceId as Id<'workspaces'>;
    const {data, isLoading} = useGetPublicInfoById({id: workspaceId});
    const {mutate, isPending} = useJoinWorkspaceMember()
    const isMember = useMemo(()=>data?.isMember, [data?.isMember]);
    useEffect(()=>{
        if(isMember){
            router.replace(`/workspace/${workspaceId}`)
        }
    },
    [isMember, router, workspaceId])

    const handleComplete = (value:string)=>{
    
        mutate({workspaceId, joinCode:value},{
            // throwError : true,
            onSuccess(data) {
                if(!data){
                    toast.error("Unauthorized!")
                }else{
                    toast.success("Joined successfully");
                    router.replace(`/workspace/${workspaceId}`)
                }

            },
            onError() {
                if(data?.isMember){
                    toast.error("Your are aleary a member of this workspace")    
                }else{

                    toast.error("Invalid join code")
                }
            },
        })
    }

    if(isLoading){
        return(

            <div className='h-full flex items-center justify-center'>
            <Loader className='size-6 animate-spin text-muted-foreground'/>
        </div>
        )
    }
    return (
        <div className='flex h-full flex-col items-center justify-center bg-white gap-y-8 p-8 shadow-md'>
            <Image src="/logo/slack_logo_2019.svg" alt="logo" width={60} height={60} />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className='flex flex-col gap-y-2 items-center justify-center'>
                    <h1 className="text-2xl font-bold">
                        Join {data?.name}
                    </h1>
                    <p className="text-md text-muted-foreground">
                        Enter the workspace join code
                    </p>
                </div>
                <VerificationInput classNames={{
                    container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                    character: "flex items-center justify-center uppercase h-auto rounded-md border border-gray-300 text-lg font-medium text-gray-500",
                    characterInactive: "text-muted",
                    characterSelected: "bg-white text-black",
                    characterFilled: "bg-white text-black"
                }}
                    autoFocus
                    onComplete={handleComplete}
                />
            </div>
            <div className="flex gap-x-4">
                <Button
                size="lg"
                variant="outline"
                asChild
                >
                    <Link href="/">Back to home</Link>
                </Button>
            </div>
        </div>
    )
}

export default JoinPage