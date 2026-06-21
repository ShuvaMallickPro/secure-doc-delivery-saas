import "server-only";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_S3_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
  CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),

  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).optional(),
});

function formatEnvErrors(error: z.ZodError) {
  return Object.entries(error.flatten().fieldErrors)
    .map(([key, messages]) => {
      const list = Array.isArray(messages) ? messages : [];
      return `${key}: ${list.join(", ")}`;
    })
    .join("\n");
}

function parseEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables:\n${formatEnvErrors(parsed.error)}`,
    );
  }

  return parsed.data;
}

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
