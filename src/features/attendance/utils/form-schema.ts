import { z } from "zod";

export const attendanceCreateSchema = z.object({
  userId: z.number()
});
