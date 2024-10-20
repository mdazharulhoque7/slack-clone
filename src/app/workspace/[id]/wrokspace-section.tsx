import { Button } from "@/components/ui/button";
import { ToolTip } from "@/components/ui/custom/tooltip";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from 'react-use';

interface WorkspaceSectionProps { 
    children: React.ReactNode;
    label: string;
    hint: string;
    onNew?: () => void;
}

const WorkspaceSection = ({
    children,
    label,
    hint,
    onNew }: WorkspaceSectionProps) => {
    const [on, toggle ] = useToggle(true)
  return (
      <div className="flex flex-col mt-3">
          <div className="flex items-center px-3.5 group">
              <Button
                  onClick={toggle}
                  variant="transparent"
                  className="text-sm text-[#f9edffcc] shrink-0 size-6 p-0.5"
              >
                  <FaCaretDown className={cn(
                    "size-4 transition-transform",
                    on && "-rotate-90"
                  )} />
              </Button>
              <Button
                  variant="transparent"
                  className="text-sm text-[#f9edffcc] group px-1.5 h-[28px] justify-normal overflow-hidden items-center"
              >
              <span className="truncate">{label}</span>
              </Button>
              {onNew && (
                  <ToolTip label={hint} side="top" align="center">
                      <Button
                          onClick={onNew}
                          variant="transparent"
                          size="iconSm"
                          className="size-6 ml-auto p-0.5 opacity-0 group-hover:opacity-100 text-sm text-[#f9edffcc]"
                      >
                          <PlusIcon className="size-5"/>
                      </Button>
                  </ToolTip>
              ) }
          </div>
          {on && children }
    </div>
  )
}

export default WorkspaceSection