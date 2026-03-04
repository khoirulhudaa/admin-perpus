import { lang } from "@/core/libs";
import { z } from "zod";

export const userUpdateSchema = z.object({
  isActive: z.enum(["1", "2"]).optional(),
  member: z.enum(["noMember", "member"]).optional(),
  name: z
    .string()
    .min(1, {
      message: lang.text("fieldIsRequired", { field: lang.text("adminName") }),
    }),
});
