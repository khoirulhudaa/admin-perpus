import { z } from "zod"

/**
 * String optional tapi kalau diisi harus minimal 1 karakter (tidak boleh kosong)
 */
export const nonEmptyOptionalString = (message = "Tidak boleh kosong") =>
  z.string().min(1, { message }).optional()

/**
 * Number optional tapi harus valid jika diisi
 */
export const nonEmptyOptionalNumber = (message = "Harus berupa angka") =>
  z
    .number({
      required_error: message,
      invalid_type_error: message,
    })
    .optional()

/**
 * Tanggal dalam format string 'YYYY-MM-DD' (opsional)
 */
export const dateStringOptional = (
  message = "Format tanggal tidak valid (YYYY-MM-DD)"
) =>
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message })
    .optional()

/**
 * Enum string (opsional), dengan validasi kalau diisi harus sesuai pilihan
 */
export const optionalEnum = <T extends [string, ...string[]]>(
  values: T,
  message = "Pilihan tidak valid"
) => z.enum(values, { errorMap: () => ({ message }) }).optional()

/**
 * Nomor telepon Indonesia opsional tapi harus valid kalau diisi
 */
export const optionalPhoneNumber = (
  message = "Nomor telepon tidak valid (gunakan format 08...)"
) =>
  z
    .string()
    .regex(/^08\d{8,11}$/, { message })
    .optional()

/**
 * NIK 16 digit opsional
 */
export const optionalNIK = (message = "NIK harus 16 digit angka") =>
  z
    .string()
    .regex(/^\d{16}$/, { message })
    .optional()

/**
 * RFID opsional tapi harus angka dan minimal 8 karakter
 */
export const optionalRFID = (
  messageLength = "RFID harus minimal 8 karakter",
  messageFormat = "RFID harus hanya angka"
) =>
  z
    .string()
    .min(8, { message: messageLength })
    .regex(/^\d+$/, { message: messageFormat })
    .optional()
