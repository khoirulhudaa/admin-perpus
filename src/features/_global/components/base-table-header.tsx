import { Button } from "@/core/libs";
import { CaretSortIcon } from "@radix-ui/react-icons";
import React from "react";
import { PropsWithChildren } from "react";

export interface BaseTableHeaderProps extends PropsWithChildren {
  onClick?: () => void;
  sorting?: boolean;
}

export const BaseTableHeader = React.memo(({ sorting = true, ...props }: BaseTableHeaderProps) => {
  return (
    <Button className="px-0" variant="ghost" onClick={props.onClick}>
      {props.children}
      {sorting && <CaretSortIcon className="ml-2 h-4 w-4" />}{" "}
    </Button>
  );
},
);
BaseTableHeader.displayName = "BaseTableHeader";
