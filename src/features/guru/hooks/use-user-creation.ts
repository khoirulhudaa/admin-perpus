import { UserCreationModel } from "@/core/models";
import { userService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";

export const useUserCreation = () => {
  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; payload: UserCreationModel }) =>
      userService.updateUser(vars.id, vars.payload),
  });

  const update = (id: number, payload: UserCreationModel) =>
    updateMutation.mutateAsync({ id, payload });

  const isLoading = updateMutation.isPending;

  const updateMutationStudent = useMutation({
    mutationFn: (vars: { id: number; payload: FormData }) =>
      userService.upStudent(vars.id, vars.payload),
  });

  const updateStudent = (id: number, payload: FormData) =>
    updateMutationStudent.mutateAsync({ id, payload });

  const isLoadingStudent = updateMutationStudent.isPending;

  return {
    isLoading,
    isLoadingStudent,
    update,
    updateStudent,
  };
};