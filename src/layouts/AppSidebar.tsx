import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "@/utils/sidebar";
import { BookOpenText } from "lucide-react";
import { Link, useLocation } from "react-router";

const AppSidebar = () => {
    const { pathname } = useLocation();
    const { isMobile, setOpenMobile } = useSidebar()

    // Handle navigation item click
    const handleNavClick = () => {
        // Only close the sidebar on mobile devices
        if (isMobile) {
            setOpenMobile(false)
        }
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2 py-2 justify-center">
                    <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                        <div className="flex gap-2 items-center">
                            <BookOpenText className="text-green-500" />
                            <span className="font-semibold">Kitabe</span>
                        </div>
                        <span className="text-xs text-sidebar-foreground/70">Book Manager</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title} onClick={handleNavClick}>
                                        <Link to={item.url}>
                                            <item.icon className="w-[24px] h-[24px] text-gray-700" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}

export default AppSidebar
