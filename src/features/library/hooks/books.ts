import { useQuery } from '@tanstack/react-query';
import { BookStats, fetchBookStats } from '../utils';

export const useBookStats = (server?: string, sekolahId?: number) => {
  return useQuery<BookStats>({
    queryKey: ['bookStats', sekolahId, server],
    queryFn: () => fetchBookStats(server!, sekolahId!),
    enabled: !!server && !!sekolahId,
    staleTime: 1000 * 60 * 2, // fresh 10 menit
    gcTime: 1000 * 60 * 5 // cache 5 menit
  });
};
