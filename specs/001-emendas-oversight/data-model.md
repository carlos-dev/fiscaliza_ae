# Data Model: Parliamentary Amendments Oversight System

**Feature**: 001-emendas-oversight
**Date**: 2026-01-16
**Database**: PostgreSQL 15+ (production) / SQLite (development)
**ORM**: SQLAlchemy 2.0+

---

## Entity Relationship Diagram

```
┌─────────────────────┐       ┌─────────────────────┐
│     Amendment       │       │      Company        │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │       │ cnpj (PK)           │
│ codigo_emenda (UK)  │       │ razao_social        │
│ nome_autor          │   ┌──→│ data_fundacao       │
│ ano_emenda          │   │   │ cnae_principal      │
│ valor_empenhado     │   │   │ cnae_descricao      │
│ objeto_emenda       │   │   │ capital_social      │
│ cnpj_beneficiario ──┼───┘   │ endereco (JSON)     │
│ nome_beneficiario   │       │ fonte_dados_url     │
│ fonte_dados_url     │       │ data_atualizacao    │
│ data_atualizacao    │       │ created_at          │
│ created_at          │       │ updated_at          │
│ updated_at          │       └─────────────────────┘
└─────────────────────┘                 │
         │                              │
         │ 1:1                          │ 1:1
         ▼                              │
┌─────────────────────┐                 │
│   RiskAssessment    │                 │
├─────────────────────┤                 │
│ id (PK)             │                 │
│ amendment_id (FK)───┼─────────────────┘
│ score_total         │
│ score_idade         │
│ score_cnae          │
│ score_capital       │
│ explicacao_idade    │
│ explicacao_cnae     │
│ explicacao_capital  │
│ categoria_risco     │
│ data_calculo        │
│ created_at          │
│ updated_at          │
└─────────────────────┘
         │
         │ 1:0..1
         ▼
┌─────────────────────┐
│   VisualAnalysis    │
├─────────────────────┤
│ id (PK)             │
│ risk_assessment_id  │
│ streetview_url      │
│ imagem_data_captura │
│ classificacao       │
│ confianca           │
│ justificativa       │
│ ai_provider         │
│ ai_model_version    │
│ data_analise        │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

---

## Entity Definitions

### 1. Amendment (Emenda)

Represents a federal parliamentary amendment retrieved from Portal da Transparência.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Internal unique identifier |
| `codigo_emenda` | VARCHAR(50) | UNIQUE, NOT NULL | Official amendment code from Portal da Transparência |
| `nome_autor` | VARCHAR(255) | NOT NULL, INDEX | Parliamentarian author name |
| `ano_emenda` | INTEGER | NOT NULL, INDEX, CHECK(>=2000) | Fiscal year of the amendment |
| `valor_empenhado` | DECIMAL(15,2) | NOT NULL | Committed monetary value in BRL |
| `objeto_emenda` | TEXT | NOT NULL | Purpose/description of the amendment |
| `cnpj_beneficiario` | VARCHAR(14) | INDEX | Recipient company CNPJ (digits only) |
| `nome_beneficiario` | VARCHAR(255) | | Recipient company/entity name |
| `fonte_dados_url` | VARCHAR(500) | NOT NULL | Direct URL to source in Portal da Transparência |
| `data_atualizacao` | TIMESTAMP | NOT NULL | When data was last fetched from API |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | Record last update time |

**Validation Rules**:
- `cnpj_beneficiario` must be 14 digits when present
- `valor_empenhado` must be positive
- `ano_emenda` between 2000 and current year + 1

**Indexes**:
- `idx_amendment_autor` on `nome_autor`
- `idx_amendment_ano` on `ano_emenda`
- `idx_amendment_cnpj` on `cnpj_beneficiario`
- `idx_amendment_codigo` on `codigo_emenda` (UNIQUE)

---

### 2. Company (Empresa)

Represents a recipient company with data from BrasilAPI.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `cnpj` | VARCHAR(14) | PK | Company CNPJ (digits only, 14 chars) |
| `razao_social` | VARCHAR(255) | NOT NULL | Legal company name |
| `data_fundacao` | DATE | | Company founding date (data_inicio_atividade) |
| `cnae_principal` | INTEGER | | Primary CNAE code (cnae_fiscal) |
| `cnae_descricao` | VARCHAR(255) | | CNAE description |
| `capital_social` | DECIMAL(15,2) | | Registered capital in BRL |
| `endereco` | JSONB | | Structured address (logradouro, numero, municipio, uf, cep) |
| `fonte_dados_url` | VARCHAR(500) | NOT NULL | BrasilAPI URL for this CNPJ |
| `data_atualizacao` | TIMESTAMP | NOT NULL | When data was last fetched |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | Record last update time |

**Address JSON Structure**:
```json
{
  "logradouro": "Rua Example",
  "numero": "123",
  "complemento": "Sala 45",
  "bairro": "Centro",
  "municipio": "São Paulo",
  "uf": "SP",
  "cep": "01234567"
}
```

**Validation Rules**:
- `cnpj` must be exactly 14 digits
- `capital_social` must be non-negative when present

---

### 3. RiskAssessment (AvaliacaoRisco)

Calculated risk analysis for an amendment-company pair.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Internal unique identifier |
| `amendment_id` | UUID | FK → Amendment, UNIQUE, NOT NULL | Associated amendment |
| `score_total` | DECIMAL(5,2) | NOT NULL, CHECK(0-100) | Overall risk score (0-100) |
| `score_idade` | DECIMAL(5,2) | CHECK(0-100) | Company age factor score |
| `score_cnae` | DECIMAL(5,2) | CHECK(0-100) | CNAE compatibility factor score |
| `score_capital` | DECIMAL(5,2) | CHECK(0-100) | Capital adequacy factor score |
| `explicacao_idade` | TEXT | | Plain-language explanation for age factor |
| `explicacao_cnae` | TEXT | | Plain-language explanation for CNAE factor |
| `explicacao_capital` | TEXT | | Plain-language explanation for capital factor |
| `categoria_risco` | VARCHAR(20) | NOT NULL | Risk category: 'baixo', 'medio', 'alto' |
| `data_calculo` | TIMESTAMP | NOT NULL | When calculation was performed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | Record last update time |

**Category Derivation**:
- `score_total` 0-30 → `categoria_risco` = 'baixo' (Low)
- `score_total` 31-69 → `categoria_risco` = 'medio' (Medium)
- `score_total` 70-100 → `categoria_risco` = 'alto' (High)

**Explanation Templates** (FR-015 compliance):
```
explicacao_idade: "Empresa fundada há {X} meses ({data_fundacao}) - {Risco Alto|Médio|Baixo}: +{Y} pontos"
explicacao_cnae: "CNAE '{cnae_descricao}' {compatível|incompatível|ambíguo} com objeto '{objeto_resumo}': +{Y} pontos"
explicacao_capital: "Capital social R${capital} representa {X}% do valor da emenda R${valor} - {Risco Alto|Médio|Baixo}: +{Y} pontos"
```

**Indexes**:
- `idx_risk_amendment` on `amendment_id` (UNIQUE)
- `idx_risk_score` on `score_total` (for filtering/sorting)
- `idx_risk_categoria` on `categoria_risco`

---

### 4. VisualAnalysis (AnaliseVisual)

AI-generated analysis of company location via Street View.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK | Internal unique identifier |
| `risk_assessment_id` | UUID | FK → RiskAssessment, UNIQUE | Associated risk assessment |
| `streetview_url` | VARCHAR(500) | | Google Street View image URL |
| `imagem_data_captura` | DATE | | When the Street View image was captured |
| `classificacao` | VARCHAR(50) | | AI classification result |
| `confianca` | DECIMAL(4,3) | CHECK(0-1) | AI confidence score (0.0-1.0) |
| `justificativa` | TEXT | | AI explanation of classification |
| `ai_provider` | VARCHAR(50) | NOT NULL | AI service used ('openai', 'anthropic') |
| `ai_model_version` | VARCHAR(50) | NOT NULL | Model version used |
| `data_analise` | TIMESTAMP | NOT NULL | When AI analysis was performed |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP | ON UPDATE NOW() | Record last update time |

**Classification Values** (enum):
- `'Estabelecimento Comercial'` (Commercial Establishment)
- `'Propriedade Residencial'` (Residential Property)
- `'Terreno Vago'` (Vacant/Undeveloped Lot)
- `'Indisponível'` (Unavailable - no Street View data)

**Constitution III Compliance**:
- `ai_provider` and `ai_model_version` enable auditability
- `justificativa` provides explainability
- `confianca` enables confidence-based filtering

---

## State Transitions

### Amendment Processing States

```
[API Fetch] → [Stored] → [Company Linked] → [Risk Calculated] → [Visual Analyzed]
                           ↓                    ↓
                    [Company Not Found]   [Partial Score]
                    (cnpj invalid/missing)  (missing data)
```

### Risk Assessment States

| State | Condition | User Display |
|-------|-----------|--------------|
| Complete | All 3 factors calculated | Full risk breakdown |
| Partial - No Company | Company data unavailable | "Dados da empresa indisponíveis - pontuação parcial" |
| Partial - No CNAE | CNAE analysis not possible | "Análise CNAE indisponível" |
| Pending | Calculation in progress | Loading indicator |

---

## SQLAlchemy Models (Reference)

```python
from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

class Amendment(Base):
    __tablename__ = 'amendments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    codigo_emenda = Column(String(50), unique=True, nullable=False)
    nome_autor = Column(String(255), nullable=False, index=True)
    ano_emenda = Column(Integer, nullable=False, index=True)
    valor_empenhado = Column(Numeric(15, 2), nullable=False)
    objeto_emenda = Column(Text, nullable=False)
    cnpj_beneficiario = Column(String(14), index=True)
    nome_beneficiario = Column(String(255))
    fonte_dados_url = Column(String(500), nullable=False)
    data_atualizacao = Column(DateTime, nullable=False)

    # Relationships
    risk_assessment = relationship("RiskAssessment", back_populates="amendment", uselist=False)
    company = relationship("Company", foreign_keys=[cnpj_beneficiario], primaryjoin="Amendment.cnpj_beneficiario==Company.cnpj")

class Company(Base):
    __tablename__ = 'companies'

    cnpj = Column(String(14), primary_key=True)
    razao_social = Column(String(255), nullable=False)
    data_fundacao = Column(Date)
    cnae_principal = Column(Integer)
    cnae_descricao = Column(String(255))
    capital_social = Column(Numeric(15, 2))
    endereco = Column(JSONB)
    fonte_dados_url = Column(String(500), nullable=False)
    data_atualizacao = Column(DateTime, nullable=False)

class RiskAssessment(Base):
    __tablename__ = 'risk_assessments'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    amendment_id = Column(UUID(as_uuid=True), ForeignKey('amendments.id'), unique=True, nullable=False)
    score_total = Column(Numeric(5, 2), nullable=False)
    score_idade = Column(Numeric(5, 2))
    score_cnae = Column(Numeric(5, 2))
    score_capital = Column(Numeric(5, 2))
    explicacao_idade = Column(Text)
    explicacao_cnae = Column(Text)
    explicacao_capital = Column(Text)
    categoria_risco = Column(String(20), nullable=False)
    data_calculo = Column(DateTime, nullable=False)

    # Relationships
    amendment = relationship("Amendment", back_populates="risk_assessment")
    visual_analysis = relationship("VisualAnalysis", back_populates="risk_assessment", uselist=False)

    __table_args__ = (
        CheckConstraint('score_total >= 0 AND score_total <= 100'),
        CheckConstraint("categoria_risco IN ('baixo', 'medio', 'alto')"),
    )

class VisualAnalysis(Base):
    __tablename__ = 'visual_analyses'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    risk_assessment_id = Column(UUID(as_uuid=True), ForeignKey('risk_assessments.id'), unique=True)
    streetview_url = Column(String(500))
    imagem_data_captura = Column(Date)
    classificacao = Column(String(50))
    confianca = Column(Numeric(4, 3))
    justificativa = Column(Text)
    ai_provider = Column(String(50), nullable=False)
    ai_model_version = Column(String(50), nullable=False)
    data_analise = Column(DateTime, nullable=False)

    # Relationships
    risk_assessment = relationship("RiskAssessment", back_populates="visual_analysis")
```

---

## Migration Strategy

1. **Initial Migration**: Create all tables with indexes
2. **Data Seeding**: Import sample amendments for development
3. **Index Tuning**: Add composite indexes based on query patterns after load testing
