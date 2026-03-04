import { lang } from "@/core/libs";

import { z } from "zod";

export const studentEditSchema = z.object({
  email: z
    .string()
    .min(1, { message: lang.text("schoolCreationValidation5") })
    .email({ message: lang.text("schoolCreationValidation6") }),
  alamat: z.string().optional(),
  hobi: z.string().optional(),
  name: z.string().min(1, { message: lang.text("schoolCreationValidation1") }),
  jenisKelamin: z.string().optional(),
  tanggalLahir: z.string().optional(),
  role: z.string().optional(),
  rfid: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string()
      .min(8, { message: "RFID harus minimal 8 karakter" })
      .regex(/^\d+$/, { message: "RFID harus berisi hanya angka" })
      .optional() // let validator know undefined is okay
  ),
  nisn: z.string().optional(),
  namaKelas: z.string().optional(),
  idKelas: z.number().optional(),
  kelasId: z.string().min(1, "Kelas tidak boleh kosong"),
  nrk: z.string().optional(),
  nikki: z.string().optional(),
  image: z.string().optional(),
  nis: z.string().optional(),
  nip: z.string().optional(),
  nik: z.string().optional(),
  noTlp: z.string().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.number().optional(),
  status: z.number().optional(),
  sekolahId: z.number().optional(),
});
