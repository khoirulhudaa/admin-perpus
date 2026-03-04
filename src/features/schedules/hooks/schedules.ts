import { scheduleService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const useSchedules = () => {
  const auth = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();
  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["schedules"],
    queryFn: () => scheduleService.all(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const mutation = useMutation({
    mutationFn: (vars: any) => scheduleService.create(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error) => {
      console.error("Error creating schedule:", error);
    },
  });

  const create = useCallback(
    (form: any) => mutation.mutateAsync(form),
    [mutation]
  );

  const data = useMemo(() => {
    return query.data?.data;
  }, [query.data?.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
    create,
  };
};