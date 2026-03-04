import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import { Link } from "react-router-dom";

export interface BaseActionTableProps {
  editPath?: string;
  deletePath?: string;
  detailPath?: string;
  onEdit?: () => void; // Add onEdit callback
}

export const BaseActionTable = React.memo((props: BaseActionTableProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {props.detailPath && (
            <DropdownMenuItem asChild>
              <Link to={props.detailPath}>{lang.text("seeDetails")}</Link>
            </DropdownMenuItem>
          )}
          {props.editPath && (
            <DropdownMenuItem asChild>
              <Link to={props.editPath}>{lang.text("edit")}</Link>
            </DropdownMenuItem>
          )}
          {props.onEdit && (
            <DropdownMenuItem onClick={props.onEdit}>
              {lang.text("edit")}
            </DropdownMenuItem>
          )}
          {props.deletePath && (
            <DropdownMenuItem asChild>
              <Link to={props.deletePath}>{lang.text("delete")}</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});