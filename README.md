# Fides

**Open-source loan management infrastructure for microfinance and community lenders.**

Fides combines a headless loan engine with a thin loan officer workspace. The core handles products, schedules, interest, an append-only double-entry ledger, and portfolio reports. The app uses only the public REST API.

> **Status: design and foundation stage.** This repository is not a working lending system yet. Approved founding contributors can work on the scoped backlog. Outside contributor applications remain closed until architecture, contribution guidance, and the CLA process are ready.

## Who it is for

- Small microfinance institutions, cooperatives, community lenders, and savings groups moving from paper or spreadsheets.
- Developers and fintechs that need reusable lending infrastructure.

Fides is global by design, with Ghana as the first intended locale. Currencies, interest conventions, institution categories, integrations, and reporting policies must be configurable and versioned. Jurisdiction requirements need verification for each applicable institution.

## Technical direction

Start with a **TypeScript modular monolith backed by PostgreSQL**, with a separate React app. Record formal decisions and supported versions in architecture decision records before implementation.

| Area | Initial direction |
| --- | --- |
| Workspace | pnpm monorepo |
| API | TypeScript, Fastify, REST, OpenAPI |
| Persistence | PostgreSQL, Drizzle, reviewed SQL migrations |
| App | React, Vite, TanStack Query |
| Money | Integer minor units for posted amounts; exact decimal calculations and explicit rounding |
| Events | Loan lifecycle audit events and PostgreSQL transactional outbox |
| Testing | Vitest, property tests, real PostgreSQL integration tests, Playwright |
| Local development | Docker Compose and synthetic fixtures |

Additional services and infrastructure require a demonstrated need and a written decision.

### Planned module boundaries

| Path | Responsibility |
| --- | --- |
| `apps/api` | REST, authentication, application services, persistence |
| `apps/web` | Loan officer workspace using the public API |
| `apps/worker` | Outbox processing and webhook delivery |
| `packages/domain` | Framework-independent money, schedules, allocations, transitions, posting rules |
| `packages/contracts` | Public schemas and OpenAPI |
| `packages/sdk-ts` | Permissively licensed API client |
| `packages/test-fixtures` | Synthetic scenarios and independently reviewed expected results |
| `docs/adr` | Architecture decisions |
| `docs/domain` | Financial policies and worked examples |

These directories are planned, not implemented. Domain code must not depend on HTTP, UI, or database frameworks. The app must not import database models or calculate authoritative financial results locally.

### Ledger and audit history

Posted journals are append-only. Corrections create linked reversals and replacement entries. Loan lifecycle events preserve business history; full application event sourcing is not required by this direction.

Financial commands atomically persist business records, allocations, journals, audit events, idempotency results, and outbox records. Journals balance per currency. Lender ownership is enforced across authorization and database references.

### Financial policies before features

Specify and review rate conventions, supported flat and reducing-balance methods, day counts, calendars, grace periods, precision, rounding, residual handling, fees, penalties, allocation order, excess credit, early settlement, accounting recognition, and report thresholds.

Loans snapshot agreed product terms. Product changes must not alter existing loans. Restructuring preserves old and new schedule versions. Independently checked examples become test fixtures before the engines are implemented.

## First milestone

One synthetic loan must complete this journey through the API and app:

1. Register an individual client and choose a versioned product.
2. Preview an independently validated schedule.
3. Approve and disburse with atomic accounting.
4. Record full and partial repayments and issue receipts.
5. Show overdue obligations and outstanding principal.
6. Fully settle and reconcile principal to the ledger.

Retries and concurrent commands must not duplicate financial effects.

## Scope and roadmap

All capabilities below are planned.

- **Foundation:** architecture and financial policies, workspace, CI, contribution workflow, private security reporting, licensing and CLA review.
- **Core:** individual clients, versioned products, flat and reducing-balance schedules, origination, disbursement, repayments, receipts, ledger, overdue lists, and basic PAR reporting.
- **App:** a minimal accessible workspace proving the public API supports the full lending journey.
- **Integrations:** signed webhooks, mobile money settlement and reconciliation, and a verified Ghana locale pack.
- **Later:** group lending, savings, loan cycles, restructuring and write-off workflows, offline-capable field app, and hosted offering.

Credit scoring, automated decisioning, advanced analytics, and full offline collection are outside the initial milestone. Recording a repayment channel is distinct from integrating a live provider. Regulatory reporting and identity workflows require separately verified policies.

## Reliability and field workflows

- Writes use client-generated idempotency keys scoped to lender and operation.
- Reusing a key with the same payload returns the original result; a changed payload conflicts.
- Provider transaction references have separate duplicate checks.
- Repayments retain collection time and server recording time.
- Batch writes return a documented result per event.
- Webhooks use stable event IDs and at-least-once delivery; consumers deduplicate.
- Offline collection is designed for now and implemented later.

## Contributor backlog

The [issue tracker](https://github.com/Selasie5/fides/issues) contains scoped work with priorities, dependencies, acceptance criteria, boundaries, and review requirements.

Start with [architecture](https://github.com/Selasie5/fides/issues/1), [money policy](https://github.com/Selasie5/fides/issues/2), [loan and accounting policies](https://github.com/Selasie5/fides/issues/3), [workspace](https://github.com/Selasie5/fides/issues/4), [contribution workflow](https://github.com/Selasie5/fides/issues/5), [CI](https://github.com/Selasie5/fides/issues/6), and [financial fixtures](https://github.com/Selasie5/fides/issues/7). Resolve dependencies before dependent implementation begins.

## Contributing

Contributions to the canonical repository are by application. Approved founding contributors can work on this backlog; outside applications are not open yet.

- Claim an issue in a comment and agree scope with a maintainer.
- Submit changes through pull requests; no direct pushes to `main`.
- Include relevant tests, policy references, and documentation.
- Financial code, migrations, and authentication require designated maintainer review.
- Every contributor, including founders, completes the approved CLA process before contributions merge.
- Record significant decisions and review financial examples independently.

`CONTRIBUTING.md`, templates, `CODEOWNERS`, CI, and branch protection are tracked foundation work. Their presence and enforcement must not be assumed until completed.

## Security

Never commit real borrower data, identity documents, credentials, account numbers, or production logs. Use synthetic examples.

Do not disclose vulnerabilities in public issues. A verified private reporting route and `SECURITY.md` are tracked in [the security issue](https://github.com/Selasie5/fides/issues/21). Until published, contact a maintainer privately to arrange secure disclosure without posting sensitive details.

## License

The intended model is **AGPL-3.0 for core and app** and **Apache-2.0 for SDKs**, with a reviewed contributor agreement supporting commercial licensing plans.

License texts, package boundaries, notices, and the CLA process are tracked in [the licensing issue](https://github.com/Selasie5/fides/issues/22). Until completed, this README is not a substitute for a license grant or legal interpretation. Hosted and commercial licensing details will be documented separately.

## Disclaimer

Fides is under development and not ready for production lending. Lenders remain responsible for applicable licensing, consumer protection, data protection, accounting, and reporting obligations. This repository does not establish legal, financial, or regulatory compliance.

## Name

Fides comes from the Latin word for trust. Namespace availability and trademark review are tracked separately; technical name availability is not trademark clearance.
