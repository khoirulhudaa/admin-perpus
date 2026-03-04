// import React from "react";
// import { Brand } from "./_components/Brand";
// import { SidebarProps } from "../types";
// import { Nav } from "../_components/Nav";
// import { cn } from "@/core/libs";

// export const DefaultSidebar = React.memo((props: SidebarProps) => {
//   return (
//     <div
//       className={cn(
//         "sidebar sidebar-default",
//         "hidden border-r bg-[#0D121E] md:block",
//         props.className,
//       )}
//     >
//       <div className=" sidebar-content flex h-full max-h-screen flex-col gap-2">
//         <Brand />
//         <div className="px-4 overflow-y-auto py-2">
//           <Nav items={props.menus} />
//         </div>
//       </div>
//     </div>
//   );
// });

// DefaultSidebar.displayName = "DashboardSidebar";


import { cn } from "@/core/libs";
import React from "react";
import { Nav } from "../_components/Nav";
import { SidebarProps } from "../types";
import { Brand } from "./_components/Brand";

export const DefaultSidebar = React.memo(({ visible, setVisible, menus, className, minimize }: SidebarProps) => {
  return (
    <div
      className={cn(
        "sidebar sidebar-default relative h-screen", 
        "hidden border-none md:block bg-blue-700 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        visible || !minimize ? "w-[260px]" : "w-[70px]",
        className,
      )}
      {...(minimize ? {
          onMouseEnter: () => setVisible?.(true),
          onMouseLeave: () => setVisible?.(false)
        } : {})
      }
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-800 via-blue-900 to-[#070a11]" />

      <div className="relative z-20 sidebar-content flex h-full flex-col gap-4 overflow-hidden">
        <Brand isCollapsed={!visible && minimize} />
        
        {/* Menu Area dengan Custom Scrollbar */}
        <div className="flex-1 w-full pl-4 pr-0 overflow-y-auto py-4 scrollbar-hide">
          <Nav items={menus} isCollapsed={!visible && minimize} />
        </div>

        {/* User Info / Logout Area (Opsional) */}
        <div className="p-4 border-t border-white/10">
           {/* Anda bisa letakkan USER_MENU_STAFF di sini */}
        </div>
      </div>
    </div>
  );
});

DefaultSidebar.displayName = "DashboardSidebar";