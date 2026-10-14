import { defineConfig } from "drizzle-kit";
import { parseEnv } from "./src/config.js";

const env = parseEnv(process.env);
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "../../drizzle",
  dbCredentials: { url: env.MIGRATION_DATABASE_URL ?? env.DATABASE_URL },
});
