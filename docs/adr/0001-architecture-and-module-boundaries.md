# ADR 0001 Architecture and module boundaries

 Related issue: #1.
Decision owner: Selasie5, lead maintainer. Recorded: 14 October 2026.


## Context

Fides needs reliable financial transactions and a public API that supports its own loan officer app. A small contributor team needs clear ownership and a reproducible development setup without distributed transaction complexity.

## Decision

Use a TypeScript modular monolith, PostgreSQL, Fastify REST API, Drizzle with reviewed SQL migrations, and React/Vite/TanStack Query app in a pnpm monorepo. OpenAPI is the public contract. API and worker may be separate processes from the same repository/release; they share the transactional database and do not become independent financial services.

Runtime baseline: Node.js 24 LTS and pnpm 10. Bootstrap #4 pins exact supported patch versions in runtime configuration and packageManager, commits the lockfile, and CI uses the same versions with frozen installs. Exact TypeScript, framework, PostgreSQL image and decimal-library versions are selected and compatibility-tested in #4, not implied by this ADR. No floating latest tags or unpinned production images. Reviewed security patch updates do not require changing the architectural decision.

Use Docker Compose for local PostgreSQL. Initial hosting supports containerized API/worker and static app with managed or self-hosted PostgreSQL. No hosting vendor is selected. TLS, secrets, database least privilege, backups/restore and monitored outbox processing are deployment prerequisites; #6 supplies CI. Redis, brokers, Kubernetes and microservices are deferred.

## Ownership and import boundaries

| Module | Responsibility | Allowed dependencies |
| --- | --- | --- |
| packages/domain | Money, schedules, allocation, transitions, posting rules | Approved arithmetic utilities; no HTTP, UI, ORM or environment access |
| packages/contracts | Public validation schemas and OpenAPI | Schema utilities; no database or internal domain implementation |
| packages/sdk-ts | Public API client | Public contract only; no AGPL domain/server imports |
| apps/api | Authentication, routes, application services, repositories | Domain, contracts and persistence adapters |
| apps/worker | Outbox delivery | Delivery/persistence adapters; no independent financial posting outside application services |
| apps/web | Loan officer workspace | SDK/public contract and UI libraries; no domain, database or private API |
| packages/test-fixtures | Synthetic independent expected cases | Test tools; never production data |

Domain calculations receive explicit time, policy and inputs; they do not read wall clock, network, database or global state. Infrastructure adapters invoke domain functions through application services. The web displays authoritative server-calculated amounts.

## Ledger and transactions

Use append-only posted journals and linked reversal entries, explicit loan lifecycle audit events, and conventional versioned loan/product records. Full application event sourcing is not selected. Preserve original schedules, agreement snapshots and effective/recorded times.

One database transaction persists a financial command's business records, allocations, balanced journal, audit event, command result and outbox. Use lender/operation-scoped idempotency plus payload identity and separate provider reference uniqueness. Serialize competing loan mutations with an explicit locking strategy tested in real PostgreSQL. Enforce lender-consistent record references.

External calls do not occur inside financial database transactions. The outbox worker delivers at least once using stable IDs, bounded retries and recorded attempts; recipients deduplicate. Read-model rebuilding is allowed without making asynchronous projections authoritative for financial posting.

## Alternatives and consequences

Microservices and a broker introduce deployment and distributed consistency burden before justified scale. Full event sourcing adds replay/schema evolution complexity without a demonstrated need. A database-coupled UI violates API-first reuse. A monolith still requires internal boundaries: review and automated import checks must prevent accidental coupling.

REST/OpenAPI is the fixed project interface; internal SDK separation preserves the intended permissive license boundary subject to licensing review #22. No independent claim about license compatibility is made.

## Verification and evolution

#4 must verify clean-clone development and import boundaries. #6 verifies pinned CI. #11/#13 verify journal atomicity, database constraints and concurrency. #12 verifies lender isolation. Architecture changes need a new ADR describing migration and consequences.

References: [Node.js release policy](https://github.com/nodejs/Release), [pnpm 10 compatibility](https://github.com/pnpm/pnpm.io/blob/main/versioned_docs/version-10.x/installation.md), and [ADR 0002](0002-money-and-rounding.md). Runtime sources consulted 14 October 2026.
