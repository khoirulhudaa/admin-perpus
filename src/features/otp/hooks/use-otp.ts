import { ResendOtpRequestModel, VerifyOtpRequestModel } from "@/core/models";
import { otpService } from "@/core/services";
import { useMutation } from "@tanstack/react-query";

export const useOtp = () => {
  const verifyMutation = useMutation({
    mutationFn: (vars: VerifyOtpRequestModel) => otpService.verify(vars),
  });

  const resendMutation = useMutation({
    mutationFn: (vars: ResendOtpRequestModel) =>
      otpService.resend({ email: vars.email }),
  });

  const verify = (req: VerifyOtpRequestModel) =>
    verifyMutation.mutateAsync(req);
  const resend = (req: ResendOtpRequestModel) =>
    resendMutation.mutateAsync(req);

  return {
    verify,
    resend,
  };
};
