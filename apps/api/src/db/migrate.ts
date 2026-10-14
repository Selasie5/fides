import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { parseEnv } from "../config.js";
import { connectDatabase } from "./connection.js";

const env = parseEnv(process.env);
if (env.NODE_ENV === "production" && !env.MIGRATION_DATABASE_URL)
  throw new Error("Production migrations require MIGRATION_DATABASE_URL");
const { db, pool } = connectDatabase(
  env.MIGRATION_DATABASE_URL ?? env.DATABASE_URL,
);
try {
  await migrate(db, {
    migrationsFolder: fileURLToPath(
      new URL("../../../../drizzle", import.meta.url),
    ),
  });
  console.info("Database migrations complete");
} catch {
  console.error("Database migration failed");
  process.exitCode = 1;
} finally {
  await pool.end();
}
