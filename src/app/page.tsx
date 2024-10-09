'use client';

import { useRouter } from 'next/navigation'
import {useAuthActions} from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button";
import { nextjsMiddlewareRedirect } from '@convex-dev/auth/nextjs/server';


export default function Home() {
  const route = useRouter()
  const {signOut} = useAuthActions()
const handleSignOut = ()=>{
  signOut().then(()=>{
    route.push('/auth')
  })

}
  return (
    <div className="flex flex-col items-center w-full h-full justify-center gap-y-5">
        <p>
        You are logged in!
      </p>
      <Button variant={"destructive"} onClick={()=>handleSignOut()}
      >
        Sign Out
        </Button>
    </div>
  );
}
