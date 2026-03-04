import { graduationDataModel } from "@/core/models";
import { graduationService } from "@/core/services/graduation";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface useGraduationProps {
  sekolahId?: number;
  lulus?: boolean;
}

export const useGraduation = (props?: useGraduationProps) => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  // Gunakan props.sekolahId jika ada, fallback ke profile
  const schoolId = props?.sekolahId ?? profile.user?.sekolah?.id;

  const query = useQuery({
    enabled,
    queryKey: ["graduations"], // Sertakan props untuk caching
    queryFn: () => graduationService.all(props),
  });

  const mutation = useMutation({
    mutationFn: (vars: graduationDataModel) => graduationService.create(vars),
    onSuccess: () => {
      query.refetch();
    },
  });

  const create = (form: graduationDataModel) => mutation.mutateAsync(form);

  const data = useMemo(() => {
    return query.data?.data || [];
  }, [query.data, schoolId]);

  return {
    query,
    data,
    isLoading: query.isLoading || query.isPending,
    isError: query.isError,
    error: query.error,
    create,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
};