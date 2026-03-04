import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import { useProfile } from "@/features/profile";
import React from "react";
import { Link, To } from "react-router-dom";

export interface UserMenuItem {
  title?: string;
  separator?: boolean;
  label?: boolean;
  url?: To;
}

export interface UserMenuProps {
  menus: UserMenuItem[];
}

export const UserMenu = React.memo(({ menus = [] }: UserMenuProps) => {
  const profile = useProfile();

  console.log('prof', profile?.user)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="border-2 border-foreground/25">
              <AvatarImage
                src={getStaticFile(String(profile.user?.image))}
                alt={profile.user?.name}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        {menus && menus?.length > 0 && (
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-row gap-2">
                <Avatar>
                  <AvatarImage
                    src={getStaticFile(String(profile.user?.image))}
                    alt={profile.user?.name}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap flex-1">
                  <p className="font-bold">{profile.user?.name || "-"}</p>
                  <p className="text-xs opacity-50">
                    {profile.user?.email || "-"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {menus?.map((menu, i) => {
              if (menu.separator) {
                return <DropdownMenuSeparator key={i} />;
              }

              if (menu.label) {
                return (
                  <DropdownMenuLabel key={i}>{menu.title}</DropdownMenuLabel>
                );
              }
              return (
                <DropdownMenuItem asChild key={i}>
                  <Link to={menu.url || "#"}>{menu.title}</Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  );
});
