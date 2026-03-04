import { biodataService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface UseStudentDetailProps {
  id?: number;
}

export const useStudentDetail = (props?: UseStudentDetailProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(props?.id);

  const query = useQuery({
    enabled,
    queryKey: ["student-detail", { id: props?.id }],
    queryFn: () => biodataService.siswaById(Number(props?.id)),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
