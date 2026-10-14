import { seed } from "./seed.js";

try {
  await seed();
} catch {
  console.error("Local seed failed");
  process.exitCode = 1;
}
