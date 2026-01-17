# Quickstart Guide: Parliamentary Amendments Oversight System

**Feature**: 001-emendas-oversight
**Date**: 2026-01-16

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Python | 3.11+ | Backend API |
| Node.js | 20+ LTS | Frontend build |
| PostgreSQL | 15+ | Production database |
| Git | 2.x | Version control |

### Optional (Development)

| Software | Version | Purpose |
|----------|---------|---------|
| Docker | 24+ | Containerized services |
| Redis | 7+ | Production caching |

---

## Quick Start (Development)

### 1. Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd fiscaliza_ae

# Checkout feature branch
git checkout 001-emendas-oversight
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

### 3. Configure Environment

Edit `backend/.env`:

```env
# Database (SQLite for development)
DATABASE_URL=sqlite:///./dev.db

# Or PostgreSQL for production-like setup
# DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/fiscaliza_ae

# External APIs
PORTAL_TRANSPARENCIA_API_KEY=  # Optional, check if required
BRASILAPI_BASE_URL=https://brasilapi.com.br/api

# AI Provider (choose one)
OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=openai  # or "anthropic"

# Google Maps (for Street View)
GOOGLE_MAPS_API_KEY=AIza...

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# Cache (in-memory for development)
CACHE_BACKEND=memory
# CACHE_BACKEND=redis
# REDIS_URL=redis://localhost:6379/0
```

### 4. Initialize Database

```bash
# Run migrations
alembic upgrade head

# (Optional) Seed sample data for development
python -m src.scripts.seed_sample_data
```

### 5. Start Backend Server

```bash
# Development mode with auto-reload
uvicorn src.main:app --reload --port 8000

# Server will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### 6. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 7. Start Frontend

```bash
# Development mode with hot reload
npm run dev

# Frontend will be available at http://localhost:5173
```

---

## Verify Installation

### Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "portal_transparencia": "available",
  "brasilapi": "available",
  "database": "connected",
  "timestamp": "2026-01-16T10:00:00Z"
}
```

### API Documentation

Open http://localhost:8000/docs for interactive Swagger UI.

### Frontend

Open http://localhost:5173 - should show the amendments dashboard.

---

## Running Tests

### Backend Tests

```bash
cd backend

# All tests
pytest

# Unit tests only
pytest tests/unit/

# Integration tests (requires external APIs or mocks)
pytest tests/integration/

# Contract tests (validate external API schemas)
pytest tests/contract/

# With coverage
pytest --cov=src --cov-report=html
```

### Frontend Tests

```bash
cd frontend

# Unit tests
npm run test

# With coverage
npm run test:coverage

# E2E tests (requires backend running)
npm run test:e2e
```

---

## Development Workflow

### 1. Fetch Amendment Data

```bash
# Import amendments from Portal da Transparência (requires API)
python -m src.scripts.fetch_amendments --year 2024 --limit 100
```

### 2. Process Risk Scores

```bash
# Calculate risk scores for all unprocessed amendments
python -m src.scripts.calculate_risk_scores
```

### 3. Run Visual Analysis (requires AI API key)

```bash
# Analyze company locations (processes in batches)
python -m src.scripts.run_visual_analysis --batch-size 10
```

---

## Project Structure Reference

```
fiscaliza_ae/
├── backend/
│   ├── src/
│   │   ├── api/           # FastAPI route handlers
│   │   ├── core/          # Config, database, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── services/      # Business logic
│   │   └── scripts/       # CLI utilities
│   ├── tests/
│   ├── alembic/           # Database migrations
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API client
│   │   └── hooks/         # Custom hooks
│   ├── tests/
│   └── package.json
│
├── specs/
│   └── 001-emendas-oversight/
│       ├── spec.md        # Feature specification
│       ├── plan.md        # Implementation plan
│       ├── research.md    # Technology decisions
│       ├── data-model.md  # Database schema
│       ├── quickstart.md  # This file
│       └── contracts/     # API specifications
│
└── shared/
    └── glossary.json      # Portuguese term definitions
```

---

## Common Issues

### Issue: Database connection error

**Symptom**: `sqlalchemy.exc.OperationalError`

**Solution**:
```bash
# For SQLite, ensure directory exists
mkdir -p backend/data

# For PostgreSQL, verify connection string and that server is running
psql -h localhost -U postgres -c "SELECT 1"
```

### Issue: External API rate limit exceeded

**Symptom**: `429 Too Many Requests` from Portal da Transparência

**Solution**:
```bash
# Use cached data during development
CACHE_BACKEND=memory

# Or wait for rate limit reset (usually 1 minute)
```

### Issue: AI API key invalid

**Symptom**: `401 Unauthorized` from OpenAI/Anthropic

**Solution**:
1. Verify API key in `.env`
2. Check API key has sufficient credits/quota
3. Ensure correct provider is selected (`AI_PROVIDER`)

### Issue: Street View images not loading

**Symptom**: "Address verification unavailable" for all companies

**Solution**:
1. Verify `GOOGLE_MAPS_API_KEY` is set
2. Enable "Street View Static API" in Google Cloud Console
3. Check billing is enabled for the Google Cloud project

---

## Getting Help

- **Specification**: See [spec.md](spec.md) for feature requirements
- **API Contract**: See [contracts/openapi.yaml](contracts/openapi.yaml) for endpoint details
- **Data Model**: See [data-model.md](data-model.md) for database schema
- **Architecture Decisions**: See [research.md](research.md) for technology choices
