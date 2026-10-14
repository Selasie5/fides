import { expect, it } from "vitest";
import { createFidesClient } from "./index.js";

it("rejects malformed server contracts", async () => {
  const client = createFidesClient(
    "http://localhost",
    async () => new Response(JSON.stringify({ status: "unexpected" })),
  );
  await expect(client.health()).rejects.toThrow();
});
it("rejects unsuccessful API responses", async () => {
  const client = createFidesClient(
    "http://localhost",
    async () => new Response("", { status: 503 }),
  );
  await expect(client.health()).rejects.toThrow("health request failed");
});
