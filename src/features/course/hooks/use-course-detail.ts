import { courseService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface UseCourseDetailProps {
  id?: number;
}

export const useCourseDetail = (props?: UseCourseDetailProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(props?.id);

  const query = useQuery({
    enabled,
    queryKey: ["course-detail", { id: Number(props?.id) }],
    queryFn: () => courseService.get(Number(props?.id)),
  });

  const data = useMemo(() => query.data, [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
