# Security policy

## Supported versions

Fides is in the design and foundation stage. There are no supported production releases. The default branch contains development work, not a production security guarantee.

Report suspected vulnerabilities in the default branch and any published release, identifying the commit or version. A maintainer will assess impact and applicability; no response-time SLA is currently promised.

## Private reporting route

**Activation pending.** GitHub private vulnerability reporting must be enabled and independently verified before this policy announces an available intake route. Do not publish vulnerability details in issues, pull requests, discussions, or project-board comments.

Maintainer activation checklist:
1. In repository Settings → Security → Advanced Security, enable private vulnerability reporting (GitHub may group this under Code security).
2. Verify the repository Security → Advisories page shows **Report a vulnerability** to an eligible signed-in reporter.
3. Verify the report form opens and targets this repository; do not send a fabricated vulnerability to test it.
4. Confirm who receives reports and designate a backup responder.
5. Replace this activation section with the verified private reporting link, recording the verification date in the implementation PR.

Until activation is verified, no private intake endpoint is advertised here. Do not send sensitive details to an unverified address. If you cannot access a private report form, withhold exploit details and arrange a private channel directly with a known maintainer.

## What to include after private intake is activated

- Affected version or commit and component.
- Impact, prerequisites, and minimal reproduction using synthetic data.
- Expected and observed behaviour.
- Redacted evidence and a suggested mitigation, if known.

Never include production credentials, real borrower records, identity documents, or financial exports. Request a secure transfer method before sharing an artifact that cannot safely be redacted.

## Maintainer handling

Keep reports private during triage. Confirm affected versions, reproduce with synthetic fixtures, assess cross-lender and financial impact, and coordinate containment and a reviewed fix. Rotate exposed credentials rather than merely deleting them from code. Preserve restricted incident evidence without copying it into public logs.

Agree disclosure timing with the reporter. Publish a redacted advisory and upgrade instructions after remediation where appropriate. A report acknowledgement is not confirmation that a finding is valid. Do not promise a bounty, deadline, legal safe harbor, or certification without an approved policy.

## Contributor security requirements

Read [the threat model](docs/security/threat-model.md) and [the engineering security practices](docs/security/engineering-practices.md) before changing authentication, lender access, financial commands, imports, callbacks, or webhook delivery.

Use synthetic data only. Never commit secrets, production logs, database dumps, or real customer identifiers. Security-sensitive work requires review by a designated security or backend maintainer; financial effects also require financial maintainer review. Branch enforcement, scanning, and CI remain separate foundation work and must not be assumed to exist.

## Deployment responsibility

Future operators must configure credentials, TLS, backups, database roles, access controls, and monitoring for their environment. This policy is not evidence that these controls have been tested or that Fides meets a regulatory standard.
