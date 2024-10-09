'use client';

import { redirect } from 'next/navigation'
import {useAuthActions} from "@convex-dev/auth/react"
import { Button } from "@/components/ui/button";


export default function Home() {
  const {signOut} = useAuthActions()
const handleSignOut = ()=>{
  signOut()
  // redirect('/auth')

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
