import { cn } from '@/core/libs';
import { Icon, SidebarContext } from '@/features/_global';
import { useProfile } from '@/features/profile';
import { motion } from 'framer-motion';
import React, { useCallback, useContext, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItemProps, NavProps } from '../types';

interface NavItemPropsExtended extends NavItemProps {
  isCollapsed?: boolean;
  isParentManajemenData?: boolean;
  isChild?: boolean;
  main?: boolean;
  onClose?: () => void; // Tambahkan ini
  onClick?: () => void;
}

const NavItem = React.memo(({ isCollapsed, onClose, ...props }: NavItemPropsExtended) => {
  const sidebarContext = useContext(SidebarContext);
  const { onClick: onClickFromProps } = props;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      // Jalankan fungsi onClick dari props (ini yang akan menutup Sheet)
      if (onClickFromProps) {
        onClickFromProps();
      }
      // Karena struktur flat, kita langsung tutup sidebar saat diklik (di mobile)
      sidebarContext.setVisible?.(false);
    },
    [sidebarContext],
  );

  return (
    <li className="relative list-none w-full">
      <NavLink
        to={props.url || ''}
        onClick={handleClick}
        className={({ isActive }) =>
          cn(
            `group relative flex items-center justify-between w-full gap-3 ${isCollapsed ? 'px-2' : 'px-3'} py-2.5 mb-2 rounded-tl-full rounded-bl-full text-[13px] font-medium transition-all duration-200`,
            'text-white/60 hover:text-white hover:brightness-[90%]',
            isActive && 'bg-slate-200 text-blue-900 shadow-lg' // Aktif: Background terang, Teks biru
          )
        }
      >
        {({ isActive }) => (
          <div onClick={onclick} className={cn('flex items-center gap-3', isCollapsed && 'justify-start items-start w-full')}>
            {props.icon && (
              <Icon
                iconName={props.icon}
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-blue-800" : "text-white/80 group-hover:text-white"
                )}
              />
            )}

            {!isCollapsed && (
              <span 
                onClick={onclick}
                className={cn(
                  "truncate tracking-wide transition-colors text-[14px]",
                  isActive ? "text-blue-900 font-bold" : "text-white/90 font-bold"
                )}
              >
                {props.title}
              </span>
            )}
            
            {/* Indikator Garis Aktif */}
            {isActive && !isCollapsed && (
              <motion.div 
                layoutId="activePill"
                className="absolute right-0 w-1 h-6 bg-blue-600 rounded-l-full"
              />
            )}
          </div>
        )}
      </NavLink>
    </li>
  );
});

export const Nav = React.memo(
  ({ items = [], isCollapsed, onClick }: NavProps & { isCollapsed?: boolean, onClick?: any }) => {
    const profile = useProfile();
    const userRole = profile?.user?.role;

    const filteredItems = useMemo(() => {
      // Filter berdasarkan role tanpa mengubah struktur
      if (userRole === 'superAdmin') {
        const excluded = ["WEBSITE SEKOLAH", "MANAJEMEN KELAS", "MANAJEMEN GURU"];
        return items.filter((item: any) => !excluded.includes(item.title));
      }
      return items.filter(item => item.title !== "STATISTIK SEKOLAH");
    }, [items, userRole]);

    return (
      <ul className="flex flex-col list-none p-0 m-0 w-full">
        {filteredItems?.map((item, index) => (
          <NavItem
            key={index}
            onClick={onClick}
            {...item}
            isCollapsed={isCollapsed}
          />
        ))}
      </ul>
    );
  }
);

Nav.displayName = 'Nav';