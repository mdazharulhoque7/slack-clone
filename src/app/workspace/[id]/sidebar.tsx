import { usePathname } from "next/navigation";
import { UserButton } from "@/app/features/auth/components/user-button";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    return ( 
        <aside className="bg-[#481349] min-w-[50px] w-[50px] flex h-full flex-col gap-y-4 item-center pt-[9px] pb-4">
            <WorkspaceSwitcher />
            <SidebarButton icon={Home} label="Home" isActive={pathname.includes("/workspace")} />
            <SidebarButton icon={MessagesSquare} label="DMs" />
            <SidebarButton icon={Bell} label="Activity" />
            <SidebarButton icon={MoreHorizontal} label="More" />
            <div className="flex flex-col items-center justify-center mt-auto gap-y-1">
                <UserButton/>
            </div>
        </aside>
     );
}
 
export default Sidebar;
