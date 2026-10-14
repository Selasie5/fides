# Local development

This scaffold implements issue #4 under [ADR 0001](adr/0001-architecture-and-module-boundaries.md), the proposed [Neon/toolchain ADR](adr/0003-neon-and-workspace-toolchain.md), and the [security engineering practices](security/engineering-practices.md). It provides infrastructure only. No loans, money calculations, authentication, outbox delivery or financial fixtures are implemented.

## Toolchain

Use Node **24.15.0** (see .nvmrc/.node-version), pnpm **10.34.7**, and Docker Compose v2. With nvm, run `nvm install 24.15.0` and `nvm use 24.15.0`. Enable Corepack and run `corepack prepare pnpm@10.34.7 --activate`. Alternatively install that exact pnpm version with npm. Direct dependencies and the PostgreSQL image (tag and digest) are pinned. The lockfile is committed; use frozen installs. Decimal.js **10.6.0** is pinned for future exact arithmetic; no calculations are implemented.

## Fresh clone

From the repository root:

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm build
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

On PowerShell, use `Copy-Item .env.example .env` instead of cp. If script execution is restricted, use `pnpm.cmd`. Keep the documented API port 3001 when using the default Vite proxy; changing it also requires changing the proxy target.

Open http://localhost:5173. The app reads API liveness through the public SDK; it does not assert database readiness. API endpoints: http://localhost:3001/health, /ready, /openapi.json. The Vite server forwards /api to the local API. A deployed static web app requires a reverse proxy implementing the same /api mapping; deployment is outside this scaffold.

The worker stays idle until the outbox feature lands. Stop development with Ctrl+C. Run `pnpm db:down` to stop PostgreSQL; the named volume is retained. The local database binds only to loopback and uses synthetic development credentials. It is not a production configuration.

## Checks

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:integration
```

Integration tests require the migrated local database and .env. They fail rather than silently skip when PostgreSQL is unavailable. They verify an idempotent synthetic seed and transaction rollback against real PostgreSQL. Unit tests cover configuration, seed restrictions, API errors and SDK response validation. Lint also enforces ADR import boundaries. `pnpm format` formats source.

Workspace packages are built before application development and tests. After changing a package, rebuild it or run its build command in watch mode (`pnpm --filter @fides/contracts build --watch`, for example). Restart application processes as needed.

## Neon and Drizzle

Hosted PostgreSQL uses **Neon**. In the Neon Console, select the project and branch, then **Connect** and the intended database/role. Copy the provider-issued connection string into secret configuration as DATABASE_URL. Use a separate migration role and direct connection as MIGRATION_DATABASE_URL. Do not commit credentials or use a production branch for development.

The Node API uses Drizzle's node-postgres adapter for both Neon and Docker PostgreSQL. This preserves interactive transactions and avoids a second local-only database adapter. [Drizzle documents node-postgres for serverful Neon applications](https://orm.drizzle.team/docs/connect-neon); [Neon accepts standard PostgreSQL connections](https://neon.com/docs/connect/connect-from-any-app). Keep sslmode=require or verify-full in hosted URLs; production configuration requires TLS. Provision least-privilege roles before deployment; the scaffold does not provision Neon projects or permissions.

Run `pnpm db:generate` after schema changes and review the generated SQL and metadata in drizzle/. Apply reviewed migrations with `pnpm db:migrate`; migrations are explicit and never run automatically at API startup. In production, MIGRATION_DATABASE_URL is mandatory. There is no automatic down migration; review a forward corrective migration or restore plan before applying changes. Local synthetic seeding refuses hosted connections, production mode and databases other than fides_dev.

The only initial table is development_markers. It holds a synthetic workspace marker, not client, lender or financial records. The fixture package makes no claim of independently reviewed financial examples; those belong to issue #7.

## Review

Lead-maintainer review is required for #4. Database migrations also require the designated backend/security reviewer under the engineering practices. No license grant is introduced: package license metadata and SDK publication remain subject to #22. CI implementation remains #6.
