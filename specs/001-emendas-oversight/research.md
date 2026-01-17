# Research: Parliamentary Amendments Oversight System

**Feature**: 001-emendas-oversight
**Date**: 2026-01-16
**Status**: Complete

## Executive Summary

This document consolidates technology decisions and research findings for the Parliamentary Amendments Oversight System. All "NEEDS CLARIFICATION" items from the technical context have been resolved based on the user's architectural input and best practices research.

---

## Technology Decisions

### 1. Backend Framework: FastAPI

**Decision**: Use FastAPI with Python 3.11+

**Rationale**:
- User specified Python with FastAPI for backend API
- Async-first design enables efficient handling of multiple external API calls
- Built-in OpenAPI documentation supports transparency goals
- Pydantic integration provides robust data validation
- Mature ecosystem for Brazilian government API integrations

**Alternatives Considered**:
- Django REST Framework: Heavier, less async-native; rejected for performance constraints
- Flask: Less structured, would require more boilerplate; rejected

---

### 2. AI Agent Implementation

**Decision**: Multimodal AI Agent using GPT-4o or Claude 3.5 Sonnet API

**Rationale**:
- User specified GPT-4o or Claude 3.5 Sonnet for multimodal capabilities
- Both models support vision (image analysis) and NLP (semantic comparison)
- API-based approach avoids infrastructure complexity of self-hosted models
- Supports Constitution III (AI Ethics) with explainable outputs

**Implementation Pattern**:
```python
# Abstraction layer for AI provider switching
class AIAgent(Protocol):
    async def classify_image(self, image_url: str) -> ImageClassification: ...
    async def compare_cnae(self, purpose: str, cnae: str) -> CNAECompatibility: ...

# Concrete implementations
class OpenAIAgent(AIAgent): ...
class AnthropicAgent(AIAgent): ...
```

**Alternatives Considered**:
- Self-hosted vision model (CLIP, BLIP): Higher infrastructure cost, lower accuracy; rejected
- Rule-based CNAE matching: Insufficient for semantic understanding; rejected

---

### 3. Frontend Stack: React + Vite + Tailwind

**Decision**: React 18+ with Vite build tool and Tailwind CSS

**Rationale**:
- User specified React, Vite, and Tailwind CSS
- Vite provides fast development experience and optimized production builds
- Tailwind enables rapid UI development with mobile-first responsive design
- React ecosystem has mature accessibility tooling (react-aria, headless UI)

**TypeScript Configuration**:
- Strict mode enabled for type safety
- Path aliases for clean imports
- ESLint + Prettier for code consistency

**Alternatives Considered**:
- Next.js: SSR not required for this SPA; rejected for simplicity
- Vue/Nuxt: Team familiarity with React; rejected

---

### 4. Database: PostgreSQL (Production) / SQLite (Development)

**Decision**: PostgreSQL 15+ for production, SQLite for local development

**Rationale**:
- User specified PostgreSQL or SQLite for development
- PostgreSQL provides robust JSON support for caching API responses
- Full-text search capabilities for amendment purpose descriptions
- SQLite simplifies local development setup

**ORM**: SQLAlchemy 2.0+ with async support (asyncpg driver)

**Alternatives Considered**:
- MongoDB: Relational data model more appropriate; rejected
- MySQL: PostgreSQL has better JSON and full-text support; rejected

---

### 5. Authentication: JWT-based

**Decision**: Simple JWT authentication with python-jose

**Rationale**:
- User specified JWT for API protection
- Stateless authentication simplifies horizontal scaling
- Read endpoints remain public for transparency (Constitution I)
- Write endpoints (admin functions) protected

**Token Configuration**:
- Access token expiry: 30 minutes
- Refresh token expiry: 7 days
- Algorithm: HS256 (symmetric, simple deployment)

**Alternatives Considered**:
- OAuth2 with external provider: Overcomplex for current scope; rejected
- Session-based auth: Stateful, harder to scale; rejected

---

### 6. Caching Strategy

**Decision**: Multi-tier caching with Redis (production) or in-memory (development)

**Rationale**:
- Constitution IV requires minimizing government API load
- FR-013 specifies 7-day cache for amendments, 30-day for company data
- Redis provides distributed caching for multiple backend instances

**Cache Keys**:
```
amendments:{year}:{page} -> 7 days TTL
company:{cnpj} -> 30 days TTL
streetview:{address_hash} -> 90 days TTL
ai:vision:{image_hash} -> 30 days TTL
ai:cnae:{purpose_hash}:{cnae} -> 30 days TTL
```

**Alternatives Considered**:
- Database-only caching: Less performant for frequently accessed data; rejected
- CDN caching: Insufficient control over invalidation; rejected as primary solution

---

### 7. External API Integration Patterns

**Decision**: Async HTTP client (httpx) with circuit breaker pattern

**Rationale**:
- Constitution IV requires circuit breakers and fallbacks
- httpx provides async support matching FastAPI
- tenacity library for retry logic with exponential backoff

**Circuit Breaker Configuration**:
```python
# Per-API settings
PORTAL_TRANSPARENCIA = {
    "failure_threshold": 5,
    "recovery_timeout": 60,  # seconds
    "half_open_requests": 3
}

BRASILAPI = {
    "failure_threshold": 3,
    "recovery_timeout": 30,
    "half_open_requests": 2
}
```

**Fallback Behavior**:
1. Return cached data with staleness indicator (FR-014)
2. If no cache, return partial analysis with "Data unavailable" markers
3. Log API failures for monitoring (Constitution Technical Standards)

---

### 8. Testing Strategy

**Decision**: pytest (backend) + Vitest (frontend) with contract testing

**Rationale**:
- Constitution Technical Standards requires unit, integration, and contract tests
- pytest-asyncio for async service testing
- VCR.py for recording/replaying external API responses
- Vitest for React component and hook testing

**Test Categories**:
1. **Unit tests**: Risk calculation, data transformation, utility functions
2. **Integration tests**: API endpoint testing with mocked external services
3. **Contract tests**: Validate external API response schemas haven't changed
4. **E2E tests**: Playwright for critical user journeys (optional, Phase 2)

---

## Resolved Clarifications

### Q1: Which AI provider to use as primary?

**Resolution**: Support both with provider abstraction layer
- Default: OpenAI GPT-4o (wider availability)
- Alternative: Anthropic Claude 3.5 Sonnet (configurable via environment)
- Runtime switching based on availability/cost

### Q2: How to handle Street View API costs?

**Resolution**: Implement cost controls
- Cache Street View images for 90 days
- Lazy-load images only when user views amendment detail
- Budget alert when monthly costs exceed threshold
- Fallback to static maps if Street View unavailable

### Q3: CNAE mapping complexity?

**Resolution**: AI-assisted with human-curated baseline
- Create baseline mapping of common amendment purposes to CNAE groups
- Use AI for edge cases and semantic similarity
- Flag "ambiguous" cases for conservative scoring (avoid false positives)

### Q4: How to ensure legally neutral language throughout?

**Resolution**: Multi-layer validation
1. UI copy review checklist (part of PR process)
2. AI prompts explicitly instruct neutral language
3. Automated linter for banned words ("fraude", "corrupção", "crime")
4. User-facing text stored in i18n files for centralized review

---

## API Response Schema Research

### Portal da Transparência - Emendas Endpoint

Based on API documentation research:

```json
{
  "codigoEmenda": "string",
  "nomeAutor": "string",
  "anoEmenda": 2024,
  "valorEmpenhado": 500000.00,
  "objetoEmenda": "string (purpose description)",
  "cnpjBeneficiario": "string (14 digits)",
  "nomeBeneficiario": "string"
}
```

### BrasilAPI - CNPJ Endpoint

Based on API documentation:

```json
{
  "cnpj": "string",
  "razao_social": "string",
  "data_inicio_atividade": "YYYY-MM-DD",
  "cnae_fiscal": 1234567,
  "cnae_fiscal_descricao": "string",
  "capital_social": 100000.00,
  "logradouro": "string",
  "numero": "string",
  "municipio": "string",
  "uf": "string",
  "cep": "string"
}
```

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Portal da Transparência API changes schema | Medium | High | Contract tests, schema validation, alerts |
| AI classification accuracy < 70% | Low | Medium | Human review for high-stakes cases, confidence thresholds |
| Street View coverage gaps | High | Low | Graceful degradation, "unavailable" messaging |
| Rate limit exceeded on government APIs | Medium | Medium | Aggressive caching, request queuing |
| JWT secret compromise | Low | High | Environment variable, rotation procedure |

---

## Recommendations Summary

1. **Start with backend API** - Establish data pipeline before frontend
2. **Mock external APIs early** - Use VCR recordings for consistent testing
3. **Implement caching first** - Critical for both performance and API respect
4. **AI integration last** - Can be added incrementally after core features work
5. **Mobile-first CSS** - Tailwind's responsive prefixes make this straightforward
