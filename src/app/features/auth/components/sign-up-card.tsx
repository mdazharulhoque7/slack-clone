'use client';

import { useState } from 'react';
import {FcGoogle} from 'react-icons/fc'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../types';
import { useAuthActions } from '@convex-dev/auth/react';
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from 'react-icons/md';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface SignUpProps {
    setState: (state:SignInFlow) => void;
}


export const SignUpCard = ({setState}:SignUpProps) => {
    const route = useRouter()
    const {signIn} = useAuthActions()
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")

    const onPasswordSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(password !== confirmpassword){
            setError('Passwords do not match');
            return;
        }
        setPending(true);
        signIn('password', {name, email, password, flow:'signUp'})
            .catch((e)=>{
                console.log(e);
                setError("Something went wrong !")
            })
            .then(()=>{
                route.push('/')
              })
            .finally(()=>setPending(false))
    };
    const signUpProvider = (value: 'github' | 'google') => {
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
                Sign up to continue
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
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                    placeholder="Full Name"
                    type="text"
                    required
                    />
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
                    <Input
                    disabled={pending}
                    value={confirmpassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    placeholder="Confirm Password"
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
                    onClick={(e)=>{signUpProvider('google')}}
                    >
                        <FcGoogle className='size-5 absolute left-2.5 top-2.5'/>
                        Continue with Google
                    </Button>
                    <Button 
                    disabled={pending}
                    variant="outline"
                    size="lg"
                    className="w-full relative"
                    onClick={(e)=>{signUpProvider('github')}}
                    >
                        <FaGithub className='size-5 absolute left-2.5 top-2.5'/>
                        Continue with Github
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Already an account? 
                    <span 
                        onClick={()=>{setState('signIn')}}
                        className="text-sky-700 hover:underline cursor-pointer">Sign in</span>
                </p>
            </CardContent>
        </Card>
    );
};