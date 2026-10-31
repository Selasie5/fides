# Engineering security practices

## Safe data and logs

Use generated fictional identities and test credentials in examples, fixtures, screenshots and issues. Never use redacted production dumps as a shortcut: residual identifiers and metadata can still expose people.

Allowlist structured log fields such as request ID, opaque lender/actor ID when necessary, operation, event ID, status and duration. Do not log authentication headers, tokens, session cookies, passwords, bank/account identifiers, identity document values, names/contact details, request bodies or raw provider payloads. Avoid amounts and free-text notes in general application telemetry; approved restricted financial audit records are a separate system.

Sanitize untrusted strings to prevent log injection. Return safe client errors; keep stack traces restricted and stripped of payloads. Apply access, retention and deletion policy to observability vendors as well as local logs. Test redaction with synthetic sensitive values.

## Secrets and credentials

Use environment or an approved secret manager; commit only placeholder configuration. Separate local, CI, staging and production credentials. Limit database permissions and keep migration credentials separate from application credentials. Rotate suspected exposures, inspect their use privately and prevent further leakage. Removing a secret from the current file does not revoke it.

Secret scanning and push protection must be configured and verified when available; documentation is not proof they are enabled.

## Dependency updates

1. Pin runtime/package-manager versions and commit lockfiles when scaffolding lands.
2. Use frozen-lockfile installation in CI; review manifest and lockfile changes together.
3. Configure an update tool with separate reviewed PRs and a documented cadence.
4. Assess advisories for reachable impact privately when appropriate; prioritize fixes by impact and exposure.
5. Run relevant financial, integration and build checks; inspect new install scripts and transitive changes.
6. Release reviewed fixes with migration/upgrade guidance when needed.

No unconditional automatic merge for updates affecting financial arithmetic, authentication, database drivers, imports or release tooling. Until automation exists, the lead maintainer coordinates a weekly dependency check once manifests are introduced. No production security SLA is implied.

## Review requirements

Every change uses a PR. Authentication, lender isolation, migrations, financial commands, provider callbacks, imports, webhook delivery, logging and CI need a designated security/backend reviewer. Money, schedules, allocation and journal changes additionally need a designated financial reviewer and independently checked fixtures.

Issue #5 records CODEOWNERS ownership, but branch rules, required reviews, and contributor agreement checks must still be configured and verified in #6 and #22. Do not claim those gates exist before verification. If the lead maintainer uses a temporary review bypass, document rationale and validation in the PR; a bypass does not establish independent review.

A security-sensitive PR describes the affected trust boundary, abuse cases, permissions, failure/rollback behaviour, retry/concurrency behaviour, logging impact and tests. It contains synthetic evidence only. Exploit details from a private finding stay in the private advisory until coordinated disclosure.

## Readiness checklist

- [ ] Relevant threat-model rows have implementation evidence.
- [ ] Negative authorization and lender-reference tests pass.
- [ ] Financial retries/concurrency/rollback behaviour is verified where affected.
- [ ] Logs and errors contain no synthetic sensitive markers.
- [ ] Dependency changes and CI permissions are reviewed.
- [ ] Operator configuration and remaining risks are documented.
- [ ] Private reporting route is enabled and verified before advertised.

This checklist is a review aid, not certification or a substitute for deployment security assessment.
