import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useBiodataNoRefetch = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ['biodata-siswa'],
    queryFn: () => biodataService.siswa(),
    staleTime: 30000, // Cache data selama 30 detik
    refetchInterval: 100000, // Refetch otomatis setiap 3 menit (180,000 ms)
    refetchOnWindowFocus: true, // Refetch saat kembali ke halaman
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

export const useBiodataNoRefetchForCard = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ['biodata-siswa'],
    queryFn: () => biodataService.siswa(),
    // staleTime: 15 * 60 * 1000, // Cache 5 menit
    // gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Hindari refetch saat balik tab
    refetchInterval: false,      // Hindari refetch otomatis
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]);

  const isLoading = query.isLoading; // Hanya true saat pertama kali

  return {
    data,
    isLoading,
    refetch: query.refetch, // <-- ini penting
    isRefetching: query.isRefetching,
  };
};
