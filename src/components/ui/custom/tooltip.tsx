"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolTipProps {
    label:string,
    children: React.ReactNode,
    side?: "top" | "right" | "bottom" | "left",
    align?: "start" | "center" | "end"
}

export const ToolTip = ({label, children, side, align}:ToolTipProps)=>{
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
            {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} className="bg-black text-white border-white/5">
                    <p className="font-medium text-xs">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}