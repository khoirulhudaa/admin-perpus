import React from "react";
import { Link } from "react-router-dom";

export interface InfoItemProps {
  icon?: React.ReactNode;
  label?: string;
  value?: React.ReactNode;
  link?: string;
  renderValue?: React.ReactNode;
}

export const InfoItem = React.memo(
  ({ icon, label, value, renderValue, link }: InfoItemProps) => {
    return (
      <div className="flex flex-row gap-2">
        {icon && <div className="pt-1">{icon}</div>}
        <div className="flex-1">
          <p className="font-bold text-sm">{label}</p>
          {renderValue || (
            <p className="text-sm">
              {value && link ? (
                <Link className="underline" to={link} target="_blank">
                  {value}
                </Link>
              ) : (
                value
              )}
            </p>
          )}
        </div>
      </div>
    );
  },
);
