import { lang } from "@/core/libs";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, {
      message: lang.text("fieldIsRequired", {
        field: lang.text("password"),
      }),
    }),
    new_confirm_password: z.string().min(1, {
      message: lang.text("fieldIsRequired", {
        field: lang.text("confirmNewPassword"),
      }),
    }),
    new_password: z
      .string()
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
      return data.new_password === data.new_confirm_password;
    },
    {
      message: lang.text("passwordsDontMatch"),
      path: ["new_confirm_password"],
    },
  );

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
