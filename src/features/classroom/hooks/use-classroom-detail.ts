import { classroomService } from "@/core/services/classroom";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface useClassroomDetailProps {
  id: number;
}

export const useClassroomDetail = (props?: useClassroomDetailProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(props?.id);

  const query = useQuery({
    enabled,
    queryKey: ["classroom-detail", { id: props?.id }],
    queryFn: () => classroomService.get(Number(props?.id)),
    refetchOnWindowFocus: true
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
