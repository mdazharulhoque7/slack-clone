import Quill, { type QuillOptions } from 'quill';
import "quill/dist/quill.snow.css"
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { PiTextAa } from 'react-icons/pi'
import { ImageIcon, Smile } from 'lucide-react';
import { MdSend } from 'react-icons/md';
import { ToolTip } from './ui/custom/tooltip';
import { Delta, Op } from 'quill/core';
import { cn } from '@/lib/utils';


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
    const [text, setText] = useState("")
    const [toolbarVisible, setToolbarVisible] = useState<boolean>(true)
    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const submitRef = useRef(onSubmit);
    const cancelRef = useRef(onCancel);
    const placeholderRef = useRef(placeholder);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);

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
            modules:{
                toolbar:[
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{list: "ordered"}, {list: "bullet"}]
                ],
                keyboard:{

                    bindings:{
                        enter: {
                            key: "Enter",
                            handler: ()=>{
                                // TODO Submit form
                                return;
                            }
                        },
                        shift_enter:{
                            key: "Enter",
                            shiftKey: true,
                            handler: ()=>{
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

        if(innerRef){
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current)
        setText(quill.getText())

        // Listen to quill text change event and update text state accordingly
        quill.on(Quill.events.TEXT_CHANGE, ()=>{
            setText(quill.getText())
        })

        // Cleanup method
        return () => {
            // turn of quill event listener
            quill.off(Quill.events.TEXT_CHANGE)

            if (container) {
                container.innerHTML = ""
            }
            if(quillRef.current){
                quillRef.current = null;
            }
            if(innerRef){
                innerRef.current = null;
            }
        }
    }, [innerRef])

    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
    const toggleToolbar = ()=>{
        setToolbarVisible((value)=> !value)
        console.log(containerRef.current);
        const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');
        if(toolbarElement){
            toolbarElement.classList.toggle('hidden')
        }
    }
    return (
        <div className='flex flex-col'>
            <div
                className='flex flex-col border border-slate-200 rounded-md
                        overflow-hidden focus-within:border-slate-300
                        focus-within:shadow-sm transition bg-white
                        '
            >

                <div ref={containerRef} className='h-full ql-custom' />
                <div className="flex px-2 pb-2 z-[5]">
                    <ToolTip label={toolbarVisible ? 'Hide formatting': 'Show formatting'}>
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={disabled}
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className='size-4' />
                        </Button>
                    </ToolTip>
                    <ToolTip label='Emoji'>
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={disabled}
                            onClick={() => { }}
                        >
                            <Smile className='size-4' />
                        </Button>
                    </ToolTip>
                    {variant === 'create' && (
                        <>
                            <ToolTip label='Image'>
                                <Button
                                    variant="ghost"
                                    size="iconSm"
                                    disabled={disabled}
                                    onClick={() => { }}
                                >
                                    <ImageIcon className='size-4' />
                                </Button>
                            </ToolTip>
                            <Button
                                variant="ghost"
                                size="iconSm"
                                disabled={disabled || isEmpty}
                                onClick={() => { }}
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
                                onClick={() => { }}
                            >
                                Cancel</Button>
                            <Button
                                size="sm"
                                disabled={disabled}
                                onClick={() => { }}
                                className=' text-white bg-[#007a5a] hover:bg-[#007a5a]/80'
                            >
                                Save</Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
                <p>
                    <strong>Shift + Enter</strong> to add a new line
                </p>
            </div>
        </div>
    )
}

export default Editor