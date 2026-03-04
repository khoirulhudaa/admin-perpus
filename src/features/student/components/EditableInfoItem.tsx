import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  dayjs,
  lang,
} from "@/core/libs";
import { InfoItem } from "@/features/_global";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface EditableInfoItemProps<T extends FieldValues> {
  control: Control<T>;
  icon: React.ReactNode;
  label: string;
  value: string | number | boolean | undefined;
  name: Path<T>;
  type?: string;
  options?: { value: string | number | boolean; label: string }[];
  isEditMode: boolean;
}

export const EditableInfoItem = React.memo(
  <T extends FieldValues>({
    control,
    icon,
    label,
    value,
    name,
    type = "text",
    options,
    isEditMode,
  }: EditableInfoItemProps<T>) => {
    return isEditMode ? (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              {type === "select" ? (
                <Select
                  value={field.value !== undefined ? String(field.value) : ""}
                  onValueChange={(val) =>
                    field.onChange(
                      name === "isActive" || name === "sekolahId"
                        ? Number(val)
                        : name === "isVerified"
                        ? val === "true"
                        : val
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Pilih ${label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options?.map((opt) => (
                      <SelectItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "date" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal h-10"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {field.value ? (
                        dayjs(field.value).format("DD MMMM YYYY")
                      ) : (
                        <span className="text-gray-500">Pilih tanggal lahir</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) =>
                          field.onChange(newValue ? newValue.format("YYYY-MM-DD") : "")
                        }
                        maxDate={dayjs()}
                        showDaysOutsideCurrentMonth
                        sx={{
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                          padding: "8px",
                          color: "black",
                        }}
                      />
                    </LocalizationProvider>
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  type={type}
                  placeholder={`Masukkan ${label}`}
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            </FormControl>
            {type === "date" && fieldState.error?.message && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
            {type !== "date" && <FormMessage>{fieldState.error?.message}</FormMessage>}
          </FormItem>
        )}
      />
    ) : (
      <InfoItem
        icon={icon}
        label={label}
        value={type === "date" ? (value ? dayjs(value).format("DD MMMM YYYY") : "-") : value ?? "-"}
      />
    );
  }
);

interface NonEditableInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  renderValue?: React.ReactNode;
  isEditMode: boolean;
}

export const NonEditableInfoItem = ({
  icon,
  label,
  value,
  renderValue,
  isEditMode,
}: NonEditableInfoItemProps) => {
  if (isEditMode) return null;
  return (
    <InfoItem
      icon={icon}
      label={label}
      value={value ?? "-"}
      renderValue={renderValue}
    />
  );
};