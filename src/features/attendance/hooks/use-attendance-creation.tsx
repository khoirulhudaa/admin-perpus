import { attendanceCreationModel } from "@/core/models";
import { attendanceService } from "@/core/services/attedance";
import { useMutation } from "@tanstack/react-query";

export const useAttendanceCreation = () => {
  const createMutation = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.create(vars)
  });
  const createMutationRemove = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.remove(vars)
  });
  const createMutationGo = useMutation({
    mutationFn: (vars: attendanceCreationModel) => attendanceService.createGo(vars)
  });

  // const create = (form: attendanceCreationModel) =>
  const create = (form: any) =>
    createMutation.mutateAsync(form);

  const remove = (form: attendanceCreationModel) =>
    createMutationRemove.mutateAsync(form);

  const createGo = (form: attendanceCreationModel) =>
    createMutationGo.mutateAsync(form);

  const isLoading =
    createMutation.isPending
  const isLoadingGo =
    createMutationGo.isPending

  return {
    isLoading,
    isLoadingGo,
    create,
    createGo,
    remove
  };
};
