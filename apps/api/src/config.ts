import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { z } from "zod";

config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
  quiet: true,
});
const postgresUrl = z
  .string()
  .url()
  .refine((value) => {
    try {
      return ["postgres:", "postgresql:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  });
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  HOST: z.string().min(1).default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  DATABASE_URL: postgresUrl,
  MIGRATION_DATABASE_URL: postgresUrl.optional(),
});
export function parseEnv(input: Record<string, unknown>) {
  const result = envSchema.safeParse(input);
  if (!result.success)
    throw new Error(
      `Invalid environment: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`,
    );
  const env = result.data;
  if (env.NODE_ENV === "production") {
    for (const value of [env.DATABASE_URL, env.MIGRATION_DATABASE_URL].filter(
      Boolean,
    )) {
      const url = new URL(value as string);
      if (
        !["require", "verify-full"].includes(
          url.searchParams.get("sslmode") ?? "",
        )
      ) {
        throw new Error("Production database connections require TLS");
      }
    }
  }
  return env;
}
