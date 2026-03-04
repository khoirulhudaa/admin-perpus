import { Button, Input } from "@/core/libs";
import { Filter } from "lucide-react";

export interface BaseGlobalSearchProps {
    value: string;
    onChange: (val: string) => void;
    showFilterButton?: boolean; // ini yang error sebelumnya
    onFilterClick?: () => void;
    searchPlaceholder?: string;
  }
  

export const BaseGlobalSearch = ({
    value,
    onChange,
    showFilterButton = true,
    onFilterClick,
    searchPlaceholder = "Cari...",
}: BaseGlobalSearchProps) => {
  return (
    <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:items-center sm:justify-between">
    <div className="flex-1">
      <div className="flex gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sm:max-w-[300px] flex-1"
        />
        {showFilterButton && (
          <Button onClick={onFilterClick} size="icon">
            <Filter size={16} />
          </Button>
        )}
      </div>
    </div>
  </div>
);
};