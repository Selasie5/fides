import { sql } from "drizzle-orm";
import { buildApp } from "./app.js";
import { parseEnv } from "./config.js";
import { connectDatabase } from "./db/connection.js";

const env = parseEnv(process.env);
const { db, pool } = connectDatabase(env.DATABASE_URL);
const app = buildApp(async () => {
  await db.execute(sql`select 1`);
});
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, async () => {
    await app.close();
    await pool.end();
  });
}
try {
  await app.listen({ host: env.HOST, port: env.PORT });
  console.info("Fides API started");
} catch {
  console.error("Fides API startup failed");
  await pool.end();
  process.exitCode = 1;
}
