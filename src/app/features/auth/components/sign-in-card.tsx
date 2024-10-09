'use client';

import { useState } from 'react';
import {FcGoogle} from 'react-icons/fc'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../types';
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface SignInProps {
    setState: (state:SignInFlow) => void;
}


export const SignInCard = ({setState}:SignInProps) => {
    const route = useRouter()
    const {signIn} = useAuthActions()
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const onPasswordSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        signIn('password', {email, password, flow:'signIn'})
        .then(()=>{
            route.push('/')
          })
            .catch(()=>{
                setError("Invalid email or password !")
            })
            .finally(()=>setPending(false))
    };
    const signInProvider = (value: 'github' | 'google') => {
        setPending(true);
        signIn(value)
        .then(()=>{
            route.push('/')
          })
        .finally(()=> setPending(false))
    };

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                Login to continue
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center justify-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className='size-4' />
                    <p>{error}</p>

                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={onPasswordSubmit}>
                <Input
                    disabled={pending}
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    placeholder="Email"
                    type="email"
                    required
                    />
                    <Input
                    disabled={pending}
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}                    
                    placeholder="Password"
                    type="password"
                    required
                    />
                    <Button className="w-full" size="lg" disabled={pending}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="f-full flex flex-col gap-y-2.5">
                    <Button 
                    disabled={pending}
                    variant="outline"
                    size="lg"
                    className="w-full relative"
                    onClick={(e)=>{signInProvider('google')}}
                    >
                        <FcGoogle className='size-5 absolute left-2.5 top-2.5'/>
                        Continue with Google
                    </Button>
                    <Button 
                    disabled={pending}
                    variant="outline"
                    size="lg"
                    className="w-full relative"
                    onClick={(e)=>{signInProvider('github')}}
                    >
                        <FaGithub className='size-5 absolute left-2.5 top-2.5'/>
                        Continue with Github
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account? 
                    <span 
                        onClick={()=>{setState('signUp')}}
                        className="text-sky-700 hover:underline cursor-pointer">Sign up</span>
                </p>
            </CardContent>
        </Card>
    );
};