import React from 'react';
import {
  Building2,
  ShieldCheck,
  Workflow,
  Wrench,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_AI_SEEDED_QUERY } from '../../data/mockData';

export const OverviewView: React.FC = () => {
  const {
    activeRole,
    navigateTo,
    openAiSearch,
    clients,
    competitors,
    tools,
    workflowStages
  } = useApp();

  const isFinancialRestricted = activeRole === 'New Joiner';

  // Compute summary stats
  const totalClients = clients.length;
  const highRiskClients = clients.filter(c => c.churnRisk === 'High');
  const attentionClients = clients.filter(c => c.status === 'Attention');
  const totalRevenue = clients.reduce((acc, c) => acc + c.annualRevenue, 0);
  const avgHealth = Math.round(
    clients.reduce((acc, c) => acc + c.healthScore, 0) / clients.length
  );

  return (
    <div className="space-y-6">
      <section className="hero-panel relative overflow-hidden rounded-[2rem] p-7 sm:p-10"><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><div className="relative z-10 max-w-3xl"><div className="eyebrow"><Sparkles className="h-3.5 w-3.5" /> EXECUTIVE SIGNAL DESK</div><h1 className="display-heading mt-5">See the move before it becomes the <em>moment.</em></h1><p className="hero-copy mt-5 max-w-2xl">One premium workspace for the client signals, market moves, workflows, solutions, and technology decisions that matter now.</p><div className="mt-7 flex flex-wrap gap-3"><button className="button-primary" onClick={() => openAiSearch(DEMO_AI_SEEDED_QUERY)}>Ask the Gateway <ArrowUpRight className="h-4 w-4" /></button><button className="button-ghost" onClick={() => navigateTo('client-intelligence')}>Prioritize clients</button></div></div><div className="hero-stat-cluster"><div><strong>{totalClients}</strong><span>Client accounts</span></div><div><strong>{highRiskClients.length}</strong><span>High-risk signals</span></div><div><strong>{avgHealth}</strong><span>Avg. health</span></div></div></section>
      {/* Editorial Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Consilio Enterprise Intelligence
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Intelligence Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Cross-platform strategic gateway across client portfolios, competitor moves,
            e-Discovery workflows, internal tools, and emerging legal tech.
          </p>
        </div>

        {/* Quick Action: Seeded Demo AI Query banner */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openAiSearch(DEMO_AI_SEEDED_QUERY)}
            className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/80 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-2xs group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Run Demo AI Query: Single-Service Churn</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Role-Aware KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Portfolio Revenue */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500">Portfolio ARR (Synthetic)</span>
          {isFinancialRestricted ? (
            <div className="my-1.5 flex items-center gap-1.5 text-slate-400 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted</span>
            </div>
          ) : (
            <div className="my-1 font-bold text-base sm:text-lg text-slate-900 tabular-nums">
              ${(totalRevenue / 1000000).toFixed(1)}M
            </div>
          )}
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">+8.4% YoY</span>
            <span>· 15 accounts</span>
          </div>
        </div>

        {/* Metric 2: Active Clients */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500">Tracked Accounts</span>
          <div className="my-1 font-bold text-base sm:text-lg text-slate-900 tabular-nums">
            {totalClients}
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <span>AmLaw 100 & Enterprise</span>
          </div>
        </div>

        {/* Metric 3: Single-Service Risk */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500">Churn Attention</span>
          <div className="my-1 font-bold text-base sm:text-lg text-amber-700 tabular-nums flex items-center gap-1.5">
            <span>{attentionClients.length}</span>
            <span className="text-[11px] font-normal text-amber-800">accounts</span>
          </div>
          <div className="text-[10px] text-rose-600 font-medium flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>Single-service exposure</span>
          </div>
        </div>

        {/* Metric 4: Workflow Health */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500">Avg Account Health</span>
          <div className="my-1 font-bold text-base sm:text-lg text-slate-900 tabular-nums">
            {avgHealth} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">
            Weighted across matters
          </div>
        </div>

        {/* Metric 5: Tool Fleet Adoption */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500">Sightline Adoption</span>
          <div className="my-1 font-bold text-base sm:text-lg text-slate-900 tabular-nums">
            78.4%
          </div>
          <div className="text-[10px] text-slate-500">
            Proprietary review engine
          </div>
        </div>

        {/* Metric 6: Learning Progress */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-500">Your Journey</span>
          <div className="my-1 font-bold text-base sm:text-lg text-blue-700 tabular-nums">
            74% <span className="text-xs font-normal text-slate-400">avg</span>
          </div>
          <div className="text-[10px] text-slate-500">
            3 modules completed
          </div>
        </div>
      </div>

      {/* Notice when viewing as New Joiner */}
      {isFinancialRestricted && (
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            You are viewing in <strong>New Joiner</strong> mode. Restricted financial portfolio
            metrics and account margin data are masked. Switch to <strong>Management</strong> in
            the top-right bar to view full synthetic revenue tables.
          </span>
        </div>
      )}

      {/* Five Intelligence Snapshots Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Five Core Intelligence Areas
            </h2>
            <p className="text-xs text-slate-500">
              Live intelligence summaries mapped to Consilio’s practice taxonomy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Snapshot 1: Client Intelligence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-50 text-blue-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">
                    Client Intelligence
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">15 Tracked</span>
              </div>
              <div className="text-xs text-slate-600 line-clamp-2 mb-3">
                <strong>Attention Flag:</strong> Apex Legal Group (-14.2% YoY) and Northstar
                Holdings (-9.1% YoY) show single-service churn vulnerabilities.
              </div>
              <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cross-sell whitespace:</span>
                  <span className="font-semibold text-slate-900">$4.2M identified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Healthy accounts:</span>
                  <span className="text-emerald-700 font-medium">80% above 75 score</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('client-intelligence')}
              className="mt-3.5 pt-2 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
            >
              <span>Explore Client Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshot 2: Competitor Intelligence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-indigo-50 text-indigo-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">
                    Competitor Intelligence
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">4 Key Rivals</span>
              </div>
              <div className="text-xs text-slate-600 line-clamp-2 mb-3">
                <strong>Market Positioning:</strong> Relativity aiR 2.0 release targets privilege review.
                Consilio maintains decisive +12% capability edge in full-service managed delivery.
              </div>
              <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consilio Advantage:</span>
                  <span className="font-semibold text-slate-900">Managed Legal Services</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Primary Challenger:</span>
                  <span className="text-slate-800 font-medium">Relativity (34.5% share)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('competitor-intelligence')}
              className="mt-3.5 pt-2 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
            >
              <span>Explore Battlecards & Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshot 3: Team, Workflow & Roles */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-700">
                    <Workflow className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">
                    Team, Workflow & Roles
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">6 EDRM Stages</span>
              </div>
              <div className="text-xs text-slate-600 line-clamp-2 mb-3">
                <strong>Operational Flow:</strong> Interactive 6-stage lifecycle from Forensic
                Collection to Production. 6 internal core roles mapped to RACI matrices.
              </div>
              <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Peak pipeline capacity:</span>
                  <span className="font-semibold text-slate-900">4.2 TB / 24hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Elusion rate target:</span>
                  <span className="text-emerald-700 font-medium">&lt; 1.0% error rate</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('workflow-roles')}
              className="mt-3.5 pt-2 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
            >
              <span>Inspect Workflow & Roles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshot 4: Internal Tools & Tech */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-50 text-amber-700">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">
                    Internal Tools & Tech
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">6 Core Tools</span>
              </div>
              <div className="text-xs text-slate-600 line-clamp-2 mb-3">
                <strong>Platform Status:</strong> Sightline v8.4.2 active. Complete Data deployed for
                automated remote MS 365 and Slack e-discovery acquisitions.
              </div>
              <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fleet health:</span>
                  <span className="text-emerald-700 font-medium">100% Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Atlas documentation:</span>
                  <span className="font-semibold text-slate-900">Live & Linked</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('tools-intelligence')}
              className="mt-3.5 pt-2 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
            >
              <span>View Tools & Atlas Links</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshot 5: Technology Intelligence */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-violet-50 text-violet-700">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">
                    Technology Intelligence
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Radar 2026</span>
              </div>
              <div className="text-xs text-slate-600 line-clamp-2 mb-3">
                <strong>Tech Radar:</strong> Continuous Active Learning (CAL) in Adopt. Generative AI
                Privilege Summaries in Trial. Uncalibrated Boolean culling in Hold.
              </div>
              <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Global e-Discovery Market:</span>
                  <span className="font-semibold text-slate-900">$14.8B (9.2% CAGR)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Regulatory Focus:</span>
                  <span className="text-slate-800 font-medium">EU AI Act & FRCP 26(f)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('technology-intelligence')}
              className="mt-3.5 pt-2 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
            >
              <span>Inspect Tech Radar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Learning & Enablement Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-50 text-blue-700">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-xs text-slate-900">
                    Personalized Enablement
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Knowledge Checks</span>
              </div>
              <div className="text-xs text-slate-600 mb-3">
                Continue your learning track: <strong className="text-slate-800">Understanding the e-Discovery Lifecycle</strong>.
              </div>
              <div className="p-2.5 bg-slate-50 rounded text-[11px] space-y-1.5 border border-slate-100">
                <div className="flex justify-between text-slate-700">
                  <span>Foundations Score</span>
                  <span className="font-bold text-slate-900">95%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
            <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => navigateTo('assessments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Launch Assessments →</span>
              </button>
              <button
                onClick={() => navigateTo('learning')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                View Modules
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Intelligence Feed & Strategic Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Intelligence Stream */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Recent Intelligence Stream
              </h3>
              <p className="text-[11px] text-slate-500">
                Verified events across competitor moves, client updates, and tools.
              </p>
            </div>
            <span className="text-[11px] text-slate-400">Updated today</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2.5 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Apex Legal Group: Single-Service Churn Warning
                  </span>
                  <span className="text-[10px] text-slate-400">14:00 today</span>
                </div>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  Account relies exclusively on Managed Review while external vendor handles
                  collection. Propose Sightline Forensics bundling to prevent competitor displacement.
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    onClick={() => navigateTo('client-detail', { clientId: 'apex-legal' })}
                    className="text-blue-600 font-semibold hover:underline text-[11px]"
                  >
                    View Account Profile →
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2.5 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Relativity aiR 2.0 Feature Update Issued
                  </span>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  Competitor announced new per-matter pricing models for case strategy assist. Sales
                  battlecards updated with Sightline cost comparison notes.
                </p>
                <div className="mt-1.5">
                  <button
                    onClick={() =>
                      navigateTo('competitor-detail', { competitorId: 'relativity' })
                    }
                    className="text-blue-600 font-semibold hover:underline text-[11px]"
                  >
                    Inspect Relativity Battlecard →
                  </button>
                </div>
              </div>
            </div>

            <div className="py-2.5 flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">
                    Consilio Sightline v8.4.2 Deployed to Production
                  </span>
                  <span className="text-[10px] text-slate-400">3 days ago</span>
                </div>
                <p className="text-slate-600 mt-0.5 text-[11px]">
                  Released enhanced spreadsheet single-cell redactions and GenAI privilege draft
                  rationales for review attorneys.
                </p>
                <div className="mt-1.5">
                  <button
                    onClick={() =>
                      navigateTo('tool-detail', { toolId: 'consilio-sightline' })
                    }
                    className="text-blue-600 font-semibold hover:underline text-[11px]"
                  >
                    View Sightline Documentation →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Actions & Priority Focus */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Recommended Actions
              </h3>
              <p className="text-[11px] text-slate-500">
                Prioritized interventions based on your role ({activeRole}).
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs">
                <div className="font-semibold text-slate-900 mb-1">
                  Cross-Sell Forensics to Single-Service Accounts
                </div>
                <div className="text-[11px] text-slate-600 mb-2">
                  Apex Legal Group, Northstar Holdings, and Meridian Corp represent $3.5M+ in
                  unrealized cross-sell whitespace.
                </div>
                <button
                  onClick={() => openAiSearch(DEMO_AI_SEEDED_QUERY)}
                  className="text-blue-600 font-semibold hover:underline text-[11px] flex items-center gap-1"
                >
                  <span>Analyze in AI Search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs">
                <div className="font-semibold text-slate-900 mb-1">
                  Review e-Discovery Lifecycle Assessment
                </div>
                <div className="text-[11px] text-slate-600 mb-2">
                  Test your understanding of RACI responsibilities and EDRM stage handoffs.
                </div>
                <button
                  onClick={() => navigateTo('assessments')}
                  className="text-blue-600 font-semibold hover:underline text-[11px] flex items-center gap-1"
                >
                  <span>Start Knowledge Assessment</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            Internal Consilio Intelligence Platform v2.4 · All records synthetic
          </div>
        </div>
      </div>
    </div>
  );
};
