# Implementation Plan: Parliamentary Amendments Oversight System

**Branch**: `001-emendas-oversight` | **Date**: 2026-01-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-emendas-oversight/spec.md`

## Summary

Build a web application that identifies and scores potential irregularities in Brazilian federal parliamentary amendments by analyzing data from government APIs, calculating risk scores based on objective criteria (company age, CNAE compatibility, capital adequacy), and providing AI-assisted visual location analysis. The system emphasizes data transparency, legal safety through neutral language, and citizen-friendly interfaces.

**Technical Approach**: Web application with FastAPI backend orchestrating external API calls and risk calculations, React/TypeScript frontend with Tailwind CSS, and AI agent using Agno framework (GPT-4.1-mini) for image classification and NLP-based CNAE compatibility analysis. Optional Supabase storage for caching and performance optimization.

## Technical Context

**Language/Version**: Python 3.11+ (backend), Node.js 18+ (frontend), TypeScript 5+
**Primary Dependencies**: FastAPI (backend API framework), React 18 (frontend), Vite (build tool), Tailwind CSS (styling), Agno framework (AI agent orchestration), OpenAI GPT-4.1-mini (AI model)
**Storage**: Supabase (PostgreSQL-based) for caching amendment data, company data, risk scores, and AI analysis results - enables 7-day/30-day cache strategy per FR-013
**Testing**: pytest (backend unit/integration tests), pytest-asyncio (async test support), Vitest (frontend unit tests), Playwright (E2E tests)
**Target Platform**: Web (browser-based), deployed on cloud platform (AWS/GCP/Azure or Vercel/Railway)
**Project Type**: Web application (frontend + backend microservices)
**Performance Goals**:
- P95 < 2 seconds for cached data queries (per Constitution Principle IV)
- P95 < 10 seconds for fresh government API calls
- Support 100+ concurrent users without degradation
**Constraints**:
- Government APIs rate-limited (must implement aggressive caching per Constitution Principle IV)
- Street View API costs (budget considerations for image retrieval)
- AI API costs (GPT-4.1-mini token usage for classification tasks)
- Must maintain legal safety (no accusatory language per Constitution Principle II)
**Scale/Scope**:
- ~10,000+ amendments in initial dataset
- ~5,000+ unique companies
- Expected concurrent users: 50-200 during peak civic engagement periods

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Data Transparency First ✅ PASS

**Requirements**:
- All government data must retain full traceability to official sources
- Distinguish between raw data, derived insights, and AI interpretations
- One-click access to original source data

**Compliance**:
- ✅ FR-012: All data includes direct links to original government sources
- ✅ Spec defines clear data entities (Amendment, Company) with source timestamps
- ✅ Risk Assessment entity separates calculated scores from raw data
- ✅ Visual Analysis entity marks AI classifications distinctly

**Actions**: Document API endpoints in contracts/, include source URL fields in data model

---

### Principle II: Legal Safety & Responsible Communication ✅ PASS

**Requirements**:
- NEVER make direct accusations of wrongdoing
- Use neutral, evidence-based language
- Reference official audit criteria (TCU, CGU)

**Compliance**:
- ✅ FR-011: System enforces neutral terminology ("Potential Irregularity" not "fraud")
- ✅ Spec language models neutral communication in all user stories
- ✅ Success criteria SC-006: Zero instances of accusatory terminology

**Actions**: Create terminology checklist in quickstart.md, implement content validation in frontend components

---

### Principle III: AI Ethics & Explainability ✅ PASS

**Requirements**:
- AI features must be explainable, auditable, bias-aware
- AI-generated content clearly labeled with confidence scores
- Provide opt-out mechanisms where feasible

**Compliance**:
- ✅ FR-010: AI classification displayed with "AI-generated" label and disclaimer
- ✅ FR-015: Risk score calculations include plain-language explanations
- ✅ Visual Analysis entity includes confidence scores and analysis timestamps
- ✅ Spec defines AI as assistance tool, not decision-maker

**Actions**:
- Document AI model versions and prompts in research.md
- Include confidence thresholds in data-model.md
- Add explainability endpoints to contracts/

---

### Principle IV: Performance & Scalability for Public APIs ✅ PASS

**Requirements**:
- Minimize government API load through caching
- P95 < 2 seconds cached, < 10 seconds fresh
- Circuit breakers and fallback strategies
- Monitor API health

**Compliance**:
- ✅ FR-013: 7-day cache for amendments, 30-day cache for company data
- ✅ FR-014: Display data staleness indicators
- ✅ Edge cases define API unavailability handling (cached data + staleness indicator)
- ✅ Success criteria SC-001: 2-second cached query target
- ✅ Supabase storage enables efficient caching strategy

**Actions**:
- Define caching layer architecture in research.md
- Create API health monitoring design in data-model.md
- Document circuit breaker patterns in quickstart.md

---

### Principle V: Citizen-Centric User Experience ✅ PASS

**Requirements**:
- Design for non-technical users
- WCAG 2.1 AA accessibility
- Mobile-first responsive design
- Progressive disclosure

**Compliance**:
- ✅ User stories describe citizen-friendly workflows (search/filter/detail)
- ✅ Spec assumptions define Portuguese language, basic web literacy users
- ✅ Success criteria SC-002: 3-click navigation to detailed analysis
- ✅ React + Tailwind enables responsive, accessible UI development

**Actions**:
- Define accessibility requirements in research.md
- Create mobile-first component designs
- Include CNAE glossary in data-model.md

---

### Security & Privacy Requirements ✅ PASS

**Compliance**:
- ✅ Public data only (no PII beyond optional user accounts)
- ✅ HTTPS, secure headers, rate limiting (standard for FastAPI + React deployment)
- ✅ Spec assumptions: no authentication required for basic functionality

**Actions**: Document security headers configuration in research.md

---

### Technical Standards ✅ PASS

**Compliance**:
- ✅ Testing framework specified (pytest, Vitest, Playwright)
- ✅ FR-012: API dependencies documented (Portal da Transparência, BrasilAPI)
- ✅ Structured logging and observability (FastAPI + standard logging libraries)

**Actions**: Define test coverage requirements in research.md

---

### 🎯 OVERALL GATE STATUS: ✅ PASS - All principles satisfied, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-emendas-oversight/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions, API research, AI model selection
├── data-model.md        # Phase 1: Entities, schemas, risk scoring algorithms
├── quickstart.md        # Phase 1: Developer setup, deployment guide, terminology
├── contracts/           # Phase 1: API endpoint specifications
│   ├── backend-api.yaml     # OpenAPI spec for FastAPI endpoints
│   └── external-apis.md     # Portal da Transparência, BrasilAPI, Street View API docs
└── checklists/
    └── requirements.md  # Spec validation checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── agents/              # AI agent logic
│   │   ├── image_classifier.py
│   │   └── cnae_analyzer.py
│   ├── api/                 # FastAPI routes
│   │   ├── amendments.py
│   │   ├── companies.py
│   │   └── risk_scores.py
│   ├── models/              # Pydantic models
│   │   ├── amendment.py
│   │   ├── company.py
│   │   └── risk_assessment.py
│   ├── services/            # Business logic
│   │   ├── portal_transparencia.py
│   │   ├── brasil_api.py
│   │   ├── street_view.py
│   │   ├── risk_calculator.py
│   │   └── cache_manager.py
│   └── main.py              # FastAPI application entry
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
├── requirements.txt
└── pyproject.toml

frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard/
│   │   │   ├── AmendmentList.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── RiskScoreBadge.tsx
│   │   ├── AmendmentDetail/
│   │   │   ├── AmendmentInfo.tsx
│   │   │   ├── CompanyInfo.tsx
│   │   │   ├── RiskBreakdown.tsx
│   │   │   └── VisualAnalysis.tsx
│   │   └── shared/
│   │       ├── Glossary.tsx
│   │       └── SourceLink.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── AmendmentDetail.tsx
│   ├── services/            # API client
│   │   └── api.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   └── App.tsx
├── tests/
│   ├── unit/
│   └── e2e/
├── package.json
├── vite.config.ts
└── tailwind.config.js

shared/
└── types/                   # Shared type definitions between backend/frontend
    └── api_contracts.ts
```

**Structure Decision**: Web application architecture (Option 2) selected based on:
- Clear separation of concerns (backend API orchestration vs. frontend presentation)
- Independent deployment of backend/frontend for scaling
- Shared types directory enables type safety across stack
- Aligns with user's specified architecture (FastAPI backend + React frontend)

## Complexity Tracking

> **Note**: No constitutional violations identified. Architecture follows simplicity principles (Constitution Technical Standards).

| Decision | Justification | Simpler Alternative Considered |
|----------|---------------|-------------------------------|
| Supabase for caching | Managed PostgreSQL simplifies cache + persistence layer, built-in real-time features could enable future enhancements (alert subscriptions) | In-memory Redis cache: rejected because loses data on restart, no persistence for offline analysis, higher operational overhead |
| Agno AI framework | Abstracts AI agent complexity, standardizes GPT-4 integration for both image + NLP tasks | Direct OpenAI API calls: rejected because increases boilerplate for prompt management, error handling, retry logic across two AI use cases |
| Separate AI agent service | Could extract agents to independent microservice for independent scaling of AI operations | Inline AI in backend API: acceptable for MVP, extract later if AI operations become bottleneck (monitor p95 latency) |

---

## Phase 0: Research & Technology Validation

**Status**: To be completed in research.md

### Research Tasks

1. **Portal da Transparência API Investigation**
   - Endpoint: `/api-de-dados/emendas`
   - Required fields validation: author, year, value, purpose, recipient CNPJ
   - Rate limits, authentication requirements
   - Data update frequency
   - Response format and error handling

2. **BrasilAPI Integration Research**
   - Endpoint: `/cnpj/{cnpj}`
   - Response schema: founding date, CNAE, capital, address
   - Rate limits, availability guarantees
   - Fallback strategies for unavailable CNPJs

3. **Street View API Selection**
   - Google Street View Static API vs. alternatives
   - Pricing model for expected volume (10,000 addresses)
   - Image resolution requirements for AI classification
   - Geographic coverage for Brazilian addresses

4. **Agno Framework + GPT-4.1-mini Integration**
   - Agno framework installation and configuration
   - GPT-4.1-mini API access and pricing
   - Prompt engineering for:
     a. Image classification (Commercial/Residential/Vacant)
     b. CNAE-purpose semantic comparison
   - Token usage estimation and cost projections
   - Confidence score interpretation

5. **CNAE-Purpose Mapping Strategy**
   - Obtain CNAE code list and descriptions
   - Define amendment purpose categories (Culture, Health, Education, Infrastructure, etc.)
   - Build initial compatibility matrix
   - Determine semantic similarity thresholds

6. **Risk Scoring Algorithm Design**
   - Weight distribution for three factors (company age, CNAE, capital)
   - Threshold definitions: Low (0-30), Medium (31-69), High (70-100)
   - Edge case handling (missing data, ambiguous CNAEs, zero-value amendments)

7. **Caching Strategy Architecture**
   - Supabase schema design for cached data
   - Cache invalidation rules (7-day amendments, 30-day companies)
   - Staleness indicator implementation
   - Cache warming strategy for initial dataset

8. **Testing Strategy**
   - Contract test approach for external APIs (mocking Portal da Transparência, BrasilAPI)
   - AI agent testing (deterministic prompts vs. probabilistic outputs)
   - E2E test scenarios covering all user stories

9. **Accessibility Requirements**
   - WCAG 2.1 AA checklist for React components
   - Screen reader testing tools
   - Keyboard navigation patterns
   - Color contrast validation for risk score badges

10. **Security Configuration**
    - HTTPS setup (Let's Encrypt or cloud provider SSL)
    - CSP, HSTS headers for FastAPI
    - CORS configuration (frontend-backend communication)
    - Rate limiting strategy (per-IP limits)

**Output**: research.md documenting all decisions, alternatives considered, and rationale

---

## Phase 1: Design Artifacts

**Prerequisites**: research.md complete with all NEEDS CLARIFICATION resolved

### 1. Data Model Design (data-model.md)

Define schemas for:

- **Amendment Entity**: ID, author, year, value (BRL), purpose, recipient_cnpj, risk_score, created_at, updated_at, source_url
- **Company Entity**: CNPJ (PK), legal_name, founding_date, primary_cnae, capital_amount, address (full), created_at, updated_at, source_url
- **RiskAssessment Entity**: amendment_id (FK), overall_score, age_score, cnae_score, capital_score, age_explanation, cnae_explanation, capital_explanation, calculated_at
- **VisualAnalysis Entity**: company_cnpj (FK), street_view_url, ai_classification (enum), ai_confidence, ai_justification, image_date, analyzed_at

Include:
- Validation rules (e.g., risk_score 0-100, CNPJ format)
- Relationships (Amendment → Company one-to-one, Amendment → RiskAssessment one-to-one)
- Index strategy for query performance (index on risk_score, year, author for dashboard filters)

### 2. API Contracts (contracts/)

**backend-api.yaml** (OpenAPI 3.0):

Endpoints:
- `GET /api/v1/amendments` - List amendments with filters (parliamentarian, year, risk_score_min, risk_score_max), pagination
- `GET /api/v1/amendments/{id}` - Get amendment detail with risk assessment and company data
- `GET /api/v1/companies/{cnpj}` - Get company details (cached from BrasilAPI)
- `GET /api/v1/risk-scores/{amendment_id}` - Get detailed risk score breakdown
- `GET /api/v1/visual-analysis/{cnpj}` - Get Street View analysis (cached or trigger new analysis)
- `GET /api/v1/health` - Health check, API dependency status

**external-apis.md**:

Document Portal da Transparência, BrasilAPI, Street View API endpoints, authentication, rate limits, error codes, sample responses

### 3. Quickstart Guide (quickstart.md)

Sections:
- **Prerequisites**: Python 3.11+, Node 18+, Supabase account
- **Backend Setup**: Virtual environment, install dependencies, configure environment variables (API keys, Supabase connection), run migrations, start FastAPI dev server
- **Frontend Setup**: npm install, configure API base URL, start Vite dev server
- **Running Tests**: Backend (pytest), Frontend (Vitest), E2E (Playwright)
- **Deployment**: Supabase setup, backend deployment (Railway/Render), frontend deployment (Vercel/Netlify)
- **Terminology Glossary**: CNAE, Emendas Parlamentares, TCU, CGU, Portal da Transparência definitions
- **Legal Safety Checklist**: Approved vs. prohibited terms, content review process

### 4. Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- Python 3.11, FastAPI, Pydantic
- React 18, TypeScript 5, Vite, Tailwind CSS
- Supabase, PostgreSQL
- Agno framework, OpenAI GPT-4.1-mini
- pytest, Vitest, Playwright

---

## Phase 1 Completion Gate: Re-evaluate Constitution Check

After design artifacts complete, verify:

- ✅ Data model includes source_url fields (Principle I: Transparency)
- ✅ Risk assessment includes explanation fields (Principle III: Explainability)
- ✅ API contracts include staleness indicators (Principle IV: Performance)
- ✅ Quickstart includes accessibility checklist (Principle V: Citizen-Centric UX)
- ✅ No accusatory terminology in any artifact (Principle II: Legal Safety)

---

## Next Steps

After this plan is complete:

1. Execute Phase 0: Generate research.md by investigating all research tasks
2. Execute Phase 1: Generate data-model.md, contracts/, quickstart.md based on research findings
3. Run `/speckit.tasks` to convert this plan into executable tasks.md with user story organization
4. Implement via `/speckit.implement` or manual development following tasks.md

**Branch**: 001-emendas-oversight
**Plan File**: /Users/carlosandre/fiscaliza_ae/specs/001-emendas-oversight/plan.md
