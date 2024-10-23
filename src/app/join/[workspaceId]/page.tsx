"use client"

import React from 'react'
import Image from 'next/image'
import VerificationInput from 'react-verification-input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const JoinPage = () => {
    return (
        <div className='flex h-full flex-col items-center justify-center bg-white gap-y-8 p-8 shadow-md'>
            <Image src="/logo/slack_logo_2019.svg" alt="logo" width={60} height={60} />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className='flex flex-col gap-y-2 items-center justify-center'>
                    <h1 className="text-2xl font-bold">
                        Join workspace
                    </h1>
                    <p className="text-md text-muted-foreground">
                        Enter the workspace join code
                    </p>
                </div>
                <VerificationInput classNames={{
                    container: "flex gap-x-2",
                    character: "flex items-center justify-center uppercase h-auto rounded-md border border-gray-300 text-lg font-medium text-gray-500",
                    characterInactive: "text-muted",
                    characterSelected: "bg-white text-black",
                    characterFilled: "bg-white text-black"
                }}
                    autoFocus
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