import { schoolService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface UseSchoolDetailProps {
  id: string | number;
}

export const useSchoolDetail = (props: UseSchoolDetailProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() &&
    Boolean(profile.user?.id) &&
    Boolean(String(props.id));

  const query = useQuery({
    enabled,
    queryKey: ["school-detail", { id: props.id }],
    queryFn: () => schoolService.get(Number(props.id)),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
