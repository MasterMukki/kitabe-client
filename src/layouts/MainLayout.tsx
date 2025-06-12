import type React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";
import AppSidebar from "./AppSidebar";
import { navItems } from "@/utils/sidebar";

const MainLayout: React.FC = () => {
    const {pathname} = useLocation();

    const getTitle = () => {
        const item = navItems.find((item) => pathname === item.url);
        if(item) {
            return item?.title;
        }
        return '';
    }

    const title = getTitle();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="shadow-md">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 hover:cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-[1rem] font-semibold">{ title }</span>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default MainLayout;