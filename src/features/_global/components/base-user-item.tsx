import { Avatar, AvatarFallback, AvatarImage } from "@/core/libs";
import React from "react";

export interface BaseUserItemProps {
  image?: string;
  name?: string;
  text1?: string;
  text2?: string;
  text3?: string;
}

export const BaseUserItem = React.memo(
  ({ image, name, text1, text2 }: BaseUserItemProps) => {
    const nameArr = name?.split(" ") || [];
    const initialName =
      nameArr && nameArr.length > 0
        ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
        : "-";

    const renderUser = () => {
      return (
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{initialName}</AvatarFallback>
          </Avatar>
          <div className="">
            <p className="font-bold mb-1">{name}</p>
            <p className="text-xs mb-1 opacity-50">{text1}</p>
            <p className="text-xs mb-2 opacity-50">{text2}</p>
          </div>
        </div>
      );
    };

    return (
      <>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {renderUser()}
        </div>
      </>
    );
  },
);
