import { lang } from "@/core/libs";
import z from "zod";

export const letterUpdateFormSchema = z.object({
    kopSurat: z.any().optional(), // File atau string (URL/Base64)
    ttdKepalaSekolah: z.any().optional(), // File atau string (URL/Base64)
    namaKepalaSekolah: z.string().min(1, { message: lang.text("principalNameRequired") }),
    judulSurat: z.string().min(1, { message: lang.text("letterNameRequired") }),
});
