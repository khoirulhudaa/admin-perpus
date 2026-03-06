import { Sheet, SheetContent } from "@/core/libs";
import { useSidebarContext } from "@/features/_global/hooks";
import React, { useState } from "react";
import { Nav } from "../_components/Nav";
import { SidebarProps } from "../types";
import { Brand } from "./_components/Brand";
import { Trigger } from "./_components/Trigger";

export const SheetSidebar = React.memo((props: SidebarProps) => {
  const sidebarContext = useSidebarContext();
  const [active, setActive] = useState<boolean>(false)

  console.log("Status Sidebar di Sheet:", sidebarContext.visible);

  return (
    // PENTING: Tambahkan onOpenChange
    <Sheet 
      open={active} 
      onOpenChange={() => setActive(!active)}
    >
      {/* Trigger biasanya diletakkan di luar SheetContent tapi di dalam Sheet */}
      <Trigger onClick={() => setActive(!active)} /> 
      
      <SheetContent
        side="left"
        // Pastikan z-index tinggi dan background tidak transparan
        className="fixed top-0 left-0 sidebar-sheet-content flex flex-col bg-slate-900 p-0 z-[99999] w-[100vw]"
      >
        <nav className="sidebar-content-wrapper flex flex-col gap-4 pt-5 md:pt-12 px-4">
          <Brand />
          {/* Pastikan props.menus diteruskan ke Nav */}
          <Nav items={props.menus} onClick={() => setActive(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
});

SheetSidebar.displayName = "SheetSidebar";
