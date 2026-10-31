# Contributing to Fides

Fides is in the design and foundation stage. It is not a working lending system and it is not ready for production lending. Read the [README](README.md), the [architecture and module boundaries ADR](docs/adr/0001-architecture-and-module-boundaries.md), the [money and rounding ADR](docs/adr/0002-money-and-rounding.md), the [loan calculation and accounting policy](docs/domain/loan-calculations-and-accounting.md), the [threat model](docs/security/threat-model.md), and the [engineering security practices](docs/security/engineering-practices.md) before starting work.

This document implements issue #5. It describes the intended workflow. It does not grant repository access, approve an application, or create a legal agreement.

## Founding contributors and outside applications

Fides began with a small founding group. The only maintainer identity recorded in this repository is **@Selasie5**, who is recorded as lead maintainer and decision owner in [ADR 0001](docs/adr/0001-architecture-and-module-boundaries.md) and in [CODEOWNERS](.github/CODEOWNERS). No other founding contributor, maintainer team, or reviewer identity is recorded here, and this document does not invent one. A future founding contributor or maintainer must be added by a reviewed change to `CODEOWNERS` and the relevant decision record; a comment, issue assignment, or pull request cannot grant that status.

Contributions to the canonical repository are by application. Approved founding contributors can work on the scoped backlog. **Outside contributor applications remain closed.** They open only after the approved contributor agreement and licensing review (#22), CI and branch protection (#6), and the remaining foundation work are complete. Opening a pull request does not change that status.

## Before you start

1. Check the issue tracker for an existing issue. Do not duplicate scoped work.
2. Resolve the issue's dependencies first. Do not start dependent implementation before its dependency is resolved.
3. Read the policy, ADR, and security documents linked by the issue.
4. Claim the issue as described below and wait for a maintainer to confirm the scope.

## Claiming an issue

Comment on the issue with:

- your intended scope and a short implementation plan;
- the acceptance criteria you expect to satisfy;
- any dependency or policy question that could change the scope;
- the branch name you intend to use.

A maintainer confirms the claim in a comment. **No assignee is presumed.** An issue is not claimed until a maintainer confirms it, even if the issue already shows an assignee from earlier triage. Do not open a review-ready pull request before the claim is confirmed. If the scope changes materially, agree on the change first.

Do not claim more work than you can complete. If you stop working on a claimed issue, say so in the issue so it can be released.

## Branches and commits

- `develop` is the integration branch. Open pull requests against `develop`.
- `main` is updated by maintainers from reviewed integration work. Do not target `main` unless a maintainer directs you to.
- Do not push directly to `develop` or `main`. Use a branch and a pull request.
- Name branches `type/issue-number-short-description`, for example `docs/5-contribution-workflow` or `feat/9-flat-interest`.
- Use a type from `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, or `ci`.
- Keep commits focused and the history understandable. Do not mix unrelated formatting, dependency, or refactoring changes into a scoped pull request.
- Keep your branch current with `develop` using the method a maintainer requests. Rebase only your own unpublished work; do not rewrite shared history.
- Do not commit secrets, local environment files, generated credentials, database dumps, or real borrower data. Use the documented synthetic setup.

Branch protection and required review rules are not yet verified (see #6), so these branch rules are manual expectations, not automated gates.

## Pull requests

Open one pull request per issue and link the issue in the description (`Closes #5`). Fill in the [pull request template](.github/pull_request_template.md) and keep it accurate. Draft pull requests are welcome for early feedback; mark the pull request ready only when the definition of done is met.

Every pull request must address the template prompts that apply:

- **Policy:** cite the ADR, domain policy, or issue decision that governs the change. If a decision is missing, propose an ADR or policy change in the same or a preceding pull request.
- **Tests:** describe the tests added or updated and the commands run. A documentation-only change still needs a documented verification step, such as a link check, render check, or review of the affected policy.
- **Migrations:** state whether the change adds a schema or data migration. Reviewed SQL migrations are committed under `drizzle/`; they never run automatically at API startup. Include the forward plan and note that there is no automatic down migration. Database changes need the designated backend/security reviewer.
- **Security:** describe the affected trust boundary, authorization and lender-isolation impact, failure and retry behaviour, logging impact, and any dependency or permission change. Reference the applicable [threat model](docs/security/threat-model.md) rows.
- **Documentation:** update affected documentation, examples, and decision records. Financial policy or worked-example changes need independent financial review.
- **Data:** use synthetic identities and synthetic financial records only. Never include production logs, account numbers, identity documents, credentials, or real borrower information in code, tests, screenshots, or comments.

Small, reviewable changes merge faster than large mixed changes. If a change grows beyond the confirmed scope, split it.

## Review and merge

Review requirements depend on what the change affects:

| Change | Required review |
| --- | --- |
| All changes | Lead maintainer review |
| Money, rates, schedules, allocation, posting, ledger, financial policy, or financial fixtures | Designated financial maintainer review, plus independently checked expected results |
| Migrations, authentication, lender isolation, provider callbacks, imports, webhook delivery, logging, or CI | Designated security/backend reviewer |
| Public contracts and OpenAPI | Lead maintainer review |
| Documentation and decision records | Lead maintainer review; financial policy documents also need financial review |

[CODEOWNERS](.github/CODEOWNERS) records the verified maintainer identity for these paths. GitHub can request review from a code owner when a repository ruleset requires it, but a `CODEOWNERS` file does not itself block a merge. Branch protection, required status checks, and review automation are tracked in #6 and must not be assumed to exist until they are configured and verified.

Reviewers may request changes, ask for a narrower scope, or decline a change that conflicts with the architecture, financial policy, or security requirements. Approval is not a transfer of responsibility for the contributor's claims. A temporary maintainer bypass, if ever used, must be documented in the pull request with its rationale and validation; a bypass does not create independent review.

## Required financial reviewer and CLA gate

Two gates are required before a contribution merges. **Neither is automated or verified today.** Do not describe either gate as enforced, and do not treat a checked box or a `CODEOWNERS` entry as proof that it was satisfied.

### Financial reviewer gate

Changes that affect money representation, rates, schedules, allocation, repayments, receipts, posting, journals, ledger reconciliation, financial policy, or independently checked financial fixtures require review by a **designated financial maintainer**. The reviewer must check the policy basis and the expected numeric results independently; author self-review is not independent financial review.

The repository currently records one maintainer, @Selasie5. That means an independent financial reviewer is not yet designated. Until a second qualified financial reviewer is recorded through a reviewed change to `CODEOWNERS` and the relevant decision record, financial implementation work should not merge on the basis that independent financial review occurred. This is a limitation of the current foundation stage, not a claim that review is unavailable forever.

### Contributor agreement gate

Every contributor, including founding contributors, is expected to complete the approved contributor agreement before contributions merge. The agreement text, signature record, and enforcement process are tracked in #22 and are **not approved yet**. There is no CLA bot and no required CLA status check.

Until #22 completes, there is no approved agreement to sign and no verified way to confirm compliance. Do not mark a pull request as CLA-cleared, and do not describe the requirement as satisfied. This section explains the requirement; it does not claim the gate exists or that it is enforced.

## Definition of done

A contribution is done when all applicable items are true:

- [ ] The issue was claimed and the scope was confirmed by a maintainer.
- [ ] The change is limited to the confirmed scope, with unrelated work split out.
- [ ] Tests are added or updated for the changed behaviour, or a documentation-only change records how it was verified.
- [ ] The validation commands below pass, or any unavailable check is explained in the pull request.
- [ ] Documentation, examples, and decision records are updated.
- [ ] Any migration is reviewed, includes a forward plan, and does not run automatically at startup.
- [ ] The security prompts in the pull request are answered, including authorization, lender isolation, retry, logging, and dependency impact where relevant.
- [ ] The required reviewer designations are confirmed, including the financial reviewer where required.
- [ ] The contributor agreement status is resolved for the contributor.
- [ ] Only synthetic data is used, and no secrets or real borrower data are included.
- [ ] The pull request template is complete and the linked issue's acceptance criteria are addressed.

A merged pull request does not by itself close a gate, approve an outside application, establish legal compliance, or create a license grant.

## Validation

Run the checks relevant to your change from the repository root. Use the pinned toolchain in [Local development](docs/development.md).

```sh
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:integration
```

`pnpm test:integration` requires the migrated local PostgreSQL database and `.env` described in [Local development](docs/development.md). Report the commands you ran and any check you could not run. Do not claim a check passed if it was skipped.

## Security

Do not report suspected vulnerabilities in public issues or pull requests. Read [SECURITY.md](SECURITY.md) first. The private reporting route is **pending activation and verification**, so no private intake address is advertised. If you cannot access a private report form, withhold exploit details and arrange a private channel with a known maintainer.

Never commit secrets, production logs, database dumps, real customer identifiers, identity documents, or account numbers. Use synthetic examples. Read the [threat model](docs/security/threat-model.md) and [engineering security practices](docs/security/engineering-practices.md) before changing authentication, lender access, financial commands, imports, callbacks, or webhook delivery.

## Licensing

The intended licensing model is recorded in the README and remains subject to the licensing and contributor agreement review in #22. Nothing in this document is a license grant or legal interpretation. Do not add package license metadata or publish artifacts on the assumption that the intended model is already approved.
