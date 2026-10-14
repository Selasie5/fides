# Loan servicing and accounting baseline

Status: proposed. Related issue: #3.
Decision owner: lead maintainer; required reviewers: domain advisor and financial maintainer.

## Context

The README defines methods and an auditable ledger but not their servicing semantics. Contributors need one deterministic financial contract before implementing engines. Issues #1 and #2 are closed but their written records are not present on main.

## Decision

Adopt [fides-contractual-monthly-v1](../domain/loan-calculations-and-accounting.md) for the first implementation: fixed monthly non-compounding schedules; flat/equal-principal and reducing equal-principal/equal-instalment methods; bounded principal grace; optional disclosed fixed charges; principal-first oldest-due allocation; unapplied credit for advance funds; dated full-settlement quotes with proportional unearned-interest cancellation; due-date accrual accounting; and explicit rejection of unsupported retrospective recalculation.

The operational ledger recognizes scheduled interest at due dates. It does not implement effective-interest financial reporting or impairment accounting. Finance applicability review is required before production.

## Alternatives

- Cash recognition only: simpler, but would obscure recognized interest receivables and reconciliation.
- Daily reducing recalculation and arbitrary partial curtailment: useful later, but adds event replay, accrual and rescheduling complexity before the first reliable journey.
- Interest/charges-first allocation: common in configurable products, but not selected for this initial principal-first policy. Lenders requiring it need an approved version.
- Full IFRS/ECL accounting: necessary for some operators, but cannot be claimed from a basic loan subledger.
- Fully arbitrary policy configuration: deferred until a bounded set has independent fixtures and consistent accounting.

## Consequences

Preserve original schedules and policy snapshots. UI must disclose methods, charges and scheduled-versus-actual behaviour. Engine implementations cannot import the teaching guide's illustrative allocation order as a default. Follow the [worked examples](../domain/loan-policy-examples.md).

Before merge, resolve numeric assumptions against #2 and record reviewer approval. Before release, configure safe amount/rate/term limits, verify required fixtures and accounting gates, and obtain lender applicability review. No domain or legal sign-off is invented by this ADR.
