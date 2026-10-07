import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  Radar,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TECH_RADAR_ITEMS } from '../../data/mockData';
import { RadarRing, TechRadarItem } from '../../types';

export const TechnologyRadarView: React.FC = () => {
  const { openAiSearch } = useApp();

  const [selectedRing, setSelectedRing] = useState<'All' | RadarRing>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredItems = TECH_RADAR_ITEMS.filter(item => {
    if (selectedRing !== 'All' && item.ring !== selectedRing) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const getRingColor = (ring: RadarRing) => {
    switch (ring) {
      case 'Adopt':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Trial':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Assess':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Hold':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Intelligence Area 05
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Industry Technology Radar & Regulatory Watch
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Strategic technology assessment across emerging legaltech, Generative AI models,
            courtroom defensibility benchmarks, and regulatory compliance changes.
          </p>
        </div>

        <button
          onClick={() =>
            openAiSearch('What technologies are currently in the Trial and Assess rings?')
          }
          className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/90 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask AI: Tech Radar Analysis</span>
        </button>
      </div>

      {/* Market Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Global e-Discovery Market</span>
          <div className="my-1 font-bold text-xl text-slate-900 tabular-nums">
            $14.8 Billion
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+9.2% CAGR (2026-2030)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">GenAI in Legal Spend</span>
          <div className="my-1 font-bold text-xl text-blue-700 tabular-nums">
            $1.42B (9.6% share)
          </div>
          <div className="text-[11px] text-slate-500">
            Rapid enterprise pilot acceleration
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">TAR 2.0 Court Acceptance</span>
          <div className="my-1 font-bold text-xl text-emerald-700 tabular-nums">
            100% Defensible
          </div>
          <div className="text-[11px] text-slate-500">
            Validated in Da Silva Moore precedents
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Primary Regulatory Watch</span>
          <div className="my-1 font-bold text-sm text-slate-900 mt-1">
            EU AI Act & FRCP 26(f)
          </div>
          <div className="text-[11px] text-slate-500">
            Strict AI disclosure requirements
          </div>
        </div>
      </div>

      {/* Visual Radar Rings Overview Card */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Technology Radar Quadrants & Rings
            </h3>
            <p className="text-xs text-slate-500">
              Categorized by production readiness, court defensibility, and client adoption.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(['All', 'Adopt', 'Trial', 'Assess', 'Hold'] as const).map(ring => (
              <button
                key={ring}
                onClick={() => setSelectedRing(ring)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedRing === ring
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {ring}
              </button>
            ))}
          </div>
        </div>

        {/* Ring Descriptions Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded bg-emerald-50/70 border border-emerald-200">
            <span className="font-bold text-emerald-900">Adopt:</span>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Production standard across matters; proven courtroom defensibility.
            </p>
          </div>

          <div className="p-2.5 rounded bg-blue-50/70 border border-blue-200">
            <span className="font-bold text-blue-900">Trial:</span>
            <p className="text-[11px] text-blue-800 mt-0.5">
              Active pilot projects with client consent; verified human-in-the-loop.
            </p>
          </div>

          <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200">
            <span className="font-bold text-amber-900">Assess:</span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              R&D evaluation; tracking legal admissibility and security parameters.
            </p>
          </div>

          <div className="p-2.5 rounded bg-rose-50/70 border border-rose-200">
            <span className="font-bold text-rose-900">Hold:</span>
            <p className="text-[11px] text-rose-800 mt-0.5">
              Phased out or high risk; creates client budget fatigue or court sanctions.
            </p>
          </div>
        </div>

        {/* Radar Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">{item.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRingColor(
                    item.ring
                  )}`}
                >
                  {item.ring}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                Category: {item.category} · Consilio Maturity: {item.consilioMaturity}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{item.summary}</p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                <div className="text-slate-600">
                  <strong className="text-slate-800">Impact on Roles:</strong> {item.impactOnRoles}
                </div>
                <div className="text-slate-600">
                  <strong className="text-slate-800">Regulatory & Defensibility:</strong>{' '}
                  {item.regulatoryConsiderations}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory & Legal-Tech Watch Panel */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Active Legal-Tech & Court Regulatory Watch</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900">EU AI Act (Enforced 2026)</span>
            <p className="text-slate-600 text-[11px]">
              Classifies automated legal document categorization as high-risk if utilized for final
              substantive rights determinations. Mandates continuous human oversight and bias audits.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900">FRCP 26(f) AI Transparency</span>
            <p className="text-slate-600 text-[11px]">
              Federal judges increasingly requiring parties to disclose whether generative models
              or LLMs assisted in privilege log generation or search query formulation.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900">Cross-Border Data Sovereignty</span>
            <p className="text-slate-600 text-[11px]">
              Strict limitations on cloud LLM inference crossing EU or APAC boundaries. Consilio
              deploys in-region tenant isolation for all foreign-custodian datasets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
