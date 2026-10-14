# ADR 0003 Neon persistence and workspace toolchain

Status: proposed for approval with the issue #4 scaffold PR.
Decision owner: Selasie5, lead maintainer. Recorded: 14 October 2026.

## Decision

Use Neon for hosted PostgreSQL as requested for issue #4. This selects the database provider left open in ADR 0001; API, worker and web hosting remain undecided. Keep Docker PostgreSQL for credential-free local development.

Use Drizzle's node-postgres adapter in the Node API. Neon supports standard PostgreSQL connections, and this adapter supports interactive transactions on both hosted and local databases. Do not introduce an HTTP-only database adapter for the future financial-command path. No hosted database is provisioned by this scaffold.

Pin Node 24.15.0, pnpm 10.34.7, TypeScript 5.9.3, Fastify 5.12.7, Drizzle ORM 0.45.4, Drizzle Kit 0.31.11, React 19.3.1, Vite 8.3.4, Vitest 5.0.4 and Decimal.js 10.6.0. Manifests pin all remaining direct dependencies and pnpm-lock.yaml locks transitive resolution. Local PostgreSQL 17.6-bookworm is pinned by image digest in compose.yaml. Version updates require reviewed manifest/lockfile changes and compatibility checks.

Decimal.js is reserved for reviewed domain arithmetic under ADR 0002. This scaffold tests isolated decimal contexts; it implements no financial rules and does not establish safe product limits.

## Operations and boundaries

Use provider-issued Neon connection strings in secret configuration. Require TLS in production, keep migration credentials separate from application credentials, and apply reviewed SQL migrations explicitly. Development seeding is restricted to the local fides_dev database. No authentication or production permissions are implied by the scaffold.

The only initial database table stores synthetic development markers. API liveness and readiness are separate. The worker is idle until outbox delivery is implemented. The web accesses public contracts through the SDK. Automated import checks enforce the module dependencies described in ADR 0001.

## Validation

Run the commands in [Local development](../development.md), including the real PostgreSQL integration test. The PR records completed checks and any missing hosted or browser proof. Lead-maintainer and designated backend/security migration review remain required.

References: [ADR 0001](0001-architecture-and-module-boundaries.md), [ADR 0002](0002-money-and-rounding.md), [Drizzle Neon drivers](https://orm.drizzle.team/docs/connect-neon), [Neon PostgreSQL connections](https://neon.com/docs/connect/connect-from-any-app).
