import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react"


export const useConfirm = (title: string, message: string): [()=>JSX.Element, ()=>Promise<unknown>]=>{
    const [promise, setPromise] = useState<{resolve: (value:boolean)=> void}|null>(null);
    const confirm = () => new Promise((resolve, reject)=>{
        setPromise({resolve});
    });

    const handleClose = () => {
        setPromise(null);
    };

    const handleCancle = ()=> {
        promise?.resolve(false);
        handleClose();
    }

    const handleConfirm = ()=>{
        promise?.resolve(true);
        handleClose();
    };

    const ConfirmDialog = ()=>(
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-2">
                    <Button variant="outline" onClick={handleCancle}>No</Button>
                    <Button onClick={handleConfirm}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    return [ConfirmDialog,confirm]
}