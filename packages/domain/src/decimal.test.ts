import Decimal from "decimal.js";
import { expect, it } from "vitest";

it("supports isolated exact decimal contexts without changing global settings", () => {
  const originalPrecision = Decimal.precision;
  const Exact = Decimal.clone({
    precision: 50,
    rounding: Decimal.ROUND_HALF_EVEN,
  });
  const HigherPrecision = Decimal.clone({
    precision: 80,
    rounding: Decimal.ROUND_HALF_EVEN,
  });
  expect(new Exact("0.1").plus("0.2").toString()).toBe("0.3");
  expect(new Exact("0.1").plus("0.2").toString()).toBe(
    new HigherPrecision("0.1").plus("0.2").toString(),
  );
  expect(Decimal.precision).toBe(originalPrecision);
});
