# Workflow Documentation: 2026-10-08

---

## 1. Product Engineering Workflow

**Ownership:** Product Engineering team (separate from ERDM lifecycle)  
**Status:** High-level phases mapped; per-tool workflows (8+ in Review) require Product Owner/TPO/PM engagement

**Team Composition:**
- Non-client-facing development team
- **Legacy maintenance**: Site Manager (bug fixes, issues)
- **ABI Development**: New features from product team requirements
- **QA Team**: Tests against requirements
- **DB Team**: Separate team for database changes (not owned by Product Engineering)

### 1.1 Ingestion Phase

```
Source Documents
       │
       ▼
┌──────────────────┐
│  PRE-INTAKE      │  ──► Malware verification on collected documents
│  (DMC MACHINES)  │       Isolated antiviral/malware scanning environment
└──────────────────┘       All files pass through before Unix processing
       │
       ▼
┌──────────────────┐
│  INTAKE JOB      │  ──► Moves clean files to Unix processing engine server
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  POST-INTAKE     │  ──► Document processing & reduction (Doc & No-Express)
│                  │       Reduces number of documents requiring review
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  SNAPLOGIC MAP   │  ──► Maps processed data for downstream consumption
└──────────────────┘
       │
       ▼
   Review Phase
```

**Two Ingestion Modes:**
1. **Manual Ingestion** — Team manually triggers document load
2. **Autoloading** — Doc team signals completion; system auto-ingests (preferred)

### 1.2 Review Phase

```
                     ┌─────────────────────┐
                     │   CORE ECA          │  ◄── Entry point after ingestion
                     │   (Fast-track)      │       For time-sensitive cases (5-day SLA)
                     └──────────┬──────────┘
                                │
               ┌────────────────┼────────────────┐
               ▼                ▼                ▼
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │     AVR     │  │  CORE ECA   │  │ RELATIVITY  │
        │ Review +    │  │ Review only │  │  Review     │
        │ Hosting     │  │ (faster,    │  │             │
        │             │  │  fewer docs)│  │             │
        └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
               │                │                │
               │                │                │
               └────────────────┼────────────────┘
                                │
                                ▼
                         Production Phase
```

**Tool Differences:**
| Tool | Review | Hosting | Speed | Output Volume | Notes |
|------|--------|---------|-------|---------------|-------|
| **AVR** | ✓ | ✓ (integrated) | Standard | Higher | All-in-one platform |
| **Core ECA** | ✓ | ✗ (needs AVR/Relativity) | Faster | Lower | Consolidates critical docs for urgent cases |
| **Relativity** | ✓ | ✓ | Standard | Standard | Third-party review platform |

**Per-Tool Review Manipulations (internal to each review platform):**
- Searching
- Tagging / Coding
- Keyword Searching
- Commenting
- Review / Re-master
- Bouldering (likely categorization/coding — **term to validate**)

**Flow Options (post-Data Ops):**

1. Data Ops → Core ECA → Review (AVR/Core ECA/Relativity)
2. Data Ops → Review (AVR/Core ECA/Relativity) directly
3. Data Ops → Core ECA → Relativity

**Relativity Cost Strategy:**
- Consilio processes 10,000 docs → reduces to ~1,000 for Relativity review
- Pays Relativity for 1,000; bills client for 10,000
- Relativity adjusting pricing to counter this
- **Strategic Pivot:** "One-stop shop" — minimize external dependencies, keep processing in-house

### 1.3 Production Phase

```
Data Core (Repository)
       │
       ▼
┌──────────────────┐
│  DATA PROCESSING │  ──► Converts to production-phase files
│     TEAM         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   BATES          │  ──► Unique UUID per document (Bates Number)
│   NUMBERING      │       Universal legal production identifier
│                  │       Document-level OR Page-level (each page unique)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PRODUCTION      │  ──► .dat format (universal doc processing format)
│   FILES          │
└──────────────────┘
```

**Key Formats:**

- `.dat` — Universal file format for document processing (ingestion & storage)
- **Bates Number** — Unique identifier per document (like primary key)
  - **Two granularities:** Document-level OR Page-level (each page gets unique Bates)
  - Used in URLs to reference specific documents/pages
  - Generated during Production phase

**Production Conversion Flow (External Tools):**
```
Native File → Prismdock → PDF → ImageGear → TIFF (per page)
```
- **Prismdock**: Native file → PDF conversion (licensed, external)
- **ImageGear**: PDF → TIFF conversion, page-level (licensed, external)
- TIFF generation always creates intermediate "C PDF" (not exposed to user)

### 1.4 Analytics Layer

| Tool                    | Type                                    | Purpose                                             | Status            |
| ----------------------- | --------------------------------------- | --------------------------------------------------- | ----------------- |
| **ICE**                 | Analytics Engine                        | Internal analytics processing                       | Active            |
| **Reveal / BrainSpace** | Third-party review + analytics platform | Advanced analytics, AI-driven review                | Upcoming adoption |
| **Present Doc**         | PDF/TIFF conversion                     | Production-ready output (images → TIFF, docs → PDF) | Active            |
| **Prismdock**           | File Conversion                         | Native file → PDF (production pipeline)             | Active (licensed) |
| **ImageGear**           | File Conversion                         | PDF → TIFF, page-level (production pipeline)        | Active (licensed) |

---

## 2. Enterprise Architecture Workflow (Data Warehouse Team)

**Ownership:** Data Warehouse team  
**Role:** Internal service provider — does **not** generate source data; creates views on demand

### 2.1 Source Systems (9 Enterprise Sources)

```
Relativity ◄──┐
ServiceNow    │
UKG           │
Active Dir.   ├──► Data Lake (raw source data)
Bullhorn      │
Case Mgmt Sys │
ETA/MC Resp.  │
SnapLogic     │
SSIS          │
SQL Jobs      ◄──┘ (also integration mechanism)
```

### 2.2 Data Flow

```
Internal Client Teams
       │
       ▼ (Requirements)
┌──────────────────┐
│  DATA WAREHOUSE  │
│     TEAM         │  ──► Brings data from different applications
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  TRANSFORMATION  │  ──► On-demand, per requirement
│   (Views)        │
└────────┬─────────┘
         │
         ▼
   Reports / Views
   (handed back to
    requesting team)
```

### 2.3 Identified Patterns

| Category        | Patterns                                         | Source                             |
| --------------- | ------------------------------------------------ | ---------------------------------- |
| **Ingestion**   | Manual, Auto-loading                             | Data Warehouse team                |
| **Integration** | SnapLogic, SSIS, SQL Jobs                        | Data Warehouse team                |
| **Load**        | Incremental, Decremental                         | Data Warehouse team                |
| **Testing**     | Manual QA, Unit Testing, Playwright Automated UI | QA/Engineering                     |
| **Backup**      | DCCIS / DCIS                                     | Industry-standard (Microsoft, AWS) |

### 2.4 Example: UK Active Employees View

```
UK Database (Employees)
       │
       ▼
┌──────────────────┐
│  CREATE VIEW     │  ──► Fields: Employee ID, Department,
│  (Active Emps)   │       Supervisor/Manager, Email
└──────────────────┘
```

---

## 3. Client Workflow Before Data Handover (Pre-Engagement)

> **Source:** merged from `CLIENT_WORKFLOW_BEFORE_DATA_HANDOVER.md` (kept standalone) — v1.0, 2026-10-09, Draft — pending validation with Sales/Pre-Sales, Legal, and Client Services teams

### 3.1 Overview

This section captures the **pre-engagement workflow** — the process that occurs **before client data enters Consilio's systems**. It spans from initial client conversation through conflict clearance, legal team formation, opportunity creation, and win confirmation.

**Trigger:** New client inquiry or existing client new matter  
**Exit:** Client marked "Win" → Data handover to ingestion pipeline (Product Engineering workflow, §1, begins)

### 3.2 Core Components

| Component | Description |
|-----------|-------------|
| **Person who performs** | Role/individual responsible for the step |
| **Condition / Filters** | Gates, checks, or criteria that must be met |
| **Data** | Information captured or produced at this step |
| **When and How** | Timing, method, tools, systems used |

### 3.3 Workflow Process (Sequential Flow)

```
Step 1: CRO Engagement          Step 2: Conflict Check          Step 3: Legal Team Formation
       │                              │                              │
       ▼                              ▼                              ▼
┌──────────────┐            ┌─────────────────┐            ┌──────────────────┐
│ CRO enters   │            │ Conflict Checker │            │ Lead assigns     │
│ engagement   │            │ (Legal Team)     │            │ lawyers +        │
│ or data      │            │                  │            │ Data Services    │
└──────────────┘            └─────────────────┘            └──────────────────┘
       │                              │                              │
       ▼                              ▼                              ▼
Step 4: Lead → Opportunity        Step 5: Mark Win
       │                              │
       ▼                              ▼
┌──────────────┐            ┌─────────────────┐
│ Lawyers +    │            │ CRO marks       │
│ Data Services│            │ "Win" in CRM    │
│ scope work   │            │                 │
└──────────────┘            └─────────────────┘
       │                              │
       ▼                              ▼
                          ┌─────────────────────┐
                          │ DATA HANDOVER       │
                          │ → Ingestion Pipeline│
                          └─────────────────────┘
```

#### Step 1: CRO Engagement (Client-Facing Intake)

| Aspect | Detail |
|--------|--------|
| **Person who performs** | CRO (Client Relationship Owner) |
| **Condition / Filters** | New inquiry OR existing client new matter; client qualifies for Consilio services |
| **Data Captured** | Client name, matter type (Engagement vs. Data), scope overview, urgency, budget indicators |
| **When** | First client conversation / RFP receipt |
| **How** | CRM entry (ServiceNow/Salesforce), initial scoping call, intake form |
| **Tools** | CRM (ServiceNow/Salesforce), email, calendar, scoping templates |
| **Output** | Qualified lead record in CRM; "Engagement" or "Data" classification |

**Decision Point:** Engagement (service-heavy) vs. Data (processing-heavy) → routes to different scoping paths

#### Step 2: Conflict of Interest Check

| Aspect | Detail |
|--------|--------|
| **Person who performs** | Legal Team (Conflict Clearance function) |
| **Condition / Filters** | Must clear before any work commitment; checks against existing client/matter database |
| **Data Captured** | Client entities, adverse parties, matter description, jurisdiction |
| **When** | Immediately after CRO engagement entry (target: <24 hrs) |
| **How** | Conflict Checker tool → Legal Team review → Clear/Flag/Escalate |
| **Tools** | Conflict Checker (internal), client/matter database, Legal Team review queue |
| **Output** | Conflict Clearance Certificate OR Conflict Flag (blocks progression) |

**Escalation Path:** Flag → Legal Lead review → Partner approval OR decline

#### Step 3: Legal Team Formation

| Aspect | Detail |
|--------|--------|
| **Person who performs** | Lead (Engagement Lead / Matter Lead) |
| **Condition / Filters** | Conflict cleared; matter type determines team composition |
| **Data Captured** | Assigned lawyers (names, roles), Data Services liaison, estimated hours, rate card |
| **When** | Post-clearance, pre-opportunity creation |
| **How** | Lead assigns via resource management tool; confirms availability |
| **Tools** | Resource management (UKG/Bullhorn?), internal staffing board, rate card database |
| **Output** | Staffed team roster; preliminary budget estimate |

**Team Composition Variables:**
- **Engagement matters:** Senior lawyer + associates + project manager
- **Data matters:** Data Services lead + processing analysts + QC

#### Step 4: Lead to Opportunity (Scoping & Proposal)

| Aspect | Detail |
|--------|--------|
| **Person who performs** | Lawyers (subject matter) + Data Services (technical scoping) |
| **Condition / Filters** | Team formed; client requirements gathered |
| **Data Captured** | Detailed scope, deliverables, timeline, pricing model (fixed/T&M/capped), assumptions, risks |
| **When** | After team formation; iterative with client |
| **How** | Scoping workshops → proposal draft → internal review → client presentation → negotiation |
| **Tools** | Proposal templates, pricing calculator, CRM (Opportunity record), document collaboration (SharePoint/Teams) |
| **Output** | Signed proposal / SOW; Opportunity stage = "Proposal Submitted" → "Negotiation" → "Verbal Win" |

**Key Handoff:** Lawyers scope legal strategy; Data Services scope processing/hosting/review requirements

#### Step 5: Client Mark as Win

| Aspect | Detail |
|--------|--------|
| **Person who performs** | CRO (updates CRM) |
| **Condition / Filters** | Client verbal/written commitment; SOW agreed; commercial terms settled |
| **Data Captured** | Win date, contract value, start date, kickoff requirements, data readiness date |
| **When** | Client confirms "go" |
| **How** | CRM: Opportunity → "Closed Won"; auto-triggers handoff workflow |
| **Tools** | CRM (ServiceNow/Salesforce), contract management (DocuSign), kickoff checklist |
| **Output** | **Closed Won Opportunity** → Triggers Data Handover to Ingestion Pipeline |

**Automation:** CRM "Closed Won" → Webhook → Ingestion Pipeline notification + Project creation in Case Mgmt System

### 3.4 Roles & Responsibilities (RACI)

| Step | CRO | Legal Team | Lead | Lawyers | Data Services | CRM/System |
|------|-----|------------|------|---------|---------------|------------|
| 1. CRO Engagement | **R/A** | I | C | I | I | R (entry) |
| 2. Conflict Check | I | **R/A** | C | I | I | R (tool) |
| 3. Legal Team Formation | I | C | **R/A** | R | R | — |
| 4. Lead → Opportunity | C | I | **A** | **R** | **R** | R (tracking) |
| 5. Mark Win | **R/A** | I | C | I | I | R (trigger) |

**Legend:** R=Responsible, A=Accountable, C=Consulted, I=Informed

### 3.5 Systems & Tools Touched

| System / Tool | Purpose | Steps Used |
|---------------|---------|------------|
| **CRM (ServiceNow/Salesforce)** | Lead/Opportunity tracking, win trigger | 1, 4, 5 |
| **Conflict Checker** | Conflict clearance | 2 |
| **Resource Management** | Staffing, availability | 3 |
| **Pricing Calculator** | Commercial modeling | 4 |
| **Proposal/Templates** | SOW generation | 4 |
| **Contract Management (DocuSign)** | Execution | 5 |
| **Case Mgmt System** | Project creation (post-win) | 5 (trigger) |
| **Ingestion Pipeline** | Data onboarding (post-win) | 5 (trigger) |

### 3.6 Handoffs

| From Step | To Step | Artifact | Format | SLA |
|-----------|---------|----------|--------|-----|
| 1 (CRO) | 2 (Conflict) | Engagement record | CRM record | <4 hrs |
| 2 (Conflict) | 3 (Team) | Clearance certificate | PDF/Email | <24 hrs |
| 3 (Team) | 4 (Opportunity) | Staffed roster + rates | Resource tool export | <2 days |
| 4 (Opportunity) | 5 (Win) | Signed SOW | DocuSign/PDF | Client-dependent |
| 5 (Win) | **Ingestion** | Project kickoff packet | Auto-generated (CRM webhook) | <1 hr |

### 3.7 Pain Points & Gaps (From Discovery)

| # | Pain Point | Impact | Owner to Resolve |
|---|------------|--------|------------------|
| 1 | Conflict check bottleneck — Legal Team capacity | Delays Step 2 by 2–5 days | Legal Ops |
| 2 | Resource visibility — no real-time view of lawyer/Data Services availability | Over/under commitment in Step 3 | Resource Mgmt / UKG |
| 3 | Scoping disconnect — Lawyers vs Data Services estimate separately | Rework in Step 4 | Lead / PMO |
| 4 | Manual CRM updates — CRO enters data in multiple places | Errors, delayed win trigger | CRM Admin / Automation |
| 5 | No standard "data readiness" checklist for client | Ingestion delays post-win | Data Processing Team |

### 3.8 Open Questions

| # | Question | For Whom | Due |
|---|----------|----------|-----|
| 1 | What is the exact Conflict Checker tool? Internal or licensed? | Legal Team | Interview |
| 2 | Resource management tool — UKG? Bullhorn? Custom? | Lead / HR | Interview |
| 3 | Does "Engagement vs Data" classification affect downstream workflow? | Product Eng / Data Services | Interview |
| 4 | CRM = ServiceNow or Salesforce? (Both mentioned) | CRO / IT | Interview |
| 5 | What triggers Case Mgmt System project creation? Webhook? Manual? | DevOps / Case Team | Interview |
| 6 | Pricing model variations — fixed vs T&M vs capped — who approves? | Finance / Lead | Interview |

### 3.9 Data Dictionary Contribution (For Master Spreadsheet)

| Field | Source Step | Type | Notes |
|-------|-------------|------|-------|
| Client Name | 1 | String | CRM primary key |
| Matter Type | 1 | Enum [Engagement, Data] | Routes workflow |
| Conflict Status | 2 | Enum [Clear, Flagged, Escalated] | Gate |
| Conflict Details | 2 | Text | If flagged |
| Lead Attorney | 3 | Reference (User) | From resource tool |
| Data Services Lead | 3 | Reference (User) | From resource tool |
| Estimated Hours | 3 | Numeric | By role |
| Rate Card Version | 3 | Reference | Effective date |
| Opportunity ID | 4 | String | CRM key |
| Scope Summary | 4 | Text | SOW reference |
| Pricing Model | 4 | Enum [Fixed, T&M, Capped] | |
| Total Contract Value | 4 | Currency | |
| Win Date | 5 | DateTime | Trigger |
| Data Ready Date | 5 | Date | Client commitment |
| Kickoff Checklist | 5 | JSON | Auto-generated |

### 3.10 Next Steps

1. **Validate with CRO team** — confirm Steps 1, 4, 5 accuracy
2. **Validate with Legal Team** — confirm Steps 2, 3 accuracy
3. **Validate with Data Services** — confirm Step 4 scoping accuracy
4. **Map CRM fields** — align Data Dictionary with actual CRM schema
5. **Automate Win → Ingestion trigger** — DevOps to implement webhook

---

## 4. Client Service Request Workflow (Post-Engagement)

> **Source:** merged from `CLIENT_SERVICE_REQUEST_WORKFLOW.md` (kept standalone) — v1.0, 2026-10-09, Draft — based on handwritten flowchart; pending validation with Premier Support, Concierge, and IT teams

### 4.1 Overview

This section captures the **post-engagement service request workflow** — how existing clients (Cobalt/Premier) request services through either a **Project Manager (PM) path** or **IT path**, with different handling based on client tier and request type.

**Trigger:** Client submits service request (with date field)  
**Exit:** Request fulfilled / denied / escalated; service delivered or ticket closed

### 4.2 Client Tier Definitions

| Tier | Classification | Service Model | Path |
|------|----------------|---------------|------|
| **Cobalt** | Custom Service / Premium Client | Bespoke, high-touch | PM Path → Concierge (custom) |
| **Premier** | Base Service | Standardized, tiered | PM Path → Premier Support (Accept/Deny) OR IT Path → Base Service |

### 4.3 Visual Flow (from Handwritten Flowchart)

```
                           ┌─────────────────────────────────────┐
                           │   CLIENT REQUEST SERVICES           │
                           │   (Date field captured)             │
                           └──────────────┬──────────────────────┘
                                          │
                ┌─────────────────────────┼─────────────────────────┐
                ▼                         ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
       │   PM PATH       │       │   IT PATH       │       │  (Other paths?) │
       │ (Specified      │       │ (Parallel       │       │                 │
       │  Format)        │       │  processing)    │       │                 │
       └────────┬────────┘       └────────┬────────┘       └────────┬────────┘
                │                         │                         │
        ┌───────┴───────┐         ┌───────┴───────┐         ┌───────┴───────┐
        ▼               ▼         ▼               ▼         ▼               ▼
┌───────────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ PREMIER       │ │ CONCIERGE │ │ COBALT →  │ │ PREMIER → │
│ SUPPORT       │ │ (Custom   │ │ Premium   │ │ Base      │
│               │ │  Service) │ │ Client    │ │ Service   │
│ Accept / Deny │ │           │ │           │ │           │
└───────┬───────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
        │               │             │             │
        ▼               ▼             ▼             ▼
   ┌─────────┐    ┌────────────┐ ┌──────────┐ ┌──────────┐
   │ Accept  │    │ Custom     │ │ Premium  │ │ Standard │
   │ → Fulfill│   │ Delivery   │ │ Handling │ │ Handling │
   │ Deny    │    │ (Cobalt)   │ │          │ │          │
   │ → Notify│    │            │ │          │ │          │
   └─────────┘    └────────────┘ └──────────┘ └──────────┘
```

### 4.4 Path A: PM Path (Specified Format Required)

**Entry Condition:** Client request submitted via specified format (form/template)

#### A1: Premier Support Branch

| Aspect | Detail |
|--------|--------|
| **Trigger** | Premier client request via PM path |
| **Decision Point** | **Accept / Deny** by Premier Support Lead |
| **Accept Criteria** | Within SLA scope, capacity available, valid premier entitlement |
| **Deny Reasons** | Out of scope, capacity exceeded, entitlement expired, requires custom work |
| **Accept →** | Fulfillment via Premier Support team (Base Service delivery) |
| **Deny →** | Client notified with reason; offered upgrade path or custom service quote |
| **Owner** | Premier Support Lead / Team |
| **Tools** | ServiceNow (ticketing), Premier entitlement database, SLA tracker |

#### A2: Concierge Branch (Cobalt Clients → Custom Service)

| Aspect | Detail |
|--------|--------|
| **Trigger** | Cobalt client request via PM path (flagged as custom/premium) |
| **Handling** | **No Accept/Deny gate** — all Cobalt requests route to Concierge |
| **Process** | Requirements gathering → Custom scoping → Quote → Delivery |
| **Classification** | "Client request custom service for Cobalt Clients" |
| **Owner** | Concierge Team (dedicated) |
| **Tools** | Custom request tracker, quoting tool, resource management, CRM |

### 4.5 Path B: IT Path (Parallel Processing)

**Entry Condition:** Client request routed to IT (infrastructure, access, technical changes)

#### B1: Cobalt Client → Premium Client Handling

| Aspect | Detail |
|--------|--------|
| **Mapping** | Cobalt Client = **Premium Client** in IT path |
| **Priority** | Elevated / Expedited |
| **Handling** | Dedicated IT liaison, faster SLA, premium support queue |
| **Services** | Environment provisioning, custom integrations, dedicated resources |
| **Owner** | IT Premium Support Team |
| **Tools** | IT ServiceNow, K8s/QPods provisioning, monitoring, Private Registry |

#### B2: Premier Support → Base Service

| Aspect | Detail |
|--------|--------|
| **Mapping** | Premier Support request = **Base Service** in IT path |
| **Priority** | Standard |
| **Handling** | Standard IT service catalog, self-service where possible |
| **Services** | Standard environment access, baseline monitoring, catalog requests |
| **Owner** | IT Service Desk / Standard Operations |
| **Tools** | IT ServiceNow, Service Catalog, Standard runbooks |

### 4.6 Roles & Responsibilities (RACI)

| Activity | Client | PM | Premier Support | Concierge | IT Premium | IT Standard | ServiceNow |
|----------|--------|----|-----------------|-----------|------------|-------------|------------|
| Submit Request | **R/A** | I | I | I | I | I | R (capture) |
| Route to Path | I | **R/A** | C | C | C | C | — |
| PM Path: Premier Accept/Deny | I | C | **R/A** | I | I | I | R (track) |
| PM Path: Concierge Custom | I | C | I | **R/A** | I | I | R (track) |
| IT Path: Cobalt/Premium | I | I | I | I | **R/A** | I | R (track) |
| IT Path: Premier/Base | I | I | I | I | I | **R/A** | R (track) |
| Fulfillment | I | A | R | R | R | R | — |
| Close/Notify | I | A | R | R | R | R | R (close) |

### 4.7 Request Lifecycle States

| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| **Submitted** | Request received, date captured | → Routed to PM / IT |
| **Routed** | Assigned to PM Path or IT Path | → Premier Review / Concierge / IT Triage |
| **Premier Review** | Accept/Deny evaluation | → Accepted / Denied |
| **Concierge Scoping** | Custom requirements gathering | → Quoted / Declined |
| **IT Triage** | Priority assignment, queue placement | → In Progress |
| **In Progress** | Active fulfillment | → Delivered / Blocked |
| **Blocked** | Waiting on client/dependency | → In Progress / Cancelled |
| **Delivered** | Service completed, client notified | → Closed |
| **Denied** | Request declined with reason | → Closed / Reopened (appeal) |
| **Closed** | Final state | — |

### 4.8 Systems & Tools

| System / Tool | Purpose | Path(s) |
|---------------|---------|---------|
| **ServiceNow** | Ticketing, tracking, SLA, reporting | Both (central) |
| **Specified Format/Template** | PM Path entry gate | PM only |
| **Premier Entitlement DB** | Validate premier status, SLA scope | PM → Premier |
| **Concierge Tracker** | Custom request lifecycle | PM → Concierge |
| **Quoting Tool** | Custom service pricing | PM → Concierge |
| **IT Service Catalog** | Base Service requests | IT → Premier/Base |
| **K8s/QPods Provisioning** | Environment deployment | IT → Cobalt/Premium |
| **Resource Management** | Staffing for custom delivery | PM → Concierge |
| **CRM (ServiceNow/Salesforce)** | Client tier reference (Cobalt/Premier) | All |

### 4.9 Handoffs

| From | To | Artifact | Format | SLA |
|------|-----|----------|--------|-----|
| Client | PM/IT Router | Request form | Specified format / ServiceNow portal | Immediate |
| PM Router | Premier Support | Routed ticket | ServiceNow ticket | <1 hr |
| PM Router | Concierge | Custom request record | Concierge Tracker | <1 hr |
| PM Router | IT Premium | Provisioning request | ServiceNow + spec doc | <2 hrs |
| PM Router | IT Standard | Catalog request | ServiceNow | <4 hrs |
| Premier Support | Client | Accept/Deny notification | Email + ServiceNow update | <24 hrs (review) |
| Concierge | Client | Custom quote / scope | Document + Quote | <3 business days |
| IT Premium | Client | Environment ready / Access granted | ServiceNow + credentials | Per premium SLA |
| IT Standard | Client | Service fulfilled | ServiceNow closure | Per base SLA |

### 4.10 SLA Matrix (Proposed — Needs Validation)

| Client Tier | Path | Request Type | Response SLA | Resolution SLA |
|-------------|------|--------------|--------------|----------------|
| **Cobalt** | PM → Concierge | Custom | 4 hrs | 3 business days (quote) |
| **Cobalt** | IT → Premium | Technical | 2 hrs | 8 hrs (provisioning) |
| **Premier** | PM → Premier | Base Service | 4 hrs | 24 hrs (Accept/Deny) |
| **Premier** | PM → Premier | Accepted → Fulfill | — | Per service SLA |
| **Premier** | IT → Base | Standard | 8 hrs | 3 business days |

### 4.11 Pain Points & Gaps (From Flowchart Analysis)

| # | Pain Point | Impact | Owner to Resolve |
|---|------------|--------|------------------|
| 1 | **"Specified Format" gate** — clients may submit informally | Requests bounce, delay routing | PM / Client Services |
| 2 | **No unified entry point** — PM vs IT path split at start | Confusion, duplicate requests | ServiceNow Admin |
| 3 | **Premier Accept/Deny bottleneck** — single decision point | Queue buildup | Premier Support Lead |
| 4 | **Cobalt vs Premier mapping inconsistent** — Premium in PM ≠ Premium in IT | Misrouting, wrong SLA | IT / PM Alignment |
| 5 | **Concierge capacity** — all Cobalt custom requests funnel here | Resource saturation | Concierge Lead / Resource Mgmt |
| 6 | **No escalation path shown** for denied Premier requests | Client dissatisfaction | Premier Support / Sales |
| 7 | **Date field only** — no priority, category, impact fields | Poor triage | ServiceNow Config |

### 4.12 Open Questions

| # | Question | For Whom | Due |
|---|----------|----------|-----|
| 1 | What is the "Specified Format"? Template? Portal? Email template? | PM / Client Services | Interview |
| 2 | How is client tier (Cobalt/Premier) determined at request time? CRM lookup? | ServiceNow Admin | Interview |
| 3 | Can a request start in PM Path and move to IT Path (or vice versa)? | PM / IT Lead | Interview |
| 4 | What defines "Base Service" vs custom in Premier Support? | Premier Support Lead | Interview |
| 5 | IT Premium vs Standard — separate queues? Separate teams? | IT Lead | Interview |
| 6 | Concierge team structure — dedicated? Shared with other functions? | Concierge Lead | Interview |
| 7 | Appeal process for Denied Premier requests? | Premier Support / Sales | Interview |
| 8 | Metrics tracked today? Volume, SLA adherence, denial rate? | All leads | Interview |

### 4.13 Data Dictionary Contribution (For Master Spreadsheet)

| Field | Source | Type | Notes |
|-------|--------|------|-------|
| Request ID | ServiceNow | String | Primary key |
| Request Date | Client entry | DateTime | Trigger |
| Client Name | CRM lookup | Reference | Auto-populate |
| Client Tier | CRM | Enum [Cobalt, Premier] | Routes path |
| Request Path | Router | Enum [PM, IT] | Manual/auto |
| Request Format | Client | Enum [Specified, Informal] | Gate check |
| PM Sub-Path | PM Router | Enum [Premier Support, Concierge] | |
| IT Sub-Path | IT Router | Enum [Premium, Base] | |
| Premier Decision | Premier Support | Enum [Accept, Deny] | |
| Deny Reason | Premier Support | Text | If denied |
| Concierge Scope | Concierge | Text | Custom requests |
| Quote Amount | Concierge | Currency | Custom requests |
| Priority | IT Triage | Enum [Critical, High, Medium, Low] | |
| SLA Target | System | DateTime | Calculated |
| Resolution Date | Fulfillment | DateTime | Actual |
| SLA Met | System | Boolean | KPI |

### 4.14 Next Steps

1. **Validate with Premier Support** — confirm Accept/Deny criteria, SLA, team structure
2. **Validate with Concierge** — confirm custom request flow, capacity, quoting process
3. **Validate with IT** — confirm Premium vs Base service catalog, provisioning SLAs, team split
4. **Validate with PM/Client Services** — confirm "Specified Format," routing logic, client tier lookup
5. **Unify entry point** — design single ServiceNow portal form with conditional routing
6. **Add escalation path** — for Denied Premier → Sales / Concierge upsell
7. **Enrich request form** — add priority, category, impact fields for better triage

---

## 5. Infosec Department Workflow

> **Source:** merged from `INFOSEC_WORKFLOW.md` (kept standalone) — v1.0, 2026-10-09, Draft — based on capability table provided; pending validation with Infosec lead

### 5.1 Overview

**Ownership:** Infosec Department  
**Mission:** Protect Consilio's people, data, systems, and client trust through continuous monitoring, proactive governance, and independent validation.  
**Client-Facing:** Indirect (supports client-facing compliance obligations; no direct client interaction)  
**Departments Interviewed:** Not yet — this is a first-pass draft from capability data

### 5.2 Team Structure (5 Subteams)

| # | Team | Function |
|---|------|----------|
| 1 | **Risk Management** | Risk registers, third-party risk, business continuity, GRC (ZenGRC, Fusion, SecurityScoreCard) |
| 2 | **Privacy & Compliance** | Data protection, AI governance, audit readiness, regulatory compliance (AuditBoard, FairNow, O365 compliance) |
| 3 | **Identity Access Management (IAM)** | Identity lifecycle, PAM, MFA, DNS threat defense (NetWrix, AD IDAM, InfoBlox) |
| 4 | **SecOps People and Data (Blue Team)** | 24×7 monitoring, endpoint defense, email protection, sensitive-data visibility (Rapid7, SpamTitan, DarkTrace, BitDefender) |
| 5 | **SecOps System (Red Team)** | Vulnerability scanning, app security, network control, red team / pen testing (Burp Suite, Cloudflare, Zscaler, Pentera, DomainTools) |

### 5.3 Capability → Team Mapping

| Capability | Primary Team | Supporting Team(s) | Phase |
|------------|--------------|--------------------|----|
| 24×7 Monitoring & Endpoint Defense (Rapid7) | **Blue Team** | Risk Mgmt (incident tracking) | Detect/Respond |
| Cloud Posture & Workload Monitoring (AdminDroid, Axonius) | **Risk Mgmt** | Blue Team, IAM | Detect/Respond |
| Application Security & Web Shielding (InsightVM, Burp Suite, Cloudflare, Pentera) | **Red Team** | Blue Team | Prevent/Govern |
| Vulnerability Discovery & Patching (InsightVM) | **Red Team** | Blue Team | Prevent/Govern |
| Email, SaaS & User-Risk Protection (O365, SpamTitan, DarkTrace, PhishER, Exclaimer) | **Blue Team** | Privacy & Compliance | Prevent/Govern |
| Sensitive-Data Visibility (Falcon Sandbox, BitDefender, Palo Alto Wildfire) | **Blue Team** | Privacy & Compliance | Prevent/Govern |
| Identity Governance & Strong Login (NetWrix PAM, AD IDAM, InfoBlox) | **IAM** | Risk Mgmt | Prevent/Govern |
| Privileged Access & Application Control (NetWrix PAM, AD + MFA) | **IAM** | Red Team | Prevent/Govern |
| Network Control & Traffic Visibility (Zscaler: Deception, ZDX, ZIA, ZPA) | **Red Team** | Blue Team | Prevent/Govern |
| AI Use Governance & AI App Protection (FairNow, AuditBoard) | **Privacy & Compliance** | Risk Mgmt | Prevent/Govern |
| Independent Testing & Continuous Red Team (DomainTools, ADAudit Plus, Burp Suite, PEN test) | **Red Team** | Blue Team | Validate/Recover |
| Incident Readiness & Third-Party Risk (ZenGRC, SharePoint PowerApp, SecurityScoreCard, Fusion) | **Risk Mgmt** | Privacy & Compliance | Validate/Recover |

### 5.4 Business Workflow (3-Phase Security Lifecycle)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   PHASE 1: DETECT / RESPOND                                         │
│   Continuous monitoring → Alert → Triage → Respond → Remediate      │
│                                                                     │
│   PHASE 2: PREVENT / GOVERN                                         │
│   Identify gaps → Harden → Protect → Govern → Enforce              │
│                                                                     │
│   PHASE 3: VALIDATE / RECOVER                                       │
│   Test controls → Audit → Assess third parties → Recover → Improve │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
              │                              │
              └──────────┐    ┌──────────────┘
                         ▼    ▼
                   Continuous Improvement Loop
                   (findings feed back to Phase 1 & 2)
```

#### Phase 1: Detect / Respond

**Objective:** Detect security incidents in real time and respond before impact.

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 1.1 | **Continuous monitoring** — EDR/IDR across corporate endpoints; automated alerting on threshold breaches | Blue Team | Rapid7 InsightIDR (MSSP) |
| 1.2 | **Cloud & asset posture monitoring** — M365 reporting, unified asset inventory across all tools | Risk Mgmt (+ Blue Team, IAM) | AdminDroid, Axonius |
| 1.3 | **Alert triage** — Security team receives alerts, classifies severity, opens ticket | Blue Team | Centralized ticketing system |
| 1.4 | **Incident response** — Investigate, contain, eradicate, recover | Blue Team (+ Red Team for complex) | Rapid7, ticketing system |
| 1.5 | **Incident tracking** — Remediation activities tracked to closure; audit trail maintained | Blue Team | Ticketing system, ZenGRC |

**Trigger:** Automated alert (threshold breach) OR user-reported incident OR external threat intel  
**Exit:** Incident resolved; root cause documented; remediation verified  
**Handoff → Phase 2:** Findings that require hardening/governance changes feed into Prevent/Govern

#### Phase 2: Prevent / Govern

**Objective:** Reduce attack surface, enforce controls, ensure compliance.

**2A: Vulnerability & Application Security**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 2.1 | **Vulnerability scanning** — Continuous asset discovery, risk-based prioritization | Red Team | Rapid7 InsightVM |
| 2.2 | **Web application testing** — DAST testing for OWASP Top 10, API vulnerabilities | Red Team | Burp Suite |
| 2.3 | **Web shielding / edge protection** — CDN, WAF, DDoS protection | Red Team | Cloudflare |
| 2.4 | **Breach & attack simulation** — Validate exploitability, test control effectiveness | Red Team | Pentera |
| 2.5 | **Patch management** — Remediate vulnerabilities based on risk priority | Red Team (+ IT Support) | Rapid7 InsightVM |

**2B: Email & User-Risk Protection**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 2.6 | **Email gateway filtering** — Spam, phishing, malware inbound/outbound | Blue Team | SpamTitan |
| 2.7 | **Advanced email threat detection** — Anomalous behavior, zero-day phishing | Blue Team | DarkTrace/EMAIL |
| 2.8 | **Phishing incident response** — User-reported phishing triage & automation | Blue Team | PhishER |
| 2.9 | **Sensitive-data visibility** — Malware analysis sandbox, endpoint AV | Blue Team | Falcon Sandbox, BitDefender, Palo Alto Wildfire |
| 2.10 | **Email signature governance** — Centralized branding & legal disclaimers | Privacy & Compliance | Exclaimer |

**2C: Identity & Access Management**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 2.11 | **Identity lifecycle management** — Provisioning/deprovisioning workflows | IAM | AD IDAM |
| 2.12 | **Privileged access management** — Control & monitor elevated access | IAM | NetWrix PAM |
| 2.13 | **MFA enforcement** — Multi-factor authentication across applications | IAM | AD + MFA |
| 2.14 | **DNS threat defense** — Malicious domain detection & blocking | IAM | InfoBlox |

**2D: Network Control & Traffic Visibility**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 2.15 | **Secure web gateway (SWG)** — Outbound internet traffic control | Red Team | Zscaler ZIA |
| 2.16 | **Zero trust network access (ZTNA)** — App access without VPN | Red Team | Zscaler ZPA |
| 2.17 | **Deception technology** — Decoy assets to trap lateral movement | Red Team | Zscaler Deception |
| 2.18 | **Digital experience monitoring** — User experience across apps/networks | Red Team | Zscaler ZDX |

**2E: AI Governance & Compliance**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 2.19 | **AI use governance** — Track controls, risks, audit activities for AI tools | Privacy & Compliance | AuditBoard, FairNow |
| 2.20 | **AI guardrail identification** — Define guardrails for AI products (client-facing, internal, vendor-supplied) | Privacy & Compliance (+ Risk Mgmt) | AuditBoard |

**Trigger:** Scheduled scanning cadence, new system onboarding, policy change, finding from Phase 1  
**Exit:** Controls implemented, risks mitigated, compliance evidence generated  
**Handoff → Phase 3:** Validate that controls actually work

#### Phase 3: Validate / Recover

**Objective:** Independently verify controls, assess third parties, ensure recovery capability.

**3A: Independent Testing & Red Team**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 3.1 | **External penetration testing** — Annual/periodic third-party pen test | Red Team (+ external vendor) | External PEN test team |
| 3.2 | **Domain & infrastructure threat hunting** — Domain/IP threat intelligence | Red Team | DomainTools |
| 3.3 | **Active Directory auditing** — Changes, logins, privileged activity review | Red Team | ADAudit Plus |
| 3.4 | **Web app DAST testing** — Validate application security posture | Red Team | Burp Suite |

**3B: Incident Readiness & Third-Party Risk**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 3.5 | **GRC tracking** — Centralize risk & control tracking | Risk Mgmt | ZenGRC |
| 3.6 | **Process automation** — Approval workflows, process digitization | Risk Mgmt | SharePoint PowerApp Workflow |
| 3.7 | **Third-party/vendor risk monitoring** — External security posture rating | Risk Mgmt | SecurityScoreCard |
| 3.8 | **Business continuity & resilience** — Crisis response, continuity planning | Risk Mgmt | Fusion Risk Management |
| 3.9 | **Incident retainer support** — External incident response support on retainer | Risk Mgmt (+ Blue Team) | Incident retainer (contract) |

**3C: Compliance & Audit Evidence**

| Step | Activity | Team | Tools |
|------|----------|------|-------|
| 3.10 | **Audit readiness** — Generate evidence, map controls to frameworks | Privacy & Compliance | AuditBoard, AdminDroid |
| 3.11 | **Compliance reporting** — Regulatory & client compliance reports | Privacy & Compliance | ZenGRC, AuditBoard |

**Trigger:** Scheduled (annual pen test, quarterly GRC review), event-driven (post-incident, vendor onboarding)  
**Exit:** Validation report; findings feed back to Phase 1 (new detection rules) and Phase 2 (control improvements)  
**Feedback Loop:** All findings → Risk register (ZenGRC) → prioritized into Prevent/Govern backlog

### 5.5 System Workflow (Data Flow)

```
                    ┌─────────────────────────────────────────┐
                    │        SECURITY DATA SOURCES            │
                    ├─────────────────────────────────────────┤
                    │ Endpoints (EDR/IDR) ── Rapid7 InsightIDR│
                    │ M365 / Entra ID ────── AdminDroid       │
                    │ Email ──────────────── SpamTitan/DarkTrace│
                    │ Network ────────────── Zscaler (ZIA/ZPA)│
                    │ DNS ────────────────── InfoBlox         │
                    │ Applications ───────── Burp Suite        │
                    │ Cloud ──────────────── Axonius           │
                    │ Assets ─────────────── Axonius (aggregator)│
                    └────────────────┬────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────────┐
                    │        TRIAGE & CORRELATION             │
                    ├─────────────────────────────────────────┤
                    │ Blue Team: Alert triage & response      │
                    │ Axonius: Asset correlation & gap ID     │
                    │ Ticketing: Incident tracking            │
                    └────────────────┬────────────────────────┘
                                     │
                    ┌────────────────┴────────────────────────┐
                    ▼                                         ▼
     ┌──────────────────────┐              ┌──────────────────────┐
     │  GRC / RISK SYSTEMS  │              │  COMPLIANCE SYSTEMS  │
     │  ZenGRC (risk regs)  │              │  AuditBoard (controls│
     │  Fusion (BC/DR)      │              │  FairNow (AI gov)    │
     │  SecurityScoreCard   │              │  AdminDroid (evidence│
     │  (third-party risk)  │              │  ZenGRC (reporting)  │
     └──────────┬───────────┘              └──────────┬───────────┘
                │                                      │
                └──────────────┬───────────────────────┘
                               ▼
              ┌─────────────────────────────────────┐
              │     CONTINUOUS IMPROVEMENT LOOP     │
              │  Findings → Risk Register →         │
              │  Prioritized backlog →              │
              │  Prevent/Govern actions             │
              └─────────────────────────────────────┘
```

### 5.6 Infosec Department Handoffs

| Direction | Department | Data Exchanged | Format | SLA |
|-----------|------------|----------------|--------|-----|
| ← From | IT Support | Asset inventory, system config changes, vulnerability scan results | Axonius feed, Rapid7 reports | Continuous |
| ← From | Product Engineering | App security requirements, SDLC integration (Burp Suite CI) | API / CI pipeline | Per release |
| ← From | HR / UKG | Joiner-mover-leaver events for AD IDAM provisioning | UKG → AD IDAM workflow | Same day |
| → To | IT Support | Patch priorities (risk-ranked), configuration hardening requirements | Rapid7 InsightVM, ZenGRC tickets | Per scan cycle |
| → To | All Departments | Security awareness, phishing simulations, policy updates | Email / O365 / PhishER | Monthly |
| → To | Premier Support / Client Services | Compliance evidence for client audits | AuditBoard / AdminDroid reports | Per request |
| → To | Product Management / TPOs | AI guardrails for client-facing AI products | AuditBoard control mapping | Per AI product launch |
| → To | Executive / Risk | Risk posture, incident reports, third-party ratings | ZenGRC dashboard, Fusion | Quarterly |

### 5.7 Capability Summary (Tool Inventory for Tools Inventory Sheet)

| Tool | Capability Category | Primary Team | Internal/External | Phase |
|------|---------------------|--------------|-------------------|-------|
| Rapid7 InsightIDR | Endpoint Detection & Response (EDR/IDR) | Blue Team | External (MSSP) | Detect/Respond |
| AdminDroid | M365 Reporting & Auditing | Risk Mgmt | External | Detect/Respond |
| Axonius | Asset Aggregation & Correlation | Risk Mgmt | External | Detect/Respond |
| Rapid7 InsightVM | Vulnerability Management | Red Team | External | Prevent/Govern |
| Burp Suite | Web App Security Testing (DAST) | Red Team | External | Prevent/Govern + Validate |
| Cloudflare | CDN, WAF, DDoS Protection | Red Team | External | Prevent/Govern |
| Pentera | Breach & Attack Simulation | Red Team | External | Prevent/Govern |
| SpamTitan | Email Security Gateway | Blue Team | External | Prevent/Govern |
| DarkTrace/EMAIL | AI Email Threat Detection | Blue Team | External | Prevent/Govern |
| PhishER | Phishing Incident Response | Blue Team | External | Prevent/Govern |
| Exclaimer | Email Signature Management | Privacy & Compliance | External | Prevent/Govern |
| MS O365 | Collaboration + Built-in Security | Privacy & Compliance | External | Prevent/Govern |
| Falcon Sandbox | Malware Analysis Sandbox | Blue Team | External | Prevent/Govern |
| BitDefender AV | Endpoint Protection (AV/EDR) | Blue Team | External | Prevent/Govern |
| Palo Alto Wildfire | Cloud Malware Analysis | Blue Team | External | Prevent/Govern |
| NetWrix PAM | Privileged Access Management | IAM | External | Prevent/Govern |
| AD IDAM | Identity Lifecycle (Provisioning) | IAM | External (Microsoft) | Prevent/Govern |
| InfoBlox | DNS Threat Defense | IAM | External | Prevent/Govern |
| AD + MFA | Multi-Factor Authentication | IAM | External (Microsoft) | Prevent/Govern |
| Zscaler Deception | Lateral Movement Detection | Red Team | External | Prevent/Govern |
| Zscaler ZDX | Digital Experience Monitoring | Red Team | External | Prevent/Govern |
| Zscaler ZIA | Secure Web Gateway (SWG/CASB) | Red Team | External | Prevent/Govern |
| Zscaler ZPA | Zero Trust Network Access | Red Team | External | Prevent/Govern |
| AuditBoard | GRC / AI Governance | Privacy & Compliance | External | Prevent/Govern + Validate |
| FairNow | AI Fairness & Bias Auditing | Privacy & Compliance | External | Prevent/Govern |
| DomainTools | Domain/IP Threat Intelligence | Red Team | External | Validate/Recover |
| ADAudit Plus | Active Directory Auditing | Red Team | External | Validate/Recover |
| ZenGRC | Governance, Risk & Compliance | Risk Mgmt | External | Validate/Recover |
| SharePoint PowerApp | Workflow Automation | Risk Mgmt | Internal (SharePoint) | Validate/Recover |
| SecurityScoreCard | Third-Party Risk Rating | Risk Mgmt | External | Validate/Recover |
| Fusion Risk Management | Business Continuity / Resilience | Risk Mgmt | External | Validate/Recover |
| External PEN Test Team | Penetration Testing | Red Team | External (vendor) | Validate/Recover |

**Total: 33 tools identified across 3 phases and 5 teams.** (Intentionally **not** merged into §10 Quick Reference — Infosec uses a security-phase taxonomy, not the ingestion/review/production pipeline taxonomy.)

### 5.8 RACI by Phase

| Phase | Risk Mgmt | Privacy & Compliance | IAM | Blue Team | Red Team |
|-------|-----------|----------------------|-----|-----------|----------|
| 1. Detect / Respond | C | I | C | **R/A** | C |
| 2A. Vuln & App Security | C | I | I | C | **R/A** |
| 2B. Email & User-Risk | I | **A** | C | **R** | I |
| 2C. Identity & Access | C | C | **R/A** | I | C |
| 2D. Network Control | I | I | C | C | **R/A** |
| 2E. AI Governance | C | **R/A** | I | I | I |
| 3A. Independent Testing | I | I | C | C | **R/A** |
| 3B. Incident Readiness | **R/A** | C | I | C | C |
| 3C. Compliance & Audit | C | **R/A** | C | I | I |

**R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed

### 5.9 Pain Points & Open Questions

**Known Pain Points (inferred from capability table)**

| # | Pain Point | Impact | Team |
|---|------------|--------|------|
| 1 | 33 tools across 5 teams — tool sprawl creates visibility gaps | Unknown assets, blind spots | All |
| 2 | Axonius exists to solve fragmentation — indicates prior gap | Asset inventory unreliable | Risk Mgmt |
| 3 | AI governance is nascent (FairNow, AuditBoard) — client AI products launching | Compliance gaps for AI offerings | Privacy & Compliance |
| 4 | External PEN test on retainer — limited internal red team capacity | Validation depends on vendor schedule | Red Team |
| 5 | Email stack has 5 tools (O365, SpamTitan, DarkTrace, PhishER, Exclaimer) — overlap? | Complexity, potential tool consolidation | Blue Team |

**Open Questions for Interview**

| # | Question | For Whom |
|---|----------|----------|
| 1 | What is the actual incident response process (steps, escalation, SLA)? | Blue Team |
| 2 | How are vulnerabilities prioritized (CVSS? Risk-based? Business impact)? | Red Team |
| 3 | What frameworks are you compliant against (SOC 2, ISO 27001, GDPR, CCPA)? | Privacy & Compliance |
| 4 | What is the AD IDAM provisioning trigger (HR ticket? UKG webhook? Manual)? | IAM |
| 5 | Is Rapid7 MSSP fully outsourced or co-managed? | Blue Team |
| 6 | How is AI governance enforced (block? monitor? review board)? | Privacy & Compliance |
| 7 | What does the incident retainer cover (duration, response time, scope)? | Risk Mgmt |
| 8 | How does Infosec integrate with Product Engineering's SDLC (Shift Left)? | Red Team + Product Eng |
| 9 | Is there a formal security awareness / phishing simulation program? | Blue Team |
| 10 | What is the current security posture score (SecurityScoreCard rating)? | Risk Mgmt |
| 11 | How many incidents per month on average? Response time? | Blue Team |
| 12 | Is FairNow actually in use or in evaluation? | Privacy & Compliance |

### 5.10 Next Steps

1. **Validate this draft** with Infosec lead (confirm team assignments, phases, tool ownership)
2. **Interview each subteam** using `CORE_WORKFLOW_DISCOVERY.md` — Blue Team and Red Team first (deepest system workflow)
3. **Confirm tool licenses** — all 33 tools are External except SharePoint PowerApp (Internal)
4. **Map to Data Dictionary** — add Infosec sheet with tool → team → phase → capability → risk mapping
5. **Identify gaps** — capabilities listed but no tool (e.g., SIEM? SOAR? DLP?) or tools listed but no owner

---

## 6. Department Handoff / Information Flow

### 6.1 ERDM Lifecycle vs. Product Engineering

```
ERDM Lifecycle Stages (Baseline)
       │
       ├──► Ingestion Phase ──► Product Engineering branches here
       │         │
       │         └──► Own workflow: Pre-intake → Post-intake → SnapLogic
       │
       ├──► Review Phase
       │
       └──► Production Phase
```

### 6.2 Department Workflow Definition

> **"Where do they come in and where do they go hand over the data?"**

- **Data Warehouse Team:** Receives requirements → Builds views → Hands back reports
- **Product Engineering:** Owns ingestion→review→production pipeline (independent of ERDM) — **interviewed**
- **Infosec:** 3-phase security lifecycle (Detect/Respond → Prevent/Govern → Validate/Recover) — **§5** (handoffs listed in §5.6)
- **Client Pre-Engagement (CRO / Legal):** CRO → Conflict → Legal Team → Opportunity → Win → data handover into ingestion — **§3**
- **Client Service Requests (PM / IT paths):** Premier Accept/Deny, Concierge (Cobalt), IT Premium/Base — **§4**
- **Case Team (Internal Tool):** Case Management System, CaseTime — _not yet interviewed_ (available after 18:45)
- **Content Checker:** Used by CaseTime, not owned by Concierge → **External** tool

### 6.3 Internal vs. External Tool Classification

```
Criterion: Built by Concierge? → Internal : External

Internal:  (Concierge-built)
External:  Relativity, ServiceNow, UKG, Active Directory, Bullhorn,
           SnapLogic, SSIS, Reveal/BrainSpace, Content Checker,
           CaseTime, ETA/MC Response, Power BI, ICE, Present Doc,
           Prismdock, ImageGear, SonarQube, Bitbucket, Kubernetes
```

---

## 7. Data Dictionary Structure (Deliverable)

**Due:** 2026-10-09 11:00  
**Format:** Two spreadsheets

### Spreadsheet 1: Updated Data Dictionary

| Sheet              | Content                                                      |
| ------------------ | ------------------------------------------------------------ |
| Dashboard          | Summary: field counts, modules, categories                   |
| Workflow           | Product Engineering phases, tools per phase, handoffs        |
| Tools Inventory    | 20+ tools: name, category, internal/external, owner, purpose |
| Enterprise Systems | 9 source systems + integration mechanisms                    |
| Patterns           | Ingestion, Integration, Load, Testing, Backup                |
| Conceal (M&A)      | 24 fields: CEO, acquisition dates, valuations, companies     |
| Competitors        | ~70 identified (pending master checklist)                    |

### Spreadsheet 2: Populated Data

- One row per entity per field (synthetic + actual)
- Column structure **must match** Spreadsheet 1
- Synthetic data kept separate (subnet) until real data arrives → then merge

---

## 8. Open Actions & Dependencies

| #   | Action                                                       | Owner                       | Dependency                                   | Due               |
| --- | ------------------------------------------------------------ | --------------------------- | -------------------------------------------- | ----------------- |
| 1   | Get per-tool product workflows (8+ in Review)                | Product Owners / TPOs / PMs | Schedule time with each                      | ASAP              |
| 2   | Interview Case team (Case Mgmt System, CaseTime)             | Satvik / Prithvi            | Available after 18:45                        | Tomorrow          |
| 3   | Obtain masked ServiceNow/Salesforce client data (5+ clients) | Bruguiram / Team            | Manager permission + confidentiality masking | ASAP              |
| 4   | Finalize master checklist: Services / Solutions / Platforms  | Lead                        | Prerequisite for competitor mapping          | Before 11:00      |
| 5   | Complete 20-tool inventory (only ~15 named)                  | All                         | Consolidated document review                 | 11:00             |
| 6   | Validate Content Checker ownership (Internal vs External)    | Team                        | Conflicting statements in transcript         | Before dict final |
| 7   | Build prototype screens using finalized data                 | All                         | Data dictionary + populated sheets ready     | Weekend           |
| 8   | Confirm private Docker registry name                         | Product Engineering         | —                                            | ASAP              |
| 9   | Map all 20+ tools → Product Owner → TPO                      | Lead                        | —                                            | Before 11:00      |
| 10  | Document CI/CD artifact storage (not Jenkins)                | Product Engineering         | —                                            | ASAP              |
| 11  | Clarify "ABI" vs "ABL" product name                          | Product Engineering         | —                                            | ASAP              |
| 12  | Validate "Bouldering" term (coding/tagging?)                 | Product Engineering         | —                                            | ASAP              |
| 13  | Confirm cloud exceptions (which apps, why)                   | Product Engineering         | —                                            | Weekend           |

---

## 9. Transcription Uncertainties

- **DCCIS / DCIS** — Backup pattern spelling unclear (segments ~8213–8225s)
- **Enviz (ENBIZD?)** — Application mentioned but function unknown (~18:00 in original)
- **AI Investigate / AI Summary** — Unclear if separate tools or AVR modules (~18:10)
- **Exact 20-tool list** — Transcript states "20" but only ~15 explicitly named
- **Speaker attribution** — Multiple speakers not individually identified
- **Private Docker registry name** — Not captured in transcript
- **Exact CI/CD tool** — Not Jenkins; artifact storage unclear
- **"ABI" vs "ABL"** — Product name spelling inconsistent in transcript
- **"Bouldering"** — Term meaning unclear (coding/tagging/category?)
- **Cloud exceptions** — Which applications, why cloud considered

---

## 10. Quick Reference: Tool → Phase Mapping

| Tool              | Category              | Phase                   | Internal/External |
| ----------------- | --------------------- | ----------------------- | ----------------- |
| Doc & No-Express  | Document Processing   | Ingestion (Post-intake) | ?                 |
| SnapLogic         | Integration           | Ingestion / Integration | External          |
| AVR               | Review + Hosting      | Review                  | External          |
| Core ECA          | Review (Fast)         | Review                  | External          |
| Relativity        | Review                | Review                  | External          |
| ICE               | Analytics             | Analytics               | ?                 |
| Reveal/BrainSpace | Analytics/Review      | Analytics               | External          |
| Present Doc       | Production Output     | Production              | ?                 |
| Prismdock         | File Conversion       | Production              | External          |
| ImageGear         | File Conversion       | Production              | External          |
| ServiceNow        | Source System         | Data Lake               | External          |
| UKG               | Source System         | Data Lake               | External          |
| Active Directory  | Source System         | Data Lake               | External          |
| Bullhorn          | Source System         | Data Lake               | External          |
| Case Mgmt System  | Source System / Case  | Data Lake / Case        | Internal          |
| ETA/MC Response   | Source System         | Data Lake               | External          |
| SSIS              | Integration           | Integration             | External          |
| SQL Jobs          | Integration           | Integration             | External          |
| Power BI          | BI / Reporting        | BI                      | External          |
| CaseTime          | Case Management       | Case                    | External          |
| Content Checker   | Validation (CaseTime) | Case                    | External          |
| SonarQube         | Code Quality          | CI/CD                   | External          |
| Bitbucket         | Source Control        | CI/CD                   | External          |
| Kubernetes        | Orchestration         | Deployment              | Internal (cluster) |
| Private Docker Registry | Artifact Storage | CI/CD                | Internal          |

---

## 11. Infrastructure & Deployment

### 11.1 Hosting
- **Primary:** Kubernetes cluster (QPods) — on-prem/private
- **Cloud:** Avoided for document storage (security/compliance)
- **Exceptions:** Few applications may use cloud (not finalized)

### 11.2 Container Registry
- **Private Docker registry** (not Docker Hub — avoids public exposure)
- Registry name: [TO BE CONFIRMED]

### 11.3 CI/CD Pipeline
| Stage | Tool / Mechanism |
|-------|------------------|
| Source Control | Bitbucket ("books") |
| CI Trigger | Automatic on push |
| Code Quality | SonarQube |
| Build | Docker images built in CD phase |
| Artifact Storage | [INTERNAL — not Jenkins/JFrog] |
| Deploy | Kubernetes (QPods) |

**Branch Strategy:** One branch per feature/environment

---

## 12. Product Ownership Discovery

**Current State:** NO central documentation of product owners
- Each Product Engineering team has different Product Owners (typically India-based)
- **TPOs (Technical Product Owners)** sit between departments — primary contact for workflow questions
- **Discovery method:** Direct outreach / tribal knowledge only
- **Action Required:** Map product → owner → TPO for all 20+ tools

---