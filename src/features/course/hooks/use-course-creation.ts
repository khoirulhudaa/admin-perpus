import { CourseCreationModel } from "@/core/models/course";
import { courseService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";

export const useCourseCreation = () => {
  const createMutation = useMutation({
    mutationFn: (vars: CourseCreationModel) => courseService.create(vars),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: CourseCreationModel }) =>
      courseService.update(vars.id, vars.payload),
  });

  const deleteMutation = useMutation({
    mutationFn: (vars: { id: number }) => courseService.delete(vars.id),
  });

  const create = (form: CourseCreationModel) =>
    createMutation.mutateAsync(form);

  const update = (id: number, payload: CourseCreationModel) =>
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
