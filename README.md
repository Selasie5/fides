# Fides

**Open-source loan management infrastructure for microfinance and community lenders.**

Fides is a headless loan engine (schedules, interest, and a double-entry ledger) with a thin, usable loan officer app built on top of it. Lenders who run on notebooks and spreadsheets get software they can trust. Developers get a reliable core they don't have to build from scratch.

> **Status: early stage.** Fides is under active design and the architecture is changing quickly. We are **not accepting outside contributions yet**. Star or watch the repo to follow along.

---

## Why Fides?

*Fides* is Latin for trust, and the root of the word "fiduciary." Lending runs on trust: between lender and borrower, and between a lender and the system that holds its books. Most small lenders around the world still track money in notebooks and spreadsheets because the available software is either too heavy, too expensive, or built for banks rather than for them.

Getting loan math and ledger records exactly right is hard. Flat vs. reducing-balance interest, rounding, grace periods, early repayment, penalties, and restructuring all look simple until real money is involved. Fides aims to make that part correct, auditable, and reusable.

## Who it's for

- **Microfinance institutions, cooperatives, susu collectors, savings groups, and small lenders** who need to originate loans, record repayments, and know who is overdue.
- **Developers and fintechs** who want a loan engine with a clean API instead of building one themselves.

Fides is global by design. Our first users and first integrations will come from Ghana, but Ghana is a *locale pack*, not a limit. Currency, interest conventions, payment providers, institution categories, and regulatory reports are all configurable. Ghana's microfinance rules changed in January 2026, which is exactly why institution types are configuration and never hardcoded.

## Architecture

Fides is a **headless core plus an opinionated app**, and the app uses only the public API.

```
┌──────────────────────────────────────┐
│  Fides App (loan officer workspace)  │
└──────────────────┬───────────────────┘
                   │  public API only
┌──────────────────▼───────────────────┐
│  Fides Core                          │
│  • Loan product configuration        │
│  • Schedule & interest engine        │
│  • Double-entry ledger + audit trail │
│  • Portfolio reporting (PAR, arrears)│
│  • Webhooks & integrations           │
└──────────────────────────────────────┘
```

**Core (developer-facing)**
- Loan products defined as data, not code: rates, fees, grace periods, penalties
- Flat and reducing-balance interest, with effective rate calculation
- Event-sourced, double-entry ledger with a full audit trail
- Portfolio metrics: PAR 30/60/90, arrears aging, repayment rate
- Regulatory building blocks: credit bureau reporting data, loan classification and non-performing loan reporting, restructuring and write-off events, and consent records
- REST API and webhooks
- Apache-2.0 SDKs

**App (user-facing)**
- Register clients (individuals first, groups next)
- Create loans from product templates and generate schedules
- Record repayments (cash and mobile money)
- See who is overdue today and run portfolio reports

## Design principles

1. **Correctness over features.** Money code gets exhaustive tests and clear, documented rounding rules.
2. **Everything auditable.** Nothing in the ledger is edited or deleted, only corrected by new entries.
3. **Configurable, not hardcoded.** Regional rules, institution categories, loan classification bands, and provisioning rates live in locale packs and product definitions.
4. **Built for the field.** Weak connectivity and cash-and-mobile-money workflows shape the design from the start. Offline collection is not in v1, but every write carries a client-generated ID, repayments record collection time, and the API accepts batches, so offline support can be added without rewriting the core.
5. **API first.** If the app can't be built well on the API, the API is wrong.

## Roadmap

- [ ] **Phase 1: Core.** Loan products, schedule generator, ledger, basic API
- [ ] **Phase 2: App.** Minimal loan officer workspace that takes one loan from creation to full repayment
- [ ] **Phase 3: Microfinance features.** Group lending, compulsory savings, loan cycles, PAR reporting
- [ ] **Phase 4: Integrations.** Mobile money reconciliation, first locale pack (Ghana)
- [ ] **Later.** Offline-capable field app, decisioning and explainable approvals, collections workflows, and a hosted version of Fides



## Contributing

Fides is open source, but **contributions are by application**. Because this code handles financial records, we vet contributors before granting the ability to change it.

- **Everyone** can read the code, fork it, use it under the license, and open issues or discussions with ideas and bug reports.
- **Contributors** are approved through a short application: what you've built, why Fides, and which area you'd like to take on, followed by a small scoped task reviewed by the maintainers.
- All contributions require signing a Contributor License Agreement (CLA), which also allows the project to offer the code under a commercial license, and go through code review. Sensitive areas such as the ledger and interest engine need sign-off from designated maintainers.

> The application process opens once the core architecture stabilizes. Details will be in [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Security

Please **do not** report security vulnerabilities in public issues. See [`SECURITY.md`](SECURITY.md) for how to report them privately.

Never commit real customer data, account numbers, or credentials to this repository. Use synthetic test data only.

## License

- **Fides Core and Fides App:** [GNU AGPL-3.0](LICENSE)
- **SDKs and client libraries:** Apache-2.0

AGPL-3.0 means anyone who modifies Fides and offers it to users over a network must publish their changes. Lenders who run Fides for their own use have no extra obligations, and code that talks to the API through the Apache-2.0 SDKs carries no AGPL terms. Companies that cannot use AGPL software can ask about a commercial license.

A hosted version of Fides is planned for the future.

## Disclaimer

Fides is provided **as is**, without warranty of any kind. Lenders using Fides are solely responsible for their own legal and regulatory compliance, including licensing, consumer protection, data protection, and reporting obligations in their jurisdictions. Nothing in this project constitutes legal, financial, or regulatory advice.

## Trademark

"Fides" and its logo are reserved by the project maintainers. The code license does not grant rights to the project name. Forks should use a different name.
