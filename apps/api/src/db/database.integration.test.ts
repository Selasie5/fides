import { sql } from "drizzle-orm";
import { expect, it } from "vitest";
import { parseEnv } from "../config.js";
import { connectDatabase } from "./connection.js";
import { developmentMarkers } from "./schema.js";
import { assertLocalSeed, seed } from "./seed.js";

it("connects to real local PostgreSQL, seeds idempotently and rolls back transactions", async () => {
  const env = parseEnv(process.env);
  assertLocalSeed(env);
  await seed();
  await seed();
  const { db, pool } = connectDatabase(env.DATABASE_URL);
  try {
    expect(
      (await db.select().from(developmentMarkers)).filter(
        (row) => row.id === "workspace-ready",
      ),
    ).toHaveLength(1);
    await expect(
      db.transaction(async (tx) => {
        await tx.execute(
          sql`insert into development_markers values ('rollback-test', 'Synthetic rollback marker')`,
        );
        throw new Error("rollback");
      }),
    ).rejects.toThrow("rollback");
    const result = await db.execute(
      sql`select id from development_markers where id = 'rollback-test'`,
    );
    expect(result.rows).toHaveLength(0);
  } finally {
    await pool.end();
  }
});
