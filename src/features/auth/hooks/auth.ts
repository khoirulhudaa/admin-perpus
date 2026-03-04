import { LoginRequestModel } from "@/core/models/auth";
import { authService } from "@/core/services/auth";
import { storage } from "@itokun99/secure-storage";
import { getToken, saveToken } from "../utils";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UseAuthMutationVariables {
  type: "login" | "logout";
  data?: unknown;
}

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = useCallback(() => Boolean(getToken()), []);

  const loginMutation = useMutation({
    mutationFn: (vars: LoginRequestModel) => {
      return authService.login(vars);
    },
    onSuccess: (res) => {
      if (res.data?.token) {
        saveToken(String(res?.data?.token));
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => {
      return authService.logout();
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (vars: { email: string }) => {
      return authService.forgotPassword(vars);
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: (vars: { password: string; token: string }) => {
      return authService.resetPassword(
        { password: vars.password },
        { path: String(vars.token) }
      );
    },
  });
  const resetPasswordMutationDefault = useMutation({
    mutationFn: (vars: { id: string }) => authService.resetPasswordDefault(vars.id),
  });

  const login = (req: LoginRequestModel) => loginMutation.mutateAsync(req);
  const logout = () => {
    logoutMutation.mutateAsync();
    setTimeout(() => {
      // storage.clear();
      storage.delete("auth.token");
      localStorage.removeItem('token');
      localStorage.removeItem('attendanceTarget');
      queryClient.clear();
      navigate?.("/auth/login", { replace: true });
    }, 10);
  };

  const forgotPassword = (email: string) => {
    return forgotPasswordMutation.mutateAsync({ email });
  };

  const resetPassword = (password: string, token: string) =>
    resetPasswordMutation.mutateAsync({ password, token });

  const resetPasswordDefault = (id: string) =>
    resetPasswordMutationDefault.mutateAsync({id});

  const isLoading =
    loginMutation.isPending ||
    logoutMutation.isPending ||
    resetPasswordMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resetPasswordMutationDefault.isPending;

  return {
    isLoading,
    login,
    logout,
    resetPassword,
    forgotPassword,
    isAuthenticated,
    resetPasswordDefault
  };
};
