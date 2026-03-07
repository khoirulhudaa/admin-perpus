import { Button, cn } from '@/core/libs';
import { useProfile } from '@/features/profile';
import { Maximize, Menu, Minimize } from 'lucide-react';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import ini penting
import { Sidebar } from './sidebar';
import { SidebarProps } from './sidebar/types';
import { UserMenu, UserMenuProps } from './usermenu';

export interface DashboardLayoutProps extends PropsWithChildren {
  menus: SidebarProps['menus'];
  usermenus: UserMenuProps['menus'];
  sidebarClassName?: string;
  headerClassName?: string;
}

export const DashboardLayout = React.memo(({ menus = [], usermenus, children, ...props }: DashboardLayoutProps) => {
  const [minimize, setMinimize] = useState(false);
  const [visible, setVisible] = useState(true);
  
  const profile = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Tambahkan pengecekan untuk path signage
  // Gunakan 'signane' sesuai dengan navigate('/signane') di button kamu
  const isFullPage = location.pathname === '/scan-qrcode' || location.pathname === '/signane';

  useEffect(() => {
    if (isFullPage) {
      setVisible(false);
      setMinimize(true);
    } else {
      setVisible(true);
      setMinimize(false);
    }
  }, [isFullPage]);

  
  const filteredMenus = menus.map((data) => {
    if(profile?.user?.role === 'superAdmin' && data?.title === 'Manajemen Perpustakaan') {
      return false;
    }
    if (data.items) {
      const filteredItems = data.items.filter(item => {
        if (profile?.user?.role === 'superAdmin' && (item.title === 'Acara' || item.title === 'Kelulusan')) {
          return false;
        }
        return true;
      });

      return filteredItems.length > 0
        ? { ...data, items: filteredItems }
        : null;
    }
    return data;
  }).filter(Boolean);

  return (
    <div className={cn(
      "dashboard-layout grid min-h-[100svh] w-full bg-slate-200",
      // 2. Jika full page, gunakan 1 kolom saja
      isFullPage ? "grid-cols-1" : "md:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr]"
    )}>
      
      {/* 3. Sembunyikan Sidebar jika isFullPage */}
      {!isFullPage && (
        <Sidebar.Default 
          menus={filteredMenus}
          className={cn("border-r border-slate-300", props.sidebarClassName)}
          visible={visible}
          setVisible={setVisible}
          minimize={minimize}
        />
      )}

      <div className="sidebar-content flex flex-col overflow-hidden">
        
        {/* 4. Sembunyikan Header jika isFullPage */}
        {!isFullPage && (
          <header
            className={cn(
              "sidebar-header flex h-14 items-center gap-2 border-b border-slate-300 shadow-sm",
              "bg-white/70 backdrop-blur-md sticky top-0 z-[50]",
              visible ? 'px-1 md:px-8 pr-3' : 'px-4 md:px-9',
              props.headerClassName,
            )}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {setVisible(!visible), setMinimize(!minimize)}}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 shadow-sm bg-white"
              >
                {visible ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="text-[11px] font-bold uppercase tracking-wider">
                   {visible ? "Collapse" : "Expand"}
                </span>
              </Button>

              {/* Tombol ke Mode Signage */}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => {navigate('/signane')}}
                className="flex items-center md:ml-0 ml-2 gap-2 px-3 py-1.5 rounded-md md:rounded-lg transition-all text-slate-600 hover:bg-slate-100 hover:text-blue-600 border border-slate-200 shadow-sm bg-white"
              >
                <Maximize className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                   Mode Signage
                </span>
              </Button> */}
            </div>
            
            <div className="md:hidden">
                <Sidebar.Sheet className={props.sidebarClassName} menus={filteredMenus} />
            </div>
            
            <div className="w-full flex-1"></div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-300">
               <UserMenu menus={usermenus} />
            </div>
          </header>
        )}

        <main className={cn(
          "sidebar-layout-main max-h-svh overflow-y-auto flex flex-1 flex-col pb-10",
          "bg-slate-200/50",
          // 5. Hilangkan padding jika full page agar benar-benar menempel ke layar
          !isFullPage && "md:px-6"
        )}>
          <div className={cn(
            "gap-4 flex-1 flex flex-col",
            isFullPage ? "p-0" : "py-6 px-2 lg:gap-6 lg:py-8"
          )}>
            <div className={cn(
              !isFullPage && "bg-transparent rounded-[2rem] p-1 min-h-full"
            )}>
               {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';