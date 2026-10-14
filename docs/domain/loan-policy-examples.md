# Loan policy worked examples

All records are synthetic. GHS has two decimal places. These examples use policy `fides-contractual-monthly-v1`, no fee/penalty/grace unless explicitly stated, monthly rate 0.02, principal 1200.00, disbursement 1 January 2027 and three due dates: 1 February, 1 March, 1 April. Rounding is half-even.

## 1 Three schedule methods

| Method | Period | Opening principal | Principal | Interest | Payment |
| --- | --- | --- | --- | --- | --- |
| Flat | 1 | 1200.00 | 400.00 | 24.00 | 424.00 |
| Flat | 2 | 800.00 | 400.00 | 24.00 | 424.00 |
| Flat | 3 | 400.00 | 400.00 | 24.00 | 424.00 |
| Reducing equal principal | 1 | 1200.00 | 400.00 | 24.00 | 424.00 |
| Reducing equal principal | 2 | 800.00 | 400.00 | 16.00 | 416.00 |
| Reducing equal principal | 3 | 400.00 | 400.00 | 8.00 | 408.00 |
| Reducing equal instalments | 1 | 1200.00 | 392.11 | 24.00 | 416.11 |
| Reducing equal instalments | 2 | 807.89 | 399.95 | 16.16 | 416.11 |
| Reducing equal instalments | 3 | 407.94 | 407.94 | 8.16 | 416.10 |

Flat interest totals 72.00; reducing equal-principal totals 48.00; reducing equal-instalment totals 48.32. Every method totals principal 1200.00. Unrounded annuity payment is approximately 416.1056071101816756.

Zero-rate P=1000.00 over three instalments: principal 333.33, 333.33, 333.34; all interest zero.

## 2 Principal grace

One principal-grace period, three total periods, P=1200.00, r=0.02:
- Flat: payments 24.00, 624.00, 624.00; principal 0, 600, 600; total interest 72.
- Reducing equal principal: payments 24.00, 624.00, 612.00; interest 24, 24, 12; principal 0, 600, 600; total interest 60.
- Equal-instalment grace is rejected.

## 3 Partial payment and accrual

Flat loan, 1 February: accrue interest 24 (Dr interest receivable, Cr interest income). Receive 300 under principal-first allocation: Dr Bank 300; Cr principal receivable 300. Outstanding principal 900; first-instalment arrears after the due date are principal 100 + interest 24 = 124.

On 1 March accrue second-period interest 24. Receive 424: oldest instalment principal 100, oldest interest 24, second-instalment principal 300. Principal outstanding 500. Second instalment unpaid principal 100 + interest 24 = 124. This intentionally differs from the teaching guide's interest-first illustration; policy, not that illustration, controls implementation.

## 4 Advance payment and excess funds

Receive 500 on 15 January: nothing is due. Dr Bank 500; Cr customer unapplied funds 500. Principal stays 1200.

On 1 February accrue 24 interest. Apply 424 from credit: Dr customer unapplied funds 424; Cr principal receivable 400; Cr interest receivable 24. Principal is 800; unapplied credit is 76. No new bank receipt occurs.

## 5 Full early settlement and rebate

Flat loan with no previous payment. Quote for 16 January: elapsed 15 days in 31-day period. Earned interest = round(24 × 15/31) = 11.61. Quote principal 1200 + earned interest 11.61 = 1211.61.

Recognize Dr interest receivable 11.61 / Cr interest income 11.61. Receive 1211.61: Dr Bank 1211.61 / Cr principal receivable 1200 / Cr interest receivable 11.61. Cancel unearned schedule interest 72−11.61 = 60.39 through a linked settlement event. No income journal is posted for that cancellation because it was never recognized.

After a normal 424 payment on 1 February, a 15 February quote has principal 800 and elapsed 14/28 days. Flat current-period earned interest is 24×14/28=12; quote 812; remaining unearned interest 36 is cancelled. For reducing equal-principal, earned interest is 16×14/28=8; quote 808; remaining unearned interest 16 is cancelled.

A quote dated 1 February before receipt includes the full due interest 24 and all principal 1200: 1224. It does not add another day's next-period interest. Same-day disbursement settlement has zero earned interest. A changed balance revision invalidates any quote.

## 6 Penalty and waiver

Optional fixed late penalty 5.00: a 1 February unpaid instalment receives one assessment effective 2 February: Dr penalty receivable 5 / Cr penalty income 5. Repeating assessment produces no additional effect.

After the 300 partial payment, unpaid obligations are principal 100 + interest 24 + penalty 5 = 129. Waive the outstanding interest 24: Dr interest income 24 / Cr interest receivable 24. Due obligations become 105. Principal remains 900. A principal waiver or waiver of already paid interest is rejected.

## 7 Mobile money settlement

For a normal flat 424 repayment after interest accrual: Dr provider clearing 424; Cr principal receivable 400; Cr interest receivable 24. Provider later remits 420 and charges lender 4: Dr Bank 420, Dr provider expense 4, Cr provider clearing 424. Borrower repayment remains 424.

## 8 Fee disclosure

Separate origination fee 10 on the flat loan: borrower receives principal 1200 and pays fee 10 separately. Gross repayment instalments total 1272; total borrower payments including fee 1282; total credit cost 82. Dr Bank 10 / Cr fee income 10 at disbursement. Netting the fee from proceeds is rejected by this policy.

## 9 Error cases

Reject annual-effective rate supplied as nominal; unsupported grace; currency mismatch; negative/overflow amounts; irregular first due date; stale/underfunded settlement; out-of-order/closed-period backdating; dependent reversal; unsupported partial curtailment/restructuring/write-off. Each rejection leaves no partial financial records.

A payment effective 28 February entered 3 March is eligible only if the accounting period is open and no later financial-effective-date event already exists for that loan. recorded_at stays 3 March. Never quietly allocate it as a 3 March collection.

## 10 Reconciliation

For every event, total debits equal total credits. Outstanding principal reconciles to principal control accounts; unpaid recognized interest reconciles to interest receivable; unapplied funds reconcile to customer liabilities. Original schedules, receipts, allocation events and journal links remain inspectable after closure.
