# Consilio UI Change Plan

## Purpose

This document maps the requested UI changes to the current React/Vite implementation and turns them into a tracked implementation plan. It preserves all requested changes, identifies the existing surfaces that need to change, and groups delivery into four phases maximum.

This is an implementation plan, not an assertion that the requested redesign is already complete.

## Current implementation map

The application is a React 19 + TypeScript + Vite single-page prototype with mock data and context-driven navigation.

### Application shell and state

| Surface | Current location | Current behavior | Required direction |
| --- | --- | --- | --- |
| App router | `src/App.tsx` | Switches between `ActiveView` values; routes are in-memory rather than URL-backed. | Add the About Consilio landing route, unified workflow routes, product/solution routes, technology landscape routes, learning detail routes, assessment detail/results routes, and deep-link-safe back/breadcrumb behavior. |
| Navigation/state | `src/context/AppContext.tsx` | Stores active view, selected entity IDs, role, global filters, notifications, saved views, and AI-search modal state. | Extend the typed navigation/state model for route history, universal filter state, page-specific filter state, chat drawer, voice flows, freshness metadata, risk metadata, assessment attempts, and learning completion. |
| Shared types | `src/types.ts` | Defines clients, competitors, workflow stages, roles, tools, technology radar items, learning modules, assessments, submissions, and AI results. | Add typed records for Consilio history/acquisitions, leadership, workflow layers, solution/product catalog, technology market-share evidence, data lineage/freshness, risk rules, filter schemas, learning redirects, assessment recommendations, and media assets. |
| Mock data | `src/data/mockData.ts` | Contains synthetic datasets for every current page. | Replace prose-heavy fields with structured summaries/tags/metrics while retaining expandable evidence and source metadata. Any real company, CEO, acquisition, market-share, competitor, or logo information must be source-validated before being presented as fact. |
| Global CSS | `src/index.css` | Minimal Tailwind import, basic body font, scrollbar styles. | Establish the premium light design tokens, typography, motion rules, Stratos Blue/Cod Gray palette, ambient gradients, hairline borders, glass surfaces, focus states, responsive breakpoints, and reduced-motion fallback. |

### Existing page and component surfaces

| Current page/component | Current role | Changes mapped to it |
| --- | --- | --- |
| `src/components/layout/Shell.tsx` | Brand lockup, sidebar, breadcrumbs, search trigger, global filters, role switcher, notifications, main content frame. | New application name/logo, collapsible modern sidebar, remove repeated “Intelligence” wording from child labels, universal filter rail/popover, breadcrumbs/back behavior, help action, freshness/status area, responsive layout, persistent non-blocking agent drawer trigger. |
| `src/components/search/AiSearchModal.tsx` | Full-screen AI search modal with seeded mock query flows and result tables. | Convert to an openable right-side/page-integrated agent drawer that never covers or blurs the working dataset; preserve good search/result behavior; add voice entry, predefined voice navigation flows, page opening, evidence/freshness display, and compact action cards. |
| `src/components/views/OverviewView.tsx` | Current first page with KPI cards, intelligence area cards, alerts, learning/assessment shortcuts, and recent insights. | Make this the new opening experience with About Consilio/history/leadership/acquisitions content or an About landing entry that is the initial screen; redesign as a numbers-first executive dashboard with comparison bases, priorities, insight cards, freshness, and high-value CTAs. |
| `src/components/views/ClientIntelligenceView.tsx` | Client KPI summary, search/status/industry filters, sortable client table, single-service warning, client navigation. | Rename sidebar label to Client; add page-specific modern filter chips/panel, risk indicator beside every client, quantified comparison context, service-count/ellipsis expansion, table overlay, data validation/freshness, actionable next-best actions, help, and card/table responsive modes. |
| `src/components/views/ClientDetailView.tsx` | Client profile with tabs for overview, revenue, services, matters, reviews, health, intelligence. | Use a numbers-first profile, tags instead of dense prose, risk explanation and evidence, service expansion, comparison charts, last-updated metadata, modern table overlays, consistent breadcrumbs/back, help, and page-integrated agent actions. |
| `src/components/views/CompetitorIntelligenceView.tsx` | Competitor directory, active competitor summary, capability comparison table. | Rename sidebar label to Competitors or Market Intelligence per the requested rename; add market/competitor filters, image/logo treatment, market-share comparisons, tags, expandable comparison rows, data source/freshness, risk/opportunity logic, help, and table controls. |
| `src/components/views/CompetitorDetailView.tsx` | Competitor battlecard with tabs and capability table. | Modernize battlecard layout, add comparison basis for every number, expandable long fields, competitor imagery, structured SWOT/offerings/pricing/recent moves, freshness/source labels, help, and responsive overlays. |
| `src/components/views/WorkflowRolesView.tsx` | Current e-Discovery stage flow plus workflow/roles/RACI tabs and a stage detail area. | Replace team/workflow/rules summary with one unified workflow canvas containing System, Business/Money Chain, Application, and Data layers; clicking a layer expands internal subflows; retain role/tool/RACI intelligence as linked subflows; add visual hierarchy, metrics, handoffs, bottlenecks, filters, help, and deep navigation. |
| `src/components/views/ToolsIntelligenceView.tsx` | Searchable internal tools list with selected tool detail. | Rename/reframe as **Solution 360 — Product Atlas**; redesign cards and real-estate usage; add quantified hero stats, rich filters, tags, concise summaries, expandable detail pages, adoption/status metrics, tool relationships, source/freshness, and responsive comparison views. |
| `src/components/views/TechnologyRadarView.tsx` | Technology radar with ring/category filters, radar-like visual, and verbose technology trend content. | Make this the third intelligence destination after Clients and Market Intelligence; redesign around Consilio’s technology share in legal/e-discovery, capability map, competitor offerings, market share, charts, evidence, comparisons, concise tags, filters, detail views, help, and freshness/source validation. Do not mix generic industry trend prose into the primary view. |
| `src/components/views/LearningView.tsx` | Learning journey progress bars and module cards with course progress. | Remove in-app course progress tracking and course delivery; present concise learning cards, completion state, “Mark as completed,” and Atlas redirects for course content. Keep recommendations driven by assessment outcomes. |
| `src/components/views/AssessmentsView.tsx` | One assessment experience with question progress, answer selection, score, explanations, and restart. | Add quantitative assessment dashboard, counts/categories/completion metrics, assessment landing cards, improved question navigator, saved answer state, results breakdown, wrong-area recommendations, course links to Atlas, retake flow, completion/freshness state, and responsive UX. |
| `src/components/views/ContributorAdminView.tsx` | Contributor proposal/admin approval tables and modal. | Apply the same visual system, filters/sorts, table overlays, tags, freshness and validation states, consistent buttons, risk/status logic, and responsive behavior. It is included in the universal UI work even though it is not an intelligence destination. |

## Information architecture changes

### Proposed top-level navigation

Use the approved application name consistently: **Consilio Gateway of Intelligence**.

1. About Consilio — opening/initial destination.
2. Workspace — executive overview and saved views.
3. Intelligence
   - Clients
   - Market Intelligence (renamed from Competitor Intelligence)
   - Workflows (unified workflow canvas)
   - Solution 360 — Product Atlas (former Internal Tools & Tech section)
   - Technology Intelligence (third intelligence destination after Clients and Market Intelligence)
4. Enablement
   - Learning
   - Assessments
5. Governance
   - Contributor Portal
   - Admin Approvals
6. Atlas — external learning/documentation destination.

Do not repeat the word “Intelligence” in every sidebar child label. The parent section supplies that context; page titles may still use the term where it improves clarity.

### Route and navigation model

The current `activeView` switch is sufficient for the prototype but does not support durable URLs or a real history stack. Implement a typed route model that supports:

- About landing and acquisition/leadership detail states.
- List/detail states for clients, competitors, solutions/products, workflows, learning items, and assessments.
- Query-param or state-backed filters and selected records.
- Breadcrumb links for every ancestor and a visible back action for every detail state.
- A safe fallback when an entity ID is missing or stale.
- Scroll restoration and keyboard focus restoration when opening/closing overlays or drawers.

## Design direction and system requirements

### Visual system

- Light-first, premium editorial aesthetic inspired by Linear’s clarity and density, without copying Linear’s brand or dark mode.
- Canvas: `#FFFFFF` with a very subtle Stratos Blue ambient radial glow at approximately 2–4% opacity in hero/overview areas.
- Primary ink: Cod Gray `#0F0F0F`.
- Primary accent: Stratos Blue `#001749`; use a restrained deeper midnight transition on hover.
- Use a premium serif display face for selected emotional/editorial words and a geometric sans for UI/data copy. Add the chosen fonts intentionally rather than relying on browser defaults.
- Use 0.5–1px hairline borders with low-opacity Cod Gray/Stratos Blue instead of heavy gray boxes.
- Use translucent white surfaces with backdrop blur only where it improves hierarchy; preserve contrast and performance.
- Use deep midnight underlays for a small number of high-impact areas, especially final CTA/footer or selected hero sections, following the requested 90/10 light-to-dark rule.
- Use premium icons with a slightly blue-tinted dark treatment; avoid pure gray icons that look disabled.
- Use ghost buttons for secondary actions: transparent fill, 1px Stratos Blue or Cod Gray border. Reserve filled Stratos Blue buttons for the highest-priority action.
- Standardize hover, focus, pressed, loading, success, warning, and disabled states.
- Keep motion purposeful: short elevation/opacity/position transitions, progressive disclosure, workflow expansion, and chart reveal. Respect `prefers-reduced-motion`.

### Content and hierarchy rules

- Every page is insights-first and actionable: show the number, its implication, the priority, and the next action before detail.
- Convert long statements into tags, labels, compact summaries, and metrics. Put full descriptions, evidence, and narrative in inner pages, drawers, or expansion panels.
- Do not force every record into the same card style. Use KPI tiles, metric bands, profile cards, comparison rows, timeline nodes, data tables, charts, and editorial panels according to the content.
- Represent priority as P0/P1/P2/P3 or an equivalent visible scale. Higher-priority and more decision-relevant metrics receive stronger visual weight.
- Every numeric value needs a comparison basis: period, denominator, peer/competitor benchmark, market baseline, or explicit “not available.”
- Show decision-making metrics and insight metrics separately where that helps the user move from “what is happening” to “what should I do.”
- Use counts whenever multiple items are collapsed. For long lists, show the first few plus `+N more` and allow expansion.
- Keep titles and labels plain-language and concise. Avoid long explanatory paragraphs in overview/list views.

## Universal change traceability

The following checklist preserves every requested universal change and maps it to implementation work.

### U1. Tags, concise summaries, and varied visual patterns

- Replace long statements on all pages with tags, metric chips, compact summaries, and expandable detail.
- Keep inner pages/drawers for full descriptions and evidence.
- Vary presentation patterns by content; do not render every dataset as an identical card grid.
- Primary surfaces: every `src/components/views/*.tsx`, `src/components/search/AiSearchModal.tsx`, and shared design components to be created.

### U2. Intelligence-driven, actionable, numbers-first pages

- Reorder every page so the most important numbers and insights appear first.
- Add P0/P1/P2/P3 priority treatment.
- Add comparison context to every number.
- Add decision-making and insight metrics.
- Primary surfaces: `OverviewView`, all intelligence views, Learning, Assessments, and the shared metric/insight primitives.

### U3. Navigation, breadcrumbs, back actions, and modern tables

- Keep data easy to navigate through cards and clear flows.
- Add clickable breadcrumbs and explicit back buttons for every deeper view.
- Modernize every table with compact density, column hierarchy, sticky headers, row hover/focus, responsive horizontal overflow, row expansion, and table overlay/detail treatment.
- Primary surfaces: `Shell.tsx`, all detail views, client/competitor/workflow tables, contributor/admin tables, and AI evidence tables.

### U4. Universal consistent filter location with page-specific logic

- Keep filters in one predictable global location in the shell.
- Add a consistent page filter bar/panel pattern that can expose page-specific logic without moving the user to a new location.
- Use modern multi-select chips, range controls, segmented controls, saved views, active-filter summaries, reset-all, and filter counts.
- Make filters the primary sorting/discovery mechanism rather than relying on search alone.
- Required page-specific examples: client risk/status/industry/service/region; market competitor position/share/capability; workflow layer/status/role/tool; solution category/adoption/status/user/workflow; technology ring/category/maturity/market share; learning area/status/difficulty; assessments category/completion/score.
- Primary surfaces: `Shell.tsx`, new shared filter component(s), each page view, and `GlobalFilterState`.

### U5. Agent chat placement

- Replace the full-screen modal in `AiSearchModal.tsx` with an openable side drawer or docked workspace panel.
- The current page remains visible and legible; no full-page blur or content-hiding overlay.
- Support resizing/collapsing, contextual page/entity scope, result citations/source freshness, action buttons, and page navigation.

### U6. Collapsible modern sidebar

- Add expanded/collapsed desktop states with icon tooltips and persistent preference.
- Retain a mobile drawer with accessible focus handling.
- Improve hierarchy, active state, spacing, logo lockup, section labels, hover motion, and selected-page indication.
- Primary surface: `Shell.tsx` plus shared navigation primitives.

### U7. Application name

- Replace the current “Consilio Gateway / Enterprise Intelligence” treatment with the approved product name **Consilio Gateway of Intelligence**.
- Apply name to brand lockup, document title, metadata, search prompt, onboarding/about copy, and accessibility labels.

### U8. Intelligence-page help button

- Add a consistent help action to every intelligence page.
- Help opens a non-blocking guide that explains page purpose, metric definitions, filter meanings, table/chart controls, and “where to look for what.”
- Use page-specific content rather than a generic tooltip.

### U9. Voice agent and mocked navigation flows

- Add microphone/voice entry to the agent drawer.
- Implement at least four predefined mock flows, for example:
  1. “Show high-risk clients” → opens Clients with risk filter applied.
  2. “Compare Consilio with Relativity” → opens Market Intelligence competitor comparison.
  3. “Show the review workflow” → opens the workflow canvas focused on review.
  4. “Which tools support review?” → opens Solution 360 filtered to review-stage tools.
- Show transcript, interpreted intent, target page, applied filters, and fallback when a command is not recognized.
- If browser speech APIs are unavailable, provide a deterministic mock voice control with the same UI contract.

### U10. Premium light-mode redesign

- Use the Linear-inspired light density and navigation discipline requested by the user.
- Implement the Ghost Component Trick for secondary actions.
- Tint icons with a subtle Stratos Blue overlay rather than pure gray.
- Implement the specified white canvas, ambient glow, Cod Gray typography, Stratos Blue actions, glass surfaces, hairline borders, monolithic editorial hero, 90/10 midnight underlay, and micro-border rules.
- Consolidate these decisions into design tokens rather than one-off utility classes.

### U11. Consilio imagery, logo, client and competitor imagery

- Use the provided Consilio logo asset at `src/images/consilio_logo.png`.
- Add approved Consilio imagery and premium icons from authorized sources.
- For competitors and clients, use official brand SVGs or approved public logo assets with fallbacks, alt text, source/license metadata, and consistent crop rules.
- Do not silently scrape or present unverified images as official. Add an asset manifest and source fields to the data model.

### U12. Expandable multi-value tables and counts

- Use `+N` counts, ellipses, and row expansion for services, offerings, tools, roles, tags, and other multi-value cells.
- Apply to client services in Client Intelligence and to every comparable multi-value table.
- Expansion should work with keyboard and on mobile.

### U13. Client risk indicator

- Add a color-coded risk badge immediately beside each client name in directory and detail contexts.
- Use a consistent accessible palette and text label, not color alone.
- Explain the rule and supporting signals in the detail drawer/page.
- Initial rule must include the existing single-service signal and can combine revenue decline, health score, status, and competitor exposure.

### U14. Filter/sort on every table

- Every table across intelligence, governance, AI evidence, client/competitor detail, workflow/RACI, and assessments must expose filter and sort controls.
- Show current sort/filter state and result count.
- Use a consistent interaction pattern and preserve state when navigating into a row and back.

### U15. Risk logic, validation, and accuracy

- Define centralized, typed risk rules with explanation codes, severity, confidence, and evidence.
- Add validation for required fields, impossible percentages, missing comparison baselines, stale timestamps, conflicting statuses, and invalid entity references.
- Display “data confidence,” “last validated,” and “source” where accuracy is material.
- Never imply 100% certainty for synthetic or unavailable data; show “not available” when a basis is missing.

### U16. Premium buttons and consistent animation

- Create shared button variants and motion primitives.
- Standardize CTA hierarchy, radius, hover/pressed states, focus ring, loading state, and disabled state.
- Use the same timing/easing across navigation, drawers, cards, charts, expandable rows, and workflow layers.

### U17. New-data notifications and freshness

- Notify users when new data is available through the existing notification area and contextual page notices.
- Show freshness for every data-bearing surface, such as “Updated now,” “Updated 24h ago,” or an absolute timestamp when useful.
- Add stale thresholds by dataset and a visible stale/warning treatment.
- Include freshness/source metadata in data types and mock records.

### U18. Responsive system

- Support desktop expanded/collapsed sidebar, tablet layouts, and mobile navigation drawer.
- Convert wide tables to responsive overlay/detail views or carefully designed horizontal scrollers.
- Make charts, workflow canvas, filters, agent drawer, forms, and assessment navigation touch-friendly.
- Test at minimum 1440px, 1024px, 768px, and 390px widths.

### U19. Learning and Atlas

- Remove in-app course progress tracking and progress bars.
- Keep concise learning cards, status, key outcomes, and “Mark as completed.”
- Redirect course content and detailed learning material to Atlas.
- Preserve assessment-driven recommendations and completion state in the local app.
- Primary surface: `LearningView.tsx`, `LEARNING_MODULES`, navigation/context, and Atlas link handling.

### U20. Assessment dashboard and adaptive recommendations

- Add dashboard metrics: total assessments, categories, completed, in progress, average score, and recommended next action.
- Give each assessment a landing card with purpose, question count, category, best score, completion status, and CTA.
- Add a high-quality question navigator with question index, answered/unanswered state, flagged state if introduced, previous/next, and submit/review flow.
- After completion, show score, category breakdown, incorrect areas, explanations, and recommended Atlas courses to complete or retake.
- Preserve retake and completion history rather than only keeping transient local component state.

## Intelligence-specific change map

### I1. About Consilio page and opening experience

**Current gap:** No About view or company history/acquisition/leadership data model exists. `OverviewView` is currently the first view.

**Implementation target:** Add `AboutConsilioView.tsx` and a route/state entry. Use a premium editorial landing page with:

- Consilio origin/history timeline.
- Detailed acquisition timeline graph with expandable company nodes, acquisition date, acquired capability, geography, strategic rationale, and source/freshness.
- Current CEO card for **Andy Macdonald** (the official Consilio spelling), including approved portrait, role, verified biography, relevant experience, and source links. The official executive-management page currently identifies him as Chief Executive Officer and says he is responsible for strategic and operational initiatives, with more than 20 years of executive experience. It also lists his prior First Advantage leadership and earlier First American role. Treat family/location details as optional and omit them from the UI unless explicitly approved.
- Relevant company facts shown as concise metric tiles/tags rather than long prose.
- Clear path into the intelligence dashboard.

**Files/data likely affected:** `App.tsx`, `AppContext.tsx`, `types.ts`, `mockData.ts`, `Shell.tsx`, new About view/components, `index.html` metadata, asset manifest.

**Acceptance criteria:** About is the initial opening destination; history/acquisitions are visually navigable; every fact has source/freshness; CEO card is accessible and fact-checked; the dashboard remains one action away.

### I2. Rename Competitor Intelligence to Market Intelligence

Rename user-facing labels, breadcrumbs, page headings, search category labels, notification copy, help content, and saved-view descriptions. Keep internal identifiers temporarily compatible where useful, but add a migration/alias strategy so existing navigation does not break.

Affected surfaces: `Shell.tsx`, `CompetitorIntelligenceView.tsx`, `CompetitorDetailView.tsx`, `AppContext.tsx`, `AiSearchModal.tsx`, `OverviewView.tsx`, learning/assessment labels, and mock content.

### I2.1. Universal and contextual filters

Implement the filter system described in U4. The shell owns placement and shared state; each page owns its schema/options, active-filter chips, and query logic. Filter state should be serializable for deep links and saved views.

### I3. Sidebar naming under Intelligence

Remove repeated “Intelligence” from child labels. Use `Clients`, `Market Intelligence`, `Workflows`, `Solution 360`, and `Technology` or `Technology Intelligence` according to the final information-architecture decision. Update active-state logic and breadcrumbs accordingly.

### I4. Unified workflow intelligence

**Current gap:** `WorkflowRolesView` is centered on six e-Discovery stages with separate workflow/roles/RACI tabs. There is no system/business/application/data layer model.

**Implementation target:**

- Create one unified workflow canvas with layer nodes for:
  - System workflow: how work gets done.
  - Business workflow: money chain/value flow.
  - Application workflow: systems and applications involved.
  - Data workflow: data movement, transformations, controls, and handoffs.
- Clicking a layer expands its internal workflow and subflows.
- Connect stages to roles, tools, inputs, outputs, cycle time, throughput, bottlenecks, controls, and evidence.
- Use progressive disclosure, zoom/pan where useful, minimap or orientation aid, active-layer styling, and detail panel.
- Keep the existing e-Discovery workflow as one useful system/data subflow rather than deleting it.
- Include filter/sort/help/freshness and agent actions.

Likely data additions: `WorkflowLayer`, `WorkflowNode`, `WorkflowEdge`, `WorkflowMetric`, `WorkflowEvidence`.

### I5. Solution 360 and Products redesign

**Current gap:** `ToolsIntelligenceView` is a searchable list plus selected-tool detail; data is verbose and the page has no rich filter set or quantified hero.

**Implementation target:**

- Rename the section to **Solution 360 — Product Atlas**. “Product Atlas” gives the subsection a memorable, navigational name while preserving the user’s requested products meaning.
- Create a visual 360 representation: capability ring, orbit, radial map, or another legible relationship visualization that maps solutions to workflows, users, integrations, and outcomes.
- Use quantified initial stats such as total solutions, enterprise adoption, active integrations, operational availability, workflow coverage, and recently updated items.
- Add filters for category, workflow stage, user group, adoption tier, system status, integration, license model, and freshness.
- Replace long paragraphs with tags, one-line “what it does,” status/adoption metrics, and expandable detail.
- Use varied layouts for capability groups, product profiles, comparisons, and release notes.

### I6. Technology Intelligence rebuild and ordering

**Current gap:** `TechnologyRadarView` is a ring/category radar with verbose trend/regulatory copy. It does not quantify Consilio’s technology share in the legal/e-discovery landscape or systematically compare competitor offerings.

**Implementation target:**

- Place Technology as the third intelligence item after Clients and Market Intelligence.
- Reframe the page around: Consilio technology position, e-discovery capability coverage, competitor offering comparison, market share/technology share, adoption/maturity, and strategic gaps.
- Add charts that clearly identify denominator, period, source, and confidence.
- Keep technology trends as a secondary, filterable signal layer rather than the page’s main narrative.
- Use concise technology cards/tags with drill-down detail, evidence, regulatory notes, and freshness.
- Add filters for capability, vendor, market segment, maturity, adoption, ring, source confidence, and date.

## Phase plan

The work is intentionally limited to four phases. Each phase ends with a usable, reviewable increment.

### Live implementation status

- **Branch:** `codex-ui-wow`
- **Phase 1:** In progress / foundation implemented and build-validated.
- **Phase 2:** In progress / About Consilio, renamed Market Intelligence labels, client risk badge, and technology rebuild implemented.
- **Phase 3:** In progress / unified workflow framing and Solution 360 — Product Atlas framing implemented; deeper layer/subflow data modeling remains.
- **Phase 4:** In progress / learning redirect/completion treatment and browser-microphone mock entry implemented; full assessment recommendation persistence and four explicit voice-flow states remain.

### Phase 1 — Foundation, information architecture, and design system

**Goal:** Establish the shared system that all later page work depends on.

**Scope:**

- Add design tokens, typography, light premium visual language, icon treatment, button variants, card/table primitives, motion primitives, focus states, and reduced-motion behavior.
- Add the approved logo/asset manifest structure and placeholder-safe image handling.
- Refactor `Shell.tsx` for the new product name, collapsible sidebar, child labels, responsive nav, breadcrumbs, explicit back behavior, notifications, freshness area, help trigger, and universal filter placement.
- Extend `AppContext.tsx`, `types.ts`, and routing for serializable navigation, route history, filter schemas, page-specific filters, source/freshness, validation, risk, and chat drawer state.
- Replace the AI modal foundation with a non-blocking agent drawer shell while preserving current seeded search flows.
- Define shared table, expansion, count, risk, freshness, help, metric, empty, loading, and validation components.
- Add baseline test fixtures and an acceptance checklist for all widths.

**Traceability:** U1–U8, U10, U12, U14, U16–U18; prerequisite for I1–I6.

**Exit criteria:** All existing routes still open; sidebar can collapse; breadcrumbs/back work; filters appear in one consistent location; agent drawer does not hide page data; no obvious desktop/mobile overflow; shared components are used by at least one existing list and one detail view.

### Phase 2 — About Consilio and intelligence information architecture

**Goal:** Deliver the new opening experience and the first three intelligence destinations with consistent numbers-first behavior.

**Scope:**

- Build About Consilio history, acquisition timeline, CEO card, relevant facts, sources, and opening route.
- Rework Overview as an actionable executive dashboard linked from About.
- Rename Competitor Intelligence to Market Intelligence throughout the UI.
- Rework Clients and client detail with risk indicators, service counts/expansion, modern tables, filters, comparisons, freshness, and validation.
- Rework Market Intelligence and competitor detail with market-share context, images, comparison tables, tags, filters, and sources.
- Rebuild Technology Intelligence around Consilio/market/competitor technology share and charts; place it third under Intelligence.
- Add page-specific help content to About, Overview, Clients, Market Intelligence, and Technology.

**Traceability:** I1, I2, I2.1, I3, I6, U1–U4, U8, U11–U15, U17, U18.

**Exit criteria:** About is the opening page; all labels and breadcrumbs use the new terminology; every intelligence table has filter/sort/expansion; clients show risk next to names; all major numbers show comparison/freshness/source; technology page no longer leads with verbose generic trend prose.

### Phase 3 — Unified workflow and Solution 360/products

**Goal:** Replace the two weakest intelligence surfaces with visual, layered, decision-oriented experiences.

**Scope:**

- Build the unified workflow data model and canvas for system, business, application, and data layers.
- Add expandable subflows, stage metrics, role/tool links, handoffs, bottlenecks, controls, and detail panels.
- Preserve and connect current e-Discovery stage data.
- Reframe Tools Intelligence as Solution 360 and Products; add quantified hero stats, 360 visualization, filters, concise tags, expandable product profiles, adoption/status/release data, and comparison views.
- Add help, agent contextual actions, freshness, validation, and responsive behavior.

**Traceability:** I4, I5, U1–U5, U8, U10–U18.

**Exit criteria:** A user can understand the full workflow at a glance, expand each of the four layers, inspect subflows, and reach linked roles/tools; Solution 360 is filter-first and numbers-first, with no dense prose required to understand a product’s purpose.

### Phase 4 — Enablement, voice, governance hardening, and quality pass

**Goal:** Finish the cross-application experience and verify the whole redesign.

**Scope:**

- Redesign Learning around cards, Atlas redirects, mark-as-completed, and assessment recommendations; remove in-app course progress tracking.
- Build the assessment dashboard, landing cards, question navigator, attempt state, results breakdown, retake flow, and Atlas recommendations.
- Add the voice agent and four mocked navigation flows.
- Apply the design system and universal filter/sort/freshness/risk/validation/table behavior to Contributor/Admin and remaining surfaces.
- Add new-data notifications and stale-data states across datasets.
- Add client/competitor/Consilio imagery and final asset/source validation.
- Perform responsive, accessibility, keyboard, reduced-motion, visual-regression, and content QA.

**Traceability:** U1–U20, especially U5, U9, U11, U17–U20.

**Exit criteria:** Learning and Assessments meet the requested flows; voice demos work for four defined commands; every page has consistent navigation/filter/help/table behavior; stale/new data states are visible; responsive and accessibility checks pass; no requirement in this document remains untracked.

## Data, validation, and evidence contract

Before adding real-looking content, define a common metadata contract:

```ts
interface DataEvidence {
  sourceName: string;
  sourceUrl?: string;
  retrievedAt: string;
  lastUpdatedAt?: string;
  freshnessState: 'Fresh' | 'Aging' | 'Stale' | 'Unknown';
  confidence: 'High' | 'Medium' | 'Low' | 'Unverified';
  comparisonBasis?: string;
  notes?: string;
}
```

Use this for company facts, acquisitions, CEO information, market shares, competitor data, technology comparisons, client metrics, tools, workflows, learning recommendations, and assessment results. Synthetic demo data should be visibly marked as demo/synthetic in development fixtures and should not be presented as externally verified market truth.

Centralize validation rules for:

- Percentages in the 0–100 range.
- Revenue and count values that are non-negative.
- Market-share totals and stated denominators.
- Timestamp ordering and stale thresholds.
- Required source/confidence fields for externally sourced claims.
- Risk explanations that point to actual signals.
- Valid entity references in workflow edges, related tools, related courses, and recommendations.
- Assessment scores that match the recorded answer history.

## Requirement tracking matrix

Use this matrix during implementation. Mark each row `Not started`, `In progress`, `Blocked`, `Ready for QA`, or `Accepted`.

| ID | Requirement | Primary implementation surface | Phase | Status |
| --- | --- | --- | --- | --- |
| I1 | About Consilio history, acquisitions timeline, CEO card, relevant facts, opening experience | New About view, router, mock/data types, Shell | 2 | In progress |
| I2 | Rename Competitor Intelligence to Market Intelligence | Shell, views, search, copy/data | 2 | In progress |
| I2.1 | Universal consistent filters with page-specific logic | Shell, filter primitives, context, every view | 1–4 | Not started |
| I3 | Remove repeated Intelligence wording from sidebar children | Shell/navigation | 1–2 | Not started |
| I4 | Unified system/business/application/data workflow with expandable subflows and premium visuals | Workflow view, workflow types/data | 3 | Not started |
| I5 | Solution 360/products redesign, 360 visual, filters, tags, stats, expandable cards | Tools view, new components/data | 3 | In progress |
| I6 | Technology landscape/share/rebuild as third intelligence page | Technology view, technology data/charts | 2 | In progress |
| U1 | Tags and concise summaries; varied patterns | All views/shared primitives | 1–4 | In progress |
| U2 | Intelligence-driven, actionable, numbers-first, priority hierarchy, comparisons | All dashboards/views | 1–4 | In progress |
| U3 | Navigation flow, breadcrumbs/back, modern tables/overlays | Shell, all list/detail/table surfaces | 1–4 | In progress |
| U4 | Filters colocated consistently and tuned to page logic | Shell/context/all views | 1–4 | In progress |
| U5 | Agent chat integrated as non-blocking page drawer | AI search component, context, Shell | 1 | In progress |
| U6 | Collapsible modern sidebar | Shell | 1 | In progress |
| U7 | Creative application name | Shell, metadata, copy | 1 | Accepted |
| U8 | Help button and page navigation guide on intelligence pages | Shared help + each intelligence view | 1–2 | In progress |
| U9 | Voice agent with four mocked navigation/data flows | Agent drawer, voice/mocks, context | 4 | In progress |
| U10 | Linear-inspired premium light theme and specified design tricks | CSS/tokens/shared primitives/all views | 1–4 | In progress |
| U11 | Consilio logo/icons/images and client/competitor imagery | Asset manifest, Shell, entity views | 1–4 | Not started |
| U12 | Ellipsis/expand and numerical counts in multi-value tables | Table/row primitives, all tables | 1–4 | Not started |
| U13 | Color-coded client risk indicator beside client name | Client list/detail, risk rules | 2 | Not started |
| U14 | Filters and sort on every table | Shared table controls/all tables | 1–4 | Not started |
| U15 | Risk logic, validation, 100% accuracy emphasis | Data contract/validation/risk surfaces | 1–4 | Not started |
| U16 | Premium buttons and consistent animations | Shared primitives/CSS/all views | 1–4 | Not started |
| U17 | New-data notifications and freshness durations | Context/notifications/all data surfaces | 1–4 | Not started |
| U18 | Entire system responsive | Shell, views, charts, tables, drawers | 1–4 | In progress |
| U19 | Learning cards, remove course progress, Atlas redirects, mark completed | Learning view/context/data | 4 | In progress |
| U20 | Assessment dashboard, landing cards, question navigation, score recommendations | Assessments view/context/data/Atlas links | 4 | In progress |

## Verification plan

### Functional verification

- `npm install` using the approved lockfile/package manager workflow, then `npm run lint` and `npm run build`.
- Exercise every route from the sidebar, breadcrumb, back action, card, table row, agent action, and voice mock.
- Verify filters affect data and remain visible/serializable when navigating into details and back.
- Verify every table’s filter, sort, result count, row expansion, and mobile behavior.
- Verify risk explanations match the underlying signals.
- Verify notification/freshness changes appear for new/stale data fixtures.
- Verify assessments calculate score from answer history and recommendations match missed categories.
- Verify Atlas links open in a safe new context and are visibly external.

### Visual and responsive verification

Review at 1440px, 1024px, 768px, and 390px widths. Check:

- Sidebar expanded/collapsed/mobile drawer.
- Filter control location and active-filter visibility.
- Charts and workflow canvas readability.
- Table overlay/detail behavior.
- Agent drawer coexistence with page data.
- Typography, hierarchy, contrast, icon tinting, ghost buttons, micro-borders, ambient glow, and midnight underlay.
- Loading, empty, stale, error, validation, and reduced-motion states.

### Accessibility verification

- Keyboard access to navigation, breadcrumbs, filters, tables, expansions, drawers, voice controls, and assessment questions.
- Visible focus states and logical focus return after closing overlays/drawers.
- Screen-reader labels for icons, charts, risk indicators, counts, and freshness.
- Color is never the only risk/status signal.
- Sufficient contrast for light theme, ghost buttons, tinted icons, and translucent surfaces.
- Reduced-motion mode removes nonessential animation.

## Public research incorporated into the plan

Research was performed on 8 October 2026 using publicly available sources. These findings are planning inputs and must still be captured in the app’s evidence model with retrieval timestamps.

### Consilio company history and acquisitions

The official [Consilio About page](https://www.consilio.com/about) provides the source-of-truth narrative for the About timeline. It identifies the following milestones for the planned timeline graph:

- **2000:** Founded as First Advantage Litigation Consulting, initially focused on forensics consulting for multinational corporate clients dealing with electronically stored information.
- **2005:** Launched Global RPM and Secure Data Hosting; the True Data Partners technology addition expanded data processing and eDiscovery capabilities.
- **2006–2010:** Expanded operations in Europe and Asia and established India operations for follow-the-sun support.
- **Early 2010s:** Continued international expansion and added enhanced audio review and text analytics workflows.
- **2013:** First Advantage Litigation Consulting rebranded to Consilio.
- **2015:** Separated from First Advantage, added Backstop LLP, Proven Legal Technologies, Huron Legal, and EQD, and launched a new Sightline iteration.
- **2018:** Merged with Advanced Discovery and acquired DiscoverReady; the official narrative says these expanded geographic reach, technology, expertise, and client portfolios.
- **2021:** Acquired Adecco Group legal consulting/eDiscovery units including Special Counsel, D4, and EQ, and acquired Legility.
- **2022:** Announced Complete Enterprise after integrating acquired business units.
- **2023:** Completed the acquisition of Lawyers On Demand and SYKE, expanding Enterprise Legal Services across Europe, the Middle East, Africa, Asia, and Australia and strengthening the UK footprint. The related [Consilio announcement](https://www.consilio.com/resource/consilio-announces-intent-to-acquire-lawyers-on-demand-and-syke-to-bolster-legal-flexible-talent-and-advisory-capabilities?889d8e38_page=9) also provides public scale context for Lawyers On Demand.
- **2025:** Completed the acquisition of TrueLaw. The [official TrueLaw announcement](https://www.consilio.com/resource/consilio-acquires-truelaw-strengthening-position-as-worlds-largest-legal-data-ai-technology-provider) describes narrative AI, investigation tools, contradiction detection, and legal-language-model capabilities added to Consilio’s AI portfolio.

The UI should present these as sourced company milestones, not as an exhaustive legal transaction register. Each node should link to the relevant official announcement where available and show `Source: Consilio` plus the retrieval date.

### Andy Macdonald leadership card

The official [Consilio Executive Management page](https://www.consilio.com/about-consilio/executive-management) currently identifies **Andy Macdonald** as **Chief Executive Officer**. The page says he is responsible for strategic and operational initiatives, client satisfaction, and business growth; it describes more than 20 years of executive experience, his prior First Advantage leadership from 2003–2011 including President and CEO, and his earlier President/CEO role at Employee Health Programs within The First American Corporation.

Use that page as the primary source for the card. The [2023 interview with Andy Macdonald](https://www.adammendler.com/blog/andy-macdonald/) may be used as a secondary editorial source for approved leadership quotes or career context, but it should not override the official title/biography. The app should use the official portrait or an explicitly approved company asset; do not use a scraped third-party headshot by default.

### Market and competitor evidence

Public research confirms that the market is fragmented and that vendor categories overlap. The [2025 Annual Report filing from CS Disco](https://www.sec.gov/Archives/edgar/data/1625641/000162564126000044/law-20251231.htm) lists Consilio, Epiq, and KLDiscovery among legal-services-provider competitors and separately identifies software/cloud competitors including Relativity, Nuix, OpenText, Everlaw, and Reveal. This supports the planned competitor taxonomy, but it does **not** provide a comparable market-share percentage for Consilio.

For market context, the [Fortune Business Insights eDiscovery report](https://www.fortunebusinessinsights.com/industry-reports/ediscovery-market-101503) reports North America at **39.41% of global eDiscovery market share in 2025** in its published forecast taxonomy. The [Cascadia Capital Legal, Compliance & Tech Industry Report](https://www.cascadiacapital.com/wp-content/uploads/Cascadia-Legal-Compliance-Tech-Industry-Report-2024.pdf) provides another public industry benchmark and reports North America at approximately **39% of the global eDiscovery market in 2023**. These figures are market-level/regional benchmarks, not Consilio’s vendor share.

The public [IDC MarketScape landing page hosted by Relativity](https://resources.relativity.com/2025-idc-marketscape-ediscovery-software-relativity-landing-page.html) can be used as a source for vendor assessment context, but it is vendor-hosted and should be labeled accordingly. It should not be used as an independent market-share denominator without access to the underlying IDC report and methodology.

The Technology Intelligence page must therefore use three distinct metric types:

1. **Market benchmark:** total market size, geography, period, and source.
2. **Vendor evidence:** independently sourced vendor revenue, customer, deployment, or analyst data where the denominator is explicit.
3. **Consilio internal share:** only if an approved internal dataset is supplied; otherwise show `Not publicly available` rather than fabricating a percentage.

Every chart must show the metric type, denominator, period, source, confidence, and whether the figure is a company claim, independent estimate, or internal measure. Avoid combining service-provider revenue share with software-platform share in a single chart.

### Competitor and product imagery

For competitors, prefer official brand media kits or official websites and store the source URL/license note in the asset manifest. Where no approved logo is available, use a neutral generated SVG monogram rather than copying a protected image. This keeps the UI complete without implying endorsement or using unverified assets.

### Research limitations

Consilio is privately held and the public sources reviewed do not expose a standardized, independently audited vendor-share table across Consilio, Epiq, KLDiscovery, Relativity, Nuix, OpenText, Everlaw, and other providers. The implementation must make that limitation visible in the UI and use a data-request placeholder for any future authoritative share dataset.

## Known prerequisites and decisions to resolve

1. **Resolved:** The final application name is **Consilio Gateway of Intelligence**.
2. **Resolved:** The Solution 360 product subsection is named **Product Atlas**; the full navigation label is **Solution 360 — Product Atlas**.
3. **Resolved:** Use `C:\CGI\CGI-UI\src\images\consilio_logo.png`. Competitor/client imagery should use official SVG/logo assets or approved public sources with attribution/fallbacks.
4. **Resolved for planning:** Public research confirms the official title **Andy Macdonald, Chief Executive Officer**. Use the official Consilio executive page as the primary biography source and obtain an approved portrait before publishing. Do not use third-party biography details as authoritative without review.
5. **Partially resolved:** Public sources are sufficient for Consilio’s history/acquisition timeline and market-level benchmarks, but not for a reliable, comparable vendor percentage for Consilio. The plan now defines a sourced proxy approach and explicitly requires “not publicly available” when a vendor denominator cannot be defended.
6. **Resolved:** Use a lightweight typed hash/query route adapter; do not add a router dependency unless implementation constraints make the adapter unsafe.
7. **Resolved:** Use browser microphone/speech APIs for a fully simulated/mock voice experience. No backend or production speech service is required in Phase 4. Provide a deterministic mock fallback when speech recognition is unsupported or permission is denied.
8. **Resolved:** Keep the current Atlas destination, `https://atlas.consilio.com`, and use external redirect behavior. Course completion remains local/demo state unless Atlas provides an approved synchronization contract later.

## Baseline note

The current checkout is a source-only prototype without an installed Vite executable in `node_modules`; `npm run build` therefore cannot be executed until dependencies are installed. No dependency or source implementation changes were made as part of this planning document.
