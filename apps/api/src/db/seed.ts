import { syntheticMarkers } from "@fides/test-fixtures";
import { parseEnv } from "../config.js";
import { connectDatabase } from "./connection.js";
import { developmentMarkers } from "./schema.js";
export function assertLocalSeed(env: ReturnType<typeof parseEnv>) {
  const url = new URL(env.DATABASE_URL);
  if (
    env.NODE_ENV !== "development" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
    url.pathname !== "/fides_dev"
  ) {
    throw new Error(
      "Synthetic seed is restricted to the local fides_dev database",
    );
  }
}
export async function seed() {
  const env = parseEnv(process.env);
  assertLocalSeed(env);
  const { db, pool } = connectDatabase(env.DATABASE_URL);
  try {
    await db
      .insert(developmentMarkers)
      .values([...syntheticMarkers])
      .onConflictDoNothing();
    console.info("Synthetic local fixture ready");
  } finally {
    await pool.end();
  }
}
