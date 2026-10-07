import {
  ClientRecord,
  CompetitorRecord,
  WorkflowStage,
  RoleRecord,
  InternalToolRecord,
  TechRadarItem,
  LearningModule,
  AssessmentQuestion,
  ContributorSubmission,
  AiSearchResult,
  CompanyTimelineItem,
  CompanyLeader,
  UnifiedWorkflowLayer
} from '../types';

export const SYNTHETIC_DATA_DISCLAIMER = "Notice: All client names, financial figures, metrics, and case statistics in this prototype are synthetic demo records designed for operational prototyping.";

const CONSILIO_EVIDENCE = (sourceName: string, sourceUrl: string): { sourceName: string; sourceUrl: string; retrievedAt: string; freshnessState: 'Fresh'; confidence: 'High'; } => ({
  sourceName,
  sourceUrl,
  retrievedAt: '2026-10-08',
  freshnessState: 'Fresh',
  confidence: 'High'
});

export const CONSILIO_LEADERSHIP: CompanyLeader = {
  name: 'Andy Macdonald',
  title: 'Chief Executive Officer',
  biography: 'Andy Macdonald serves as Chief Executive Officer of Consilio, leading global strategy, enterprise operational growth, client engagement, and technological innovation. Under his leadership, Consilio has evolved from an e-discovery pioneer into the world’s leading provider of legal technology, enterprise data, and flexible legal talent solutions.',
  highlights: ['Former First Advantage President & CEO', 'Growth and integration leadership', 'Based in Washington, D.C.'],
  priorLeadership: ['President & Chief Executive Officer, First Advantage (2003–2011)', 'President & CEO, Employee Health Programs, The First American Corporation', 'Executive leadership across multi-jurisdictional compliance and corporate operations'],
  strategicPillars: ['Unified global delivery under guaranteed defensible quality SLAs', 'Proprietary software innovation through Sightline and Complete Data with zero third-party software markups', 'Client-first partnership across AmLaw 100 law firms and Fortune 500 corporate legal departments'],
  leadershipInsights: ['Scale with defensibility: growth is paired with repeatable quality controls and an auditable delivery model.', 'Integrate capability, not just companies: acquisitions are connected into one client-facing operating system.', 'Keep technology close to the client: product innovation is framed around faster, clearer legal decisions.'],
  portraitUrl: '/src/images/andy_mcdonald_photo.jpg',
  evidence: CONSILIO_EVIDENCE('Consilio Executive Management', 'https://www.consilio.com/about-consilio/executive-management')
};

export const CONSILIO_TIMELINE: CompanyTimelineItem[] = [
    { phase: 'Phase 1 · Foundations & Global Roots', year: '2000–2002', title: 'First Advantage Litigation Consulting is founded', summary: 'The company begins as a forensics consultancy for multinational corporate clients navigating early Big Data and electronically stored information (ESI) challenges.', capability: 'Forensics & ESI', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/en-ca/about') },
    { phase: 'Phase 1 · Foundations & Global Roots', year: '2005', title: 'Global RPM launches', summary: 'A breakthrough proprietary web-based review technology launches alongside secure data hosting, creating a scalable foundation for modern eDiscovery.', capability: 'Review technology', evidence: CONSILIO_EVIDENCE('Consilio history', 'https://www.zippia.com/consilio-careers-1448449/history/') },
    { phase: 'Phase 1 · Foundations & Global Roots', year: '2006–2010', title: 'Follow-the-sun operations take shape', summary: 'Consilio establishes its primary operations hub in India for 24/7 delivery and expands across Europe and Asia.', capability: 'Global delivery', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/en-ca/about') },
    { phase: 'Phase 1 · Foundations & Global Roots', year: '2006–2010', title: 'True Data Partners joins the platform', summary: 'The acquisition adds a multilingual document-review data-processing engine to the growing technology stack.', capability: 'Strategic technology', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/en-ca/about') },
    { phase: 'Phase 1 · Foundations & Global Roots', year: '2013', title: 'The Consilio brand is born', summary: 'First Advantage Litigation Consulting formally rebrands as Consilio, uniting the company around a global legal technology identity.', capability: 'Brand & platform', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/en-ca/about') },
    { phase: 'Phase 2 · Private Equity Spurs Expansion', year: '2015', title: 'Separation and strategic backing', summary: 'Consilio separates from First Advantage and secures Shamrock Capital Advisors as its lead private equity investor.', capability: 'Capital & operating model', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') },
    { phase: 'Phase 2 · Private Equity Spurs Expansion', year: '2015', title: 'Huron Legal expands advisory reach', summary: 'The acquisition of Huron Consulting Group’s legal consulting arm deepens Consilio’s corporate legal advisory footprint.', capability: 'Legal advisory', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') },
    { phase: 'Phase 2 · Private Equity Spurs Expansion', year: '2018', title: 'The megamerger with Advanced Discovery', summary: 'GI Partners acquires Consilio and immediately combines it with Advanced Discovery, creating a global #2 eDiscovery provider with 2,500+ employees across 11 countries.', capability: 'Global eDiscovery', evidence: CONSILIO_EVIDENCE('GI Partners', 'https://www.gipartners.com/news/gi-partners-announces-completion-of-consilio-acquisition-and-merger-with-advanced-discovery') },
    { phase: 'Phase 2 · Private Equity Spurs Expansion', year: 'Late 2018', title: 'DiscoverReady joins the enterprise portfolio', summary: 'The acquisition strengthens enterprise legal solutions and adds complementary client relationships and delivery capability.', capability: 'Enterprise solutions', evidence: CONSILIO_EVIDENCE('Harris Williams', 'https://www.harriswilliams.com/transactions/consilio') },
    { phase: 'Phase 3 · The Scale-Up & AI Era', year: 'April 2021', title: 'Stone Point and Xact Data Discovery', summary: 'GI Partners sells Consilio to funds managed by Stone Point Capital; the concurrent XDD merger takes the combined headcount beyond 4,000 globally.', capability: 'Scale & integration', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') },
    { phase: 'Phase 3 · The Scale-Up & AI Era', year: 'October 2021', title: 'Special Counsel, D4 and EQ expand the footprint', summary: 'Consilio acquires the legal consulting and eDiscovery units of Special Counsel from Adecco Group, including D4 and EQ.', capability: 'Flexible legal services', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') },
    { phase: 'Phase 3 · The Scale-Up & AI Era', year: 'Late 2021', title: 'Legility extends managed legal talent', summary: 'The Legility acquisition expands flexible legal talent, enterprise outsourcing, and managed services capabilities.', capability: 'Managed services', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') },
    { phase: 'Phase 3 · The Scale-Up & AI Era', year: '2022–2024', title: 'India becomes a delivery engine', summary: 'Infrastructure expands across Gurgaon, Bangalore, and Hyderabad, establishing India as the base for more than 45% of the workforce.', capability: 'Delivery infrastructure', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') },
    { phase: 'Phase 3 · The Scale-Up & AI Era', year: 'June 2025', title: 'TrueLaw brings the AI leap', summary: 'The Seattle-based advanced AI legal research and narrative investigation platform joins Consilio, strengthening the Aurora enterprise cloud platform.', capability: 'Legal AI', evidence: CONSILIO_EVIDENCE('Consilio TrueLaw acquisition', 'https://www.consilio.com/resource/consilio-acquires-truelaw-strengthening-position-as-worlds-largest-legal-data-ai-technology-provider') },
    { phase: 'Phase 3 · The Scale-Up & AI Era', year: '2026', title: 'A 4,600+ person AI-enabled enterprise', summary: 'Consilio operates at global scale and develops generative-AI managed legal workflows through strategic partnerships including Wordsmith and Eudia.', capability: 'AI-enabled workflows', evidence: CONSILIO_EVIDENCE('Consilio About', 'https://www.consilio.com/about') }
  ];

export const UNIFIED_WORKFLOW_LAYERS: UnifiedWorkflowLayer[] = [
  { id: 'system', name: 'System workflow', summary: 'How a matter moves from signal to defensible work product.', nodes: [
      { id: 'intake', label: 'Intake & scope', description: 'Qualify the matter, custodians, jurisdictions, and outcome.', metric: '24h target', owner: 'Matter Lead', tools: ['Complete Data', 'Atlas'], subflowStages: ['Identification & Preservation'] },
      { id: 'preserve', label: 'Preserve & collect', description: 'Protect evidence, establish chain of custody, and collect across sources.', metric: '99.9% custody', owner: 'Forensics Lead', tools: ['Nuix', 'EnCase'], subflowStages: ['Identification & Preservation', 'Forensic Collection'] },
      { id: 'delivery', label: 'Discover to deliver', description: 'Move evidence through collection, processing, review, and production.', metric: '6 stages', owner: 'Delivery Director', tools: ['Sightline', 'RelativityOne'], subflowStages: ['Forensic Collection', 'Ingestion & Processing', 'Analysis & ECA', 'Managed Review', 'Production'] },
      { id: 'quality', label: 'Quality & defensibility', description: 'Validate decisions, audit handoffs, and close the matter with confidence.', metric: '3 audit gates', owner: 'QC Lead', tools: ['Sightline', 'Atlas'], subflowStages: ['Analysis & ECA', 'Managed Review', 'Production'] }
  ] },
  { id: 'business', name: 'Business workflow', summary: 'Where value, revenue, risk, and client decisions move.', nodes: [
      { id: 'opportunity', label: 'Opportunity signal', description: 'Identify whitespace, renewal risk, and next-best service actions.', metric: '$8.2M whitespace', owner: 'Account Executive', tools: ['Gateway', 'Client CRM'], subflowStages: ['Account Health', 'QBR', 'Cross-sell'] },
      { id: 'plan', label: 'Account plan', description: 'Turn client context into an aligned coverage plan for partners and delivery.', metric: '15 accounts', owner: 'Client Partner', tools: ['Gateway', 'Atlas'], subflowStages: ['Account Health', 'QBR'] },
      { id: 'value', label: 'Value realization', description: 'Connect matter outcomes to margin, retention, and client proof.', metric: '3.4× stickiness', owner: 'Practice Leader', tools: ['Finance Ledger', 'QBR Workspace'], subflowStages: ['Delivery KPI', 'Outcome Review', 'Renewal'] },
      { id: 'renewal', label: 'Renewal & expansion', description: 'Coordinate executive proof, risk mitigation, and next-best service motions.', metric: '92% target', owner: 'Growth Lead', tools: ['QBR Workspace', 'Gateway'], subflowStages: ['Outcome Review', 'Renewal'] }
  ] },
  { id: 'application', name: 'Application workflow', summary: 'The applications that orchestrate each handoff and decision.', nodes: [
      { id: 'capture', label: 'Capture & stage', description: 'Connect enterprise sources and stage evidence in controlled workspaces.', metric: '18 connectors', owner: 'Data Operations', tools: ['Complete Data', 'Nuix', 'Cellebrite'], subflowStages: ['Forensic Collection', 'Ingestion & Processing'] },
      { id: 'process', label: 'Process & enrich', description: 'Normalize, de-duplicate, extract, and prepare evidence for analysis.', metric: '1.8PB indexed', owner: 'Processing Lead', tools: ['Nuix', 'Complete Data'], subflowStages: ['Ingestion & Processing', 'Analysis & ECA'] },
      { id: 'review', label: 'Review & decide', description: 'Surface relevance, privilege, and production decisions with auditability.', metric: '84% adoption', owner: 'Review Lead', tools: ['Sightline', 'Brainspace'], subflowStages: ['Analysis & ECA', 'Managed Review', 'Production'] },
      { id: 'report', label: 'Report & orchestrate', description: 'Make matter progress visible to counsel, clients, and account leaders.', metric: 'Live signal', owner: 'Matter Lead', tools: ['Atlas', 'Gateway'], subflowStages: ['Managed Review', 'Production'] }
  ] },
  { id: 'data', name: 'Data workflow', summary: 'How evidence is preserved, transformed, governed, and returned.', nodes: [
      { id: 'lineage', label: 'Preserve & transform', description: 'Maintain chain of custody, hashes, metadata, and processing lineage.', metric: 'SHA-256 verified', owner: 'Forensics Specialist', tools: ['EnCase', 'Nuix'], subflowStages: ['Identification & Preservation', 'Forensic Collection', 'Ingestion & Processing'] },
      { id: 'govern', label: 'Govern & protect', description: 'Apply retention, access, privilege, and jurisdictional controls before review.', metric: '4 control gates', owner: 'Data Governance', tools: ['Atlas', 'Complete Data'], subflowStages: ['Identification & Preservation', 'Ingestion & Processing'] },
      { id: 'insight', label: 'Analyze & produce', description: 'Turn governed evidence into defensible insight and production-ready output.', metric: '3 audit gates', owner: 'QC Lead', tools: ['Sightline', 'RelativityOne'], subflowStages: ['Analysis & ECA', 'Managed Review', 'Production'] },
      { id: 'return', label: 'Return & learn', description: 'Close the loop with client-ready outputs, learnings, and reusable playbooks.', metric: 'Continuous loop', owner: 'Practice Leader', tools: ['Atlas', 'Gateway'], subflowStages: ['Production'] }
  ] }
];

export const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: 'apex-legal',
    name: 'Apex Legal Group',
    tier: 'Enterprise',
    region: 'North America',
    industry: 'AmLaw 100 Litigation',
    accountOwner: 'Sarah Mitchell',
    status: 'Attention',
    annualRevenue: 4820000,
    revenueSharePercent: 6.8,
    yoyGrowth: -14.2,
    qoqGrowth: -3.8,
    services: ['Review'],
    serviceMix: [
      { name: 'Review', sharePercent: 100, activeMatters: 6 }
    ],
    activeMattersCount: 6,
    documentsProcessedGB: 1840,
    healthScore: 54,
    churnRisk: 'High',
    nextBestAction: 'Schedule executive QBR; bundle Sightline Forensics to eliminate single-service review dependency.',
    whitespaceOpportunity: 'Forensics & Enterprise Collection ($1.4M estimated whitespace)',
    competitorExposure: 'RelativityOne & Epiq actively courting IP Litigation practice',
    clientSince: '2019',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1350000 },
      { quarter: 'Q1 2026', revenue: 1220000 },
      { quarter: 'Q2 2026', revenue: 1150000 },
      { quarter: 'Q3 2026', revenue: 1100000 },
    ],
    reviews: [
      {
        author: 'Marcus Vance',
        role: 'Senior Litigation Partner',
        date: '2026-08-14',
        rating: 3,
        comment: 'Review team quality is solid, but lack of integrated collection workflow forces us to use a separate vendor for custodial imaging.'
      },
      {
        author: 'Elena Rostova',
        role: 'Practice Group Director',
        date: '2026-04-20',
        rating: 4,
        comment: 'Sightline review speed is commendable, but pricing transparency on ad-hoc privilege review could be improved.'
      }
    ]
  },
  {
    id: 'northstar-holdings',
    name: 'Northstar Holdings',
    tier: 'Enterprise',
    region: 'North America',
    industry: 'Financial Services & PE',
    accountOwner: 'David Reynolds',
    status: 'Watch',
    annualRevenue: 3450000,
    revenueSharePercent: 4.9,
    yoyGrowth: -9.1,
    qoqGrowth: -2.1,
    services: ['Processing'],
    serviceMix: [
      { name: 'Processing', sharePercent: 100, activeMatters: 4 }
    ],
    activeMattersCount: 4,
    documentsProcessedGB: 3200,
    healthScore: 61,
    churnRisk: 'Medium',
    nextBestAction: 'Introduce Managed Services multi-year SLA to protect data processing footprint.',
    whitespaceOpportunity: 'Managed Services & Managed Review ($950k whitespace)',
    competitorExposure: 'Lighthouse proposing unified SaaS processing model',
    clientSince: '2021',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 920000 },
      { quarter: 'Q1 2026', revenue: 880000 },
      { quarter: 'Q2 2026', revenue: 840000 },
      { quarter: 'Q3 2026', revenue: 810000 },
    ],
    reviews: [
      {
        author: 'Jonathan Cole',
        role: 'VP Legal Operations',
        date: '2026-07-09',
        rating: 3,
        comment: 'Processing turnaround is dependable. However, we are reviewing whether an all-in-one managed service contract saves cost.'
      }
    ]
  },
  {
    id: 'meridian-corp',
    name: 'Meridian Corp',
    tier: 'Strategic',
    region: 'EMEA',
    industry: 'Aerospace & Industrial',
    accountOwner: 'Camilla Dupont',
    status: 'Watch',
    annualRevenue: 2890000,
    revenueSharePercent: 4.1,
    yoyGrowth: -6.4,
    qoqGrowth: -1.4,
    services: ['Forensics'],
    serviceMix: [
      { name: 'Forensics', sharePercent: 100, activeMatters: 3 }
    ],
    activeMattersCount: 3,
    documentsProcessedGB: 890,
    healthScore: 65,
    churnRisk: 'Medium',
    nextBestAction: 'Deliver Cross-border Regulatory Review pilot for upcoming transatlantic compliance audit.',
    whitespaceOpportunity: 'Managed Review & Brainspace Concept Analytics ($1.2M whitespace)',
    competitorExposure: 'KLDiscovery expanding European forensic labs',
    clientSince: '2020',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 760000 },
      { quarter: 'Q1 2026', revenue: 730000 },
      { quarter: 'Q2 2026', revenue: 710000 },
      { quarter: 'Q3 2026', revenue: 690000 },
    ],
    reviews: [
      {
        author: 'Dr. Henrik Lind',
        role: 'General Counsel EMEA',
        date: '2026-06-18',
        rating: 4,
        comment: 'Forensic investigators are best-in-class for mobile device and cloud container acquisitions.'
      }
    ]
  },
  {
    id: 'sterling-moss',
    name: 'Sterling & Moss LLP',
    tier: 'Enterprise',
    region: 'North America',
    industry: 'AmLaw 50 Corporate Defense',
    accountOwner: 'Sarah Mitchell',
    status: 'Growth',
    annualRevenue: 7200000,
    revenueSharePercent: 10.2,
    yoyGrowth: 18.4,
    qoqGrowth: 4.8,
    services: ['Review', 'Processing', 'Forensics', 'Advisory'],
    serviceMix: [
      { name: 'Review', sharePercent: 55, activeMatters: 12 },
      { name: 'Processing', sharePercent: 25, activeMatters: 8 },
      { name: 'Forensics', sharePercent: 12, activeMatters: 4 },
      { name: 'Advisory', sharePercent: 8, activeMatters: 2 }
    ],
    activeMattersCount: 14,
    documentsProcessedGB: 9400,
    healthScore: 94,
    churnRisk: 'Low',
    nextBestAction: 'Deploy GenAI Deposition Prep pilot on pending multidistrict antitrust matter.',
    whitespaceOpportunity: 'Advanced Generative AI Privilege Logging ($600k expansion)',
    competitorExposure: 'Low; multi-year sole provider master services agreement signed',
    clientSince: '2017',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1650000 },
      { quarter: 'Q1 2026', revenue: 1780000 },
      { quarter: 'Q2 2026', revenue: 1840000 },
      { quarter: 'Q3 2026', revenue: 1930000 },
    ],
    reviews: [
      {
        author: 'Rachel Sterling',
        role: 'Managing Partner',
        date: '2026-09-02',
        rating: 5,
        comment: 'Consilio’s integrated Sightline ecosystem has reduced our review cost by 32% across our class action docket.'
      }
    ]
  },
  {
    id: 'vanguard-biotech',
    name: 'Vanguard BioTech',
    tier: 'Enterprise',
    region: 'North America',
    industry: 'Healthcare & Pharma',
    accountOwner: 'David Reynolds',
    status: 'Active',
    annualRevenue: 5100000,
    revenueSharePercent: 7.2,
    yoyGrowth: 5.6,
    qoqGrowth: 1.2,
    services: ['Review', 'Processing'],
    serviceMix: [
      { name: 'Review', sharePercent: 65, activeMatters: 7 },
      { name: 'Processing', sharePercent: 35, activeMatters: 5 }
    ],
    activeMattersCount: 8,
    documentsProcessedGB: 5120,
    healthScore: 82,
    churnRisk: 'Low',
    nextBestAction: 'Demonstrate automated FDA 21 CFR Part 11 validation pipeline.',
    whitespaceOpportunity: 'Forensic Clinical Data Archival ($800k whitespace)',
    competitorExposure: 'Moderate from Epiq Pharma solutions team',
    clientSince: '2022',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1240000 },
      { quarter: 'Q1 2026', revenue: 1260000 },
      { quarter: 'Q2 2026', revenue: 1290000 },
      { quarter: 'Q3 2026', revenue: 1310000 },
    ],
    reviews: [
      {
        author: 'Arun Patel',
        role: 'Head of Regulatory Affairs',
        date: '2026-05-30',
        rating: 4,
        comment: 'Fast processing turnaround on clinical investigator notes.'
      }
    ]
  },
  {
    id: 'horizon-health',
    name: 'Horizon Health Partners',
    tier: 'Strategic',
    region: 'North America',
    industry: 'Healthcare & Hospital Systems',
    accountOwner: 'Camilla Dupont',
    status: 'Active',
    annualRevenue: 3880000,
    revenueSharePercent: 5.5,
    yoyGrowth: 7.9,
    qoqGrowth: 2.4,
    services: ['Processing', 'Forensics', 'Review'],
    serviceMix: [
      { name: 'Review', sharePercent: 40, activeMatters: 5 },
      { name: 'Processing', sharePercent: 40, activeMatters: 4 },
      { name: 'Forensics', sharePercent: 20, activeMatters: 2 }
    ],
    activeMattersCount: 6,
    documentsProcessedGB: 2900,
    healthScore: 86,
    churnRisk: 'Low',
    nextBestAction: 'Expand HIPAA redaction automation across Medicare inquiry response.',
    whitespaceOpportunity: 'Advisory on Cloud EHR data extraction ($450k)',
    competitorExposure: 'RelativityOne Health direct sales outreach',
    clientSince: '2023',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 920000 },
      { quarter: 'Q1 2026', revenue: 960000 },
      { quarter: 'Q2 2026', revenue: 990000 },
      { quarter: 'Q3 2026', revenue: 1010000 },
    ],
    reviews: []
  },
  {
    id: 'cobalt-defense',
    name: 'Cobalt Defense Systems',
    tier: 'Enterprise',
    region: 'North America',
    industry: 'Aerospace & Defense',
    accountOwner: 'Sarah Mitchell',
    status: 'Growth',
    annualRevenue: 6400000,
    revenueSharePercent: 9.1,
    yoyGrowth: 22.0,
    qoqGrowth: 6.5,
    services: ['Forensics', 'Processing', 'Review', 'Managed Services'],
    serviceMix: [
      { name: 'Managed Services', sharePercent: 45, activeMatters: 6 },
      { name: 'Forensics', sharePercent: 25, activeMatters: 4 },
      { name: 'Review', sharePercent: 20, activeMatters: 4 },
      { name: 'Processing', sharePercent: 10, activeMatters: 3 }
    ],
    activeMattersCount: 11,
    documentsProcessedGB: 7800,
    healthScore: 92,
    churnRisk: 'Low',
    nextBestAction: 'Renew annual ITAR-compliant private cloud tenancy agreement.',
    whitespaceOpportunity: 'Expansion into classified subcontract matters ($1.1M)',
    competitorExposure: 'Very low; specialized FedRAMP/ITAR security clearances',
    clientSince: '2018',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1450000 },
      { quarter: 'Q1 2026', revenue: 1550000 },
      { quarter: 'Q2 2026', revenue: 1650000 },
      { quarter: 'Q3 2026', revenue: 1750000 },
    ],
    reviews: []
  },
  {
    id: 'omnicom-legal',
    name: 'Omnicom Global Legal',
    tier: 'Strategic',
    region: 'EMEA',
    industry: 'Media & Telecommunications',
    accountOwner: 'Camilla Dupont',
    status: 'Active',
    annualRevenue: 4120000,
    revenueSharePercent: 5.8,
    yoyGrowth: 3.4,
    qoqGrowth: 0.8,
    services: ['Review', 'Processing'],
    serviceMix: [
      { name: 'Review', sharePercent: 70, activeMatters: 6 },
      { name: 'Processing', sharePercent: 30, activeMatters: 4 }
    ],
    activeMattersCount: 7,
    documentsProcessedGB: 3950,
    healthScore: 78,
    churnRisk: 'Low',
    nextBestAction: 'Demonstrate multi-language European sentiment clustering with Brainspace.',
    whitespaceOpportunity: 'Cross-border GDPR compliance audit workflow ($520k)',
    competitorExposure: 'Epiq London office pitching consolidated rates',
    clientSince: '2021',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1010000 },
      { quarter: 'Q1 2026', revenue: 1020000 },
      { quarter: 'Q2 2026', revenue: 1040000 },
      { quarter: 'Q3 2026', revenue: 1050000 },
    ],
    reviews: []
  },
  {
    id: 'summit-peak-energy',
    name: 'Summit Peak Energy',
    tier: 'Mid-Market',
    region: 'North America',
    industry: 'Oil, Gas & Clean Utilities',
    accountOwner: 'David Reynolds',
    status: 'Watch',
    annualRevenue: 2150000,
    revenueSharePercent: 3.0,
    yoyGrowth: -4.5,
    qoqGrowth: -1.0,
    services: ['Processing', 'Forensics'],
    serviceMix: [
      { name: 'Processing', sharePercent: 60, activeMatters: 3 },
      { name: 'Forensics', sharePercent: 40, activeMatters: 2 }
    ],
    activeMattersCount: 4,
    documentsProcessedGB: 1850,
    healthScore: 68,
    churnRisk: 'Medium',
    nextBestAction: 'Pitch Sightline automated environmental regulatory discovery pack.',
    whitespaceOpportunity: 'Managed Review for EPA investigation ($650k)',
    competitorExposure: 'KLDiscovery pitching regional Houston support',
    clientSince: '2022',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 560000 },
      { quarter: 'Q1 2026', revenue: 540000 },
      { quarter: 'Q2 2026', revenue: 530000 },
      { quarter: 'Q3 2026', revenue: 520000 },
    ],
    reviews: []
  },
  {
    id: 'aethelgard-financial',
    name: 'Aethelgard Financial',
    tier: 'Enterprise',
    region: 'EMEA',
    industry: 'Investment Banking & FinTech',
    accountOwner: 'Camilla Dupont',
    status: 'Growth',
    annualRevenue: 5900000,
    revenueSharePercent: 8.4,
    yoyGrowth: 15.2,
    qoqGrowth: 3.9,
    services: ['Review', 'Processing', 'Forensics', 'Managed Services'],
    serviceMix: [
      { name: 'Review', sharePercent: 50, activeMatters: 8 },
      { name: 'Managed Services', sharePercent: 30, activeMatters: 5 },
      { name: 'Processing', sharePercent: 12, activeMatters: 3 },
      { name: 'Forensics', sharePercent: 8, activeMatters: 2 }
    ],
    activeMattersCount: 10,
    documentsProcessedGB: 6800,
    healthScore: 89,
    churnRisk: 'Low',
    nextBestAction: 'Deliver Bloomberg chat & WhatsApp message normalization case study.',
    whitespaceOpportunity: 'Off-channel communications compliance surveillance ($900k)',
    competitorExposure: 'Low; multi-jurisdiction SLA across London and Frankfurt',
    clientSince: '2020',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1380000 },
      { quarter: 'Q1 2026', revenue: 1450000 },
      { quarter: 'Q2 2026', revenue: 1510000 },
      { quarter: 'Q3 2026', revenue: 1560000 },
    ],
    reviews: []
  },
  {
    id: 'pinnacle-mobility',
    name: 'Pinnacle Mobility Group',
    tier: 'Mid-Market',
    region: 'APAC',
    industry: 'Automotive & Autonomous Systems',
    accountOwner: 'Sarah Mitchell',
    status: 'Active',
    annualRevenue: 1980000,
    revenueSharePercent: 2.8,
    yoyGrowth: 11.0,
    qoqGrowth: 2.7,
    services: ['Forensics', 'Review'],
    serviceMix: [
      { name: 'Review', sharePercent: 55, activeMatters: 3 },
      { name: 'Forensics', sharePercent: 45, activeMatters: 2 }
    ],
    activeMattersCount: 4,
    documentsProcessedGB: 1420,
    healthScore: 79,
    churnRisk: 'Low',
    nextBestAction: 'Expand Japanese & Korean translation review workflows.',
    whitespaceOpportunity: 'Ingestion pipeline for CAN bus telemetry logs ($400k)',
    competitorExposure: 'Relativity APAC partner network',
    clientSince: '2024',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 470000 },
      { quarter: 'Q1 2026', revenue: 490000 },
      { quarter: 'Q2 2026', revenue: 505000 },
      { quarter: 'Q3 2026', revenue: 515000 },
    ],
    reviews: []
  },
  {
    id: 'nexagen-pharma',
    name: 'NexaGen Pharma',
    tier: 'Strategic',
    region: 'North America',
    industry: 'Healthcare & Pharma',
    accountOwner: 'David Reynolds',
    status: 'Active',
    annualRevenue: 3750000,
    revenueSharePercent: 5.3,
    yoyGrowth: 8.5,
    qoqGrowth: 2.0,
    services: ['Processing', 'Review'],
    serviceMix: [
      { name: 'Review', sharePercent: 60, activeMatters: 5 },
      { name: 'Processing', sharePercent: 40, activeMatters: 4 }
    ],
    activeMattersCount: 6,
    documentsProcessedGB: 3400,
    healthScore: 81,
    churnRisk: 'Low',
    nextBestAction: 'Introduce patent litigation prior art concept search using Sightline.',
    whitespaceOpportunity: 'Complete Custodial Archive Forensics ($550k)',
    competitorExposure: 'Epiq life sciences vertical',
    clientSince: '2021',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 900000 },
      { quarter: 'Q1 2026', revenue: 930000 },
      { quarter: 'Q2 2026', revenue: 950000 },
      { quarter: 'Q3 2026', revenue: 970000 },
    ],
    reviews: []
  },
  {
    id: 'crestview-capital',
    name: 'Crestview Capital',
    tier: 'Mid-Market',
    region: 'North America',
    industry: 'Private Equity & Real Estate',
    accountOwner: 'Sarah Mitchell',
    status: 'Attention',
    annualRevenue: 1650000,
    revenueSharePercent: 2.3,
    yoyGrowth: -11.5,
    qoqGrowth: -3.2,
    services: ['Review'],
    serviceMix: [
      { name: 'Review', sharePercent: 100, activeMatters: 2 }
    ],
    activeMattersCount: 2,
    documentsProcessedGB: 950,
    healthScore: 56,
    churnRisk: 'High',
    nextBestAction: 'Deliver executive briefing on M&A due diligence acceleration pipeline.',
    whitespaceOpportunity: 'Processing & Forensics onboarding ($700k)',
    competitorExposure: 'Everlaw offering discounted cloud review pilot',
    clientSince: '2023',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 450000 },
      { quarter: 'Q1 2026', revenue: 420000 },
      { quarter: 'Q2 2026', revenue: 400000 },
      { quarter: 'Q3 2026', revenue: 380000 },
    ],
    reviews: []
  },
  {
    id: 'thorne-bradley',
    name: 'Thorne & Bradley LLP',
    tier: 'Strategic',
    region: 'North America',
    industry: 'AmLaw 200 White Collar Defense',
    accountOwner: 'Camilla Dupont',
    status: 'Active',
    annualRevenue: 4300000,
    revenueSharePercent: 6.1,
    yoyGrowth: 6.2,
    qoqGrowth: 1.5,
    services: ['Review', 'Processing', 'Forensics'],
    serviceMix: [
      { name: 'Review', sharePercent: 50, activeMatters: 5 },
      { name: 'Processing', sharePercent: 30, activeMatters: 4 },
      { name: 'Forensics', sharePercent: 20, activeMatters: 3 }
    ],
    activeMattersCount: 7,
    documentsProcessedGB: 4100,
    healthScore: 84,
    churnRisk: 'Low',
    nextBestAction: 'Demo encrypted custodian vault for high-profile executive investigations.',
    whitespaceOpportunity: 'Trial support and high-speed production ($380k)',
    competitorExposure: 'Moderate from KLDiscovery',
    clientSince: '2020',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 1040000 },
      { quarter: 'Q1 2026', revenue: 1060000 },
      { quarter: 'Q2 2026', revenue: 1090000 },
      { quarter: 'Q3 2026', revenue: 1110000 },
    ],
    reviews: []
  },
  {
    id: 'valiant-aerospace',
    name: 'Valiant Aerospace',
    tier: 'Strategic',
    region: 'EMEA',
    industry: 'Aerospace & Industrial',
    accountOwner: 'David Reynolds',
    status: 'Active',
    annualRevenue: 3100000,
    revenueSharePercent: 4.4,
    yoyGrowth: 9.3,
    qoqGrowth: 2.2,
    services: ['Processing', 'Forensics', 'Review'],
    serviceMix: [
      { name: 'Processing', sharePercent: 40, activeMatters: 4 },
      { name: 'Forensics', sharePercent: 35, activeMatters: 3 },
      { name: 'Review', sharePercent: 25, activeMatters: 2 }
    ],
    activeMattersCount: 5,
    documentsProcessedGB: 2800,
    healthScore: 83,
    churnRisk: 'Low',
    nextBestAction: 'Deliver CAD drawing indexing capability presentation.',
    whitespaceOpportunity: 'Managed Services multi-year agreement ($620k)',
    competitorExposure: 'Lighthouse UK targeting European aerospace dockets',
    clientSince: '2022',
    quarterlyRevenue: [
      { quarter: 'Q4 2025', revenue: 740000 },
      { quarter: 'Q1 2026', revenue: 770000 },
      { quarter: 'Q2 2026', revenue: 790000 },
      { quarter: 'Q3 2026', revenue: 800000 },
    ],
    reviews: []
  }
];

export const INITIAL_COMPETITORS: CompetitorRecord[] = [
  {
    id: 'relativity',
    name: 'Relativity',
    marketPosition: 'Market Leader',
    marketSharePct: 34.5,
    analystRanking: 'Gartner Magic Quadrant Leader (Pure Software Platform)',
    strengths: [
      'De-facto industry standard review software ecosystem with global partner network',
      'Extensive third-party developer marketplace and developer SDKs',
      'Massive legal brand recognition and courtroom attorney familiarity'
    ],
    weaknesses: [
      'Relies heavily on service partners; limited direct end-to-end full service managed staffing',
      'Escalating licensing costs on RelativityOne cloud compute and storage tiers',
      'Slower custom bespoke workflow delivery compared to full-service providers'
    ],
    keyOfferings: ['RelativityOne', 'Relativity Server', 'Relativity aiR for Review', 'Relativity Trace'],
    pricingModel: 'Subscription per GB/month + user seat fees + compute tiers',
    recentMoves: [
      { date: '2026-06-15', title: 'Launch of aiR 2.0 Priv and Case Strategy', impact: 'Puts direct pressure on manual privilege logging workflows' },
      { date: '2026-02-10', title: 'Global Cloud Tier Restructuring', impact: 'Increased baseline GB storage pricing by ~8%, creating client cost fatigue' }
    ],
    battlecardSummary: 'Position Consilio Sightline as an all-inclusive solution where clients avoid steep per-GB cloud software markups while gaining dedicated managed legal review teams.',
    capabilityGapScore: 12, // +12% net Consilio edge due to full-service managed services and forensics
    capabilities: [
      { capability: 'Processing Throughput', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Review Platform Maturity', consilioRating: 'Strong', competitorRating: 'Leading', differential: -1 },
      { capability: 'Forensic Collection Depth', consilioRating: 'Leading', competitorRating: 'Moderate', differential: 2 },
      { capability: 'Generative AI Capabilities', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Full Managed Legal Services', consilioRating: 'Leading', competitorRating: 'Limited', differential: 3 },
      { capability: 'Enterprise Security / ITAR', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 }
    ],
    swot: {
      strengths: ['Ubiquitous platform familiarity', 'Massive API ecosystem', 'Continuous SaaS updates'],
      weaknesses: ['High total cost of ownership', 'No native full-service review staffing', 'Partner channel conflict'],
      opportunities: ['Clients looking to consolidate software and staffing into one Consilio SLA'],
      threats: ['Aggressive generative AI feature rollouts undercutting custom advisory models']
    }
  },
  {
    id: 'epiq',
    name: 'Epiq',
    marketPosition: 'Challenger',
    marketSharePct: 22.8,
    analystRanking: 'IDC MarketScape Leader (Legal Process & Discovery Services)',
    strengths: [
      'Direct full-service competitor with global footprint across Americas, Europe, and Asia',
      'Deep bankruptcy, class action, and mass tort administration capabilities',
      'Strong cross-selling between corporate restructuring and litigation services'
    ],
    weaknesses: [
      'Complex legacy technology stack resulting from multiple historical acquisitions',
      'Inconsistent client experience across regional delivery centers',
      'Slower adoption of proprietary custom review acceleration platforms'
    ],
    keyOfferings: ['Epiq Service+', 'Epiq Discovery', 'Bankruptcy Administration', 'Mass Tort Solutions'],
    pricingModel: 'Hybrid: Per-matter hosting, hourly staffing rates, bundled managed services',
    recentMoves: [
      { date: '2026-05-22', title: 'Acquisition of European Regulatory Consulting Boutique', impact: 'Expands cross-border GDPR compliance capacity in Frankfurt and London' },
      { date: '2026-01-18', title: 'Rollout of Automated Redaction Portal', impact: 'Targeting mid-tier healthcare litigation accounts' }
    ],
    battlecardSummary: 'Emphasize Consilio’s unified Sightline platform architecture and proven quality control workflows over Epiq’s fragmented acquisition-based tooling.',
    capabilityGapScore: 8,
    capabilities: [
      { capability: 'Processing Throughput', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Review Platform Maturity', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Forensic Collection Depth', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 },
      { capability: 'Generative AI Capabilities', consilioRating: 'Strong', competitorRating: 'Moderate', differential: 1 },
      { capability: 'Full Managed Legal Services', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 },
      { capability: 'Enterprise Security / ITAR', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 }
    ],
    swot: {
      strengths: ['Massive global scale', 'Broad legal administration portfolio', 'Strong financial relationships'],
      weaknesses: ['Tech stack fragmentation', 'High delivery management overhead'],
      opportunities: ['Pitching clients frustrated by Epiq account turnover and billing complexity'],
      threats: ['Price discounting on mega-matters to secure market share']
    }
  },
  {
    id: 'kldiscovery',
    name: 'KLDiscovery',
    marketPosition: 'Legacy Incumbent',
    marketSharePct: 11.4,
    analystRanking: 'Gartner Notable Vendor / Global Data Recovery Specialist',
    strengths: [
      'Ontrack brand heritage provides gold-standard data recovery and legacy tape extraction',
      'Proprietary Nebula platform with multi-cloud deployment options',
      'Deep expertise in highly degraded or damaged physical storage media'
    ],
    weaknesses: [
      'High corporate debt burden impacting long-term R&D capital expenditure',
      'Smaller managed review bench compared to Consilio and Epiq',
      'Nebula platform has lower market familiarity among AmLaw 100 litigation counsel'
    ],
    keyOfferings: ['Nebula eDiscovery', 'Ontrack Data Recovery', 'Nebula Archive', 'Mobile Device Capture'],
    pricingModel: 'Hosting per GB + per-drive media recovery charges',
    recentMoves: [
      { date: '2026-04-12', title: 'Financial Restructuring and Debt Refinancing', impact: 'Stabilized balance sheet but curtailed aggressive M&A' },
      { date: '2026-03-01', title: 'Nebula Generative Assist Beta', impact: 'Early stage AI conceptual summaries launched' }
    ],
    battlecardSummary: 'Highlight Consilio’s superior financial stability, larger review attorney capacity, and proven Sightline intelligence capabilities when competing for multi-year enterprise accounts.',
    capabilityGapScore: 16,
    capabilities: [
      { capability: 'Processing Throughput', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Review Platform Maturity', consilioRating: 'Strong', competitorRating: 'Moderate', differential: 1 },
      { capability: 'Forensic Collection Depth', consilioRating: 'Leading', competitorRating: 'Leading', differential: 0 },
      { capability: 'Generative AI Capabilities', consilioRating: 'Strong', competitorRating: 'Moderate', differential: 1 },
      { capability: 'Full Managed Legal Services', consilioRating: 'Leading', competitorRating: 'Moderate', differential: 2 },
      { capability: 'Enterprise Security / ITAR', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 }
    ],
    swot: {
      strengths: ['Ontrack physical forensic heritage', 'Global laboratory network'],
      weaknesses: ['Financial leverage', 'Smaller legal review staffing bench'],
      opportunities: ['Win enterprise accounts seeking long-term stability and unified tech'],
      threats: ['Aggressive pricing on basic forensics and data restoration']
    }
  },
  {
    id: 'lighthouse',
    name: 'Lighthouse',
    marketPosition: 'Challenger',
    marketSharePct: 9.8,
    analystRanking: 'IDC Major Player (Microsoft 365 Discovery & Advisory Specialist)',
    strengths: [
      'Premier Microsoft 365 and Purview integration expertise and custom connectors',
      'Strong proprietary Lighthouse Prism AI document categorization models',
      'Reputation for high-end advisory in complex corporate tech migrations'
    ],
    weaknesses: [
      'Narrower physical forensics capability compared to Consilio’s global labs',
      'Premium pricing profile often limits competitiveness on cost-sensitive document reviews',
      'Smaller international footprint outside of the US and UK'
    ],
    keyOfferings: ['Lighthouse Prism', 'M365 Purview Advisory', 'Lighthouse Spectra', 'Managed Discovery'],
    pricingModel: 'SaaS subscription + consulting advisory retainers',
    recentMoves: [
      { date: '2026-07-01', title: 'Deepened Microsoft Copilot Security Partnership', impact: 'Offers joint corporate data hygiene audits' },
      { date: '2026-01-30', title: 'Prism GenAI Expansion', impact: 'Accelerated automated topic clustering in corporate internal investigations' }
    ],
    battlecardSummary: 'Counter Lighthouse’s Microsoft specialization by proving Consilio’s Complete Data platform supports multi-cloud, on-premise, mobile, and off-channel messaging at global scale.',
    capabilityGapScore: 6,
    capabilities: [
      { capability: 'Processing Throughput', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Review Platform Maturity', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Forensic Collection Depth', consilioRating: 'Leading', competitorRating: 'Moderate', differential: 2 },
      { capability: 'Generative AI Capabilities', consilioRating: 'Strong', competitorRating: 'Strong', differential: 0 },
      { capability: 'Full Managed Legal Services', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 },
      { capability: 'Enterprise Security / ITAR', consilioRating: 'Leading', competitorRating: 'Strong', differential: 1 }
    ],
    swot: {
      strengths: ['High-end Microsoft 365 consulting', 'Strong brand in corporate tech counsel'],
      weaknesses: ['Limited physical forensic footprint', 'Premium cost barrier'],
      opportunities: ['Deliver full-lifecycle support including global forensics and scalable managed review'],
      threats: ['Deepening corporate M365 vendor lock-in']
    }
  }
];

export const E_DISCOVERY_WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'stage-1',
    number: '01',
    name: 'Identification & Preservation',
    shortDesc: 'Scoping custodians, issuing legal holds, and securing data defensibility.',
    fullDesc: 'The initial foundational phase where potential sources of Electronically Stored Information (ESI) are identified, custodian interviews are executed, and binding legal hold notices are dispatched and tracked to prevent spoliation of evidence.',
    roles: [
      { role: 'Discovery Counsel / Lawyer', raci: 'A' },
      { role: 'Project Manager', raci: 'R' },
      { role: 'Digital Forensics Specialist', raci: 'C' },
      { role: 'Data Operations Engineer', raci: 'I' }
    ],
    toolsUsed: ['Consilio Complete Data', 'Legal Hold Portal', 'Custodian Directory Tracker'],
    primaryInputs: ['Complaint / Subpoena notice', 'Custodian org chart', 'IT architecture map'],
    primaryOutputs: ['Legal Hold audit log', 'Custodian scope document', 'Preservation manifest'],
    handoffs: 'Approved custodian scope passed to Digital Forensics for collection scheduling.',
    avgCycleTime: '3 - 7 Business Days',
    throughputMetric: 'Hold compliance rate: 98.4%',
    commonBottlenecks: [
      'Unresponsive business custodians',
      'Fragmented personal mobile device ownership (BYOD)',
      'Undocumented third-party SaaS applications'
    ]
  },
  {
    id: 'stage-2',
    number: '02',
    name: 'Forensic Collection',
    shortDesc: 'Targeted forensic imaging, cloud container extracts, and chain of custody.',
    fullDesc: 'Forensic specialists execute bitstream disk imaging, mobile device extractions, and remote API queries across Microsoft 365, Google Workspace, Slack, Teams, and enterprise ERP systems while strictly preserving cryptographic SHA-256 hash validation.',
    roles: [
      { role: 'Digital Forensics Specialist', raci: 'R' },
      { role: 'Discovery Counsel / Lawyer', raci: 'C' },
      { role: 'Project Manager', raci: 'A' },
      { role: 'Data Processor', raci: 'I' }
    ],
    toolsUsed: ['EnCase Forensic', 'Cellebrite UFED', 'Consilio Cloud Harvester', 'FTK Imager'],
    primaryInputs: ['Preservation manifest', 'Target custodian credentials / devices'],
    primaryOutputs: ['Forensic images (.E01 / .RAW)', 'Cryptographic hash manifests', 'Chain of custody receipts'],
    handoffs: 'Raw forensic image containers handed over to Data Processing with verification hashes.',
    avgCycleTime: '2 - 5 Business Days per custodian wave',
    throughputMetric: 'Average 1.8 TB collected daily per forensic lab unit',
    commonBottlenecks: [
      'Encrypted mobile messaging app locks (Signal, Telegram)',
      'Bandwidth throttling on corporate cloud API extractions',
      'Remote global employees in divergent timezones'
    ]
  },
  {
    id: 'stage-3',
    number: '03',
    name: 'Ingestion & Processing',
    shortDesc: 'De-duplication, text extraction, OCR, NIST filtering, and metadata indexing.',
    fullDesc: 'Massive raw evidentiary containers are expanded, compound files (ZIPs, PSTs, nested containers) are unpacked, non-pertinent system files are excluded via NIST hashes, global deduplication is executed, and optical character recognition (OCR) is performed on rasterized documents.',
    roles: [
      { role: 'Data Processor / Ingestion Analyst', raci: 'R' },
      { role: 'Data Operations Engineer', raci: 'A' },
      { role: 'Quality Control Lead', raci: 'C' },
      { role: 'Project Manager', raci: 'I' }
    ],
    toolsUsed: ['Nuix Workstation', 'Consilio Sightline Processing Engine', 'Relativity Processing'],
    primaryInputs: ['Forensic image containers', 'Processing specifications & timezone criteria'],
    primaryOutputs: ['Extracted plain text & metadata', 'De-duplication ledger', 'Processing exception error log'],
    handoffs: 'Processed data ingested into Review & Analysis workspace with full exception resolution sign-off.',
    avgCycleTime: '12 - 24 Hours per TB',
    throughputMetric: '4.2 TB peak 24-hr pipeline capacity',
    commonBottlenecks: [
      'Corrupt password-protected archives',
      'High-volume non-searchable architectural CAD or CAD/GIS assets',
      'Excessive foreign character encoding anomalies'
    ]
  },
  {
    id: 'stage-4',
    number: '04',
    name: 'Analysis & Early Case Assessment (ECA)',
    shortDesc: 'Visual concept clustering, email threading, communication maps, and hit-rate testing.',
    fullDesc: 'Litigation teams and data scientists interrogate the processed population prior to human review. Analysts run keyword hit-count validation, concept cluster heatmaps, social network communication diagrams, and email inclusive threading to eliminate up to 70% of non-responsive documents.',
    roles: [
      { role: 'Discovery Counsel / Lawyer', raci: 'A' },
      { role: 'Project Manager', raci: 'R' },
      { role: 'Document Reviewer', raci: 'I' },
      { role: 'Quality Control Lead', raci: 'C' }
    ],
    toolsUsed: ['Brainspace', 'Consilio Sightline Analytics', 'Relativity Analytics'],
    primaryInputs: ['Processed document index', 'Proposed search query strings', 'Hot issue memos'],
    primaryOutputs: ['ECA culling report', 'Refined search term agreement', 'Concept cluster maps'],
    handoffs: 'Culled review population staged into active review batches for Document Reviewers.',
    avgCycleTime: '2 - 4 Business Days',
    throughputMetric: 'Typical 48% - 72% data volume reduction before linear review',
    commonBottlenecks: [
      'Overly broad keyword lists from opposing counsel',
      'Obfuscated corporate jargon and acronym drift'
    ]
  },
  {
    id: 'stage-5',
    number: '05',
    name: 'Managed Document Review',
    shortDesc: 'First-pass responsiveness, privilege determinations, redactions, and CAL modeling.',
    fullDesc: 'Trained review attorneys evaluate staged documents for substantive responsiveness, attorney-client privilege, work-product doctrine, and confidential trade secrets. Continuous Active Learning (CAL / TAR 2.0) algorithms dynamically elevate high-probability relevant documents to the top of reviewer queues.',
    roles: [
      { role: 'Document Reviewer (Staff Attorney)', raci: 'R' },
      { role: 'Quality Control Lead', raci: 'R' },
      { role: 'Project Manager', raci: 'A' },
      { role: 'Discovery Counsel / Lawyer', raci: 'C' }
    ],
    toolsUsed: ['Consilio Sightline', 'RelativityOne', 'Brainspace CAL'],
    primaryInputs: ['Review guidelines & coding protocol', 'Culled document batches'],
    primaryOutputs: ['Coded documents (Responsive / Non-Responsive)', 'Privilege log records', 'Redacted TIFF/PDF files'],
    handoffs: 'Privilege and responsive sets verified through Statistical QC sampling and handed off to Production.',
    avgCycleTime: 'Ongoing per matter schedule (typical 50-80 docs/hour/attorney)',
    throughputMetric: 'Statistical Elusion Sample Validation < 1.0% error rate',
    commonBottlenecks: [
      'Ambiguous privilege calls requiring external counsel escalation',
      'Complex multi-tiered redaction requirements (PII, trade secrets, HIPAA)'
    ]
  },
  {
    id: 'stage-6',
    number: '06',
    name: 'Production & Delivery',
    shortDesc: 'Bates numbering, endorsement stamping, load file formatting (DAT/OPT), and delivery.',
    fullDesc: 'The final delivery phase where responsive, non-privileged documents are converted into stipulated exchange formats (Single-page TIFF, PDF, or native file with extracted text), sequential Bates stamps and confidentiality endorsements are applied, and load files (Concordance .DAT / .OPT) are generated.',
    roles: [
      { role: 'Data Operations Engineer', raci: 'R' },
      { role: 'Quality Control Lead', raci: 'A' },
      { role: 'Project Manager', raci: 'R' },
      { role: 'Discovery Counsel / Lawyer', raci: 'I' }
    ],
    toolsUsed: ['Consilio Sightline Production Engine', 'Relativity Production Console', 'Secure SFTP / Aspera'],
    primaryInputs: ['Responsive coded document set', 'Production specifications agreement (ESI Protocol)'],
    primaryOutputs: ['Bates-stamped production volume', 'Concordance DAT/OPT load files', 'Privilege log export'],
    handoffs: 'Secure delivery hash transmitted to opposing counsel or regulatory authority (DOJ/SEC/FTC).',
    avgCycleTime: '24 - 48 Hours',
    throughputMetric: '100% Bates sequence validation check',
    commonBottlenecks: [
      'Late-breaking clawback requests from external counsel',
      'Rigid regulatory filing specifications requiring last-minute format restructuring'
    ]
  }
];

export const INTERNAL_ROLES: RoleRecord[] = [
  {
    id: 'discovery-counsel',
    title: 'Discovery Counsel / Attorney',
    department: 'Legal Solutions & Advisory',
    experienceLevel: 'Senior / Executive (JD required)',
    overview: 'Serves as the strategic legal bridge between external law firm partners, in-house general counsels, and technical e-discovery teams, designing defensible preservation protocols and negotiating ESI agreements.',
    responsibilities: [
      'Draft and negotiate ESI protocols under Federal Rule of Civil Procedure 26(f)',
      'Establish privilege review protocols and supervise redaction guidelines',
      'Serve as Rule 30(b)(6) corporate witness on discovery methodology and defensibility',
      'Advise clients on cross-border data protection (GDPR) and cloud discovery risks'
    ],
    inputs: ['Court pleadings, subpoenas, custodial organizational data, protective orders'],
    outputs: ['ESI agreements, review protocols, privilege log methodologies, expert declarations'],
    workflowStages: ['Identification & Preservation', 'Analysis & Early Case Assessment (ECA)', 'Managed Document Review'],
    primaryTools: ['Consilio Sightline', 'Brainspace', 'RelativityOne'],
    kpis: [
      { label: 'Defensibility Audit Pass Rate', target: '100%' },
      { label: 'Client Satisfaction (CSAT)', target: '4.8 / 5.0' },
      { label: 'Review Guideline Clarification Turnaround', target: '< 4 hours' }
    ],
    coreSkills: ['FRCP 26/34 Caselaw', 'Privilege Doctrine', 'ESI Protocol Negotiation', 'Deposition Defense'],
    careerPath: ['Associate Discovery Counsel', 'Senior Discovery Counsel', 'Director of Legal Advisory', 'VP Global Discovery Strategy']
  },
  {
    id: 'document-reviewer',
    title: 'Document Reviewer (Staff Attorney)',
    department: 'Managed Review Services',
    experienceLevel: 'Entry to Mid-Level (Active Bar License)',
    overview: 'Specialized legal professionals who analyze high volumes of evidentiary documents with precision, categorizing materials for responsiveness, privilege, confidentiality, and key factual issue tags.',
    responsibilities: [
      'Examine emails, spreadsheets, and chat logs against detailed substantive review coding manuals',
      'Identify and flag attorney-client communications and attorney work-product materials',
      'Execute manual and automated redactions of Personally Identifiable Information (PII) and trade secrets',
      'Provide substantive qualitative feedback on Continuous Active Learning (CAL) model suggestions'
    ],
    inputs: ['Coded guidelines, staged document batches, matter issue cheat sheets'],
    outputs: ['Coding decisions (Responsive/Privileged/Hot), redacted document pages, privilege log entries'],
    workflowStages: ['Managed Document Review'],
    primaryTools: ['Consilio Sightline', 'RelativityOne', 'Brainspace'],
    kpis: [
      { label: 'Pacing / Throughput', target: '55 - 75 docs/hr' },
      { label: 'QC Consistency Score', target: '> 98.2%' },
      { label: 'Privilege Identification Accuracy', target: '> 99.5%' }
    ],
    coreSkills: ['Document Analysis', 'Privilege Logging', 'Sightline Keyboard Coding', 'PII Identification'],
    careerPath: ['Staff Reviewer', 'Senior Review Attorney', 'QC Lead', 'Review Project Manager']
  },
  {
    id: 'data-processor',
    title: 'Data Processor / Ingestion Analyst',
    department: 'Data Operations & Technology',
    experienceLevel: 'Mid-Level Technical',
    overview: 'Technical specialist operating high-volume ingestion engines to convert chaotic raw digital evidence into normalized, indexed, and queryable e-discovery databases.',
    responsibilities: [
      'Execute file inventory, container unpacking, and NIST file hash exclusion',
      'Perform optical character recognition (OCR) on scanned non-searchable documentation',
      'Isolate and remediate corrupted files, encrypted archives, and unsupported file types',
      'Generate processing verification reports comparing raw input counts to extracted items'
    ],
    inputs: ['Forensic images (.E01, .RAW), loose email archives (.PST, .MBOX), enterprise cloud extracts'],
    outputs: ['Extracted text files, standardized metadata tables, processing exception audit logs'],
    workflowStages: ['Ingestion & Processing'],
    primaryTools: ['Nuix Workstation', 'Consilio Sightline Processing Engine', 'Relativity Processing'],
    kpis: [
      { label: 'Processing SLA Adherence', target: '99.0%' },
      { label: 'Exception Remediation Rate', target: '> 95%' },
      { label: 'Data Throughput per Shift', target: '> 1.2 TB' }
    ],
    coreSkills: ['Nuix Scripting', 'Regular Expressions (RegEx)', 'File Header Forensics', 'SQL Database Queries'],
    careerPath: ['Associate Data Processor', 'Senior Ingestion Analyst', 'Data Operations Lead', 'Infrastructure Architect']
  },
  {
    id: 'forensics-specialist',
    title: 'Digital Forensics Specialist',
    department: 'Forensics & Expert Testimony',
    experienceLevel: 'Senior Technical (EnCE / CCE / GIAC certified)',
    overview: 'Forensic investigators who safely extract and preserve digital evidence from servers, laptops, mobile devices, and cloud infrastructures while rigorously defending the chain of custody.',
    responsibilities: [
      'Perform physical and logical bitstream imaging of corporate workstations and mobile devices',
      'Execute enterprise-wide targeted cloud harvests (Microsoft 365, Google Vault, Slack Enterprise)',
      'Recover deleted records, analyze unallocated disk space, and trace USB artifact insertions',
      'Draft detailed forensic chain of custody reports and provide expert witness affidavits'
    ],
    inputs: ['Target hardware devices, custodian network credentials, forensic authorization warrants'],
    outputs: ['Cryptographically verified bitstream images, forensic analysis reports, timeline reconstructions'],
    workflowStages: ['Identification & Preservation', 'Forensic Collection'],
    primaryTools: ['EnCase Forensic', 'Cellebrite UFED', 'Consilio Complete Data', 'FTK Imager'],
    kpis: [
      { label: 'Zero Spoliation / Hash Integrity', target: '100%' },
      { label: 'Chain of Custody Completeness', target: '100%' },
      { label: 'Turnaround Time on Emergency Collections', target: '< 24 hours' }
    ],
    coreSkills: ['Hardware Imaging', 'Mobile Forensics', 'Cloud API Extraction', 'Expert Witness Testimony'],
    careerPath: ['Forensic Examiner', 'Senior Forensic Consultant', 'Managing Director of Forensics', 'Practice Leader']
  },
  {
    id: 'project-manager',
    title: 'Project Manager / Delivery Lead',
    department: 'Client Engagement & Operations',
    experienceLevel: 'Senior Professional (PMP / RCA certified)',
    overview: 'The primary operational conductor of a legal matter, managing timelines, budgets, resource allocation, and communication across external counsel, in-house clients, and technical teams.',
    responsibilities: [
      'Develop matter master schedules, milestones, and deliverable pacing forecasts',
      'Monitor daily review pacing, document ingestion rates, and production deadlines',
      'Conduct weekly client budget and pacing status briefings',
      'Coordinate cross-department handoffs between Forensics, Processing, Review, and Production'
    ],
    inputs: ['Matter scope agreements, court discovery deadlines, budget parameters'],
    outputs: ['Weekly matter status dashboard, budget variance reports, production verification certificates'],
    workflowStages: ['Identification & Preservation', 'Forensic Collection', 'Ingestion & Processing', 'Analysis & Early Case Assessment (ECA)', 'Managed Document Review', 'Production & Delivery'],
    primaryTools: ['Consilio Sightline Client Portal', 'Atlas Knowledge Base', 'Jira / Smartsheet'],
    kpis: [
      { label: 'On-Time Milestone Delivery', target: '> 97.5%' },
      { label: 'Budget Variance', target: '< 5.0%' },
      { label: 'Client Retention on Repeat Matters', target: '> 92%' }
    ],
    coreSkills: ['E-Discovery Budgeting', 'Client Stakeholder Management', 'Risk Mitigation', 'Cross-functional Leadership'],
    careerPath: ['Associate PM', 'Discovery Project Manager', 'Senior PM', 'Operations Director', 'VP Client Operations']
  },
  {
    id: 'qc-lead',
    title: 'Quality Control (QC) Lead',
    department: 'Managed Review Services',
    experienceLevel: 'Mid to Senior Legal Professional',
    overview: 'Guarantees the statistical defensibility and substantive accuracy of attorney coding, privilege determinations, and redactions before data ever leaves Consilio.',
    responsibilities: [
      'Construct statistical elusion testing samples to prove review completion to court standards',
      'Conduct daily second-tier reviews of privileged calls and trade secret redactions',
      'Analyze inter-rater reliability scores to spot struggling reviewers and provide targeted coaching',
      'Sign off on final production manifest validation'
    ],
    inputs: ['First-pass coded documents, privilege log drafts, redaction overlays'],
    outputs: ['QC audit logs, reviewer error calibration reports, statistical elusion certification memos'],
    workflowStages: ['Ingestion & Processing', 'Managed Document Review', 'Production & Delivery'],
    primaryTools: ['Consilio Sightline QC Console', 'Brainspace', 'Excel Statistical Models'],
    kpis: [
      { label: 'Zero Privilege Inadvertent Disclosure', target: '100%' },
      { label: 'Statistical Elusion Confidence Interval', target: '95% ± 2%' },
      { label: 'QC Turnaround Time', target: '< 6 hours from batch close' }
    ],
    coreSkills: ['Statistical Sampling', 'Privilege Analysis', 'Calibration Coaching', 'Defensibility Documentation'],
    careerPath: ['Senior Reviewer', 'QC Lead', 'Review Operations Manager', 'Director of Quality & Defensibility']
  }
];

export const INTERNAL_TOOLS: InternalToolRecord[] = [
  {
    id: 'consilio-sightline',
    name: 'Consilio Sightline',
    category: 'Enterprise Review & Proprietary Analytics',
    tagline: 'Consilio’s unified flagship document review and continuous active learning platform.',
    whatItDoes: 'Sightline is Consilio’s proprietary e-discovery platform engineered for lightning-fast document review, intuitive privilege logging, automated redaction, and intelligent Continuous Active Learning. It provides end-to-end matter visibility without third-party licensing markups.',
    whoUsesIt: ['Document Reviewer', 'QC Lead', 'Discovery Counsel', 'Project Manager'],
    workflowStages: ['Analysis & Early Case Assessment (ECA)', 'Managed Document Review', 'Production & Delivery'],
    relatedTools: ['Brainspace', 'RelativityOne', 'Consilio Complete Data'],
    integrations: ['Atlas Knowledge Base', 'Consilio Billing Engine', 'MS 365 Direct Ingest'],
    atlasDocUrl: 'https://atlas.consilio.com/tools/sightline-core',
    adoptionTier: 'Enterprise Standard',
    adoptionRatePct: 78.4,
    licenseModel: 'Proprietary Consilio IP (Zero 3rd-party user seat fees)',
    systemStatus: 'Operational',
    recentReleases: [
      { version: 'v8.4.2', date: '2026-09-12', note: 'Added native spreadsheet single-cell redaction and enhanced GenAI privilege draft explanations.' },
      { version: 'v8.3.0', date: '2026-06-18', note: 'Integrated high-throughput cluster visualizer with sub-second page rendering.' }
    ]
  },
  {
    id: 'consilio-complete-data',
    name: 'Consilio Complete Data',
    category: 'Enterprise Forensics & Custodian Governance',
    tagline: 'End-to-end remote forensic collection, legal hold automation, and custodian management.',
    whatItDoes: 'Provides direct API connectivity into enterprise architectures—including Microsoft 365, Google Workspace, Slack, Teams, Box, and AWS S3 buckets—enabling remote, targeted, defensible forensic acquisitions without disrupting employee hardware.',
    whoUsesIt: ['Digital Forensics Specialist', 'Project Manager', 'Discovery Counsel'],
    workflowStages: ['Identification & Preservation', 'Forensic Collection'],
    relatedTools: ['EnCase Forensic', 'Cellebrite UFED'],
    integrations: ['Microsoft Graph API', 'Google Workspace API', 'Slack eDiscovery API'],
    atlasDocUrl: 'https://atlas.consilio.com/tools/complete-data',
    adoptionTier: 'Enterprise Standard',
    adoptionRatePct: 91.2,
    licenseModel: 'Proprietary Consilio IP',
    systemStatus: 'Operational',
    recentReleases: [
      { version: 'v4.1.0', date: '2026-08-05', note: 'Added automated Teams multi-channel threaded export with emoji reaction normalization.' }
    ]
  },
  {
    id: 'relativity',
    name: 'Relativity / RelativityOne',
    category: 'Commercial Review & Case Hosting',
    tagline: 'Industry-standard commercial cloud review and case repository platform.',
    whatItDoes: 'Cloud-hosted litigation database allowing legal teams to search, review, analyze, and produce documents. Used across matters where external law firms mandate Relativity ecosystem compliance or existing client repository hosting.',
    whoUsesIt: ['Document Reviewer', 'Data Processor', 'Project Manager', 'QC Lead'],
    workflowStages: ['Ingestion & Processing', 'Analysis & Early Case Assessment (ECA)', 'Managed Document Review', 'Production & Delivery'],
    relatedTools: ['Consilio Sightline', 'Brainspace'],
    integrations: ['Relativity API', 'Brainspace Connector', 'Verity'],
    atlasDocUrl: 'https://atlas.consilio.com/tools/relativity-guide',
    adoptionTier: 'Enterprise Standard',
    adoptionRatePct: 62.0,
    licenseModel: 'Third-party SaaS (Per-GB/month cloud compute + admin user fees)',
    systemStatus: 'Operational',
    recentReleases: [
      { version: 'RelativityOne 2026.3', date: '2026-07-28', note: 'Upgraded aiR Review integration and enhanced PDF streaming viewer.' }
    ]
  },
  {
    id: 'brainspace',
    name: 'Brainspace',
    category: 'Visual Concept Analytics & Machine Learning',
    tagline: 'Advanced visual concept clustering, communication heatmaps, and supervised learning.',
    whatItDoes: 'Interrogates unstructured textual data using unsupervised machine learning. Builds interactive 2D concept cluster maps, visualizes custodian communication networks, and drives Continuous Active Learning algorithms to pinpoint critical evidence rapidly.',
    whoUsesIt: ['Discovery Counsel', 'Project Manager', 'QC Lead'],
    workflowStages: ['Analysis & Early Case Assessment (ECA)', 'Managed Document Review'],
    relatedTools: ['Consilio Sightline', 'Relativity'],
    integrations: ['Sightline Direct Sync', 'Relativity Sync Engine'],
    atlasDocUrl: 'https://atlas.consilio.com/tools/brainspace-analytics',
    adoptionTier: 'Enterprise Standard',
    adoptionRatePct: 71.5,
    licenseModel: 'Enterprise OEM License',
    systemStatus: 'Operational',
    recentReleases: [
      { version: 'v7.8', date: '2026-05-19', note: 'Improved multilingual concept mapping for cross-border German and French investigative sets.' }
    ]
  },
  {
    id: 'nuix-workstation',
    name: 'Nuix Workstation',
    category: 'High-Throughput Ingestion & Forensic Processing',
    tagline: 'Ultra-fast enterprise processing engine for unpacking complex data containers.',
    whatItDoes: 'High-performance engine designed for massive forensic data extraction, text extraction, deduplication, and forensic indexing. Capable of parsing through proprietary email containers, mobile phone archives, and heavily nested zip structures.',
    whoUsesIt: ['Data Processor', 'Data Operations Engineer', 'Digital Forensics Specialist'],
    workflowStages: ['Ingestion & Processing'],
    relatedTools: ['Consilio Sightline Processing Engine', 'EnCase Forensic'],
    integrations: ['Consilio Queue Manager', 'PostgreSQL Staging DB'],
    atlasDocUrl: 'https://atlas.consilio.com/tools/nuix-ingestion',
    adoptionTier: 'Enterprise Standard',
    adoptionRatePct: 84.0,
    licenseModel: 'Core-based hardware license server',
    systemStatus: 'Operational',
    recentReleases: [
      { version: 'v9.10', date: '2026-04-10', note: 'Optimized memory caching for large 100GB+ MS Exchange EDB database carving.' }
    ]
  },
  {
    id: 'encase-forensic',
    name: 'EnCase Forensic',
    category: 'Hardware & Disk Forensics',
    tagline: 'Court-defensible bitstream disk imaging and unallocated space recovery.',
    whatItDoes: 'The established benchmark for physical hard drive imaging, boot record investigation, unallocated cluster analysis, and deleted file header carving with full cryptographic hash verification.',
    whoUsesIt: ['Digital Forensics Specialist'],
    workflowStages: ['Forensic Collection'],
    relatedTools: ['Cellebrite UFED', 'Consilio Complete Data'],
    integrations: ['Tableau Forensic Bridges', 'Write-blocker Controllers'],
    atlasDocUrl: 'https://atlas.consilio.com/tools/encase-standards',
    adoptionTier: 'Specialized Tier',
    adoptionRatePct: 53.0,
    licenseModel: 'Hardware dongle license',
    systemStatus: 'Operational',
    recentReleases: [
      { version: 'v23.4', date: '2026-02-14', note: 'Enhanced support for NVMe PCIe Gen5 drives and APFS snapshot carving.' }
    ]
  }
];

export const TECH_RADAR_ITEMS: TechRadarItem[] = [
  {
    id: 'tech-cal',
    name: 'Continuous Active Learning (CAL / TAR 2.0)',
    category: 'AI & Machine Learning',
    ring: 'Adopt',
    summary: 'Machine learning algorithms continuously retrained on reviewer actions, immediately floating top relevant documents to reviewers until elusion criteria is satisfied.',
    consilioMaturity: 'High',
    marketAdoptionPct: 82.0,
    impactOnRoles: 'Accelerates Document Reviewer efficiency by 40-60%; elevates QC Leads into statistical validation directors.',
    regulatoryConsiderations: 'Firmly validated under federal caselaw (Da Silva Moore, Rio Tinto); requires clear statistical protocol disclosure.'
  },
  {
    id: 'tech-cloud-elastic',
    name: 'Cloud-Native Elastic Ingestion & Auto-Scaling',
    category: 'Architecture & Cloud',
    ring: 'Adopt',
    summary: 'Containerized Kubernetes-based microservices that scale processing workers up and down dynamically based on TB ingest queues.',
    consilioMaturity: 'High',
    marketAdoptionPct: 76.0,
    impactOnRoles: 'Eliminates hardware bottlenecks for Data Processors; lowers idle server costs for IT Management.',
    regulatoryConsiderations: 'Requires SOC2 Type II, ISO 27001, and region-locked tenant hosting for GDPR/cross-border compliance.'
  },
  {
    id: 'tech-genai-priv',
    name: 'Generative AI Privilege Summarization & Log Generation',
    category: 'AI & Machine Learning',
    ring: 'Trial',
    summary: 'Fine-tuned LLMs reading communication threads to draft standardized, defensible privilege log basis descriptions and identify legal advice context.',
    consilioMaturity: 'Growing',
    marketAdoptionPct: 38.0,
    impactOnRoles: 'Automates up to 65% of manual privilege description writing for Staff Attorneys, moving humans into editorial approvers.',
    regulatoryConsiderations: 'Must verify model training data isolation (zero public leak) and maintain human-in-the-loop attorney verification.'
  },
  {
    id: 'tech-auto-redaction',
    name: 'Automated PII/PHI & Biometric Redaction Models',
    category: 'Forensics & Privacy',
    ring: 'Trial',
    summary: 'Deep neural networks detecting social security numbers, banking details, patient identifiers, and facial profiles across millions of multi-modal files.',
    consilioMaturity: 'Growing',
    marketAdoptionPct: 44.0,
    impactOnRoles: 'Drastically reduces eye-strain and repetitive manual box-drawing for Review Attorneys in healthcare and financial matters.',
    regulatoryConsiderations: 'Strict verification required under HIPAA Omnibus rule and CCPA penalty statutes.'
  },
  {
    id: 'tech-agentic-workflows',
    name: 'Agentic Multi-Step Discovery Orchestration',
    category: 'AI & Machine Learning',
    ring: 'Assess',
    summary: 'Autonomous AI agents capable of querying databases, validating custodian scope, resolving exceptions, and drafting initial review setups.',
    consilioMaturity: 'Emerging',
    marketAdoptionPct: 14.0,
    impactOnRoles: 'May augment Project Managers by handling repetitive schedule adjustments and initial matter staging tasks.',
    regulatoryConsiderations: 'Defensibility before courts remains unproven; requires rigorous audit trail logging of all agent actions.'
  },
  {
    id: 'tech-quantum-encrypt',
    name: 'Post-Quantum Cryptography for Long-Term Custodial Archives',
    category: 'Architecture & Cloud',
    ring: 'Assess',
    summary: 'Lattice-based encryption standards designed to safeguard 10+ year litigation archives against future quantum decryption threats.',
    consilioMaturity: 'Evaluating',
    marketAdoptionPct: 6.0,
    impactOnRoles: 'Mainly impacts Infrastructure Security Architects and Enterprise General Counsels managing permanent holds.',
    regulatoryConsiderations: 'NIST post-quantum cryptographic standards alignment mandatory for defense contractor matters.'
  },
  {
    id: 'tech-legacy-onprem',
    name: 'Monolithic On-Premises Bare-Metal Ingestion Stacks',
    category: 'Architecture & Cloud',
    ring: 'Hold',
    summary: 'Fixed hardware processing racks requiring costly ongoing manual maintenance, physical disk swapping, and static capacity caps.',
    consilioMaturity: 'Evaluating',
    marketAdoptionPct: 18.0,
    impactOnRoles: 'Phasing out for Data Operations Engineers in favor of elastic cloud clusters; maintained only for air-gapped classified defense facilities.',
    regulatoryConsiderations: 'High carbon footprint and slow disaster recovery compliance compared to multi-region cloud.'
  },
  {
    id: 'tech-brute-boolean',
    name: 'Uncalibrated Boolean-Only Keyword Culling without Analytics',
    category: 'Analytics & ECA',
    ring: 'Hold',
    summary: 'Relying exclusively on rigid single-word keyword lists without concept clustering or hit-rate sampling, producing massive irrelevant document false positives.',
    consilioMaturity: 'Evaluating',
    marketAdoptionPct: 22.0,
    impactOnRoles: 'Creates severe document review fatigue and blows client budgets by 200-300%. Discouraged across all Consilio practices.',
    regulatoryConsiderations: 'Judges increasingly criticize unscientific keyword dumping under FRCP proportionality rules.'
  }
];

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'module-ediscovery-lifecycle',
    title: 'Foundations of the e-Discovery Lifecycle (EDRM)',
    area: 'Workflow',
    durationMinutes: 18,
    difficulty: 'Beginner',
    status: 'Completed',
    progressPct: 100,
    score: 95,
    summary: 'A complete walk-through of the six standard stages of the Electronic Discovery Reference Model from legal hold through final production.',
    keyTakeaways: [
      'Identification and Preservation establish defensibility under FRCP 37(e)',
      'Processing and ECA typically eliminate 50-70% of raw data before human review',
      'Continuous Active Learning dynamically reorganizes review queues based on attorney feedback'
    ]
  },
  {
    id: 'module-consilio-differentiators',
    title: 'Consilio Core Differentiators & Competitive Positioning',
    area: 'Competitors',
    durationMinutes: 22,
    difficulty: 'Intermediate',
    status: 'In Progress',
    progressPct: 64,
    score: 82,
    summary: 'How Consilio wins against pure-software vendors like Relativity and legacy competitors like Epiq and KLDiscovery through integrated Sightline workflows and full-service managed delivery.',
    keyTakeaways: [
      'Relativity is a software licensor; Consilio delivers end-to-end managed service accountability',
      'Sightline eliminates third-party per-GB software markups',
      'Global forensic footprint covers specialized mobile and cloud extractions across 15+ jurisdictions'
    ]
  },
  {
    id: 'module-client-whitespace',
    title: 'Client Account Health & Whitespace Identification',
    area: 'Clients',
    durationMinutes: 15,
    difficulty: 'Intermediate',
    status: 'In Progress',
    progressPct: 40,
    summary: 'Recognizing churn warning signs in accounts using only one Consilio service and constructing actionable cross-sell packages.',
    keyTakeaways: [
      'Single-service accounts (e.g. Review only or Processing only) have 3x higher churn risk',
      'Revenue declines over 2 consecutive quarters warrant an executive QBR with legal advisory',
      'Forensics is the highest-margin wedge to capture subsequent processing and managed review'
    ]
  },
  {
    id: 'module-internal-tools-atlas',
    title: 'Mastering the Internal Tools Ecosystem & Atlas Resources',
    area: 'Tools',
    durationMinutes: 20,
    difficulty: 'Beginner',
    status: 'In Progress',
    progressPct: 73,
    summary: 'Comprehensive guide to Consilio Sightline, Complete Data, Brainspace, and Nuix, and how to utilize Atlas knowledge repositories.',
    keyTakeaways: [
      'Sightline handles proprietary review, redaction, and privilege logging',
      'Complete Data connects directly into cloud enterprise APIs (Slack, M365, Google)',
      'Atlas contains standardized SOPs, user manuals, and training videos for every tool'
    ]
  },
  {
    id: 'module-tech-radar-trends',
    title: 'Generative AI & Modern e-Discovery Technology Trends',
    area: 'Technology',
    durationMinutes: 25,
    difficulty: 'Advanced',
    status: 'Not Started',
    progressPct: 0,
    summary: 'Exploring TAR 2.0, automated privilege summary drafting, and the impact of the EU AI Act and US court rulings on discovery defensibility.',
    keyTakeaways: [
      'TAR 2.0 Continuous Active Learning is already court-accepted across all major US jurisdictions',
      'GenAI privilege summaries require strict human attorney review and verification',
      'Data privacy regulations require tenant-isolated LLM instances with zero public data retention'
    ]
  }
];

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q-1',
    question: 'Which stage typically immediately follows Ingestion & Processing in the standard e-Discovery lifecycle before full-scale human review?',
    moduleTitle: 'Foundations of the e-Discovery Lifecycle (EDRM)',
    area: 'Workflow',
    options: [
      'Bates Numbering and Load File Production',
      'Analysis & Early Case Assessment (ECA)',
      'Forensic Mobile Device Collection',
      'Courtroom Expert Witness Deposition'
    ],
    correctIndex: 1,
    explanation: 'Analysis & Early Case Assessment (ECA) follows processing. It leverages keyword hit-testing, concept clustering, and email threading to cull irrelevant data before expensive human review commences.',
    relatedDoc: 'E-Discovery Workflow Stage 04: Analysis & ECA'
  },
  {
    id: 'q-2',
    question: 'What is the primary risk indicator identified when an enterprise account like Apex Legal Group relies on only one Consilio service (such as Review only)?',
    moduleTitle: 'Client Account Health & Whitespace Identification',
    area: 'Clients',
    options: [
      'The client cannot be audited under SOC2 guidelines',
      'High vulnerability to competitor poaching and margin squeeze due to disconnected upstream workflows',
      'The client is legally prevented from utilizing Continuous Active Learning',
      'The client must pay statutory double fees to federal courts'
    ],
    correctIndex: 1,
    explanation: 'Single-service accounts lack integration stickiness. If a client uses Consilio only for review, a competitor handling upstream collections or hosting can easily propose an all-in-one bundle to displace us.',
    relatedDoc: 'Client Intelligence: Account Health & Churn Risk Models'
  },
  {
    id: 'q-3',
    question: 'In TAR 2.0 (Continuous Active Learning / CAL), how does the machine learning algorithm prioritize documents for human review attorneys?',
    moduleTitle: 'Generative AI & Modern e-Discovery Technology Trends',
    area: 'Technology',
    options: [
      'It sorts documents alphabetically by author email address',
      'It dynamically scores and continuously presents the highest probability responsive documents based on ongoing attorney coding decisions',
      'It requires a static 500-document training control set that cannot be altered once review starts',
      'It discards all foreign language files automatically without review'
    ],
    correctIndex: 1,
    explanation: 'Continuous Active Learning continuously evaluates reviewer coding decisions and dynamically pushes high-ranking relevant documents to the top of the queue until elusion validation demonstrates responsive documents are exhausted.',
    relatedDoc: 'Technology Radar: Continuous Active Learning (CAL)'
  },
  {
    id: 'q-4',
    question: 'Which role is primarily accountable for maintaining chain-of-custody documentation and cryptographic SHA-256 hash integrity during data preservation?',
    moduleTitle: 'Foundations of the e-Discovery Lifecycle (EDRM)',
    area: 'Workflow',
    options: [
      'Document Reviewer (Staff Attorney)',
      'Digital Forensics Specialist',
      'Billing & Invoicing Coordinator',
      'Marketing Brand Manager'
    ],
    correctIndex: 1,
    explanation: 'Digital Forensics Specialists are responsible for forensically sound acquisitions, documenting chain of custody, and verifying bitstream SHA-256 hash parity to prevent spoliation claims under FRCP 37(e).',
    relatedDoc: 'Roles Catalog: Digital Forensics Specialist'
  },
  {
    id: 'q-5',
    question: 'What is the most decisive strategic differentiator Consilio holds when competing against pure-software platforms like Relativity?',
    moduleTitle: 'Consilio Core Differentiators & Competitive Positioning',
    area: 'Competitors',
    options: [
      'Consilio refuses to work with AmLaw 100 law firms',
      'Consilio provides an integrated end-to-end full managed service (forensics + proprietary Sightline tech + dedicated review attorneys) rather than merely licensing software seats',
      'Relativity does not possess a web-based user interface',
      'Consilio is exclusively an open-source non-profit foundation'
    ],
    correctIndex: 1,
    explanation: 'Relativity is primarily a software licensor reliant on third-party partners. Consilio provides a unified end-to-end ecosystem combining proprietary software (Sightline) with global forensic labs and managed legal review teams under one SLA.',
    relatedDoc: 'Competitor Intelligence: Relativity Battlecard'
  }
];

export const INITIAL_CONTRIBUTOR_SUBMISSIONS: ContributorSubmission[] = [
  {
    id: 'sub-01',
    title: 'Update Relativity Battlecard with aiR 2.0 Feature Comparison',
    area: 'Competitors',
    submittedBy: 'Marcus Vance',
    role: 'Contributor',
    submittedAt: '2026-10-04 14:20',
    status: 'Pending Approval',
    summary: 'Added key talking points contrasting Consilio Sightline GenAI privilege review against Relativity aiR 2.0 pricing model.',
    proposedChanges: 'Incorporated notes on Relativity’s newly announced per-matter aiR compute fee structure to empower sales team during enterprise RFP pitches.'
  },
  {
    id: 'sub-02',
    title: 'Add Atlas SOP Link for Teams Channel Threaded Harvests',
    area: 'Tools',
    submittedBy: 'Camilla Dupont',
    role: 'Contributor',
    submittedAt: '2026-10-03 11:15',
    status: 'Pending Approval',
    summary: 'Updated Consilio Complete Data documentation link to point to newly released Microsoft 365 Teams API harvest guidelines.',
    proposedChanges: 'Linked internal Atlas SOP https://atlas.consilio.com/sops/m365-teams-v4 to the Complete Data tool profile.'
  },
  {
    id: 'sub-03',
    title: 'Apex Legal Group Whitespace Opportunity Update',
    area: 'Clients',
    submittedBy: 'Sarah Mitchell',
    role: 'Contributor',
    submittedAt: '2026-09-28 09:40',
    status: 'Approved',
    summary: 'Reflected updated $1.4M forensics whitespace estimate following Q3 partner check-in.',
    proposedChanges: 'Adjusted client status to Attention and added next-best action recommendation for Sightline Forensics bundling.'
  }
];

export const DEMO_AI_SEEDED_QUERY = "Which clients have declining revenue and are using only one Consilio service?";

export const SEEDED_AI_SEARCH_RESULT: AiSearchResult = {
  query: DEMO_AI_SEEDED_QUERY,
  summary: "3 enterprise clients currently match this pattern. Two show a sustained decline over the last four quarters, while one has recently reduced engagement due to single-service dependency.",
  evidenceClients: [
    INITIAL_CLIENTS.find(c => c.id === 'apex-legal')!,
    INITIAL_CLIENTS.find(c => c.id === 'northstar-holdings')!,
    INITIAL_CLIENTS.find(c => c.id === 'meridian-corp')!
  ],
  sources: [
    { title: 'Client Intelligence Repository', dataset: 'Consilio Client Master Index', lastUpdated: '02 Oct 2026' },
    { title: 'Internal Revenue & Billing Ledger', dataset: 'Consilio Finance LTM Dataset', lastUpdated: '01 Oct 2026' },
    { title: 'Service Mix & Matter Tracking Database', dataset: 'Operations Service Register', lastUpdated: '04 Oct 2026' }
  ],
  followUpQuestions: [
    "Which of these clients have active matters currently open?",
    "What specific services should we cross-sell to Apex Legal Group?",
    "Show me the 4-quarter revenue trend comparison for these three clients.",
    "Compare competitor exposure for single-service accounts."
  ],
  contextualActions: [
    { label: "View Apex Legal Group Profile", targetView: "client-detail", targetId: "apex-legal" },
    { label: "Open Client Intelligence Overview", targetView: "client-intelligence" },
    { label: "Inspect Review Workflow Stage", targetView: "workflow", targetId: "stage-5" },
    { label: "Save Insight to Workspace", targetView: "saved-insight" }
  ]
};

export const QUICK_SEARCH_PRESETS = [
  {
    label: "Declining revenue & single service (Demo Query)",
    query: "Which clients have declining revenue and are using only one Consilio service?"
  },
  {
    label: "What tools are used during review?",
    query: "What tools are used during review?"
  },
  {
    label: "How does review fit into the e-Discovery workflow?",
    query: "How does review fit into the e-Discovery workflow?"
  },
  {
    label: "Which competitors launched AI products recently?",
    query: "Which competitors launched AI products recently?"
  },
  {
    label: "High churn risk accounts",
    query: "Show me all clients with high churn risk"
  }
];
