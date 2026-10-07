import React, { useState } from 'react';
import {
  Wrench,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Layers,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InternalToolRecord } from '../../types';

export const ToolsIntelligenceView: React.FC = () => {
  const { tools, selectedToolId, navigateTo, openAiSearch } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolState, setSelectedToolState] = useState<string>(
    selectedToolId || 'consilio-sightline'
  );

  const activeTool = tools.find(t => t.id === selectedToolState) || tools[0];

  const filteredTools = tools.filter(
    t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Intelligence Area 04
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Internal Tools & Technology Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Plain-language software profiles, tool-to-stage mappings, fleet adoption metrics, and
            direct Atlas documentation guides.
          </p>
        </div>

        <button
          onClick={() => openAiSearch('What tools are used during review?')}
          className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/90 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask AI: Tools Used During Review</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Tool Cards List */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools by name, stage, capability..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-2">
            {filteredTools.map(tool => {
              const isSelected = tool.id === activeTool.id;
              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedToolState(tool.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-400 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{tool.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        tool.adoptionTier === 'Enterprise Standard'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tool.adoptionTier}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{tool.category}</div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{tool.whatItDoes}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{tool.adoptionRatePct}% Fleet Adoption</span>
                    <span className="text-blue-600 font-medium">Inspect Tool →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Tool Profile */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {activeTool.name}
                  </h2>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{activeTool.systemStatus}</span>
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{activeTool.tagline}</div>
              </div>

              {/* Atlas Action Button */}
              <a
                href={activeTool.atlasDocUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto"
              >
                <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                <span>Open in Atlas</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Plain language "What Does It Do?" Card */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600">
                Plain-Language Overview: What Does It Do?
              </span>
              <p className="text-slate-800 leading-relaxed text-xs">{activeTool.whatItDoes}</p>
            </div>

            {/* Operational Mappings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Who uses it */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Primary Assigned Roles</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTool.whoUsesIt.map(role => (
                    <span
                      key={role}
                      className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-[11px]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Workflow stages mapped */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Workflow Stages Deployed In</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTool.workflowStages.map(st => (
                    <span
                      key={st}
                      className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded text-[11px] font-medium"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Licensing & Fleet Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-semibold text-slate-900">Licensing Model:</span>
                <div className="text-slate-700 text-[11px]">{activeTool.licenseModel}</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="font-semibold text-slate-900">Fleet Deployment Tier:</span>
                <div className="text-slate-700 text-[11px]">
                  {activeTool.adoptionTier} · {activeTool.adoptionRatePct}% active matters
                </div>
              </div>
            </div>

            {/* Recent Releases & Change Log */}
            <div className="space-y-2 pt-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Recent Releases & Version Changes
              </span>
              <div className="space-y-2 text-xs">
                {activeTool.recentReleases.map((rel, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{rel.version}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{rel.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{rel.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
