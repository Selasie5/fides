import { expect, it } from "vitest";
import { buildApp } from "./app.js";

it("serves the public health contract without a database", async () => {
  const app = buildApp(async () => {});
  try {
    const response = await app.inject("/health");
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok", service: "fides-api" });
  } finally {
    await app.close();
  }
});
it("does not leak database errors through readiness", async () => {
  const app = buildApp(async () => {
    throw new Error("synthetic-secret");
  });
  try {
    const response = await app.inject("/ready");
    expect(response.statusCode).toBe(503);
    expect(response.body).not.toContain("synthetic-secret");
  } finally {
    await app.close();
  }
});
