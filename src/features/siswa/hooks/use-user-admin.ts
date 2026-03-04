import { userService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useUserAdmin = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);
  const profileId = profile?.user?.sekolahId
  
  const query = useQuery({
    enabled,
    queryKey: ["user-admin", profileId],
    queryFn: () => userService.getAdmin(),
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  const memberOptions: never[] = [];

  return {
    query,
    data,
    memberOptions,
    isLoading,
  };
};
