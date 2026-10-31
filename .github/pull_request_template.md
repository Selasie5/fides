## Summary

<!-- What changes, and why? Keep this focused on the confirmed issue scope. -->

## Linked issue

Closes #

- [ ] The issue was claimed in a comment and the scope was confirmed by a maintainer.
- [ ] The change is limited to the confirmed scope; unrelated work is split out.

## Change type

- [ ] Feature
- [ ] Bug fix
- [ ] Documentation or decision record
- [ ] Refactor
- [ ] Test or fixture
- [ ] CI, tooling, or dependency

## Policy and review

<!-- Cite the ADR, domain policy, or issue decision that governs this change. If a decision is missing, describe the proposed record. -->

- Policy or ADR references:
- Public contract or OpenAPI impact:
- Required reviewer designations:
- Financial reviewer required? If yes, who reviewed the policy basis and expected numeric results independently?
- Contributor agreement (#22) status:

<!-- Financial changes require a designated financial maintainer and independent checks. Do not claim a reviewer or agreement is satisfied if it is not recorded. -->

## Tests and verification

<!-- List the tests added or updated, the commands run, and any check you could not run. For docs-only changes, describe how the change was verified. -->

Commands run:

```sh
# pnpm format:check
# pnpm lint
# pnpm typecheck
# pnpm test
# pnpm build
# pnpm test:integration
```

- [ ] New or updated tests cover the changed behaviour, or this is a documentation-only change with documented verification.
- [ ] Integration tests were run where required, or the reason they were not run is explained above.
- [ ] No check is reported as passing if it was skipped or unavailable.

## Database and migrations

- [ ] No schema, data, or seed change.
- [ ] A reviewed SQL migration is included under `drizzle/` and does not run automatically at API startup.
- [ ] The forward migration and operational plan are described below.
- [ ] There is no automatic down migration; a corrective migration or restore plan is documented where needed.

Notes:

## Security

<!-- Answer the prompts that apply. Reference threat-model rows when relevant. Do not include exploit details or private vulnerability data. -->

- Trust boundary and permissions affected:
- Authorization and lender-isolation impact:
- Failure, retry, idempotency, and concurrency behaviour:
- Logging, telemetry, and secret handling impact:
- Dependency, CI permission, or supply-chain impact:
- Security/backend review required?

- [ ] No secrets, credentials, production logs, or real borrower data are included.
- [ ] Only synthetic data is used in code, tests, fixtures, and screenshots.
- [ ] Security-sensitive changes describe tests or documented verification for the affected boundary.

## Documentation

- [ ] User-facing, developer, or operator documentation is updated where needed.
- [ ] An ADR or domain policy is added or amended where the decision is significant.
- [ ] Financial examples or fixtures were reviewed independently where required.
- [ ] No document claims an enforcement gate, approval, or compliance status that is not verified.

## Definition of done

- [ ] Acceptance criteria in the linked issue are addressed.
- [ ] Required review designations are confirmed.
- [ ] The contributor agreement status is resolved for the contributor, or the pull request explains why it cannot be confirmed yet.
- [ ] The validation commands above pass or exceptions are explained.
- [ ] No unrelated changes, generated secrets, or real data are included.
