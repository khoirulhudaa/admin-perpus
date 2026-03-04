// import { biodataService } from '@/core/services';
// import { useAuth } from '@/features/auth';
// import { useProfile } from '@/features/profile';
// import { useQuery } from '@tanstack/react-query';
// import { useMemo } from 'react';

// export interface UseAbsensiUserDetailProps {
//   id?: number;
// }

// export const useAbsensiUserDetail = (props?: UseAbsensiUserDetailProps) => {
//   const auth = useAuth();
//   const profile = useProfile();
//   const enabled =
//     auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(props?.id);

//   const query = useQuery({
//     enabled,
//     queryKey: ['absensi-user-detail', { id: props?.id }],
//     queryFn: () => biodataService.absensiByUserId(Number(props?.id)),
//   });

//   const data = useMemo(() => query.data?.data, [query.data?.data]);
//   const isLoading = query.isLoading || query.isFetching || query.isPending;

//   return {
//     query,
//     data,
//     isLoading,
//   };
// };


import { biodataService } from '@/core/services';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface UseAbsensiUserDetailProps {
  id?: number;
  filter?: 'harian' | 'bulanan' | 'tahunan';
}

export interface AbsensiUserDetailData {
  absensis: any[];
}

export const useAbsensiUserDetail = ({ id, filter = 'bulanan' }: UseAbsensiUserDetailProps = {}) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(id);

  const query = useQuery({
    enabled,
    queryKey: ['absensi-user-detail', { id, filter }],
    queryFn: () => biodataService.absensiByUserId(Number(id), filter),
  });

  const data = useMemo(() => query.data?.data as AbsensiUserDetailData | undefined, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};