# Feature Specification: Parliamentary Amendments Oversight System

**Feature Branch**: `001-emendas-oversight`
**Created**: 2026-01-16
**Status**: Draft
**Input**: User description: "Desenvolver uma aplicação web para identificar e pontuar potenciais irregularidades em emendas parlamentares federais brasileiras, focando em desvios de finalidade e empresas de fachada."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search and Filter Suspicious Amendments (Priority: P1)

A citizen or journalist wants to explore federal parliamentary amendments to identify potential irregularities based on objective risk indicators.

**Why this priority**: This is the core value proposition - enabling citizens to discover potentially problematic amendments through searchable, filterable data. Without this, the system has no utility.

**Independent Test**: Can be fully tested by loading the dashboard, applying filters (by parliamentarian, year, risk score), and viewing a list of amendments ranked by risk score. Delivers immediate value by surfacing high-risk cases.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded, **When** a citizen selects a specific parliamentarian from the filter, **Then** the system displays all amendments authored by that parliamentarian with their respective risk scores
2. **Given** the dashboard shows a list of amendments, **When** a user applies a risk score filter (e.g., "High Risk: 70-100"), **Then** only amendments meeting that risk threshold are displayed
3. **Given** a list of filtered amendments, **When** a user sorts by risk score descending, **Then** the highest-risk amendments appear at the top of the list
4. **Given** the dashboard, **When** a user filters by year (e.g., "2024"), **Then** only amendments from that year are shown
5. **Given** multiple filters are active (e.g., parliamentarian + year + risk score), **When** the user clears all filters, **Then** the full dataset is displayed again

---

### User Story 2 - View Amendment Risk Details (Priority: P2)

A user wants to understand WHY a specific amendment was flagged as high-risk by viewing detailed evidence and data sources.

**Why this priority**: Discovery is useless without explanation. Users need to see the evidence trail to trust the system and pursue further investigation.

**Independent Test**: Can be tested by clicking on any amendment from the list and viewing a detail page that shows: amendment metadata, recipient company data, risk score breakdown, and source links. Works independently as long as User Story 1 provides clickable amendment entries.

**Acceptance Scenarios**:

1. **Given** a list of amendments on the dashboard, **When** a user clicks on a specific amendment, **Then** the system displays a detail page showing amendment metadata (author, year, value, purpose, recipient company CNPJ)
2. **Given** the amendment detail page, **When** the page loads, **Then** the system displays the calculated risk score (0-100) with a visual breakdown of contributing factors (company age, CNAE mismatch, capital social inadequacy)
3. **Given** the risk score breakdown, **When** a user views each risk factor, **Then** each factor shows its individual score contribution and a plain-language explanation (e.g., "Company founded 8 months ago - High Risk: +30 points")
4. **Given** the amendment detail page, **When** displayed, **Then** all data points include clickable links to original sources (Portal da Transparência API endpoint for the amendment, BrasilAPI link for company registration data)
5. **Given** the detail page, **When** a user clicks a source link, **Then** the original government data source opens in a new tab for verification

---

### User Story 3 - Visual Location Analysis (Priority: P3)

A user wants to assess whether the recipient company's registered address appears to be a legitimate commercial location, using AI-assisted visual analysis.

**Why this priority**: Visual evidence adds investigative depth but is not essential for the core oversight function. The system delivers value without this feature, but it enhances investigative quality.

**Independent Test**: Can be tested by viewing an amendment detail page (from User Story 2) and seeing a Street View image of the company address with an AI classification label ("Commercial", "Residential", "Vacant Lot"). Works independently as an enhancement to detail pages.

**Acceptance Scenarios**:

1. **Given** an amendment detail page is displayed, **When** the recipient company has a valid registered address, **Then** the system displays a Street View image of that address
2. **Given** a Street View image is displayed, **When** the AI analysis completes, **Then** the system shows a classification label ("Commercial Establishment", "Residential Property", or "Vacant/Undeveloped Lot")
3. **Given** an AI classification label, **When** displayed, **Then** the label includes a disclaimer: "AI-generated classification - verify independently"
4. **Given** the visual analysis section, **When** a user views it, **Then** a clickable link to the full Street View in Google Maps is provided for manual verification
5. **Given** an amendment where the company address is invalid or unavailable, **When** the detail page loads, **Then** the system displays "Address verification unavailable - no Street View data" instead of failing

---

### Edge Cases

- What happens when the Portal da Transparência API is unavailable or returns incomplete data? (System should display cached data with staleness indicator, e.g., "Data last updated: 2 days ago - source currently unavailable")
- What happens when BrasilAPI does not return company data for a CNPJ? (System should show "Company data unavailable - unable to calculate full risk score" and display partial risk analysis based on available amendment data)
- How does the system handle amendments with multiple recipient companies? (System should calculate individual risk scores for each recipient and display them separately in the detail view)
- What happens when a company CNAE code is ambiguous or could be compatible with multiple amendment purposes? (System should use a conservative approach - only flag as mismatch if clearly incompatible, document ambiguous cases as "Unable to assess CNAE compatibility")
- How does the system handle amendments with zero or extremely low values? (System should exclude amendments below a minimum threshold from capital social ratio analysis, as the 1% rule may not apply to small amounts)
- What happens when Street View imagery is outdated or unavailable for an address? (System should display image date if available and provide "Image may be outdated - verify current status independently" warning)
- How does the system handle amendments where the purpose description is vague or missing? (System should flag these as "Insufficient data for CNAE compatibility analysis" rather than making assumptions)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST retrieve federal parliamentary amendment data from the Portal da Transparência API (endpoint: `/api-de-dados/emendas`) including: author, year, value, purpose description, and recipient company CNPJ
- **FR-002**: System MUST retrieve company registration data from BrasilAPI (endpoint: `/cnpj/{cnpj}`) including: founding date, primary CNAE code, registered capital, and registered address
- **FR-003**: System MUST calculate a Risk Score (0-100 scale) for each amendment based on three weighted factors:
  - Company age (high score if founded < 1 year ago)
  - CNAE compatibility (high score if primary CNAE is incompatible with amendment purpose)
  - Capital adequacy (high score if registered capital < 1% of amendment value)
- **FR-004**: System MUST provide a dashboard interface with filtering capabilities by: parliamentarian name, fiscal year, and risk score range (e.g., 0-30 Low, 31-69 Medium, 70-100 High)
- **FR-005**: System MUST display a sortable list of amendments showing: author, year, recipient company name, amendment value, and calculated risk score
- **FR-006**: Users MUST be able to click on any amendment in the list to view a detailed analysis page
- **FR-007**: The amendment detail page MUST display: full amendment metadata, recipient company information, risk score breakdown with individual factor contributions, and source data links
- **FR-008**: System MUST retrieve Street View imagery for the recipient company's registered address using a maps API
- **FR-009**: System MUST use an AI agent to classify the Street View image as one of three categories: "Commercial Establishment", "Residential Property", or "Vacant/Undeveloped Lot"
- **FR-010**: System MUST display the AI classification alongside the Street View image with a clear "AI-generated" label and disclaimer
- **FR-011**: System MUST use legally neutral terminology throughout - NEVER use terms like "fraud" or "corruption"; instead use "Potential Irregularity", "High Risk Pattern", or "Requires Further Investigation"
- **FR-012**: All data presented MUST include direct links to original government sources for citizen verification
- **FR-013**: System MUST cache API responses to minimize load on government APIs and improve performance (cache duration: [NEEDS CLARIFICATION: cache duration not specified - suggest 24 hours for amendment data, 7 days for company data, but may need adjustment based on data update frequency])
- **FR-014**: System MUST display data staleness indicators when showing cached data (e.g., "Data as of: 2026-01-15 14:32")
- **FR-015**: System MUST provide clear explanations for each risk factor calculation visible to end users (e.g., "Company age: Founded 6 months ago (2025-07-15) - High risk for new entity receiving R$500,000 - Contributes +35 points")

### Key Entities *(include if feature involves data)*

- **Amendment**: Represents a federal parliamentary amendment with attributes: unique identifier, author (parliamentarian), fiscal year, monetary value, purpose description, recipient company CNPJ, calculated risk score, data source timestamp
- **Company**: Represents a recipient company with attributes: CNPJ (unique identifier), legal name, founding date, primary CNAE code, registered capital amount, registered address (street, city, state, postal code), data source timestamp
- **Risk Assessment**: Represents the calculated risk analysis for an amendment with attributes: overall score (0-100), company age score component, CNAE compatibility score component, capital adequacy score component, calculation timestamp, explanatory notes for each factor
- **Visual Analysis**: Represents the AI-assisted location assessment with attributes: Street View image URL, AI classification result (Commercial/Residential/Vacant), AI confidence score, image capture date, analysis timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Citizens can discover and filter amendments by key criteria (parliamentarian, year, risk level) and view results in under 2 seconds for cached data
- **SC-002**: Users can view detailed risk analysis for any amendment, including data source verification links, within 3 clicks from the dashboard
- **SC-003**: The system processes and displays risk scores for at least 10,000 amendments without performance degradation (page load time remains under 3 seconds)
- **SC-004**: All displayed data includes verifiable source links, enabling citizens to independently confirm facts in the original government datasets
- **SC-005**: Risk score calculations are explainable - users can see exactly which factors contributed to the score and by how much
- **SC-006**: The system maintains legal safety by using only neutral, evidence-based language - zero instances of accusatory terminology ("fraud", "corruption") in user-facing content
- **SC-007**: Visual location analysis (when available) provides additional investigative context for at least 80% of amendments (assuming Street View coverage availability)
- **SC-008**: The system gracefully handles government API unavailability by serving cached data with clear staleness indicators, maintaining availability above 95% from the user perspective

### Assumptions

1. **API Availability**: Portal da Transparência and BrasilAPI maintain reasonable uptime (>90%) and stable response formats
2. **Data Completeness**: Most amendments include recipient CNPJ data; when missing, the system can still function with partial risk analysis
3. **CNAE Mapping**: A predefined mapping between common amendment purposes (e.g., "Culture", "Health", "Education") and compatible CNAE codes can be established (may require domain expert input)
4. **Street View Access**: Google Street View API (or equivalent) is accessible and cost-feasible for the volume of lookups expected
5. **AI Image Classification**: A pre-trained or fine-tuned image classification model can reliably distinguish between commercial, residential, and vacant properties with reasonable accuracy (>70%)
6. **User Base**: Primary users are Brazilian citizens, journalists, and civil society organizations with basic web literacy
7. **Language**: Interface will be in Portuguese (Brazil)
8. **Access Model**: The system is publicly accessible without authentication (user accounts not required for basic functionality)
9. **Update Frequency**: Amendment data updates are not real-time - daily or weekly refresh cycles are acceptable for the oversight use case
