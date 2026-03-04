import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  lang,
  VokadashHead,
} from "@/core/libs";
import { InputSecure, useAlert } from "@/features/_global";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
// import { useAuth } from "../hooks";
import { resetPasswordSchema } from "../utils";
import { useAuth } from "../hooks/useAuth";

  export const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const alert = useAlert();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      // Backend mengharap: { token, newPassword }
      await auth.resetPassword(data.password, String(params.token));
      alert.success("Password berhasil diperbarui!");
      navigate("/auth/login");
    } catch (err: any) {
      alert.error(err.response?.data?.message || "Gagal reset password");
    }
  }

  if (!params.token) return <Navigate to="/auth/login" replace />;

  return (
    <Form {...form}>
      <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
        <VokadashHead>
          <title>{`${lang.text("login")} | ${APP_CONFIG.appName}`}</title>
        </VokadashHead>
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{lang.text("newPassword")}</FormLabel>
                <FormControl>
                  <InputSecure
                    placeholder={lang.text("inputNewPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <FormItem className="grid gap-2">
                <FormLabel>{lang.text("confirmNewPassword")}</FormLabel>
                <FormControl>
                  <InputSecure
                    autoComplete="current_password"
                    placeholder={lang.text("inputConfirmNewPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={auth.isLoading || !form.formState.isValid}
            className="w-full"
          >
            {auth.isLoading ? lang.text("pleaseWait") : lang.text("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
