import { useBiodataGuru, useUserDetail } from "@/features/user";
import { useMemo } from "react";

export interface UseTeacherDetailProps {
  id?: number;
}

export const useTeacherDetail = (props?: UseTeacherDetailProps) => {
  const teacher = useBiodataGuru();
  const userDetail = useUserDetail(Number(props?.id));
  const currentTeacher = useMemo(() => {
    const d = teacher.data?.find((d) => d.userId === props?.id);
    return {
      ...d,
      user: {
        ...d,
        ...userDetail?.data,
      },
    };
  }, [props?.id, teacher.data, userDetail.data]);

  const isLoading = teacher.isLoading || userDetail.isLoading;
  const refetch = () => {
    userDetail.query.refetch();
    teacher.query.refetch();
  };

  return {
    refetch,
    data: currentTeacher,
    isLoading,
  };
};
