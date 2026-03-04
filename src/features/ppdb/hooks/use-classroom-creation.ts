import { ClassroomCreationModel } from "@/core/models";
import { classroomService } from "@/core/services/classroom";
import { useMutation } from "@tanstack/react-query";

export const useClassroomCreation = () => {
  const createMutation = useMutation({
    mutationFn: (vars: ClassroomCreationModel) => classroomService.create(vars),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: ClassroomCreationModel }) =>
      classroomService.update(vars.id, vars.payload),
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: number }) => classroomService.delete(vars.id),
  });

  const create = (form: ClassroomCreationModel) =>
    createMutation.mutateAsync(form);

  const update = (id: number, payload: ClassroomCreationModel) =>
    updateMutation.mutateAsync({ id, payload });

  const remove = (id: number) => deleteMutation.mutateAsync({ id });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    isLoading,
    create,
    update,
    delete: remove,
  };
};
