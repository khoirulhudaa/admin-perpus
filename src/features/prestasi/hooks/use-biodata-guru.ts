import { biodataService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useBiodataGuru = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["biodata-guru"],
    queryFn: () => biodataService.guru(),
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

export const useBiodataGuruForCard = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["biodata-guru-card"],
    queryFn: () => biodataService.guru(),
  });
  
  const data = useMemo(() => query.data || [], [query.data]);
  const isLoading = query.isLoading; // Hanya true saat pertama kali

  return {
    data,
    isLoading,
    refetch: query.refetch, // <-- ini penting
    isRefetching: query.isRefetching,
  };
};
