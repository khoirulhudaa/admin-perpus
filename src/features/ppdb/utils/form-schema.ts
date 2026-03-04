import { lang } from "@/core/libs";
import { z } from "zod";

export const classroomCreateSchema = z.object({
  className: z.string().min(1, {
    message: lang.text("fieldIsRequired", { field: lang.text("className") }),
  }),
  level: z.string().min(1, {
    message: lang.text("fieldIsRequired", { field: lang.text("level") }),
  }),
  school: z.number(),
});
