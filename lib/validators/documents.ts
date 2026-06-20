import { z } from "zod";

/**
 * Prisma @default(cuid()) uses CUID v1.
 * Zod 4 deprecates z.cuid() in favor of z.cuid2(), but Prisma IDs are still v1 —
 * so we validate with the same pattern Zod uses internally (regexes.cuid).
 */
const PRISMA_CUID_PATTERN = /^[cC][0-9a-z]{6,}$/;

export const documentIdSchema = z
  .string()
  .regex(PRISMA_CUID_PATTERN, "Invalid document ID");

export const shareLinkIdSchema = z
  .string()
  .regex(PRISMA_CUID_PATTERN, "Invalid share link ID");
export const recipientEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("A valid recipient email is required"));
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
] as const;

export const ALLOWED_UPLOAD_EXTENSIONS = [
  "pdf",
  "txt",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
] as const;

const BLOCKED_UPLOAD_EXTENSIONS = new Set([
  "exe",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "bz2",
  "msi",
  "bat",
  "cmd",
  "sh",
  "dll",
  "js",
  "html",
  "htm",
]);

function getFileExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

const uploadFileSchema = z
  .custom<File>((value) => value instanceof File, "No file provided")
  .refine((file) => file.size > 0, "File is empty")
  .refine(
    (file) => file.size <= MAX_UPLOAD_BYTES,
    `File must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller`,
  )
  .refine(
    (file) => !BLOCKED_UPLOAD_EXTENSIONS.has(getFileExtension(file.name)),
    "File type not allowed. Use PDF, TXT, or common image formats.",
  )
  .refine(
    (file) => {
      const ext = getFileExtension(file.name);
      const mimeAllowed = ALLOWED_UPLOAD_MIME_TYPES.includes(
        file.type as (typeof ALLOWED_UPLOAD_MIME_TYPES)[number],
      );
      const extAllowed = ALLOWED_UPLOAD_EXTENSIONS.includes(
        ext as (typeof ALLOWED_UPLOAD_EXTENSIONS)[number],
      );
      return mimeAllowed || extAllowed;
    },
    "File type not allowed. Use PDF, TXT, or common image formats.",
  );

export const uploadFormDataSchema = z.object({
  file: uploadFileSchema,
});

/** Turn Zod failures into short messages for UI / thrown errors. */
export function formatZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid input";
}

export function parseDocumentId(raw: unknown): string {
  const result = documentIdSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
}

export function parseShareLinkId(raw: unknown): string {
  const result = shareLinkIdSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
}

export function parseRecipientEmail(raw: unknown): string {
  const result = recipientEmailSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
}

export function parseUploadFile(raw: unknown): File {
  const result = uploadFileSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
}

/** Client-safe validation — returns an error message or null if valid. */
export function getUploadFileValidationError(raw: unknown): string | null {
  const result = uploadFileSchema.safeParse(raw);
  if (!result.success) {
    return formatZodError(result.error);
  }
  return null;
}

/** Sanitize filename for S3 keys and DB display. */
export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}
