# Loan calculations and accounting policy

Policy ID: `fides-contractual-monthly-v1`.
Status: proposed for domain advisor and financial maintainer review.
Issue: #3. Approval is recorded through PR review; no external accounting or regulatory approval is implied.

This policy selects a bounded operational lending subledger for the first Fides milestone. It is not a universal lending standard, an IFRS reporting engine, or a Ghana regulatory policy. Each deployed lender must approve contractual and accounting applicability before use.

## 1 Versioned agreement and supported products

Snapshot policy version, currency/scale, original principal, rate convention, schedule method, dates, term, fees, grace rules, allocation, accounting basis and lender timezone on each loan. A product edit never rewrites an agreement. Persist original schedules and immutable financial events.

Supported v1 methods:
- Flat interest with equal principal components.
- Reducing balance with equal principal.
- Reducing balance with equal total instalments, no grace.
- Zero interest with principal split across instalments.

One currency, one disbursement, positive principal, monthly due dates, fixed rate, no automatic compounding or capitalization. Currency-changing loans, daily floating-rate products, multiple disbursements, negative rates, balloons, arbitrary irregular instalments and automatic partial prepayment recalculation are unsupported.

## 2 Rate and date conventions

Rates are exact decimal fractions, not percentages in calculations: 2% monthly is `0.02`. Accept either monthly periodic nominal rate or annual nominal rate convertible monthly; annual conversion is annual/12. Persist both input convention and normalized monthly rate. An annual effective rate is a different quantity and is rejected as a nominal input. Do not advertise APR or an effective cost disclosure until its separate algorithm is approved.

Disbursement and due dates are civil dates in the lender's snapshotted timezone. Collection and recording times are distinct timestamp instants. The first due date is exactly one calendar month after disbursement. Derive every due date from the original anchor day, clamping to the month's last day. If disbursement is month-end, all due dates stay month-end: 31 January → 28/29 February → 31 March. For a 30 January anchor: 28/29 February → 30 March. No holiday/weekend adjustment in v1; disclose actual contractual dates.

Regular periods use the approved monthly rate directly, irrespective of 28–31 days. Do not silently apply ACT/365 or 30/360 to these products. Settlement within a period uses actual elapsed days divided by actual days in that contractual period, as specified below. Irregular first periods are rejected.

A due amount becomes overdue the day after its due date. Scheduled interest for a period is recognized at that period's due date. Payments on that date are processed after the due accrual. Monthly operational recognition is selected for v1; daily financial-statement accrual and IFRS effective-interest measurement are separate scope.

## 3 Numeric assumptions and rounding dependency

Posted amounts are integer minor units; calculations use exact decimal arithmetic with at least 34 significant digits. Baseline proposal: round monetary obligations half-even to currency scale; never round rates to currency scale. Calculate regular payments from unrounded formula, then round each period's interest and the regular payment. Final principal is the exact remaining amount, and final payment is that principal plus final rounded interest.

For equal principal, divide principal in minor units: each non-final instalment receives floor(P/n); final receives the remainder. Reject schedules producing zero principal components or negative principal. Flat interest is rounded per period; total interest is the sum of posted period amounts. Split grace-adjusted flat principal across principal-paying periods.

Issues #1 and #2 are closed, but no corresponding ADRs are currently in the repository. These assumptions need comparison with the lead maintainer's decisions; any difference must be resolved explicitly before engines ship. Record supported amount/rate/term bounds with the money implementation; reject overflow and non-amortizing schedules.

## 4 Formulas and grace periods

Let P be original principal, r monthly rate, n total contractual periods, B opening scheduled principal, and g principal-grace periods.

Flat: period interest = round(P × r). Interest does not decrease with scheduled principal. Principal is split across n−g principal-paying periods. Total scheduled interest is the sum of n rounded period amounts.

Reducing equal principal: principal is split across n−g principal-paying periods. Period interest = round(B × r), using contractual scheduled opening principal. With principal grace, B stays unchanged during grace. Instalment = rounded interest + principal component.

Reducing equal instalments: A = P × r / (1 − (1+r)^−n). Period interest = round(B × r); principal = rounded A − period interest; final principal uses the residual. At r=0 use the principal split, not the interest formula.

Grace defaults to zero. Support principal-only grace for flat and reducing equal-principal products: interest remains due monthly, g must be less than n, and term includes grace. Reject interest-free, all-payment, capitalized-interest grace and equal-instalment grace in v1. No interest-on-interest, fees, penalties or unpaid amounts. Scheduled reducing products do not recalculate interest after late or partial payments; overdue principal does not generate extra ordinary interest. Disclose this limitation. Recalculation products require a later policy version.

## 5 Fees and penalties

Default both to disabled. Permit only a fixed, disclosed origination fee in the same currency, paid separately in full at disbursement. Do not deduct it from principal proceeds or finance it. If the fee is used, disclose principal received, fee paid, gross contractual repayments and total cost (interest plus fee). Fee income is recognized at disbursement under this operational policy; lenders needing effective-interest fee amortization must not use that treatment as an IFRS substitute.

Optional late penalty: a fixed amount per instalment, assessed at most once on the first civil date after its due date if any scheduled obligation remains unpaid. Default amount is zero. Snapshot the configuration and assessment identity; catch-up processing uses the original eligibility date, not today's date. No daily accumulation or compounding. Penalties require lender approval of contractual/legal applicability. A later payment does not silently cancel an assessed penalty.

Explicit waivers/reversals handle correction. Percentage penalties, recurring fees, taxes, variable fees and default jurisdiction limits are unsupported.

## 6 Payment allocation and advance funds

Process eligible unpaid due instalments oldest due date first. Within each instalment allocate principal → interest → associated fees → penalties. This principal-first baseline reduces overdue principal before charges; it is a product decision requiring disclosure, not a legal universal rule. At a due date recognize obligations before allocating that day's payment. Stable component IDs break ties.

Allocate only to due obligations; do not automatically prepay future scheduled interest or reduce future principal. Funds received before due dates, or remaining after due allocation, become customer unapplied funds liability. On a due date, automatically apply available unapplied funds after accrual, using a separately idempotent allocation event. That event creates no new cash receipt.

A receipt distinguishes received amount, applied components, unapplied credit and remaining principal. Closure requires zero principal and due charges; remaining credit has an explicit refund or transfer disposition. Do not treat excess credit as income. Transfers across loans require an authorized separate operation and are deferred in v1.

## 7 Early settlement and rebate

Full early settlement is supported through a server-calculated quote; partial principal curtailment is not.

Quote components: outstanding principal + unpaid previously recognized interest/fees/penalties + earned current-period interest − available unapplied credit. Show any refundable credit separately; net payable cannot be negative. Future scheduled interest is cancelled through an explicit settlement adjustment, not deleted. No settlement fee in this version.

Earned current-period interest = round(original current-period scheduled interest × elapsed actual days / actual period days). The period starts on disbursement or the prior contractual due date. Quote effective dates lie within the active period; accrual through the latest due date happens first. At an exact due date the completed period is fully recognized and next-period elapsed days are zero. At disbursement elapsed days are zero. After final maturity, all scheduled interest is already recognized; no extra ordinary interest is added.

This proportional rule applies to both flat and scheduled reducing methods; it does not recompute a new daily reducing product from actual payment history. Quote has an effective date, policy version, balance revision and component breakdown. It is usable only on that date and revision. Any payment, waiver, reversal or new assessment invalidates it. Recalculate and obtain borrower acceptance if stale.

Recognize only earned current-period interest at settlement; then allocate available credit and new payment to settle obligations. Waive/cancel unearned current and future schedule interest through a linked event. Do not allow normal due-only allocation to accidentally leave the settlement's earned interest unpaid. A quote is not a payment or journal. Underfunded settlement is rejected atomically; a borrower can instead record an ordinary partial payment. Overfunding remains a liability pending refund.

## 8 Waivers and backdating

Authorized waivers may remove outstanding recognized interest, fee or penalty obligations, never principal. Record approver, reason, effective date, affected component and linked journal; recognized revenue reversal debits the relevant income and credits its receivable. Waiving already paid amounts requires a separate refund workflow and is unsupported. Future interest cancellation only follows settlement; arbitrary schedule editing is unsupported.

Permit a past collection date only when its effective date is not before the latest financial effective date for that loan and the lender's accounting period is open. Catch up eligible due accrual/penalty events through that date before allocation. Never accept a client-provided recording timestamp. Reject closed-period and out-of-order backdating with explicit errors; do not silently move dates or replay history.

A correction that requires reallocating subsequent payments is unsupported until a reviewed replay/reversal workflow exists. Simple reversal is permitted only if no later financial events depend on the transaction, in an open period, with authorization. Retain original and reversal records; reverse allocations and journal atomically.

## 9 Accrual journals and settlement channels

Operational basis: scheduled interest accrued at due dates, optional penalty accrued at assessment, fixed origination fee recognized at disbursement. Separate contractual schedule obligations from recognized ledger receivables. All journals balance per currency and commit atomically with domain effects.

| Event | Debit | Credit |
| --- | --- | --- |
| Disbursement P | Principal receivable P | Bank/cash P |
| Fee F paid separately | Bank/cash F | Fee income F |
| Due interest I | Interest receivable I | Interest income I |
| Penalty X assessed | Penalty receivable X | Penalty income X |
| Received and applied R | Bank, agent cash or provider clearing R | Principal/interest/charge receivables by allocation |
| Unapplied excess U | Receiving asset U | Customer unapplied funds U |
| Apply existing credit U | Customer unapplied funds U | Allocated receivables U |
| Cash remittance R | Office cash R | Agent cash R |
| Provider settles R less fee F | Bank R−F and provider expense F | Provider clearing R |
| Refund unapplied funds U | Customer unapplied funds U | Bank/cash U |
| Recognized interest waiver I | Interest income I | Interest receivable I |
| Reversal | Exact opposite of original lines | Exact opposite of original lines |

Split received payment between allocated and unapplied portions in one balanced journal. Confirm provider receipt through authenticated evidence; do not credit a borrower twice on callback and bank settlement. Provider fees borne by the lender do not reduce the borrower's gross repayment.

No principal receivable on approval alone. No full future interest recognition on disbursement. No duplicate interest income on collection after accrual. Reversal does not move real money; refund requires evidence of an actual outgoing transaction.

## 10 Deferred accounting and unsupported commands

Reserve events/references for write-off approval, allowance utilization, recovery, restructuring lineage and original/new schedules. Reject these financial commands in v1 until separate policies exist. Write-off is not repayment; it must not delete history or assert that legal debt disappears.

Illustrative future allowance-based principal write-off: debit loan loss allowance, credit principal receivable. Recovery may debit cash and credit recovery income under the lender's approved method. These are extension examples, not enabled posting templates. Impairment/ECL, NPL classification, effective-interest income, fee amortization, taxation and regulatory provisioning remain out of scope.

## 11 Implementation gates and references

Every engine must match [the worked examples](loan-policy-examples.md). Required checks include zero rates, grace, residual rounding, dates, due-day ordering, advance credit, partial payment, penalty deduplication, quote invalidation, settlement, waiver, closed periods, tenant references and journal reconciliation.

Selected independent reference material, consulted 14 October 2026:
- [Mifos loan product fields](https://docs.mifos.org/mifosx/user-manual/for-administrators-mifos-x-platform/administration/products/loan-products/loan-product-fields): evidence that rate conventions, repayment strategies and grace are separate product dimensions.
- [Mifos interest recalculation](https://docs.mifos.org/mifosx/user-manual/for-administrators-mifos-x-platform/administration/products/loan-products/loan-product-fields/recalculate-interest): supports distinguishing original schedules from recalculated servicing schedules.
- [IFRS interest revenue guidance](https://www.ifrs.org/news-and-events/updates/ifric/2018/ifric-update-march-2018/): effective-interest reporting has specific accounting applicability; this operational policy is not that reporting implementation.

The reference systems do not prescribe Fides's defaults. Policy choices above are recommendations requiring named project review and lender applicability review.
