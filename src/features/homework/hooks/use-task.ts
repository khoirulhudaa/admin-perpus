import { taskServices } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useTask = () => {
  const auth = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ['btask'],
    queryFn: () => taskServices.all(),
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => taskServices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btask'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; updates: Partial<{
      materiTugas: string;
      startTime: string;
      endTime: string;
      jadwalPelajaranId: number;
      deskripsi: string;
      detailTugas: string;
    }> }) => taskServices.update(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['btask'] });
    },
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  const memberOptions: never[] = [];

  return {
    query,
    data,
    memberOptions,
    isLoading,
    deleteTask: deleteMutation.mutate,
    updateTask: updateMutation.mutateAsync,
  };
};
