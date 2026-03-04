import {
  SchoolCreationModel,
  SchoolRegisterModel,
} from "@/core/models/schools";
import { schoolService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";

export const useSchoolCreation = () => {
  const registerMutation = useMutation({
    mutationFn: (vars: SchoolRegisterModel) => schoolService.register(vars),
  });

  const createMutation = useMutation({
    mutationFn: (vars: SchoolCreationModel) => schoolService.create(vars),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: SchoolCreationModel }) =>
      schoolService.update(vars.id, vars.payload),
  });

  const create = (form: SchoolCreationModel) =>
    createMutation.mutateAsync(form);
  const register = (form: SchoolRegisterModel) =>
    registerMutation.mutateAsync(form);

  const update = (id: number, payload: SchoolCreationModel) =>
    updateMutation.mutateAsync({ id, payload });

  const isLoading =
    registerMutation.isPending ||
    createMutation.isPending ||
    updateMutation.isPending;

  return {
    isLoading,
    create,
    register,
    update,
  };
};
