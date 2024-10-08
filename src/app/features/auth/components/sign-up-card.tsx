'use client';

import { useState } from 'react';
import {FcGoogle} from 'react-icons/fc'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../types';


interface SignUpProps {
    setState: (state:SignInFlow) => void;
}


export const SignUpCard = ({setState}:SignUpProps) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                Sign up to continue
            <CardDescription>
                Use your email or another service to continue
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input
                    disabled={false}
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    placeholder="Email"
                    type="email"
                    required
                    />
                    <Input
                    disabled={false}
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}                    
                    placeholder="Password"
                    type="password"
                    required
                    />
                    <Input
                    disabled={false}
                    value={confirmpassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    placeholder="Confirm Password"
                    type="password"
                    required
                    />
                    <Button className="w-full" size="lg" disabled={false}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="f-full flex flex-col gap-y-2.5">
                    <Button 
                    disabled={false}
                    variant="outline"
                    size="lg"
                    className="w-full relative"
                    >
                        <FcGoogle className='size-5 absolute left-2.5 top-2.5'/>
                        Continue with Google
                    </Button>
                    <Button 
                    disabled={false}
                    variant="outline"
                    size="lg"
                    className="w-full relative"
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