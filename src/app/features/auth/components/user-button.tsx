'use client';

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";


export const UserButton = () => {
    const route = useRouter()
    const { data, isLoading } = useCurrentUser();
    const { signOut } = useAuthActions();

    if (isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />;
    }
    if (!data) return null;

    const { image, name, email } = data;
    const avaterFallback = name ? name.charAt(0).toUpperCase() : ''

    const handleSignOut = ()=>{
        // signOut();
        signOut().then(()=>{
            route.replace(`/auth`);
        })
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-9">
                    <AvatarImage alt={name} src={image} />
                    <AvatarFallback className="bg-[#5c3b58] text-white">
                        {avaterFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="ml-1 w-60">
                <DropdownMenuItem onClick={() => handleSignOut()} className="h-10 cursor-pointer">
                    <LogOut className="size-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}