import { healthJsonSchema } from "@fides/contracts";
import Fastify from "fastify";
export function buildApp(checkDatabase: () => Promise<void>) {
  const app = Fastify({ logger: false });
  app.get(
    "/health",
    { schema: { response: { 200: healthJsonSchema } } },
    async () => ({ status: "ok", service: "fides-api" }),
  );
  app.get("/ready", async (_request, reply) => {
    try {
      await checkDatabase();
      return { status: "ok" };
    } catch {
      return reply.code(503).send({ status: "unavailable" });
    }
  });
  app.get("/openapi.json", async () => ({
    openapi: "3.1.0",
    info: { title: "Fides scaffold API", version: "0.0.0" },
    paths: {
      "/health": {
        get: {
          responses: {
            "200": {
              description: "API liveness",
              content: { "application/json": { schema: healthJsonSchema } },
            },
          },
        },
      },
    },
  }));
  return app;
}
