import { UserButton } from "@/app/features/auth/components/user-button";
import WorkspaceSwitcher from "./workspace-switcher";

const Sidebar = () => {
    return ( 
        <aside className="bg-[#481349] w-[70px] flex h-full flex-col gap-y-4 item-center pt-[9px] pb-4">
            <WorkspaceSwitcher />
            <div className="flex flex-col items-center justify-center mt-auto gap-y-1">
                <UserButton/>
            </div>
        </aside>
     );
}
 
export default Sidebar;
