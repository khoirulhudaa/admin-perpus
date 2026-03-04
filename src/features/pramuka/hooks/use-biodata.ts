import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useBiodata = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ['biodata-siswa'],
    queryFn: () => biodataService.siswa(),
    // staleTime: 1 * 60 * 1000, // 1 menit
    // gcTime: 10 * 60 * 1000,
    // refetchInterval: false, // Nonaktifkan refetch otomatis
    refetchOnWindowFocus: true, // Nonaktifkan refetch saat window focus
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]); // Memproses data
  const isLoading = query.isLoading || query.isFetching || query.isPending; // Status loading

  const memberOptions: never[] = []; // Placeholder jika ada data lain

  return {
    query,
    data,
    memberOptions,
    isLoading,
  };
};
