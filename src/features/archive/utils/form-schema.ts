import { lang } from "@/core/libs";
import { z } from "zod";

export const courseCreateSchema = z.object({
  courseName: z.string().min(1, {
    message: lang.text("fieldIsRequired", { field: lang.text("course") }),
  }),
  // classroom?: z.number(),
  school: z.number(),
  classroom: z.number(),
});
