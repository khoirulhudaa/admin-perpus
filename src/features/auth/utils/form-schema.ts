import { lang } from "@/core/libs";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    confirm_password: z.string().min(1, {
      message: lang.text("fieldIsRequired", {
        field: lang.text("confirmNewPassword"),
      }),
    }),
    password: z
      .string({
        required_error: lang.text("fieldIsRequired", {
          field: lang.text("password"),
        }),
      })
      .min(8, { message: lang.text("passwordValidation1") })
      .regex(/[A-Z]/, {
        message: lang.text("passwordValidation4"),
      })
      .regex(/[a-z]/, {
        message: lang.text("passwordValidation2"),
      })
      .regex(/[0-9]/, {
        message: lang.text("passwordValidation3"),
      }),
  })
  .refine(
    (data) => {
      return data.password === data.confirm_password;
    },
    {
      message: lang.text("passwordsDontMatch"),
      path: ["confirm_password"],
    },
  );

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: lang.text("fieldIsRequired", {
        field: lang.text("email"),
      }),
    })
    .min(1, { message: lang.text("emailValidation1") })
    .email({ message: lang.text("emailValidation2") }),
});
