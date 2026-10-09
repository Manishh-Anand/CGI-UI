-- ============================================================================
-- Consilio — EA Project Database Schema
-- ----------------------------------------------------------------------------
-- Generated from:
--   data/EAprojData/Cobalt client.xlsx                                  (client / CRM domain)
--   data/EAprojData/eDiscovery_Final_Master_Workbook_With_Market_Contribution 1.xlsx
--                                                                       (competitive intelligence domain)
--   data/EAprojData/Consilio_Applications_Tools_EDRM_Inventory_Final (1).xlsx
--                                                                       (application & tool catalog)
--   data/EAprojData/Consilio_Tools_Technology_Categories_Dashboard.xlsx  (tool technology detail)
--   data/EAprojData/Consilio_Populated_Data_Final.xlsx                  (company profile domain)
--   docs/Workflow/WORKFLOW.md §3.9, §4.13                               (workflow-derived entities)
--
-- Target dialect : PostgreSQL 14+
-- Conventions     : singular snake_case table names; natural keys kept where
--                   the source data defines them (C001, S001, D001, CS001...);
--                   UUID primary keys where the source uses UUIDs (company
--                   profile domain); SERIAL surrogate keys where the source
--                   has none (catalog, gaps).
-- Notes:
--   * Boolean-ish source flags ("Yes"/"TBD"/"No*") are stored as nullable
--     VARCHAR(10) in the catalog tables because the source tri-state carries
--     meaning (TBD = unknown, not false).
--   * client_revenue.yoy_growth_pct is 'N/A' in all source rows -> NULL.
--   * The Data Dictionary lists Revenue/Business Scale Contribution % under
--     both "Company Profile" (table 1) and "Financials & Scale" (table 9);
--     they are stored ONCE in competitor_financials to avoid duplication.
--   * client (Cobalt client.xlsx) and competitor (eDiscovery workbook) are
--     deliberately separate domains — no cross-domain foreign keys.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. TEARDOWN (idempotent re-run)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS service_request            CASCADE;
DROP TABLE IF EXISTS opportunity               CASCADE;
DROP TABLE IF EXISTS validation_gap            CASCADE;
DROP TABLE IF EXISTS tool_technology_detail    CASCADE;
DROP TABLE IF EXISTS application_tool          CASCADE;
DROP TABLE IF EXISTS edm_phase                 CASCADE;
DROP TABLE IF EXISTS competitor_financials     CASCADE;
DROP TABLE IF EXISTS competitor_brand_positioning   CASCADE;
DROP TABLE IF EXISTS competitor_commercials_pricing CASCADE;
DROP TABLE IF EXISTS competitor_security_compliance CASCADE;
DROP TABLE IF EXISTS competitor_services_footprint  CASCADE;
DROP TABLE IF EXISTS competitor_ai_strategy    CASCADE;
DROP TABLE IF EXISTS competitor_edrm           CASCADE;
DROP TABLE IF EXISTS competitor_product_architecture CASCADE;
DROP TABLE IF EXISTS competitor               CASCADE;
DROP TABLE IF EXISTS client_revenue            CASCADE;
DROP TABLE IF EXISTS client_lifecycle          CASCADE;
DROP TABLE IF EXISTS client_service           CASCADE;
DROP TABLE IF EXISTS service                   CASCADE;
DROP TABLE IF EXISTS client                   CASCADE;
DROP TABLE IF EXISTS domain                   CASCADE;
DROP TABLE IF EXISTS language_capability      CASCADE;
DROP TABLE IF EXISTS market_segment           CASCADE;
DROP TABLE IF EXISTS workforce_metric          CASCADE;
DROP TABLE IF EXISTS service_solution         CASCADE;
DROP TABLE IF EXISTS award                    CASCADE;
DROP TABLE IF EXISTS company_financial        CASCADE;
DROP TABLE IF EXISTS company_milestone        CASCADE;
DROP TABLE IF EXISTS leader                   CASCADE;
DROP TABLE IF EXISTS company_metric           CASCADE;
DROP TABLE IF EXISTS company_profile          CASCADE;
DROP TABLE IF EXISTS location                 CASCADE;

-- ===========================================================================
-- DOMAIN 1 — CLIENT / CRM  (source: "Cobalt client.xlsx")
-- Mirrors the pre-engagement -> engagement lifecycle in WORKFLOW.md §3-§4.
-- ===========================================================================

-- Sheet: Domain (7 rows)
CREATE TABLE domain (
    domain_id    VARCHAR(10)  PRIMARY KEY,             -- e.g. 'D001'
    domain_name  VARCHAR(100) NOT NULL,
    description  TEXT,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Sheet: Client (49 rows)  -- §3.9 'Client Name' = CRM primary key
CREATE TABLE client (
    client_id                VARCHAR(10)   PRIMARY KEY,            -- 'C001'
    client_name              VARCHAR(200)  NOT NULL,
    domain_id                VARCHAR(10)   NOT NULL REFERENCES domain(domain_id),
    country_region           VARCHAR(100),
    company_size             VARCHAR(50),                          -- 'Large enterprise', 'Medium', 'Large law firm', ...
    company_revenue          NUMERIC(20,2),
    company_revenue_currency VARCHAR(3),                           -- ISO-4217: USD, GBP, EUR, CHF, SEK, INR
    employee_count           INTEGER,
    tenure_start_date       DATE,
    tenure_years             NUMERIC(4,1),
    client_status            VARCHAR(20)   NOT NULL DEFAULT 'Active'
        CHECK (client_status IN ('Active', 'At Risk', 'Dormant', 'Churned')),
    client_value_score       INTEGER,                              -- 0-100
    client_value_tier        VARCHAR(10)
        CHECK (client_value_tier IN ('Low', 'Medium', 'High', 'Very High'))
);

-- Sheet: Service (8 rows)  -- service catalog offered to clients
CREATE TABLE service (
    service_id       VARCHAR(10)  PRIMARY KEY,                      -- 'S001'
    service_name     VARCHAR(200) NOT NULL,
    service_category VARCHAR(100),                                 -- 'eDiscovery', 'Document Review', ...
    description      TEXT,
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Sheet: Client_Service (164 rows)  -- M:N client <-> service with period
CREATE TABLE client_service (
    client_service_id VARCHAR(10) PRIMARY KEY,                     -- 'CS001'
    client_id         VARCHAR(10) NOT NULL REFERENCES client(client_id),
    service_id        VARCHAR(10) NOT NULL REFERENCES service(service_id),
    service_start_date DATE,
    service_end_date   DATE,
    service_status     VARCHAR(20) NOT NULL DEFAULT 'Active'
        CHECK (service_status IN ('Active', 'Ended')),
    CONSTRAINT uq_client_service_period UNIQUE (client_id, service_id, service_start_date),
    CONSTRAINT ck_client_service_dates CHECK (service_end_date IS NULL OR service_end_date >= service_start_date)
);

-- Sheet: Client_Lifecycle (49 rows)  -- status history (SCD-style, one current row per client)
CREATE TABLE client_lifecycle (
    lifecycle_id    VARCHAR(10) PRIMARY KEY,                       -- 'L001'
    client_id       VARCHAR(10) NOT NULL REFERENCES client(client_id),
    status          VARCHAR(20) NOT NULL
        CHECK (status IN ('Active', 'At Risk', 'Dormant', 'Churned')),
    effective_from  DATE         NOT NULL,
    effective_to    DATE,
    churn_reason    VARCHAR(255),
    is_current      BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT ck_lifecycle_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

-- Sheet: Client_Revenue (204 rows)  -- revenue by client x service x period
CREATE TABLE client_revenue (
    client_revenue_id     VARCHAR(10) PRIMARY KEY,                 -- 'CR001'
    client_id             VARCHAR(10) NOT NULL REFERENCES client(client_id),
    service_id            VARCHAR(10) NOT NULL REFERENCES service(service_id),
    period_type           VARCHAR(10) NOT NULL
        CHECK (period_type IN ('Annual', 'YTD')),
    period_start          DATE NOT NULL,
    period_end            DATE NOT NULL,
    revenue_generated     NUMERIC(18,2),
    currency              VARCHAR(3),                              -- ISO-4217
    revenue_pct_of_total  NUMERIC(18,8),                           -- fraction 0-1 (e.g. 0.0046 = 0.46%)
    yoy_growth_pct        NUMERIC(7,2),                            -- NULL = 'N/A' in source
    CONSTRAINT uq_client_revenue_period UNIQUE (client_id, service_id, period_type, period_start),
    CONSTRAINT ck_client_revenue_dates CHECK (period_end >= period_start)
);

-- ===========================================================================
-- DOMAIN 2 — COMPETITIVE INTELLIGENCE
-- (source: eDiscovery workbook — 'Data Dictionary' table definitions 1-9,
--  'Master Cleaned Dataset' 62-column wide table, 20 vendor rows)
-- Company name is the master key (dictionary: "Primary Key" / "Foreign Key").
-- ===========================================================================

-- Dictionary Table 1: COMPANY PROFILE (+ master columns of the wide table)
CREATE TABLE competitor (
    company                    VARCHAR(200) PRIMARY KEY,            -- 'Relativity'
    rank_overall               INTEGER,                             -- 1-20 indicative
    company_type               VARCHAR(100),                        -- 'Private software/platform vendor'
    headquarters_country       VARCHAR(100),
    founded_year               INTEGER,
    ownership_model            VARCHAR(100),                        -- 'Private - PE-backed'
    stock_ticker               VARCHAR(100),                        -- 'N/A (Private - PE)' when private
    employee_count             INTEGER,
    primary_customer_segments  TEXT,
    competitive_tier           VARCHAR(100),                        -- 'Tier 1 — platform scale'
    competitor_archetype       VARCHAR(100),                        -- 'Pure-play software'
    threat_level               VARCHAR(10) CHECK (threat_level IN ('High', 'Medium', 'Low'))
);

-- Dictionary Table 2: PRODUCT & ARCHITECTURE  (1:1 with competitor)
CREATE TABLE competitor_product_architecture (
    company                       VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    core_product_platform          TEXT,                            -- 'RelativityOne; Relativity aiR'
    proprietary_product            VARCHAR(10),                     -- 'Yes'
    deployment_model               VARCHAR(100),                    -- 'Multi-tenant SaaS'
    primary_cloud_hosting_provider VARCHAR(100),                    -- 'Microsoft Azure'
    public_api_available           VARCHAR(10),                     -- 'Yes'
    integration_capability_tier    VARCHAR(100),                    -- 'High (100+)'
    data_center_count              VARCHAR(20),                     -- source is loose text: '15+ Azure Regions'
    data_residency_regions         TEXT                             -- semicolon-separated list
);

-- Dictionary Table 3: EDISCOVERY & EDRM  (1:1)
CREATE TABLE competitor_edrm (
    company                      VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    primary_services_capabilities TEXT,
    edrm_stages_covered          INTEGER,                           -- 1-9
    legal_hold_capability        VARCHAR(100),                      -- 'Native'
    native_collection_capability VARCHAR(100),                      -- 'Via integration / partner'
    modern_data_source_support   VARCHAR(10),                       -- 'Yes'
    tar_cal_support              VARCHAR(10),                       -- 'Yes'
    multilingual_review_support  VARCHAR(10),                       -- 'Yes'
    audio_video_image_analysis   VARCHAR(10)                        -- 'Yes'
);

-- Dictionary Table 4: AI STRATEGY & GOVERNANCE  (1:1)
CREATE TABLE competitor_ai_strategy (
    company                    VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    ai_capabilities            TEXT,                                -- 'Relativity aiR; AI-assisted review'
    generative_ai_status       VARCHAR(100),                        -- 'GA (Relativity aiR)'
    ai_model_approach          TEXT,
    ai_customer_data_handling  VARCHAR(255),                        -- 'No training on customer data (stated)'
    ai_defensibility_features  VARCHAR(10),                         -- 'Yes (Audit trails & prompt logging)'
    ai_pricing_approach         VARCHAR(100)                         -- 'Usage-based'
);

-- Dictionary Table 5: SERVICES & FOOTPRINT  (1:1)
CREATE TABLE competitor_services_footprint (
    company                      VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    global_delivery_scale       TEXT,
    international_footprint     TEXT,                               -- 'Platform reported across 31 countries'
    country_count               INTEGER,                            -- 31
    managed_review_services     VARCHAR(100),                       -- 'Via partners'
    support_model               VARCHAR(100),                       -- '24x7 follow-the-sun'
    training_certification_program VARCHAR(10)                      -- 'Yes'
);

-- Dictionary Table 6: SECURITY & COMPLIANCE  (1:1)
CREATE TABLE competitor_security_compliance (
    company                           VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    security_certifications           TEXT,                         -- 'SOC 2 Type II; ISO 27001; ISO 27018'
    fedramp_status                    VARCHAR(100),                 -- 'Authorized - Moderate'
    customer_managed_encryption_keys  VARCHAR(10)                   -- 'Yes'
);

-- Dictionary Table 7: COMMERCIALS & PRICING  (1:1)
CREATE TABLE competitor_commercials_pricing (
    company                    VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    pricing_model              VARCHAR(100),                        -- 'Per GB hosted'
    pricing_transparency       VARCHAR(100),                        -- 'Quote only'
    trial_demo_availability    VARCHAR(100),                        -- 'Demo only'
    g2_capterra_rating         VARCHAR(50)                          -- '4.6 / 5 (380 reviews)'
);

-- Dictionary Table 8: BRAND & POSITIONING  (1:1)
CREATE TABLE competitor_brand_positioning (
    company                       VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    main_contribution_differentiation TEXT,
    strengths                     TEXT,
    considerations_limitations    TEXT,
    law_firm_penetration_claim    TEXT,                             -- '198 of Am Law 200 use Relativity'
    analyst_recognition           TEXT,                             -- 'Gartner Leader & IDC MarketScape Leader'
    recent_strategic_events       TEXT                              -- 24-month window
);

-- Dictionary Table 9: FINANCIALS & SCALE  (1:1)
-- NOTE: revenue_market_contribution_pct and business_scale_contribution_pct
-- also appear in dictionary Table 1; stored once here (single source of truth).
CREATE TABLE competitor_financials (
    company                         VARCHAR(200) PRIMARY KEY
        REFERENCES competitor(company) ON UPDATE CASCADE ON DELETE CASCADE,
    revenue_est_usd_m               NUMERIC(10,1),                   -- 420 (Est.)
    revenue_disclosure_type         VARCHAR(100),                    -- 'Estimated (Benchmark / PE context)'
    revenue_period                  VARCHAR(50),                     -- 'FY2025 (Est.)'
    revenue_scope                   TEXT,
    data_scale_metric               TEXT,                            -- '93 PB legal data reported'
    annualised_ingestion_tb          NUMERIC(12,1),                   -- 35000 (Est.)
    hosted_data_tb                  NUMERIC(12,1),                   -- 93000
    revenue_market_contribution_pct NUMERIC(5,2),                   -- 4.76 (% of $8.82B pool)
    business_scale_contribution_pct NUMERIC(5,2)                    -- 10.90 (% of 853.5k TB)
);

-- ===========================================================================
-- DOMAIN 3 — APPLICATION & TOOL CATALOG
-- (source: "Consilio_Applications_Tools_EDRM_Inventory_Final (1).xlsx" —
--  'Applications & Tools' 92 rows, 'EDRM Delivery Phases' 10 rows,
--  'Validation & Data Gaps' 63 rows;
--  "Consilio_Tools_Technology_Categories_Dashboard.xlsx" — 'Tools & Technologies')
-- ===========================================================================

-- Sheet: EDRM Delivery Phases (10 rows)  -- 01 evidence -> 10 delivery
CREATE TABLE edm_phase (
    phase_no                INTEGER PRIMARY KEY,                   -- 01-10
    delivery_phase          VARCHAR(100) NOT NULL,
    purpose_activities      TEXT,
    applications_tools_mentioned TEXT,
    mapping_notes           TEXT,
    edm_group               VARCHAR(100)                            -- 'Collection', 'Review', 'Production', ...
);

-- Sheet: Applications & Tools (92 rows)
-- Flag columns are nullable VARCHAR(10): source uses 'Yes'/'No'/'No*'/'TBD'/blank.
CREATE TABLE application_tool (
    application_tool_id          SERIAL PRIMARY KEY,
    name                        VARCHAR(200) NOT NULL UNIQUE,       -- 'Aurora', 'Relativity / Relativity Server'
    record_type                 VARCHAR(50),                        -- 'Application / Product', 'Tool / ...', 'Alias / ...'
    purpose_description         TEXT,
    category_role               VARCHAR(200),                       -- 'Review / hosting platform'
    delivery_phase              VARCHAR(255),                       -- free text; does not FK to edm_phase
    edm_stage                   VARCHAR(255),                       -- free text; null when N/A
    deployment_sourcing         VARCHAR(255),                       -- 'External / Service Delivery', 'Internal'
    client_user                 VARCHAR(10),                        -- 'Yes' / 'No' / 'No*' / 'TBD'
    internal_user               VARCHAR(10),
    in_house_product            VARCHAR(10),                        -- 'Yes' / 'No' / 'TBD'
    department_primary_team     VARCHAR(255),                       -- 'PE', 'EA', 'InfoSec', 'DataOps'
    vendor_provider             VARCHAR(200),                       -- 'Consilio', 'Relativity', 'Microsoft'
    status                      VARCHAR(100),                       -- 'Active / current ecosystem', 'Being deprecated; migration to AVR'
    classification_type         VARCHAR(255),                       -- 'External / Service Delivery', 'Internal'
    business_process            VARCHAR(255),                       -- 'Review / Case Management'
    architecture_workflow_summary TEXT,
    source_notes_validation     TEXT,
    source                      VARCHAR(100)                        -- 'Pasted inventory + HTML guide'
);
CREATE INDEX ix_application_tool_record_type   ON application_tool(record_type);
CREATE INDEX ix_application_tool_department    ON application_tool(department_primary_team);
CREATE INDEX ix_application_tool_business_proc ON application_tool(business_process);

-- Sheet: Tools & Technologies (27 rows)
-- Technology stack detail, matched to application_tool by tool name (1:0..1).
CREATE TABLE tool_technology_detail (
    tool_name                VARCHAR(200) PRIMARY KEY,              -- matches application_tool.name
    vendor                   VARCHAR(200),
    version                  VARCHAR(100),
    languages                TEXT,
    frameworks               TEXT,
    libraries                TEXT,
    databases                TEXT,
    design_tools             TEXT,
    scm                      TEXT,
    ai_tools                 TEXT,
    ai_algorithms_models     TEXT,
    deployment_mechanisms    TEXT,
    cloud_infrastructure     TEXT,
    apis_integrations         TEXT,
    document_data_types      TEXT,
    frontend_technologies    TEXT,
    data_verification_status VARCHAR(100)                           -- 'Verified Core Ecosystem Tool' / 'Inferred / ...'
);

-- Sheet: Validation & Data Gaps (63 rows)  -- 1:N with application_tool
CREATE TABLE validation_gap (
    validation_gap_id     SERIAL PRIMARY KEY,
    application_tool_id   INTEGER NOT NULL REFERENCES application_tool(application_tool_id)
                              ON UPDATE CASCADE ON DELETE CASCADE,
    issue_gap             TEXT,                                     -- naming/ownership/status question
    suggested_owner_team  VARCHAR(255),                              -- 'PE', 'EA', 'InfoSec'
    priority              VARCHAR(10) CHECK (priority IN ('High', 'Medium', 'Low')),
    status                VARCHAR(20) NOT NULL DEFAULT 'Open'
                          CHECK (status IN ('Open', 'Confirmed', 'Resolved')),
    resolution_notes      TEXT
);
CREATE INDEX ix_validation_gap_tool ON validation_gap(application_tool_id);

-- ===========================================================================
-- DOMAIN 4 — COMPANY PROFILE (Consilio itself)
-- (source: "Consilio_Populated_Data_Final.xlsx" — 11 entity sheets)
-- All IDs are UUIDs in the source; UUID primary/foreign keys throughout.
-- ===========================================================================

-- Sheet: LOCATION (6 rows)
CREATE TABLE location (
    location_id            UUID PRIMARY KEY,
    location_name          VARCHAR(255) NOT NULL,
    location_type          VARCHAR(50),                            -- 'Headquarters', 'Office', 'Data centre'
    address_line           VARCHAR(255),
    city                   VARCHAR(100),
    state_province         VARCHAR(100),
    postal_code            VARCHAR(20),
    country                VARCHAR(100),
    country_code           VARCHAR(3),                             -- 'US', 'GB', 'AU'
    region                 VARCHAR(100),
    latitude               NUMERIC(9,6),
    longitude              NUMERIC(9,6),
    is_headquarters        BOOLEAN NOT NULL DEFAULT FALSE,
    opened_date            DATE,
    closed_date            DATE,
    headcount              INTEGER,
    headcount_as_of_date   DATE,
    public_listing_status  VARCHAR(50)                             -- 'Public', 'Unknown'
);

-- Sheet: COMPANY_PROFILE (1 row)
CREATE TABLE company_profile (
    company_id               UUID PRIMARY KEY,
    legal_name               VARCHAR(200) NOT NULL,
    brand_name               VARCHAR(100),
    former_name              VARCHAR(200),
    short_description        VARCHAR(500),
    overview_text            TEXT,
    founded_year             INTEGER,
    brand_name_change_year   INTEGER,
    website_url              VARCHAR(500),
    company_type             VARCHAR(100),                           -- 'Private company'
    industry                 VARCHAR(150),
    headquarters_location_id UUID REFERENCES location(location_id),
    registered_address       TEXT,
    ownership_summary        TEXT,
    fiscal_year_end          VARCHAR(20),
    logo_url                 VARCHAR(500),
    profile_status           VARCHAR(20),                           -- 'Draft'
    last_reviewed_date       DATE
);

-- Sheet: COMPANY_METRIC (14 rows)
CREATE TABLE company_metric (
    metric_id          UUID PRIMARY KEY,
    metric_name        VARCHAR(255) NOT NULL,                       -- 'Employee count', 'Matters hosted'
    metric_value       NUMERIC(20,2),
    value_qualifier    VARCHAR(50),                                -- 'At least', 'More than', 'Exact'
    value_lower_bound  NUMERIC(20,2),
    value_upper_bound  NUMERIC(20,2),
    unit               VARCHAR(100),                               -- 'employees', 'terabytes per month'
    period_type        VARCHAR(50),                                -- 'Point in time', 'Monthly', 'Active workload'
    period_start_date  DATE,
    period_end_date    DATE,
    as_of_date         DATE,
    geographic_scope   VARCHAR(100),                               -- 'Global'
    business_scope     VARCHAR(255),
    is_estimate        BOOLEAN NOT NULL DEFAULT FALSE,
    methodology_note   TEXT
);

-- Sheet: LEADER (17 rows)
CREATE TABLE leader (
    leader_id          UUID PRIMARY KEY,
    full_name          VARCHAR(200) NOT NULL,
    job_title          VARCHAR(200),
    leadership_level   VARCHAR(100),                               -- 'Executive'
    leadership_function VARCHAR(200),                               -- 'Technology and innovation'
    department         VARCHAR(200),
    region_scope       VARCHAR(100),
    bio_summary        TEXT,
    profile_url        VARCHAR(500),
    photo_url          VARCHAR(500),
    appointment_date   DATE,
    announcement_date  DATE,
    end_date           DATE,
    is_current         BOOLEAN NOT NULL DEFAULT TRUE,
    display_order      INTEGER
);
CREATE INDEX ix_leader_current ON leader(is_current);

-- Sheet: COMPANY_MILESTONE (20 rows)  -- acquisitions, founding, expansions, renames
CREATE TABLE company_milestone (
    milestone_id         UUID PRIMARY KEY,
    event_title          VARCHAR(255) NOT NULL,
    event_type           VARCHAR(100),                             -- 'Acquisition', 'Founding', 'Name change'
    transaction_type     VARCHAR(100),                             -- 'Unknown', 'Not applicable'
    counterparty_name    VARCHAR(255),                             -- acquired company (when applicable)
    announcement_date    DATE,
    agreement_date       DATE,
    closing_date         DATE,
    effective_date       DATE,
    event_status         VARCHAR(50),                              -- 'Completed', 'Unverified'
    acquired_scope       VARCHAR(255),
    business_description TEXT,
    strategic_rationale  TEXT,
    geographic_scope     VARCHAR(255),
    deal_value           NUMERIC(20,2),
    deal_currency        VARCHAR(3),
    count_as_acquisition BOOLEAN,
    counting_group_id    VARCHAR(255)
);

-- Sheet: SERVICE_SOLUTION (24 rows)
CREATE TABLE service_solution (
    service_solution_id         UUID PRIMARY KEY,
    name                        VARCHAR(255) NOT NULL,              -- 'eDiscovery Services'
    offering_type               VARCHAR(50),                        -- 'Service', 'Solution'
    category                    VARCHAR(100),                       -- 'eDiscovery', 'Investigations'
    description                 TEXT,
    use_cases                   TEXT,
    target_client_types         TEXT,                               -- 'Law firms; corporate legal departments'
    industries_served           TEXT,
    geographic_availability     TEXT,
    delivery_model              VARCHAR(100),
    related_service_solution_id UUID REFERENCES service_solution(service_solution_id),
    is_active                   BOOLEAN NOT NULL DEFAULT TRUE,
    official_url                VARCHAR(500)
);

-- Sheet: WORKFORCE_METRIC (5 rows)
CREATE TABLE workforce_metric (
    workforce_record_id UUID PRIMARY KEY,
    population_type     VARCHAR(100),                               -- 'All employees', 'Review professionals'
    count_value         NUMERIC(12,2),
    count_qualifier     VARCHAR(50),                                -- 'At least', 'Exact'
    employment_relationship VARCHAR(100),                           -- 'Employee', 'Flexible talent network'
    business_function    VARCHAR(200),                              -- 'Document review', 'Software and database engineering'
    location_id         UUID REFERENCES location(location_id),
    region              VARCHAR(100),
    country             VARCHAR(100),
    period_start_date   DATE,
    period_end_date     DATE,
    as_of_date          DATE,
    methodology_note    TEXT
);
CREATE INDEX ix_workforce_metric_location ON workforce_metric(location_id);

-- Sheet: LANGUAGE_CAPABILITY (0 rows in source — table kept for completeness)
CREATE TABLE language_capability (
    language_capability_id UUID PRIMARY KEY,
    language_name          VARCHAR(100) NOT NULL,
    language_code          VARCHAR(10),
    service_solution_id    UUID REFERENCES service_solution(service_solution_id),
    capability_type        VARCHAR(100),
    geographic_scope       VARCHAR(100),
    professional_count     INTEGER,
    is_active              BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX ix_language_capability_solution ON language_capability(service_solution_id);

-- Sheet: MARKET_SEGMENT (10 rows)  -- 1:N with service_solution
CREATE TABLE market_segment (
    market_segment_id   UUID PRIMARY KEY,
    segment_type        VARCHAR(50),                                -- 'Industry', 'Client type', 'Market-position claim'
    segment_name        VARCHAR(255) NOT NULL,
    description         TEXT,
    service_solution_id UUID REFERENCES service_solution(service_solution_id)
);
CREATE INDEX ix_market_segment_solution ON market_segment(service_solution_id);
CREATE INDEX ix_market_segment_type     ON market_segment(segment_type);

-- Sheet: AWARD (3 rows)
CREATE TABLE award (
    award_id         UUID PRIMARY KEY,
    award_name       VARCHAR(255),
    awarding_body    VARCHAR(255),                                  -- 'Comparably', 'Business Insurance'
    award_year       INTEGER,
    award_category   VARCHAR(100),                                  -- 'Employee experience', 'Career growth'
    description      TEXT,
    award_status     VARCHAR(50)                                    -- 'Winner', 'Finalist'
);

-- Sheet: COMPANY_FINANCIAL (3 rows)
CREATE TABLE company_financial (
    financial_record_id UUID PRIMARY KEY,
    financial_metric    VARCHAR(100) NOT NULL,                      -- 'Revenue'
    fiscal_year         INTEGER,                                    -- 2023 / 2024 / 2025
    amount              NUMERIC(20,2),                              -- source values are whole-dollar
    currency_code       VARCHAR(3),                                 -- 'USD'
    value_basis         VARCHAR(100),                               -- 'Approximate estimate'
    scope_note          TEXT,
    classification      VARCHAR(100)                                -- 'Estimated'
);
CREATE INDEX ix_company_financial_metric_year ON company_financial(financial_metric, fiscal_year);

-- ===========================================================================
-- DOMAIN 5 — WORKFLOW-DERIVED ENTITIES
-- (source: docs/Workflow/WORKFLOW.md §3.9 + §4.13 — synthetic drafts;
--  no backing rows in the workbooks yet. IDs are application-generated.)
-- ===========================================================================

-- §3.9 Data Dictionary Contribution — pre-engagement opportunity pipeline
-- (CRO -> Conflict -> Legal Team -> Opportunity -> Win -> data handover)
CREATE TABLE opportunity (
    opportunity_id      VARCHAR(50) PRIMARY KEY,                    -- application-generated
    client_id           VARCHAR(10) NOT NULL REFERENCES client(client_id),
    matter_type         VARCHAR(20) NOT NULL
        CHECK (matter_type IN ('Engagement', 'Data')),               -- routes scoping path (§3 Step 1)
    conflict_status     VARCHAR(20)
        CHECK (conflict_status IN ('Clear', 'Flagged', 'Escalated')), -- §3.9 gate
    conflict_details    TEXT,
    lead_attorney       VARCHAR(255),   -- user reference stored as text: no user table in scope
    data_services_lead  VARCHAR(255),   -- user reference stored as text
    estimated_hours     NUMERIC(10,2),
    rate_card_version   VARCHAR(50),
    scope_summary       TEXT,
    pricing_model       VARCHAR(20)
        CHECK (pricing_model IN ('Fixed', 'T&M', 'Capped')),
    total_contract_value NUMERIC(18,2),
    win_date            DATE,           -- §3.5 'Closed Won' trigger
    data_ready_date     DATE,           -- client commitment (§3.9)
    kickoff_checklist   JSONB,          -- auto-generated at win (§3.5)
    opportunity_stage   VARCHAR(50),    -- 'Proposal Submitted' -> 'Negotiation' -> 'Verbal Win' -> 'Closed Won'
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_opportunity_client    ON opportunity(client_id);
CREATE INDEX ix_opportunity_win_date  ON opportunity(win_date);

-- §4.13 Data Dictionary Contribution — post-engagement service request
-- (PM path: Premier Accept/Deny | Concierge custom; IT path: Premium | Base)
CREATE TABLE service_request (
    request_id        VARCHAR(50) PRIMARY KEY,                      -- application-generated
    client_id         VARCHAR(10) NOT NULL REFERENCES client(client_id),
    request_date      TIMESTAMPTZ NOT NULL,                         -- trigger; captured by client (§4.1)
    client_tier       VARCHAR(20)
        CHECK (client_tier IN ('Cobalt', 'Premier')),               -- §4.2, routes path
    request_path      VARCHAR(10)
        CHECK (request_path IN ('PM', 'IT')),                       -- §4.3 flow
    request_format    VARCHAR(20)
        CHECK (request_format IN ('Specified', 'Informal')),         -- PM-path gate (§4.4)
    pm_sub_path       VARCHAR(50)
        CHECK (pm_sub_path IN ('Premier Support', 'Concierge')),
    it_sub_path       VARCHAR(50)
        CHECK (it_sub_path IN ('Premium', 'Base')),
    premier_decision  VARCHAR(10)
        CHECK (premier_decision IN ('Accept', 'Deny')),             -- §4.4 A1
    deny_reason       TEXT,
    concierge_scope   TEXT,                                         -- §4.4 A2
    quote_amount      NUMERIC(18,2),
    priority          VARCHAR(10)
        CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')), -- §4.13 IT triage
    sla_target        TIMESTAMPTZ,                                  -- calculated
    resolution_date   TIMESTAMPTZ,                                  -- actual
    sla_met           BOOLEAN,                                      -- KPI
    request_state     VARCHAR(30) NOT NULL DEFAULT 'Submitted'
        CHECK (request_state IN (
            'Submitted', 'Routed', 'Premier Review', 'Concierge Scoping',
            'IT Triage', 'In Progress', 'Blocked', 'Delivered', 'Denied', 'Closed')),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ix_service_request_client   ON service_request(client_id);
CREATE INDEX ix_service_request_state    ON service_request(request_state);
CREATE INDEX ix_service_request_tier     ON service_request(client_tier, request_path);

-- ===========================================================================
-- TABLE / COLUMN COMMENTS (key provenance)
-- ============================================================================
COMMENT ON TABLE client IS 'Sheet "Client" in Cobalt client.xlsx (49 rows). CRM primary key = client_id (§3.9).';
COMMENT ON COLUMN client.client_status IS 'Lifecycle status; history tracked in client_lifecycle.';
COMMENT ON TABLE client_lifecycle IS 'Sheet "Client_Lifecycle" — status history, one current row per client (is_current).';
COMMENT ON TABLE client_revenue IS 'Sheet "Client_Revenue" (204 rows). revenue_pct_of_total is a fraction (0-1); yoy_growth_pct NULL = "N/A".';
COMMENT ON TABLE service IS 'Sheet "Service" (8 rows) — Consilio service catalog for the client domain.';
COMMENT ON TABLE client_service IS 'Sheet "Client_Service" (164 rows) — M:N client<->service with period.';
COMMENT ON TABLE competitor IS 'Master table of eDiscovery competitor matrix (20 rows). Name is the master key per Data Dictionary Table 1.';
COMMENT ON TABLE competitor_financials IS 'Financials & scale (dictionary Table 9). Contribution % stored here once (also listed in Table 1).';
COMMENT ON TABLE edm_phase IS 'Sheet "EDRM Delivery Phases" (10 rows) — reference list of the 10-stage EDRM delivery pipeline.';
COMMENT ON TABLE application_tool IS 'Sheet "Applications & Tools" (92 rows). Flag columns keep source tri-state: Yes/No/No*/TBD/blank.';
COMMENT ON TABLE tool_technology_detail IS 'Sheet "Tools & Technologies" (27 rows) — stack detail matched to application_tool by name.';
COMMENT ON TABLE validation_gap IS 'Sheet "Validation & Data Gaps" (63 rows) — open naming/ownership/status questions.';
COMMENT ON TABLE company_profile IS 'Sheet "COMPANY_PROFILE" — Consilio corporate profile (UUID keys).';
COMMENT ON TABLE company_metric IS 'Sheet "COMPANY_METRIC" (14 rows) — KPI values with qualifiers and methodology notes.';
COMMENT ON TABLE opportunity IS 'Derived from WORKFLOW.md §3.9 (synthetic draft). Backed by no workbook rows yet.';
COMMENT ON TABLE service_request IS 'Derived from WORKFLOW.md §4.13 (synthetic draft). Backed by no workbook rows yet.';

COMMIT;
