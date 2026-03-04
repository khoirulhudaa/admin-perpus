import { Sheet, SheetContent } from "@/core/libs";
import React from "react";
import { Brand } from "./_components/Brand";
import { Trigger } from "./_components/Trigger";
import { SidebarProps } from "../types";
import { Nav } from "../_components/Nav";
import { useSidebarContext } from "@/features/_global/hooks";

export const SheetSidebar = React.memo((props: SidebarProps) => {
  const sidebarContext = useSidebarContext();
  return (
    <Sheet open={sidebarContext.visible}>
      <Trigger />
      <SheetContent
        onPressClose={sidebarContext.setVisible}
        side="left"
        className=" sidebar sidebar-sheet sidebar-sheet-content flex flex-col"
      >
        <nav className=" sidebar-content-wrapper grid gap-2 text-lg font-medium">
          <Brand />
          <Nav items={props.menus} mobile />
        </nav>
      </SheetContent>
    </Sheet>
  );
});

SheetSidebar.displayName = "SheetSidebar";
