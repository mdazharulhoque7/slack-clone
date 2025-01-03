import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateChannelModal } from '../store/use-create-channel-modal'
import { useCreateChannel } from '../api/use-create-channel'
import { useWorkspaceId } from '@/hooks/use-workspace_id'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const CreateChannelModal = () => {
  const router = useRouter()
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal()
  const [name, setName] = useState("");
  const {mutate, isPending} = useCreateChannel()

  const handleClose = ()=>{
    setName("");
    setOpen(false)
  }
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  }
  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(
      {name, workspaceId},
      {
        onSuccess: (id)=>{
          toast.success("Channel created");
          handleClose();
          router.push(`/workspace/${workspaceId}/channel/${id}`);
        },
        onError:()=>{
          toast.error("Failed to create channel");
        }
      }

    )
  }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={(e) => {handleNameChange(e)}}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='e.g. plan-budget'
          />
          <div className="flex justify-end">
            <Button
              disabled={isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal