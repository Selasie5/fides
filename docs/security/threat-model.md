# Fides threat model

## Scope and status

This is a design threat model for the architecture described in the README: a public REST API, PostgreSQL, a loan officer app, and an outbox worker. At creation, the default branch contains documentation only. Every mitigation below is a requirement for future implementation, not a tested control.

Owner: lead maintainer. Review with a designated security/backend maintainer and financial maintainer before affected features merge. Revisit when authentication, tenancy, imports, provider integrations, hosting, or financial policies change.

## Assets and trust boundaries

Assets include borrower identity and consent records; loan terms and schedules; repayments, allocations and receipts; ledger journals; lender memberships; API/session/provider credentials; webhook keys; backups; and audit evidence.

Trust boundaries:
- Browser or offline queue → API: all commands, dates, references and lender context are untrusted.
- API → PostgreSQL: authorization must survive persistence and cross-record references.
- Provider → callback endpoint: a claimed payment is untrusted until authenticated and validated.
- Worker → external webhook destination: outbound URLs and redirects can target internal services.
- Uploaded file → import parser → financial service: imported fields must not bypass domain rules.
- Contributor PR → CI → release: untrusted changes must not obtain production secrets or publish artifacts without gates.
- Operator → application/database: maintenance privileges are distinct from normal application privileges.

Threat actors include unauthenticated attackers, compromised lender users, malicious insiders, forged providers, compromised dependencies, and mistaken operators. Privileged database operators remain a residual trust risk; append-only application records alone do not stop administrator tampering.

## Threats and required mitigations

| ID | Scenario and impact | Required mitigation | Evidence before feature readiness |
| --- | --- | --- | --- |
| T01 | Lender A reads or writes lender B records through IDs, reports, exports or joins | Derive authorized lender context from membership; scope every operation; enforce lender-consistent foreign references; assess row-level security as defense in depth | Negative read/write/export tests and cross-lender reference tests |
| T02 | Stolen sessions or credentials authorize financial changes | Approved auth design; secure session/cookie settings where applicable; CSRF protection for cookie-authenticated writes; expiration/revocation; role checks; rate limiting; no secrets in logs | Revocation, unauthorized action, CSRF and session tests |
| T03 | Repeated, concurrent or tampered commands duplicate payments or alter principal | Scoped idempotency keys and payload hash; unique provider references; transaction/locking strategy; server-side policy validation | Concurrent PostgreSQL tests, retry conflicts and rollback cases |
| T04 | Posted journals are edited or incomplete records commit | Balanced journals per currency; application-role update/delete denial; atomic financial writes; linked reversals with authorization | Database constraint/permission tests and fault injection |
| T05 | Forged, replayed or reordered callbacks create fake receipts | Provider-specific signature verification over required raw payload; replay controls according to provider protocol; amount/currency/lender validation; deduplication; explicit state transitions | Invalid signature, replay, duplicate, mismatch and ordering tests |
| T06 | Webhook URLs enable SSRF or expose keys and borrower data | URL/network policy; reject internal and metadata destinations; validate DNS and redirects at delivery; egress restrictions; signed minimal payloads; safe retry history | Local/private/IPv6/redirect/DNS tests and delivery signature tests |
| T07 | Malformed or hostile imports bypass controls or exhaust resources | Explicit supported formats; size/row/depth limits; sandboxed parsing where needed; dry-run validation; approved import commands; safe spreadsheet exports | Oversize, malformed, formula-cell, duplicate and unauthorized import tests |
| T08 | Logs, exports or exception reports leak identity or secrets | Allowlisted structured logs; redact payloads; authorized exports; access controls and retention; no raw provider/customer payloads in telemetry | Log inspection fixtures and authorization tests |
| T09 | Product edits, timezone drift or backdating rewrite agreements and reports | Immutable terms snapshots; schedule/policy versions; separate effective/recorded time; controlled backdating and closed periods | Historical as-of, versioning, reversal and date-boundary fixtures |
| T10 | Compromised dependencies or CI steal secrets or modify releases | Locked installs, reviewed updates, minimal CI permissions, isolated untrusted PR execution, release review and artifact provenance plan | Workflow review and reproducible build/update checks |
| T11 | Error or outage loses financial evidence | Transactional outbox; retry-safe commands; tested backup/restore; reconciliation and restricted incident audit | Restore drill, outbox crash/retry tests and reconciliation cases |
| T12 | Unbounded APIs or batch commands deny service | Auth-aware quotas; request/batch limits; pagination; timeouts; bounded retry; per-item batch semantics | Limit/timeout tests and capacity checks before deployment |

## Financial invariants

Journals balance per currency. Payment amounts equal allocations plus explicitly unapplied credit. Principal reconciles to ledger control accounts. Corrections preserve history. Failed commands leave no partial posting. Retry behaviour does not depend on an untrusted client asserting a prior success.

Validate permission on each financial command, including reversals, waivers, imports and replay operations. Unmatched provider payments remain explicit reconciliation exceptions rather than guessed borrower allocations.

## Residual risks and open decisions

Authentication mechanisms, row-level security, deployment topology, key management, backup retention, and monitoring thresholds are not settled by this document. Provider callback controls must follow the chosen provider's protocol. Financial policy and Ghana-specific controls need independent domain review.

Do not treat audit events as tamper-proof evidence without privileged-access controls and a reviewed evidence-retention design. A lender user's access does not imply permission to export all personal records.

## Related work

Architecture #1; CI #6; ledger #11; authorization #12; idempotency #13; OpenAPI #18; outbox/webhooks #20; private security reporting #21; locale validation #23. Controls are verified in those implementation PRs, not by checking off this design document.
