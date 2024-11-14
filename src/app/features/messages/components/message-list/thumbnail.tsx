import { Dialog, DialogTrigger,DialogContent } from "../../../../../components/ui/dialog";


interface ThumbnailProps {
    url: string | null | undefined
}

const Thumbnail = ({ url }: ThumbnailProps) => {

    if (!url) return null;
    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
                    <img
                        className="rounded-md object-cover size-full"
                        src={url}
                        alt="Message image"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] max-h-[90%] border-none bg-transparent shadow-none">
                <img
                    className="rounded-md object-cover size-full"
                    src={url}
                    alt="Message image"
                />
            </DialogContent>
        </Dialog>
    )
}

export default Thumbnail