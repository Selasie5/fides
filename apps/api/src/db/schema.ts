import { pgTable, text } from "drizzle-orm/pg-core";
// Isolated synthetic setup markers; no lender or financial schema is implied.
export const developmentMarkers = pgTable("development_markers", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
});
