import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/libs";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { lang } from "@/core/libs";
import { changePasswordSchema, ChangePasswordSchema } from "../utils";
import { useProfile } from "@/features/profile";
import { useAlert, DashboardPageLayout, InputSecure } from "@/features/_global";

export function ChangePasswordFormPage() {
  const profile = useProfile();
  const alert = useAlert();

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_confirm_password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ChangePasswordSchema) {
    console.log("@@@ onSubmit: ", data);
    try {
      await profile.changePassword(data);
      alert.success("Kata sandi berhasil di perbarui");
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert.error(err?.message || "Terjadi Kesalahan");
    }
  }

  return (
    <DashboardPageLayout
      breadcrumbs={[
        {
          label: lang.text("changePassword"),
          url: "/change-password",
        },
      ]}
      title={lang.text("changePassword")}
    >
      <div className="max-w-lg">
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-8"
          >
            <FormField
              control={form.control}
              name="current_password"
              render={({ field, fieldState }) => (
                <FormItem className="mb-6">
                  <FormLabel>{lang.text("currentPassword")}</FormLabel>
                  <FormControl>
                    <InputSecure
                      autoComplete="current_password"
                      placeholder={lang.text("inputCurrentPassword")}
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
              name="new_password"
              render={({ field, fieldState }) => (
                <FormItem className="mb-6">
                  <FormLabel>{lang.text("newPassword")}</FormLabel>
                  <FormControl>
                    <InputSecure
                      autoComplete="new_password"
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
              name="new_confirm_password"
              render={({ field, fieldState }) => (
                <FormItem className="mb-6">
                  <FormLabel>{lang.text("confirmNewPassword")}</FormLabel>
                  <FormControl>
                    <InputSecure
                      autoComplete="new_confirm_password"
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
              className="text-white mt-8"
              type="submit"
              disabled={!form.formState.isValid || profile.mutation.isPending}
            >
              {lang.text("save")}
            </Button>
          </form>
        </Form>
      </div>
    </DashboardPageLayout>
  );
}
