// src/hooks/useUpdateSchoolField.ts

import { useSchoolCreation } from "@/features/schools";
import { toast } from "sonner";

export const useUpdateSchoolField = (schoolId: number) => {
  const { update, isLoading } = useSchoolCreation();

  const updateField = async (field: string, value: any) => {
    try {
      await update(schoolId, { [field]: value });
      toast.success("URL Youtube berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui URL Youtube");
      console.error(error);
    }
  };

  return {
    updateField,
    isLoading,
  };
};