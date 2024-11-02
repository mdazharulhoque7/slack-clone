import Quill, { type QuillOptions } from 'quill';
import "quill/dist/quill.snow.css"
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { PiTextAa } from 'react-icons/pi'
import { ImageIcon, Smile, XIcon } from 'lucide-react';
import { MdSend } from 'react-icons/md';
import { ToolTip } from '../ui/custom/tooltip';
import { Delta, Op } from 'quill/core';
import { cn } from '@/lib/utils';
import EmojiPopover from './emoji-popover';
import Image from 'next/image';


type EditorValue = {
    image: File | null;
    body: string;
}

interface editorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
}

const Editor = ({
    onSubmit,
    onCancel,
    placeholder = "Write something...",
    defaultValue = [],
    disabled = false,
    innerRef,
    variant = "create"
}: editorProps) => {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [toolbarVisible, setToolbarVisible] = useState<boolean>(true)


    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const submitRef = useRef(onSubmit);
    const cancelRef = useRef(onCancel);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        /**
         * If we don't have the containerRef.current,
         * In that case we will forcefully break the useEffect.
         */
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );
        const editorOption: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }]
                ],
                keyboard: {

                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                // TODO Submit form
                                const text = quill.getText();
                                const addedImage = imageElementRef.current?.files?.[0] || null;
                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                                if(isEmpty) return;

                                const body = JSON.stringify(quill.getContents())
                                submitRef.current?.({body: body, image: addedImage})
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n")
                            }
                        }

                    }
                }
            }
        }

        const quill = new Quill(editorContainer, editorOption)
        quillRef.current = quill
        quillRef.current.focus()

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current)
        setText(quill.getText())

        // Listen to quill text change event and update text state accordingly
        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText())
        })

        // Cleanup method
        return () => {
            // turn of quill event listener
            quill.off(Quill.events.TEXT_CHANGE)

            if (container) {
                container.innerHTML = ""
            }
            if (quillRef.current) {
                quillRef.current = null;
            }
            if (innerRef) {
                innerRef.current = null;
            }
        }
    }, [innerRef])

    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
    
    const toggleToolbar = () => {
        setToolbarVisible((value) => !value)
        const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');
        if (toolbarElement) {
            toolbarElement.classList.toggle('hidden')
        }
    }
    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;
        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)
    }
    return (
        <div className='flex flex-col'>
            <input
                type="file"
                accept='image/*'
                ref={imageElementRef}
                onChange={(e) => setImage(e.target.files![0])}
                className='hidden'

            />
            <div
                className={cn("flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
                    disabled && "opacity-50"
                )}
            >

                <div ref={containerRef} className='h-full ql-custom' />
                {!!image && (
                    <div className="p-2">
                        <div className="relative size-[62px] flex items-center justify-center group/image">
                        <ToolTip label='Remove image'>
                        <button
                            onClick={()=>{
                                setImage(null);
                                imageElementRef.current!.value = ""
                            }}
                            className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black
                                        absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2
                                         border-white items-center justify-center'
                        >
                            <XIcon className='size-3.5' />
                        </button>
                        </ToolTip>
                        <Image
                            alt='Uploaded'
                            src={URL.createObjectURL(image)}
                            fill
                            className='rounded-xl overflow-hidden border object-cover'
                        />
                        </div>
                    </div>
                )}
                <div className="flex px-2 pb-2 z-[5]">
                    <ToolTip label={toolbarVisible ? 'Hide formatting' : 'Show formatting'}>
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={disabled}
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className='size-4' />
                        </Button>
                    </ToolTip>
                    <EmojiPopover onEmojiSelect={onEmojiSelect}>
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={disabled}
                        >
                            <Smile className='size-4' />
                        </Button>
                    </EmojiPopover>
                    {variant === 'create' && (
                        <>
                            <ToolTip label='Image'>
                                <Button
                                    variant="ghost"
                                    size="iconSm"
                                    disabled={disabled}
                                    onClick={() => imageElementRef.current?.click()}
                                >
                                    <ImageIcon className='size-4' />
                                </Button>
                            </ToolTip>
                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={disabled || isEmpty}
                                onClick={() => { 
                                    onSubmit({
                                        body: JSON.stringify(quillRef.current?.getContents()),
                                        image
                                    });
                                }}
                                className={
                                    cn('ml-auto',
                                        isEmpty ?
                                            'bg-white hover:bg-white text-muted-foreground'
                                            : 'text-white hover:text-white bg-[#007a5a] hover:bg-[#007a5a]/80'
                                    )
                                }
                            >
                                <MdSend className='size-4' />
                            </Button>
                        </>
                    )}
                    {variant === 'update' && (
                        <div className="flex ml-auto gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={onCancel}
                            >
                                Cancel</Button>
                            <Button
                                size="sm"
                                disabled={disabled || isEmpty}
                                onClick={()=>{
                                    onSubmit({
                                        body: JSON.stringify(quillRef.current?.getContents()),
                                        image
                                    });                                    
                                }}
                                className=' text-white bg-[#007a5a] hover:bg-[#007a5a]/80'
                            >
                                Save</Button>
                        </div>
                    )}
                </div>
            </div>
            {variant === 'create' && (
                <div className={cn(
                    "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                    !isEmpty && "opacity-100"
                )}>
                    <p>
                        <strong>Shift + Enter</strong> to add a new line
                    </p>
                </div>
            )}
        </div>
    )
}

export default Editor