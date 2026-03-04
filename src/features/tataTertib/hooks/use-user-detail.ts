import { userService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useUserDetail = (id: number) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(id);

  const query = useQuery({
    enabled,
    queryKey: ['user-detail', { id }],
    queryFn: () => userService.getUserDetail(id),
  });

  const data = useMemo(() => query.data?.data, [query.data?.data]);
  //  console.log("🔹 Data mentah dari API sebelum decoding:", query.data?.data);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};
