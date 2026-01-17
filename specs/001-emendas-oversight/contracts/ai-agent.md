# AI Agent Interface Contract

**Feature**: 001-emendas-oversight
**Date**: 2026-01-16
**Providers**: OpenAI GPT-4o

---

## Overview

The AI Agent provides two core capabilities:
1. **Vision Analysis**: Classify Street View images of company addresses
2. **NLP Analysis**: Assess CNAE compatibility with amendment purposes

Both capabilities must comply with Constitution III (AI Ethics & Explainability).

---

## Provider Abstraction

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Optional

class LocationClassification(str, Enum):
    COMMERCIAL = "Estabelecimento Comercial"
    RESIDENTIAL = "Propriedade Residencial"
    VACANT = "Terreno Vago"
    UNAVAILABLE = "Indisponível"

class CNAECompatibility(str, Enum):
    COMPATIBLE = "compativel"
    INCOMPATIBLE = "incompativel"
    AMBIGUOUS = "ambiguo"

@dataclass
class VisionAnalysisResult:
    classification: LocationClassification
    confidence: float  # 0.0 - 1.0
    justification: str  # Portuguese explanation
    provider: str  # e.g., "openai"
    model_version: str  # e.g., "gpt-4o-2024-08-06"

@dataclass
class CNAEAnalysisResult:
    compatibility: CNAECompatibility
    confidence: float  # 0.0 - 1.0
    reasoning: str  # Portuguese explanation
    provider: str
    model_version: str

class AIAgentInterface(ABC):
    """Abstract interface for AI agent implementations."""

    @abstractmethod
    async def analyze_location(
        self,
        image_url: str,
        address_context: Optional[str] = None
    ) -> VisionAnalysisResult:
        """
        Classify a Street View image of a company address.

        Args:
            image_url: URL to Street View image
            address_context: Optional address string for context

        Returns:
            VisionAnalysisResult with classification and explanation
        """
        pass

    @abstractmethod
    async def analyze_cnae_compatibility(
        self,
        amendment_purpose: str,
        cnae_code: int,
        cnae_description: str
    ) -> CNAEAnalysisResult:
        """
        Assess whether a company's CNAE is compatible with amendment purpose.

        Args:
            amendment_purpose: The "objeto_emenda" text describing amendment purpose
            cnae_code: Primary CNAE code (e.g., 4711302)
            cnae_description: CNAE description (e.g., "Comércio varejista...")

        Returns:
            CNAEAnalysisResult with compatibility assessment and reasoning
        """
        pass
```

---

## Vision Analysis Specification

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image_url` | string (URL) | Yes | Google Street View static image URL |
| `address_context` | string | No | Full address for additional context |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `classification` | enum | One of: "Estabelecimento Comercial", "Propriedade Residencial", "Terreno Vago", "Indisponível" |
| `confidence` | float (0-1) | Model confidence in classification |
| `justification` | string | Portuguese explanation of visual features observed |
| `provider` | string | AI provider identifier |
| `model_version` | string | Specific model version used |

### Prompt Template (Vision)

```text
Você é um analista visual especializado em classificar endereços comerciais brasileiros.

Analise a imagem do Google Street View fornecida e classifique o local em UMA das seguintes categorias:

1. **Estabelecimento Comercial**: Local com características comerciais visíveis (fachada de loja, escritório, galpão industrial, placas comerciais, estacionamento para clientes, etc.)

2. **Propriedade Residencial**: Local com características residenciais (casa, apartamento, condomínio residencial, sem indicação de atividade comercial)

3. **Terreno Vago**: Local sem construção significativa (terreno baldio, área em construção inicial, ruínas)

IMPORTANTE:
- Seja conservador: se houver dúvida entre comercial e residencial, considere os elementos visíveis
- Negócios em residências (home office com placa comercial) devem ser classificados como comerciais
- Prédios mistos (comércio no térreo, residencial em cima) devem ser classificados como comerciais

Responda EXCLUSIVAMENTE em JSON com o seguinte formato:
{
  "classificacao": "[categoria escolhida]",
  "confianca": [0.0-1.0],
  "justificativa": "[descreva os elementos visuais que levaram à classificação]"
}

Contexto do endereço (se disponível): {address_context}
```

### Classification Guidelines

| Classification | Visual Indicators |
|----------------|-------------------|
| **Estabelecimento Comercial** | Storefront, commercial signage, loading docks, business parking, industrial equipment, office building facade |
| **Propriedade Residencial** | Residential architecture, no commercial signage, residential garage, garden/lawn typical of homes |
| **Terreno Vago** | Empty lot, undeveloped land, construction site (early stage), ruins/abandoned structure |
| **Indisponível** | Image unavailable, blurred, or unusable |

---

## NLP Analysis Specification (CNAE Compatibility)

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amendment_purpose` | string | Yes | The `objeto_emenda` text describing what the amendment funds |
| `cnae_code` | integer | Yes | Primary CNAE code (7 digits) |
| `cnae_description` | string | Yes | Official CNAE description from BrasilAPI |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `compatibility` | enum | One of: "compativel", "incompativel", "ambiguo" |
| `confidence` | float (0-1) | Model confidence in assessment |
| `reasoning` | string | Portuguese explanation of compatibility assessment |
| `provider` | string | AI provider identifier |
| `model_version` | string | Specific model version used |

### Prompt Template (NLP)

```text
Você é um analista especializado em emendas parlamentares brasileiras e classificação CNAE.

Avalie se a atividade principal de uma empresa (definida pelo CNAE) é COMPATÍVEL com o objetivo declarado de uma emenda parlamentar.

## Dados da Análise

**Objeto da Emenda (propósito declarado):**
{amendment_purpose}

**CNAE Principal da Empresa:**
Código: {cnae_code}
Descrição: {cnae_description}

## Critérios de Avaliação

1. **COMPATÍVEL**: A atividade CNAE está claramente relacionada ao objeto da emenda
   - Exemplo: Emenda para "equipamentos hospitalares" + CNAE "Comércio de equipamentos médicos"
   - Exemplo: Emenda para "construção de escola" + CNAE "Construção de edifícios"

2. **INCOMPATÍVEL**: A atividade CNAE NÃO tem relação lógica com o objeto da emenda
   - Exemplo: Emenda para "equipamentos hospitalares" + CNAE "Comércio de bebidas"
   - Exemplo: Emenda para "obras de saneamento" + CNAE "Salão de beleza"

3. **AMBÍGUO**: Não é possível determinar compatibilidade com certeza
   - CNAEs genéricos (holding, consultoria) que podem abranger múltiplas atividades
   - Objeto da emenda muito vago para análise
   - Casos onde a empresa pode atuar como intermediária legítima

IMPORTANTE:
- Seja CONSERVADOR: só classifique como "incompatível" se for CLARAMENTE incompatível
- Emendas para "saúde", "educação", "cultura" são amplas e podem ter múltiplos fornecedores legítimos
- Holdings e consultorias podem legitimamente intermediar diversos tipos de compras
- Na dúvida, classifique como "ambíguo"

Responda EXCLUSIVAMENTE em JSON:
{
  "compatibilidade": "[compativel|incompativel|ambiguo]",
  "confianca": [0.0-1.0],
  "raciocinio": "[explique sua análise em português claro]"
}
```

### Compatibility Decision Matrix

| Amendment Category | Clearly Compatible CNAEs | Clearly Incompatible CNAEs |
|--------------------|--------------------------|----------------------------|
| Saúde/Equipamentos médicos | Comércio de equipamentos médicos, Fabricação de instrumentos médicos | Comércio de bebidas, Restaurantes |
| Educação/Material escolar | Comércio de papelaria, Fabricação de móveis escolares | Agropecuária, Mineração |
| Infraestrutura/Obras | Construção civil, Engenharia | Comércio de alimentos, Academias |
| Cultura/Eventos | Produção de espetáculos, Equipamentos audiovisuais | Frigoríficos, Metalurgia |

**Always Ambiguous**: Holdings, Consultorias, Serviços administrativos, CNAEs de atividades múltiplas

---

## Error Handling

### Vision Analysis Errors

| Error Code | Condition | Fallback |
|------------|-----------|----------|
| `IMAGE_UNAVAILABLE` | Street View URL returns 404 or error | Return classification = "Indisponível" |
| `IMAGE_INVALID` | Image exists but is unusable (blurred, indoor) | Return classification = "Indisponível" with explanation |
| `AI_TIMEOUT` | AI provider timeout (>30s) | Retry once, then return null analysis |
| `AI_ERROR` | AI provider returns error | Log error, return null analysis |

### NLP Analysis Errors

| Error Code | Condition | Fallback |
|------------|-----------|----------|
| `PURPOSE_EMPTY` | Amendment purpose is empty/null | Return compatibility = "ambiguo" with warning |
| `CNAE_INVALID` | CNAE code invalid or description missing | Return compatibility = "ambiguo" with warning |
| `AI_TIMEOUT` | AI provider timeout | Retry once, then return "ambiguo" |
| `AI_ERROR` | AI provider returns error | Log error, return "ambiguo" |

---

## Rate Limiting & Costs

### Per-Provider Limits

| Provider | Rate Limit | Cost Estimate (per analysis) |
|----------|------------|------------------------------|
| OpenAI GPT-4o | 500 RPM | ~$0.02 (vision), ~$0.01 (NLP) |
| Anthropic Claude 3.5 | 1000 RPM | ~$0.02 (vision), ~$0.01 (NLP) |

### Cost Controls

1. **Cache AI results** for 30 days (same image/CNAE pair)
2. **Lazy-load** visual analysis (only on detail page view)
3. **Budget alerts** when monthly AI costs exceed threshold
4. **Fallback to simpler model** if primary unavailable

---

## Testing Requirements

### Vision Analysis Tests

```python
# Test cases for vision analysis
VISION_TEST_CASES = [
    {
        "description": "Clear commercial storefront",
        "image_url": "test_fixtures/commercial_storefront.jpg",
        "expected_classification": "Estabelecimento Comercial",
        "min_confidence": 0.8
    },
    {
        "description": "Residential house",
        "image_url": "test_fixtures/residential_house.jpg",
        "expected_classification": "Propriedade Residencial",
        "min_confidence": 0.7
    },
    {
        "description": "Empty lot",
        "image_url": "test_fixtures/vacant_lot.jpg",
        "expected_classification": "Terreno Vago",
        "min_confidence": 0.7
    },
    {
        "description": "Mixed use building (ground floor commercial)",
        "image_url": "test_fixtures/mixed_use.jpg",
        "expected_classification": "Estabelecimento Comercial",
        "min_confidence": 0.6
    }
]
```

### NLP Analysis Tests

```python
# Test cases for CNAE compatibility
CNAE_TEST_CASES = [
    {
        "description": "Clear match - medical equipment",
        "amendment_purpose": "Aquisição de equipamentos médico-hospitalares",
        "cnae_code": 4645101,
        "cnae_description": "Comércio atacadista de instrumentos e materiais para uso médico",
        "expected_compatibility": "compativel"
    },
    {
        "description": "Clear mismatch - beverage company for hospital",
        "amendment_purpose": "Construção de unidade básica de saúde",
        "cnae_code": 4635402,
        "cnae_description": "Comércio atacadista de cerveja, chope e refrigerante",
        "expected_compatibility": "incompativel"
    },
    {
        "description": "Ambiguous - holding company",
        "amendment_purpose": "Apoio a projetos culturais",
        "cnae_code": 6462000,
        "cnae_description": "Holdings de instituições não-financeiras",
        "expected_compatibility": "ambiguo"
    }
]
```

---

## Constitution III Compliance Checklist

- [x] **Explainable**: `justification`/`reasoning` fields provide human-readable explanations
- [x] **Auditable**: `provider` and `model_version` recorded for every analysis
- [x] **Bias-aware**: Conservative thresholds, "ambiguous" option prevents over-flagging
- [x] **Labeled**: UI displays "Classificação gerada por IA" with disclaimer
- [x] **No behavior prediction**: Analyzes transactions/locations, not individuals
