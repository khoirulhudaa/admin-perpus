import { SchoolCreationModel } from "@/core/models/schools";
import { schoolService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSchool = () => {
  const auth = useAuth();
  const profile = useProfile();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const schoolId = profile.user?.sekolah?.id;

  const query = useQuery({
    enabled,
    queryKey: ["schools"],
    queryFn: () => schoolService.all(),
  });

  const mutation = useMutation({
    mutationFn: (vars: SchoolCreationModel) => schoolService.create(vars),
    onSuccess: () => {
      query.refetch();
    },
  });

  const create = (form: SchoolCreationModel) => mutation.mutateAsync(form);

  const data = useMemo(() => {
    if (!schoolId) return query.data?.data || [];
    return (
      query.data?.data?.filter((d) => Number(d.id) === Number(schoolId)) || []
    );
  }, [query.data?.data, schoolId]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
    create,
  };
};
