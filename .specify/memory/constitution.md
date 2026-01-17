<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: N/A → 1.0.0

  Modified Principles: N/A (initial version)

  Added Sections:
  - Core Principles (5 principles: Data Transparency, Legal Safety, AI Ethics, Performance Optimization, Citizen-Centric UX)
  - Security & Privacy Requirements
  - Technical Standards
  - Governance

  Removed Sections: N/A

  Templates Requiring Updates:
  ✅ .specify/templates/spec-template.md - Reviewed, compliant with constitution principles
  ✅ .specify/templates/plan-template.md - Constitution Check section aligns with new principles
  ✅ .specify/templates/tasks-template.md - Task categorization compatible with new principles

  Follow-up TODOs: None

  Rationale: MINOR version (1.0.0) - Initial constitution establishing governance framework
-->

# Fiscaliza AE Constitution

## Core Principles

### I. Data Transparency First

**MUST**: All government data presented must retain full traceability to its official source (API endpoint, document reference, timestamp).

**MUST**: When data is transformed, aggregated, or analyzed, the system must clearly distinguish between:
- Raw government data (unmodified)
- Derived insights (calculations, summaries, trends)
- AI-generated interpretations

**MUST**: Users must be able to access original source data with a single click from any visualization or summary.

**Rationale**: Public accountability depends on verifiable facts. Citizens must be empowered to independently verify any claims or analyses presented by the system.

---

### II. Legal Safety & Responsible Communication

**MUST**: The system shall NEVER make direct accusations of wrongdoing against individuals or organizations.

**MUST**: Instead, present objective facts and enable citizens to draw their own conclusions:
- ✅ "Contract awarded to Company X for R$500,000 on DATE without competitive bidding (source: Portal da Transparência)"
- ❌ "Company X committed fraud by receiving R$500,000"

**MUST**: Flag potential irregularities using neutral language:
- ✅ "This transaction matches 3 of 5 red-flag patterns identified by TCU (Tribunal de Contas da União)"
- ❌ "This transaction is fraudulent"

**MUST**: All anomaly detection or risk scoring must be explainable and reference official audit criteria (TCU, CGU, legal frameworks).

**Rationale**: The system serves as a citizen empowerment tool, not a judicial authority. Defamation risks must be eliminated while preserving investigative utility.

---

### III. AI Ethics & Explainability

**MUST**: All AI/ML features (anomaly detection, risk scoring, pattern recognition, natural language summaries) must be:
- **Explainable**: Users can see why a pattern was flagged (which features triggered the model)
- **Auditable**: Model versions, training data sources, and decision logic documented
- **Bias-aware**: Regularly tested for demographic, geographic, or political bias

**MUST**: AI-generated content (summaries, insights, recommendations) must be clearly labeled with:
- AI-generated badge/icon
- Confidence score where applicable
- Link to explanation of the AI method used

**MUST NOT**: Use AI to predict individual behavior or intent (e.g., "Mayor X will likely commit fraud"). AI should focus on transaction-level pattern detection.

**MUST**: Provide opt-out mechanisms for AI features where feasible, allowing users to work with raw data only.

**Rationale**: AI can amplify both insight and harm. Transparent AI builds trust; opaque AI erodes it. Citizens have the right to understand and challenge automated decisions.

---

### IV. Performance & Scalability for Public APIs

**MUST**: The system must minimize load on government APIs through:
- Aggressive caching strategies (respect API rate limits and caching headers)
- Batch requests where supported
- Local data replication for frequently accessed datasets

**MUST**: Response times for common citizen queries (search, filter, basic visualizations):
- **p95 < 2 seconds** for cached data
- **p95 < 10 seconds** for fresh API calls
- Progressive loading/streaming for large datasets (don't block UI)

**MUST**: Implement circuit breakers and fallback strategies:
- If government API is down/slow, serve cached data with staleness indicator
- Queue non-urgent requests for retry rather than failing user sessions

**MUST**: Monitor and log API health (uptime, latency, error rates) to identify government data source issues.

**Rationale**: Government APIs are often under-resourced and rate-limited. The system must be a responsible API consumer while ensuring citizens aren't blocked by infrastructure issues outside our control.

---

### V. Citizen-Centric User Experience

**MUST**: Design for non-technical users (assume no prior knowledge of government procurement, budget terminology, or data analysis):
- Inline glossaries for technical terms (hover/click to see definition)
- Guided workflows ("I want to see how my city spends money on education")
- Pre-built dashboards for common use cases (contract analysis, budget tracking)

**MUST**: Support multiple literacy levels:
- Visual summaries (charts, timelines) as default
- Tabular data for power users
- Plain-language explanations alongside technical details

**MUST**: Accessibility compliance:
- WCAG 2.1 AA minimum (screen readers, keyboard navigation, color contrast)
- Mobile-first responsive design (many citizens access via phone)

**MUST**: Progressive disclosure - don't overwhelm users:
- Start with high-level overview
- Allow drill-down into details on demand
- Provide "Export to PDF" for sharing findings with non-digital audiences

**Rationale**: Public data is only valuable if the public can actually use it. Complexity is a barrier to accountability. The system must meet citizens where they are, not require them to become data scientists.

---

## Security & Privacy Requirements

**MUST**: The system handles public data only - no personally identifiable information (PII) of citizens should be collected or stored beyond:
- Anonymous usage analytics (page views, search terms, session duration)
- Optional account creation for saved searches/alerts (email + hashed password only)

**MUST**: Apply defense-in-depth for data integrity:
- Verify checksums/signatures from government APIs where available
- Detect and alert on unexpected data changes (potential tampering)
- Maintain audit logs of all data ingestion events

**MUST**: Implement HTTPS everywhere, secure headers (CSP, HSTS), and regular dependency updates to prevent supply chain attacks.

**MUST**: Rate limit user-facing features to prevent abuse (DoS, scraping for commercial purposes).

---

## Technical Standards

**MUST**: All code must include:
- Unit tests for business logic (data parsing, calculations, risk scoring)
- Integration tests for government API interactions (with mocked responses + occasional live validation)
- Contract tests to detect breaking changes in upstream APIs

**MUST**: Document API dependencies:
- Which government APIs are used (Portal da Transparência, PNCP, e-SIC, etc.)
- Expected data schemas and update frequencies
- Fallback strategies for each dependency

**MUST**: Observability:
- Structured logging for all API calls, errors, and user actions
- Metrics dashboards for system health (API latency, cache hit rate, user engagement)
- Alerting for critical issues (API downtime > 5min, data staleness > 24h)

**SHOULD**: Prefer simplicity over premature optimization:
- Start with proven frameworks and libraries
- Avoid custom abstractions until patterns emerge
- Document architectural decisions (ADRs) for non-obvious choices

---

## Governance

### Amendment Procedure

1. **Proposal**: Any team member can propose an amendment via pull request to this file.
2. **Review**: All principles changes require consensus approval from technical lead + at least one domain expert (legal, data journalism, civic tech).
3. **Impact Analysis**: Amendments must include:
   - Version bump justification (MAJOR/MINOR/PATCH)
   - List of affected templates/code that need updates
   - Migration plan for existing features if breaking change
4. **Ratification**: Once approved, update `LAST_AMENDED_DATE` and `CONSTITUTION_VERSION`, then propagate changes to dependent artifacts.

### Compliance Review

- **Pre-implementation**: All feature specs must reference which principles they support (e.g., "Supports Principle II by presenting neutral fact patterns").
- **Code review**: PRs should verify no principle violations (e.g., no accusatory language, AI outputs are labeled).
- **Quarterly audit**: Review flagged edge cases or user reports of misleading content.

### Versioning Policy

- **MAJOR** (X.0.0): Principle removed, redefined, or governance process changed in backward-incompatible way.
- **MINOR** (x.Y.0): New principle added, existing principle materially expanded.
- **PATCH** (x.y.Z): Clarifications, typo fixes, examples added, non-semantic refinements.

### Complexity Justification

Any deviation from simplicity principles (e.g., custom abstraction, additional infrastructure component, novel algorithm) must be justified in the `plan.md` Complexity Tracking table with:
- What simpler alternative was considered
- Why it's insufficient for the specific use case
- Acceptance criteria for removing the complexity later

---

**Version**: 1.0.0 | **Ratified**: 2026-01-16 | **Last Amended**: 2026-01-16
