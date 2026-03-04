import { DropdownMenuItem } from "@/core/libs";

export const RegionCheckboxItem = ({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) => {
  return (
    <DropdownMenuItem onSelect={onCheckedChange}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="mr-2"
      />
      {label}
    </DropdownMenuItem>
  );
};