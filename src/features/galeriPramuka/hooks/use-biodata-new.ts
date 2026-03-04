import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useBiodataNew = (id?: number) => {
  const auth = useAuth();
  const profile = useProfile();
  const baseEnabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled: baseEnabled && id !== undefined, // Only enable if id is provided
    queryKey: ['biodata-siswa-new', id],
    queryFn: () => biodataService.checkAttendance(id!),
    staleTime: 300000, // Cache data selama 30 detik
    refetchInterval: 600000, // Refetch otomatis setiap 10 detik
    refetchOnMount: true, // Refetch saat komponen dimount
    refetchOnReconnect: true, // Refetch saat koneksi pulih
    refetchOnWindowFocus: true, // Refetch saat kembali ke halaman
  });

  const queryOld = useQuery({
    enabled: baseEnabled && id === undefined, // Only enable if id is not provided
    queryKey: ['biodata-siswa-new-old'],
    queryFn: () => biodataService.checkAttendanceOld(),
    staleTime: 300000, // Cache data selama 30 detik
    refetchInterval: 600000, // Refetch otomatis setiap 10 detik
    refetchOnMount: true, // Refetch saat komponen dimount
    refetchOnReconnect: true, // Refetch saat koneksi pulih
    refetchOnWindowFocus: true, // Refetch saat kembali ke halaman
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]); // Memproses data
  const dataOld = useMemo(() => queryOld.data?.data || [], [queryOld.data?.data]); // Memproses dataOld
  const isLoading = query.isLoading || query.isFetching || query.isPending || queryOld.isLoading || queryOld.isFetching || queryOld.isPending; // Status loading
  const isLoadingOld = queryOld.isLoading || queryOld.isFetching || queryOld.isPending; // Status loading

  const memberOptions: never[] = []; // Placeholder jika ada data lain

  return {
    query,
    queryOld,
    data,
    dataOld,
    memberOptions,
    isLoading,
    isLoadingOld
  };
};