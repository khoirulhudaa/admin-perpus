import { useSchool } from "@/features/schools";

export function useSchoolId() {
  const { data } = useSchool();
  return data?.[0]?.id;
}