import { expect, it } from "vitest";
import { parseEnv } from "./config.js";
import { assertLocalSeed } from "./db/seed.js";

const local = "postgresql://fides:synthetic-secret@localhost:5432/fides_dev";
it("accepts local PostgreSQL and validates ports", () => {
  expect(parseEnv({ DATABASE_URL: local }).PORT).toBe(3001);
  expect(() => parseEnv({ DATABASE_URL: local, PORT: "bad" })).toThrow("PORT");
});
it("rejects missing config and insecure production connections without leaking values", () => {
  expect(() => parseEnv({})).toThrow("DATABASE_URL");
  expect(() => parseEnv({ DATABASE_URL: "synthetic-secret" })).toThrow(
    "Invalid environment: DATABASE_URL",
  );
  expect(() =>
    parseEnv({ DATABASE_URL: local, NODE_ENV: "production" }),
  ).toThrow("TLS");
  expect(
    parseEnv({
      DATABASE_URL:
        "postgresql://example:placeholder@branch.example.neon.tech/db?sslmode=require",
      NODE_ENV: "production",
    }).NODE_ENV,
  ).toBe("production");
});
it("refuses hosted, production and unrelated seed targets", () => {
  expect(() =>
    assertLocalSeed(parseEnv({ DATABASE_URL: local })),
  ).not.toThrow();
  for (const url of [
    "postgresql://example:placeholder@branch.example.neon.tech/db?sslmode=require",
    local.replace("fides_dev", "other"),
  ]) {
    expect(() => assertLocalSeed(parseEnv({ DATABASE_URL: url }))).toThrow(
      "restricted",
    );
  }
  expect(() =>
    assertLocalSeed(
      parseEnv({
        DATABASE_URL: `${local}?sslmode=require`,
        NODE_ENV: "production",
      }),
    ),
  ).toThrow("restricted");
});
