import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/core/libs";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DOMPurify from "dompurify";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { InfoItem } from "../components";

interface EditableInfoItemProps<T extends FieldValues> {
  control: Control<T>;
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  name: Path<T>;
  type?: string;
  options?: { value: string; label: string }[];
  ckEditorError?: string | null;
  setCkEditorError?: React.Dispatch<React.SetStateAction<string | null>>;
  isEditMode: boolean;
}

export const EditableInfoItem = <T extends FieldValues>({
  control,
  icon,
  label,
  value,
  name,
  type = "text",
  options,
  ckEditorError,
  setCkEditorError,
  isEditMode,
}: EditableInfoItemProps<T>) => {
  const visiMisiPlaceholder = `
    <p><strong>VISI:</strong></p>
    <ol>
        <li>Masukan misi sekolah anda di sini</li>
    </ol>
    <p><strong>MISI:</strong></p>
    <ol>
        <li>Misi pertama</li>
        <li>Misi kedua</li>
        <li>Misi ketiga</li>
        <p>dst...</p>
    </ol>
  `;

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
                value={String(field.value)}
                onValueChange={(val) =>
                  field.onChange(name === "active" ? Number(val) : val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "editor" ? (
              <div className="ck-editor-wrapper">
                {ckEditorError ? (
                  <textarea
                    placeholder="Masukkan Visi Misi (CKEditor gagal dimuat)"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full min-h-[300px] border border-gray-300 rounded p-2 text-black"
                  />
                ) : (
                  <CKEditor
                    editor={ClassicEditor}
                    data={field.value || visiMisiPlaceholder}
                    onReady={() => {
                      console.log("CKEditor initialized for visiMisi");
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      console.log("CKEditor changed:", data);
                      field.onChange(data);
                    }}
                    onError={(error) => {
                      console.error("CKEditor error:", error);
                      setCkEditorError?.("Gagal memuat CKEditor");
                    }}
                  />
                )}
                {ckEditorError && (
                  <p className="text-red-500 text-sm mt-1">
                    {ckEditorError}. Gunakan textarea sebagai cadangan.
                  </p>
                )}
              </div>
            ) : (
              <Input
                placeholder={`Masukkan ${label}`}
                {...field}
                value={field.value ?? ""}
              />
            )}
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  ) : (
    <InfoItem
      icon={icon}
      label={label}
      value={type === "editor" ? undefined : value || "-"}
      {...(value && type === "url" && { link: String(value) })}
      {...(type === "editor" && {
        dangerouslySetInnerHTML: { __html: DOMPurify.sanitize(value || "-") },
      })}
    />
  );
};

interface NonEditableInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  isEditMode: boolean;
}

export const NonEditableInfoItem = ({
  icon,
  label,
  value,
  isEditMode,
}: NonEditableInfoItemProps) => {
  if (isEditMode) return null;
  return <InfoItem icon={icon} label={label} value={value || "-"} />;
};
