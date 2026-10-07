import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Lock,
  DollarSign,
  Briefcase,
  Layers,
  Star,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_AI_SEEDED_QUERY } from '../../data/mockData';

export const ClientDetailView: React.FC = () => {
  const { selectedClientId, clients, navigateTo, activeRole, openAiSearch } = useApp();

  const client = clients.find(c => c.id === selectedClientId) || clients[0];
  const isFinancialRestricted = activeRole === 'New Joiner';

  const [activeTab, setActiveTab] = useState<
    'overview' | 'revenue' | 'services' | 'matters' | 'reviews' | 'health' | 'intelligence'
  >('overview');

  return (
    <div className="space-y-6">
      {/* Back button and breadcrumb action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('client-intelligence')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Client Directory</span>
        </button>

        <button
          onClick={() => openAiSearch(`What services does ${client.name} currently use?`)}
          className="text-xs bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask Gateway about {client.name}</span>
        </button>
      </div>

      {/* Account Profile Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {client.name}
              </h1>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                  client.status === 'Growth'
                    ? 'bg-emerald-50 text-emerald-800'
                    : client.status === 'Active'
                    ? 'bg-blue-50 text-blue-800'
                    : client.status === 'Watch'
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
              >
                {client.status} Status
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>{client.tier} Account</span>
              <span>·</span>
              <span>{client.region}</span>
              <span>·</span>
              <span>{client.industry}</span>
              <span>·</span>
              <span>Client Since {client.clientSince}</span>
              <span>·</span>
              <span className="text-slate-700 font-medium">Owner: {client.accountOwner}</span>
            </div>
          </div>

          {/* Quick health badge */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80 self-start lg:self-auto">
            <div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">
                Health Score
              </div>
              <div
                className={`text-xl font-bold tabular-nums ${
                  client.healthScore >= 80
                    ? 'text-emerald-700'
                    : client.healthScore >= 65
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {client.healthScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="text-[10px] uppercase font-semibold text-slate-500">
                Churn Risk
              </div>
              <div
                className={`text-xs font-bold ${
                  client.churnRisk === 'Low'
                    ? 'text-emerald-700'
                    : client.churnRisk === 'Medium'
                    ? 'text-amber-700'
                    : 'text-rose-600'
                }`}
              >
                {client.churnRisk} Risk
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 overflow-x-auto text-xs font-medium">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'revenue', label: 'Revenue & Trends' },
              { id: 'services', label: 'Services & Whitespace' },
              { id: 'matters', label: 'Active Matters' },
              { id: 'reviews', label: 'Client Reviews' },
              { id: 'health', label: 'Health & Risk Factors' },
              { id: 'intelligence', label: 'Playbook & Actions' }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {/* Churn Warning if Single-service */}
            {client.services.length === 1 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Single-Service Vulnerability Detected</span>
                </div>
                <p className="text-amber-800">
                  {client.name} currently utilizes only <strong>{client.services[0]}</strong>.
                  Accounts relying on a single delivery practice show higher churn probability when
                  competitors pitch integrated end-to-end collections and processing.
                </p>
                <div className="pt-1 font-semibold text-amber-900">
                  Immediate Recommendation: {client.nextBestAction}
                </div>
              </div>
            )}

            {/* Strategic Summary */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Account Strategic Assessment
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {client.name} is an established {client.tier.toLowerCase()} client in the{' '}
                {client.industry} sector with {client.activeMattersCount} active matters totaling{' '}
                {client.documentsProcessedGB} GB of processed digital evidence. Managed by{' '}
                {client.accountOwner}.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                    Services Used
                  </span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5">
                    {client.services.join(', ')}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                    YoY Trajectory
                  </span>
                  <div
                    className={`font-semibold text-xs mt-0.5 ${
                      client.yoyGrowth >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {client.yoyGrowth >= 0 ? `+${client.yoyGrowth}%` : `${client.yoyGrowth}%`}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-medium">
                    Competitor Exposure
                  </span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                    {client.competitorExposure}
                  </div>
                </div>
              </div>
            </div>

            {/* Whitespace Opportunity Card */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Unrealized Whitespace Opportunity
              </h3>
              <div className="text-xs text-blue-900 bg-blue-50/80 p-3 rounded-lg border border-blue-200 font-medium">
                {client.whitespaceOpportunity}
              </div>
              <p className="text-xs text-slate-600">
                Cross-practice discovery packaging allows Consilio to capture upstream forensic
                imaging and downstream production, insulating against rival bids.
              </p>
            </div>
          </div>

          {/* Right Rail: Account Stats & Playbook */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Financial Snapshot (Synthetic)
              </h3>
              {isFinancialRestricted ? (
                <div className="py-4 text-center text-slate-400 text-xs flex flex-col items-center">
                  <Lock className="w-5 h-5 mb-1" />
                  <span>Financial details restricted to Management.</span>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Annual Run-Rate:</span>
                    <span className="font-bold text-slate-900">
                      ${(client.annualRevenue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Portfolio Share:</span>
                    <span className="font-semibold text-slate-900">
                      {client.revenueSharePercent}%
                    </span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span className="text-slate-500">Quarterly Variance:</span>
                    <span
                      className={`font-semibold ${
                        client.qoqGrowth >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {client.qoqGrowth >= 0 ? `+${client.qoqGrowth}%` : `${client.qoqGrowth}%`} QoQ
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Next-Best Action
              </h3>
              <p className="text-xs text-slate-700 font-medium">{client.nextBestAction}</p>
              <button
                onClick={() => openAiSearch(DEMO_AI_SEEDED_QUERY)}
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Launch Action Playbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Revenue */}
      {activeTab === 'revenue' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Quarterly Revenue Trajectory (Synthetic Data)
              </h3>
              <p className="text-xs text-slate-500">
                Historical billed revenue across four sequential quarters.
              </p>
            </div>
            {isFinancialRestricted && (
              <span className="text-xs text-amber-700 font-medium">Restricted View</span>
            )}
          </div>

          {isFinancialRestricted ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <Lock className="w-6 h-6 mx-auto mb-2 text-slate-400" />
              <p>Financial intelligence is restricted for New Joiner role.</p>
              <p className="text-slate-400 mt-1">Switch to Management role to review ledger entries.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {client.quarterlyRevenue.map(q => (
                  <div key={q.quarter} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {q.quarter}
                    </span>
                    <div className="text-base font-bold text-slate-900 mt-1 tabular-nums">
                      ${(q.revenue / 1000).toLocaleString()}k
                    </div>
                  </div>
                ))}
              </div>

              {/* Trajectory comparison */}
              <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-1.5">
                <div className="font-semibold text-slate-900">Revenue Variance Analysis:</div>
                <div className="text-slate-700">
                  {client.yoyGrowth < 0 ? (
                    <span className="text-rose-600 font-semibold">
                      Account exhibits a {Math.abs(client.yoyGrowth)}% year-over-year revenue contraction.
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      Account shows healthy +{client.yoyGrowth}% year-over-year expansion.
                    </span>
                  )}{' '}
                  Primary cause relates to {client.services.length === 1 ? 'concentration in a single practice line' : 'broad adoption across multiple matter workflows'}.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Services */}
      {activeTab === 'services' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            Current Service Mix vs Whitespace Opportunity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="font-semibold text-xs text-slate-900 mb-2">
                Active Consumed Services
              </div>
              <div className="space-y-2">
                {client.serviceMix.map(s => (
                  <div key={s.name} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    <span className="text-slate-600 font-semibold">{s.sharePercent}% share ({s.activeMatters} matters)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/60">
              <div className="font-semibold text-xs text-blue-900 mb-2">
                Target Whitespace Offerings
              </div>
              <p className="text-xs text-blue-800 mb-3">{client.whitespaceOpportunity}</p>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>• Digital Forensics & Mobile Collections</div>
                <div>• Sightline Analytics & Continuous Active Learning</div>
                <div>• Managed Regulatory Disclosures & Privilege Logging</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Reviews & Feedback */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Partner & Client Feedback Log
              </h3>
              <p className="text-xs text-slate-500">
                Direct commentary from law firm litigation directors and corporate counsel.
              </p>
            </div>
          </div>

          {client.reviews.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No formal QBR feedback logged for this account yet.
            </div>
          ) : (
            <div className="space-y-3">
              {client.reviews.map((r, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">
                      {r.author} <span className="text-slate-500 font-normal">· {r.role}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                      <span>★ {r.rating} / 5</span>
                    </div>
                  </div>
                  <p className="text-slate-700 italic">"{r.comment}"</p>
                  <div className="text-[10px] text-slate-400">Recorded {r.date}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Health & Risk Factors */}
      {(activeTab === 'health' || activeTab === 'intelligence' || activeTab === 'matters') && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            Operational Health & Risk Indicators
          </h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-900">Competitor Exposure</div>
                <div>{client.competitorExposure}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-900 mb-1">Recommended Engagement Playbook</div>
              <div>{client.nextBestAction}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
