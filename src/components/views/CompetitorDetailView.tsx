import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Lock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DataTableTools } from '../ui/DataTableTools';

export const CompetitorDetailView: React.FC = () => {
  const { selectedCompetitorId, competitors, navigateTo, activeRole, openAiSearch } = useApp();

  const competitor =
    competitors.find(c => c.id === selectedCompetitorId) || competitors[0];

  const isManagement = activeRole === 'Management';

  const [activeTab, setActiveTab] = useState<'battlecard' | 'capabilities' | 'swot' | 'pricing'>(
    'battlecard'
  );
  const [capabilityQuery, setCapabilityQuery] = useState('');
  const visibleCapabilities = competitor.capabilities.filter(item => item.capability.toLowerCase().includes(capabilityQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('competitor-intelligence')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Competitor Directory</span>
        </button>

        <button
          onClick={() =>
            openAiSearch(`How do we compete against ${competitor.name} in document review?`)
          }
          className="text-xs bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask Gateway about {competitor.name}</span>
        </button>
      </div>

      {/* Competitor Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {competitor.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800">
                {competitor.marketPosition}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>{competitor.marketSharePct}% Market Share</span>
              <span>·</span>
              <span>{competitor.analystRanking}</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg self-start sm:self-auto">
            <div className="text-[10px] uppercase font-semibold text-emerald-800">
              Capability Advantage
            </div>
            <div className="text-xl font-bold text-emerald-900">
              +{competitor.capabilityGapScore}% Net Consilio Edge
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-6 overflow-x-auto text-xs font-medium">
          {(
            [
              { id: 'battlecard', label: 'RFP Battlecard & Win Strategy' },
              { id: 'capabilities', label: 'Capability Breakdown' },
              { id: 'swot', label: 'SWOT Analysis' },
              { id: 'pricing', label: 'Pricing & Licensing Model' }
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

      {/* Tab: Battlecard */}
      {activeTab === 'battlecard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Primary Battlecard Narrative
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {competitor.battlecardSummary}
              </p>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-blue-900">Recommended Pitch Wedge:</div>
                <div className="text-blue-800">
                  Lead with Consilio’s unified SLA. While {competitor.name} licenses software seats
                  and leaves staffing to separate partner vendors, Consilio delivers end-to-end
                  forensics, processing, and managed review with zero markups.
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Key Offerings & Software Suite
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {competitor.keyOfferings.map(off => (
                  <div key={off} className="p-2.5 bg-slate-50 rounded border border-slate-200 font-medium text-slate-800">
                    {off}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Recent Moves & Strategy
              </h3>
              <div className="space-y-2.5 text-xs">
                {competitor.recentMoves.map((m, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                    <div className="font-semibold text-slate-900 text-xs">{m.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{m.date}</div>
                    <div className="text-slate-600 text-[11px] mt-1">{m.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Capabilities */}
      {activeTab === 'capabilities' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            Head-to-Head Capability Scores
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 p-3"><input value={capabilityQuery} onChange={event => setCapabilityQuery(event.target.value)} placeholder="Filter capabilities…" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-800" /><DataTableTools count={visibleCapabilities.length} sortLabel="Capability" /></div><table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-[11px]">
                  <th className="p-3">Capability</th>
                  <th className="p-3">Consilio Rating</th>
                  <th className="p-3">{competitor.name} Rating</th>
                  <th className="p-3 text-right">Differential</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleCapabilities.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{c.capability}</td>
                    <td className="p-3">{c.consilioRating}</td>
                    <td className="p-3">{c.competitorRating}</td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {c.differential > 0 ? `+${c.differential} Consilio` : 'Parity'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: SWOT */}
      {activeTab === 'swot' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Strengths
            </div>
            <ul className="text-xs space-y-1 text-slate-600">
              {competitor.swot.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Weaknesses & Vulnerabilities
            </div>
            <ul className="text-xs space-y-1 text-slate-600">
              {competitor.swot.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Pricing */}
      {activeTab === 'pricing' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Pricing Intelligence & Model Mechanics
              </h3>
              <p className="text-xs text-slate-500">
                How {competitor.name} packages licenses and compute fees.
              </p>
            </div>
            {!isManagement && (
              <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Restricted Intel</span>
              </span>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg text-xs space-y-2 border border-slate-200">
            <div className="font-semibold text-slate-900">Pricing Model Structure:</div>
            <div className="text-slate-700">{competitor.pricingModel}</div>
          </div>
        </div>
      )}
    </div>
  );
};
