import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Zap,
  Check,
  Minus,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompetitorRecord } from '../../types';

export const CompetitorIntelligenceView: React.FC = () => {
  const { competitors, navigateTo, openAiSearch, activeRole } = useApp();

  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('relativity');

  const activeCompetitor =
    competitors.find(c => c.id === selectedCompetitorId) || competitors[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Intelligence Area 02
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Competitor Intelligence & Market Positioning
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time market share tracking, capability comparison matrices, competitor product
            releases, and RFP battlecards against major e-discovery rivals.
          </p>
        </div>

        <button
          onClick={() => openAiSearch('Which competitors launched AI products recently?')}
          className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/90 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask AI: Competitor AI Launches</span>
        </button>
      </div>

      {/* Competitor Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {competitors.map(comp => (
          <div
            key={comp.id}
            onClick={() => setSelectedCompetitorId(comp.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
              selectedCompetitorId === comp.id
                ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-bold text-sm text-slate-900">{comp.name}</span>
                <span className="text-[11px] font-semibold text-slate-600">
                  {comp.marketSharePct}% Share
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">{comp.marketPosition}</div>
              <div className="mt-2 text-[11px] text-slate-600 line-clamp-2">
                {comp.analystRanking}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold text-[11px]">
                +{comp.capabilityGapScore}% Consilio Edge
              </span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigateTo('competitor-detail', { competitorId: comp.id });
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 text-xs"
              >
                <span>Battlecard</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Head-to-Head Capability Comparison Matrix */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Consilio vs {activeCompetitor.name} Capability Comparison Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across core discovery operational competencies.
            </p>
          </div>

          <button
            onClick={() => navigateTo('competitor-detail', { competitorId: activeCompetitor.id })}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Full Profile for {activeCompetitor.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-2.5 px-3.5">Operational Capability</th>
                <th className="py-2.5 px-3">Consilio Evaluation</th>
                <th className="py-2.5 px-3">{activeCompetitor.name} Evaluation</th>
                <th className="py-2.5 px-3 text-right">Advantage Differential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeCompetitor.capabilities.map((cap, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-slate-900 whitespace-nowrap">
                    {cap.capability}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        cap.consilioRating === 'Leading'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {cap.consilioRating}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        cap.competitorRating === 'Leading'
                          ? 'bg-purple-50 text-purple-800'
                          : cap.competitorRating === 'Strong'
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {cap.competitorRating}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    {cap.differential > 0 ? (
                      <span className="text-emerald-700 font-bold">
                        +{cap.differential} Consilio Advantage
                      </span>
                    ) : cap.differential < 0 ? (
                      <span className="text-rose-600 font-semibold">
                        {cap.differential} Competitor Advantage
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Parity</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculated Capability Gap Score summary */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900">
              Overall Capability Advantage Score vs {activeCompetitor.name}:
            </span>{' '}
            <span className="text-emerald-700 font-bold">
              +{activeCompetitor.capabilityGapScore}% Net Consilio Edge
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Calculated across Managed Services, ITAR Security, and Forensics depth.
          </div>
        </div>
      </div>

      {/* Battlecard Highlights & Recent Competitor Moves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Battlecard Strategy */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>RFP Battlecard: How Consilio Wins vs {activeCompetitor.name}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {activeCompetitor.battlecardSummary}
          </p>

          <div className="pt-2 space-y-2 text-xs">
            <div className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
              Key Consilio Strengths to Lead With:
            </div>
            <ul className="space-y-1 text-slate-600">
              {activeCompetitor.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Competitor Moves & Releases */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Recent Market Moves & Product Releases</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {activeCompetitor.recentMoves.map((move, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="flex justify-between items-center text-slate-900 font-semibold mb-0.5">
                  <span>{move.title}</span>
                  <span className="text-[10px] text-slate-400">{move.date}</span>
                </div>
                <div className="text-slate-600 text-[11px]">{move.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
