
import { useMemo } from "react";
import { useSchool } from "@/features/schools";
import { useClassroom } from "@/features/classroom";

export const useSchoolOptions = () => {
  const { data } = useSchool();
  return useMemo(
    () =>
      data?.map((d) => ({
        label: d.namaSekolah,
        value: d.id,
      })) || [],
    [data]
  );
};

export const useClassroomOptions = () => {
  const { data } = useClassroom();
  return useMemo(
    () =>
      data?.map((d) => ({
        label: d.namaKelas,
        value: d.id,
      })) || [],
    [data]
  );
};
