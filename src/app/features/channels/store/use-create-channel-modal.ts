import { atom, useAtom } from "jotai";


const modelState = atom(false);

export const useCreatChannelModal = () => {
    return useAtom(modelState)
}