import { provinceService } from "@/core/services/province";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useProvinces = () => {
  const auth = useAuth();
  const profile = useProfile();   
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["provinces"],
    queryFn: () => provinceService.all(),
  });

  const data = useMemo(() => {
    return query.data || [];
  }, [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
