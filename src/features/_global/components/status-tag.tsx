import { Badge, cn } from "@/core/libs";
import React from "react";

export interface StatusTagProps {
  value?: string;
}

export const StatusTag = React.memo((props: StatusTagProps) => {
  const getColor = () => {
    switch (props.value?.toLowerCase()) {
      case "success":
        return "success";
      case "disetujui atasan":
      case "disetujui hrd":
        return "bg-theme-color-primary";
      case "ditolak atasan":
      case "ditolak hrd":
        return "bg-theme-color-danger";
      case "belum checkout":
        return "bg-theme-color-danger";
      default:
        return "bg-theme-color-warning";
    }
  };

  return <Badge className={cn("text-white", getColor())}>{props.value}</Badge>;
});
