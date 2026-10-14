import { z } from "zod";
export const healthSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("fides-api"),
});
export type Health = z.infer<typeof healthSchema>;
export const healthJsonSchema = z.toJSONSchema(healthSchema, {
  target: "draft-7",
});
