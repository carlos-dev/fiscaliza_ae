# Implementation Plan: Parliamentary Amendments Oversight System

**Branch**: `001-emendas-oversight` | **Date**: 2026-01-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-emendas-oversight/spec.md`

## Summary

A web application that enables Brazilian citizens to identify and score potential irregularities in federal parliamentary amendments by cross-referencing amendment data with company registration data and using AI-assisted visual analysis. The system calculates risk scores based on company age, CNAE compatibility, and capital adequacy, presenting findings with full source traceability and legally neutral language.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript 5.x (Frontend)
**Primary Dependencies**:
- Backend: FastAPI, SQLAlchemy, Pydantic, httpx (async HTTP client)
- AI Agent: OpenAI GPT-4o API or Anthropic Claude 3.5 Sonnet API
- Frontend: React 18+, Vite, Tailwind CSS
- Auth: python-jose (JWT)

**Storage**: PostgreSQL 15+ (production), SQLite (development)
**Testing**: pytest + pytest-asyncio (backend), Vitest + React Testing Library (frontend)
**Target Platform**: Linux server (backend), modern browsers (frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**:
- p95 < 2s for cached queries (Constitution IV requirement)
- p95 < 10s for fresh API calls
- Support 10,000+ amendments without degradation (SC-003)

**Constraints**:
- Cache duration: 7 days (amendments), 30 days (company data)
- Must respect government API rate limits
- Portuguese language interface
- Mobile-first responsive design (WCAG 2.1 AA)

**Scale/Scope**: 10,000+ amendments, public-facing application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Validation

| Principle | Requirement | Compliance Status | Implementation Notes |
|-----------|-------------|-------------------|---------------------|
| **I. Data Transparency** | Full traceability to official sources | ✅ PASS | FR-012: All data includes source links; FR-014: Staleness indicators for cached data |
| **I. Data Transparency** | Distinguish raw vs derived vs AI data | ✅ PASS | FR-003 (derived scores), FR-009/FR-010 (AI classification with labels) |
| **I. Data Transparency** | One-click access to original source | ✅ PASS | FR-012: Direct links to Portal da Transparência and BrasilAPI |
| **II. Legal Safety** | Never make direct accusations | ✅ PASS | FR-011: Neutral terminology mandate ("Potential Irregularity", "High Risk Pattern") |
| **II. Legal Safety** | Present objective facts only | ✅ PASS | FR-015: Plain-language factor explanations based on data |
| **II. Legal Safety** | Explainable anomaly detection | ✅ PASS | FR-003/FR-015: Risk score breakdown with factor contributions |
| **III. AI Ethics** | AI outputs explainable | ✅ PASS | FR-010: AI classification with disclaimer; FR-015: Factor explanations |
| **III. AI Ethics** | AI content clearly labeled | ✅ PASS | FR-010: "AI-generated" label and disclaimer required |
| **III. AI Ethics** | No individual behavior prediction | ✅ PASS | System analyzes transactions, not individuals |
| **IV. Performance** | Minimize government API load | ✅ PASS | FR-013: Aggressive caching (7/30 days) |
| **IV. Performance** | p95 < 2s cached, < 10s fresh | ✅ PASS | SC-001: 2s target for cached data |
| **IV. Performance** | Circuit breakers and fallbacks | ✅ PASS | Edge case: Serve cached data with staleness indicator |
| **V. Citizen-Centric UX** | Non-technical user design | ⚠️ NEEDS ATTENTION | Spec mentions Portuguese interface; need inline glossaries for terms like "CNAE", "Capital Social" |
| **V. Citizen-Centric UX** | WCAG 2.1 AA accessibility | ⚠️ NEEDS ATTENTION | Not explicitly in spec; must be added to implementation |
| **V. Citizen-Centric UX** | Mobile-first responsive | ⚠️ NEEDS ATTENTION | Assumption 6 mentions mobile access; must enforce in design |

### Gate Result: ✅ PASS (with UX enhancements required in implementation)

**Required UX Enhancements** (to be tracked in tasks):
1. Add inline glossary for technical terms (CNAE, Capital Social, CNPJ)
2. Implement WCAG 2.1 AA compliance checklist
3. Mobile-first responsive design verification

## Project Structure

### Documentation (this feature)

```text
specs/001-emendas-oversight/
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity schemas
├── quickstart.md        # Phase 1 output - local dev setup
├── contracts/           # Phase 1 output - API specifications
│   ├── openapi.yaml     # REST API contract
│   └── ai-agent.md      # AI agent interface contract
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/              # SQLAlchemy models (Amendment, Company, RiskAssessment, VisualAnalysis)
│   ├── services/            # Business logic
│   │   ├── transparency.py  # Portal da Transparência API client
│   │   ├── brasilapi.py     # BrasilAPI client
│   │   ├── risk_scorer.py   # Risk score calculation engine
│   │   ├── ai_agent.py      # Multimodal AI agent (vision + NLP)
│   │   └── cache.py         # Caching layer
│   ├── api/                 # FastAPI routes
│   │   ├── amendments.py    # Amendment CRUD + filtering
│   │   ├── companies.py     # Company data endpoints
│   │   └── auth.py          # JWT authentication
│   └── core/                # Configuration, dependencies
│       ├── config.py
│       ├── database.py
│       └── security.py
├── tests/
│   ├── contract/            # API contract tests
│   ├── integration/         # External API integration tests
│   └── unit/                # Unit tests for services
├── alembic/                 # Database migrations
├── requirements.txt
└── pyproject.toml

frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── RiskScore/       # Risk score display with breakdown
│   │   ├── SourceLink/      # Source traceability links
│   │   ├── AILabel/         # AI-generated content badge
│   │   └── Glossary/        # Inline term definitions
│   ├── pages/               # Route pages
│   │   ├── Dashboard/       # Main amendment list + filters
│   │   └── AmendmentDetail/ # Individual amendment analysis
│   ├── services/            # API client services
│   │   └── api.ts
│   └── hooks/               # Custom React hooks
├── tests/
│   ├── unit/
│   └── e2e/
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json

shared/
└── glossary.json            # Portuguese term definitions for UI
```

**Structure Decision**: Web application structure with separate `backend/` and `frontend/` directories. The backend handles API orchestration, risk calculation, and AI agent integration. The frontend provides the citizen-facing dashboard interface.

## Complexity Tracking

| Complexity | Why Needed | Simpler Alternative Rejected Because |
|------------|------------|-------------------------------------|
| AI Agent (Multimodal) | Required for Street View classification (FR-009) and CNAE semantic comparison | Rule-based classification would be inaccurate for visual analysis; CNAE matching requires NLP understanding |
| Dual external API integration | Portal da Transparência + BrasilAPI needed for complete data | No single API provides both amendment and company data |
| Caching layer | Constitution IV: minimize government API load | Direct API calls would violate rate limits and performance requirements |

## External API Dependencies

### Portal da Transparência (Brazilian Transparency Portal)

- **Base URL**: `https://api.portaldatransparencia.gov.br`
- **Endpoint**: `/api-de-dados/emendas`
- **Data**: Amendment details (author, year, value, purpose, recipient CNPJ)
- **Rate Limits**: 30 requests/minute (requires caching strategy)
- **Fallback**: Serve cached data with staleness indicator

### BrasilAPI

- **Base URL**: `https://brasilapi.com.br/api`
- **Endpoint**: `/cnpj/v1/{cnpj}`
- **Data**: Company registration (founding date, CNAE, capital, address)
- **Rate Limits**: 3 requests/second
- **Fallback**: Serve cached data, partial risk analysis

### Google Street View API (or equivalent)

- **Purpose**: Retrieve imagery for company addresses
- **Fallback**: "Address verification unavailable" message

### AI Provider API (GPT-4o / Claude 3.5 Sonnet)

- **Purpose 1**: Visual classification of Street View images
- **Purpose 2**: CNAE-to-amendment semantic compatibility analysis
- **Fallback**: Skip AI features, use manual classification option

## Data Synchronization Strategy

### Update Frequency

- **Emendas**: Semanal (domingo à noite, fora do horário de pico)
- **Empresas**: Sob demanda (quando emenda referencia CNPJ não cadastrado) + refresh mensal

### Sync Job: `sync_amendments`

```bash
# Executado via cron ou manualmente
python -m src.scripts.sync_amendments --year 2024 --year 2025 --year 2026
```

**Fluxo**:
1. Busca emendas do Portal da Transparência (paginado)
2. Compara com dados locais (by `codigo_emenda`)
3. Insere novas emendas
4. Atualiza emendas modificadas (valor, objeto)
5. Para cada nova emenda com CNPJ: busca dados da empresa na BrasilAPI
6. Recalcula risk scores para emendas novas/modificadas
7. Registra log de sincronização

**Controle de Rate Limit**:
- Portal da Transparência: 30 req/min → batch de 30, pausa 60s
- BrasilAPI: 3 req/s → delay de 350ms entre requests

### Indicadores no Frontend

| Situação | Exibição |
|----------|----------|
| Dados < 7 dias | Sem aviso |
| Dados 7-14 dias | "Dados atualizados há X dias" (amarelo) |
| Dados > 14 dias | "Dados podem estar desatualizados" (laranja) |
| Sync em andamento | "Atualizando dados..." (loading) |

### Logs e Monitoramento

Cada sync registra:
- Timestamp início/fim
- Emendas novas/atualizadas/inalteradas
- Erros de API (CNPJs não encontrados, timeouts)
- Tempo total de execução

## Risk Score Algorithm

The risk score (0-100) is calculated from three weighted factors:

```
Risk Score = (Company Age Factor × 0.35) + (CNAE Factor × 0.35) + (Capital Factor × 0.30)
```

### Factor Calculations

| Factor | Condition | Score |
|--------|-----------|-------|
| **Company Age** | Founded < 6 months | 100 |
| | Founded 6-12 months | 70 |
| | Founded 1-2 years | 40 |
| | Founded > 2 years | 0 |
| **CNAE Compatibility** | Clearly incompatible | 100 |
| | Ambiguous/uncertain | 50 |
| | Compatible | 0 |
| **Capital Adequacy** | Capital < 1% of amendment | 100 |
| | Capital 1-5% of amendment | 50 |
| | Capital > 5% of amendment | 0 |

**Risk Categories**:
- 0-30: Low Risk
- 31-69: Medium Risk
- 70-100: High Risk

## AI Agent Interface

### Vision Analysis (Street View Classification)

**Input**: Street View image URL
**Output**:
```json
{
  "classification": "Commercial Establishment" | "Residential Property" | "Vacant/Undeveloped Lot",
  "confidence": 0.0-1.0,
  "justification": "string (explanation of visual features)"
}
```

### NLP Analysis (CNAE Compatibility)

**Input**:
- Amendment purpose description (text)
- Company primary CNAE code + description

**Output**:
```json
{
  "compatibility": "compatible" | "incompatible" | "ambiguous",
  "confidence": 0.0-1.0,
  "reasoning": "string (explanation of semantic match/mismatch)"
}
```

## Security Considerations

- JWT-based API authentication (protect write endpoints)
- Read endpoints can be public for transparency
- Rate limiting on all endpoints (prevent abuse)
- Input validation for CNPJ format
- No PII collection beyond optional accounts (email only)
- HTTPS enforced
- CSP and HSTS headers

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Design Artifact | Compliance Status | Notes |
|-----------|-----------------|-------------------|-------|
| **I. Data Transparency** | openapi.yaml | ✅ PASS | `fonte_url` field on all entities; `X-Data-Atualizada` headers; `aviso_dados` for staleness |
| **I. Data Transparency** | data-model.md | ✅ PASS | `fonte_dados_url` and `data_atualizacao` on all models |
| **II. Legal Safety** | ai-agent.md | ✅ PASS | Conservative CNAE matching; "ambíguo" option prevents false positives |
| **II. Legal Safety** | openapi.yaml | ✅ PASS | Portuguese neutral terminology throughout |
| **III. AI Ethics** | ai-agent.md | ✅ PASS | `provider`, `model_version` for auditability; `justificativa`/`reasoning` for explainability |
| **III. AI Ethics** | openapi.yaml | ✅ PASS | `aviso_ia` disclaimer; `metadados_ia` object for audit trail |
| **IV. Performance** | research.md | ✅ PASS | Multi-tier caching strategy; circuit breaker patterns defined |
| **IV. Performance** | openapi.yaml | ✅ PASS | `X-Cache-Status` header; fallback responses for API unavailability |
| **V. Citizen-Centric UX** | Plan structure | ✅ PASS | `Glossary` component in frontend; Portuguese interface; mobile-first design specified |

### Post-Design Gate Result: ✅ PASS

All constitution principles are addressed in the design artifacts. Ready for task generation.

---

## Next Steps

After plan approval:
1. Run `/speckit.tasks` to generate detailed implementation tasks
2. Tasks will be ordered by dependency (backend APIs first, then frontend)
3. Each task will include acceptance criteria from the spec
