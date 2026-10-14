# ADR 0002 Money representation and rounding

Status: recorded baseline; merge approves this record. Related issue: #2.
Decision owner: Selasie5, lead maintainer. Recorded: 14 October 2026.
Domain and financial reviewers validate this baseline before production financial engines ship.

## Decision

Represent posted monetary amounts as signed integer minor units, currency code and snapshotted scale. Use TypeScript bigint internally and PostgreSQL NUMERIC(38,0) for persisted minor units. This is an exact integer storage choice, not a JavaScript number. JSON uses canonical decimal integer strings, for example {"currency":"GHS","scale":2,"minorUnits":"41611"}. No numeric JSON amounts or implicit bigint-to-number conversions.

Monetary primitives allow signed values for differences/reversals. Business operations constrain principal and received payments to positive values; ledger lines store positive magnitude with explicit debit/credit side. Zero lines are omitted. Reject out-of-range values before persistence: absolute minor units must be less than 10^38. Intermediate and resulting values are checked, including aggregate journal totals.

Currency scale is approved metadata, not inferred from display formatting. Support configured scales 0 through 3 initially. Currency code and scale must match for addition/comparison/posting. Changing metadata cannot reinterpret existing records. One journal balances in one currency; FX conversion needs a separate policy.

## Parsing and rates

Minor-unit inputs match a canonical integer string: 0 or an optional minus followed by a nonzero leading digit and remaining digits; reject negative zero, leading zeros, exponent notation, whitespace, grouping commas, fractional minor units and NaN/Infinity.

A UI may accept human decimal amounts, but its conversion must be exact and reject excess fractional places rather than silently round a payment instruction. Currency symbols and locale separators are UI concerns, not domain input. A scale-2 string 416.11 converts to 41611; 416.111 is rejected as an input amount.

Rates are decimal-fraction strings with an explicit period/convention, never money objects or percentages encoded ambiguously. Preserve supplied rate and convention; annual nominal-to-monthly conversion is calculation, not a rounded currency value. Rate bounds and supported conventions belong to the versioned loan policy.

## Calculation precision

Use a reviewed arbitrary-precision decimal library configured for 50 significant digits and half-even rounding. Never use binary floating-point arithmetic for money/rates or Math.pow for financial formulas. Division and annuity powers may require precision-limited approximations; posted outputs must be stable when recalculated at 80 significant digits in numeric fixtures. If they differ, reject the case or increase precision through a reviewed decision; do not guess a cent.

Direct integer arithmetic is exact. Decimal context belongs to domain arithmetic, not mutable global application settings. Zero-rate annuity calculations use principal splitting rather than division by zero. Library choice/version and safe rate/term limits are pinned and validated in #4/#8 before supported products are enabled. Storage bounds alone are not safe product limits.

## Rounding and residual rules

Round only at documented obligation/posting boundaries, using half-even to the currency scale. Preserve intermediate precision and never round a rate to two decimals.

For fixed equal-principal splits, divide integer principal by the number of principal-paying instalments: all non-final components use floor division for positive principal, and the last takes the remainder. Negative split inputs are invalid.

Flat interest is calculated and rounded separately for each period; total is the sum of those posted period amounts. Equal-instalment reducing schedules round the regular payment and each period's interest; principal is their difference. Final principal equals remaining principal exactly, with final payment = remaining principal + rounded final interest.

For full settlement, round earned current-period interest once after multiplying scheduled period interest by elapsed/period days. Cancel the unearned remainder explicitly. Never add balancing “rounding income” to hide inconsistent allocations. Discount/tax/FX rules are outside this ADR.

## Checked examples

| Case | Input | Expected |
| --- | --- | --- |
| Scale 0 midpoint | 2.5 / 3.5 units | 2 / 4 units |
| Scale 2 midpoint | 1.005 / 1.015 | 1.00 / 1.02 |
| Scale 3 midpoint | 1.2345 / 1.2355 | 1.234 / 1.236 |
| Negative midpoint | −1.005 / −1.015 at scale 2 | −1.00 / −1.02 |
| Principal residual | 1000.00 / 3 at scale 2 | 333.33, 333.33, 333.34 |
| Scale 0 split | 10 units / 3 | 3, 3, 4 |
| Scale 3 split | 1.000 / 3 | 0.333, 0.333, 0.334 |
| Rate is not currency | 0.24 nominal annual / 12 | 0.02 monthly |
| Settlement | 24.00 × 15/31 | 11.61 |
| Incompatible amounts | GHS scale 2 + another currency/scale | Reject |
| Unsafe input | numeric JSON amount or 416.111 at scale 2 | Reject |

The [loan examples](../domain/loan-policy-examples.md) add period schedules and total reconciliation. Tests must cover precision stability, reversals, maximum bounds, zero, repeating fractions, rate convention validation and amount conservation.

## Alternatives and consequences

JavaScript number/binary floating point risks monetary drift. Decimal major-unit database columns can be exact but leave scale and quantization less explicit. bigint cents hardcoded for every currency fails configurable scales. Integer storage plus explicit decimal calculations keeps postings exact and policies visible, at the cost of string serialization and deliberate conversions.

#8 implements primitives; #7 independently reviews fixtures. This ADR chooses numerical representation and boundaries, not interest recognition, allocation, legal fees or regulatory rounding mandates. A lender needing a different convention requires a new versioned policy, never silent mutation of existing loans.
