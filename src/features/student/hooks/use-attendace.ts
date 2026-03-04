import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface UseAttedanceProps {
  id?: number | string;
}

export const useAttedances = (props?: UseAttedanceProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled =
    auth.isAuthenticated() &&
    Boolean(profile.user?.id) &&
    props?.id != null;

  const query = useQuery({
    enabled,
    queryKey: ['attedances-new', { id: props?.id }],
    refetchOnWindowFocus: true,
    queryFn: () => {
      if (!props?.id) {
        throw new Error("School ID is required for attendance query");
      }
      return biodataService.checkAttendance(props.id);
    },
    placeholderData: [],
  });

  const data = useMemo(() => query.data?.data || [], [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};