import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { z } from "zod";

config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
  quiet: true,
});
const result = z.coerce
  .number()
  .int()
  .min(1000)
  .max(3600000)
  .default(30000)
  .safeParse(process.env.WORKER_POLL_INTERVAL_MS);
if (!result.success)
  throw new Error("Invalid environment: WORKER_POLL_INTERVAL_MS");
console.info("Fides worker scaffold idle; outbox delivery is not implemented");
const timer = setInterval(() => {}, result.data);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.once(signal, () => clearInterval(timer));
