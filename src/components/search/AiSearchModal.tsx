import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Building2,
  ShieldCheck,
  Workflow,
  Wrench,
  Cpu,
  Bookmark,
  ChevronRight,
  FileText,
  TrendingDown,
  AlertTriangle,
  Database,
  Info
  ,Mic
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IntelligenceArea, AiSearchResult, ClientRecord } from '../../types';
import {
  SEEDED_AI_SEARCH_RESULT,
  DEMO_AI_SEEDED_QUERY,
  QUICK_SEARCH_PRESETS,
  INITIAL_CLIENTS,
  INITIAL_COMPETITORS,
  INTERNAL_TOOLS,
  E_DISCOVERY_WORKFLOW_STAGES
} from '../../data/mockData';

export const AiSearchModal: React.FC = () => {
  const {
    isAiSearchOpen,
    closeAiSearch,
    aiSearchInitialQuery,
    navigateTo,
    activeRole
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<'All' | IntelligenceArea>('All');
  const [activeResult, setActiveResult] = useState<AiSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isAiSearchOpen) {
      if (aiSearchInitialQuery) {
        setSearchQuery(aiSearchInitialQuery);
        executeSearch(aiSearchInitialQuery);
      } else {
        setSearchQuery('');
        setActiveResult(null);
      }
    }
  }, [isAiSearchOpen, aiSearchInitialQuery]);

  if (!isAiSearchOpen) return null;

  const executeSearch = (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    setSearchQuery(queryText);

    setTimeout(() => {
      const lower = queryText.toLowerCase();

      if (lower.includes('high-risk') || lower.includes('high risk')) {
        const highRiskClients = INITIAL_CLIENTS.filter(client => client.churnRisk === 'High');
        setActiveResult({
          query: queryText,
          summary: `${highRiskClients.length} client accounts are currently flagged high risk. Open the client view to inspect their service concentration and next-best actions.`,
          evidenceClients: highRiskClients,
          sources: [{ title: 'Client Health Signals', dataset: 'Consilio Client Master Index', lastUpdated: '08 Oct 2026' }],
          followUpQuestions: ['Which high-risk clients are single-service?', 'Show the revenue trend for high-risk accounts.'],
          contextualActions: [{ label: 'Open High-Risk Clients', targetView: 'client-intelligence' }]
        });
        setIsSearching(false);
        return;
      }

      // Check if it matches our demo seeded query
      if (
        lower.includes('declining revenue') ||
        lower.includes('one consilio service') ||
        lower.includes('only one service') ||
        lower.includes('declining')
      ) {
        setActiveResult(SEEDED_AI_SEARCH_RESULT);
        setIsSearching(false);
        return;
      }

      // Check if asking about tools during review
      if (lower.includes('tools') && lower.includes('review')) {
        const reviewStage = E_DISCOVERY_WORKFLOW_STAGES.find(s => s.id === 'stage-5')!;
        const reviewTools = INTERNAL_TOOLS.filter(t =>
          t.workflowStages.includes('Managed Document Review')
        );

        setActiveResult({
          query: queryText,
          summary:
            "During the Managed Document Review stage, Consilio leverages proprietary Sightline alongside RelativityOne for review workspaces, augmented by Brainspace for Continuous Active Learning (CAL).",
          evidenceTools: reviewTools,
          evidenceWorkflow: reviewStage,
          sources: [
            { title: 'Workflow & Roles Architecture', dataset: 'EDRM Stage 05 Specification', lastUpdated: '01 Oct 2026' },
            { title: 'Internal Tools Catalog', dataset: 'Consilio Technology Register', lastUpdated: '28 Sep 2026' }
          ],
          followUpQuestions: [
            "What is the difference between Sightline and Relativity pricing?",
            "Who are the assigned roles in the Review stage?",
            "How does Continuous Active Learning retrain during review?"
          ],
          contextualActions: [
            { label: "Inspect Review Workflow Stage", targetView: "workflow-roles", targetId: "stage-5" },
            { label: "Open Consilio Sightline Profile", targetView: "tools-intelligence", targetId: "consilio-sightline" },
            { label: "View Brainspace Analytics Profile", targetView: "tools-intelligence", targetId: "brainspace" }
          ]
        });
        setIsSearching(false);
        return;
      }

      // Check if asking about workflow
      if (lower.includes('workflow') || lower.includes('lifecycle') || lower.includes('edrm')) {
        setActiveResult({
          query: queryText,
          summary:
            "The e-Discovery workflow spans six structured phases: 01 Identification & Preservation, 02 Forensic Collection, 03 Ingestion & Processing, 04 Analysis & ECA, 05 Managed Review, and 06 Production.",
          evidenceWorkflow: E_DISCOVERY_WORKFLOW_STAGES[4],
          sources: [
            { title: 'Consilio Delivery Handbook', dataset: 'Standard Operating Procedures v4.2', lastUpdated: '15 Sep 2026' }
          ],
          followUpQuestions: [
            "What roles participate in Identification & Preservation?",
            "What are the most common bottlenecks in Ingestion & Processing?",
            "How does Early Case Assessment reduce linear review volumes?"
          ],
          contextualActions: [
            { label: "Open Interactive Workflow Map", targetView: "workflow-roles" },
            { label: "Explore Roles Directory", targetView: "workflow-roles" }
          ]
        });
        setIsSearching(false);
        return;
      }

      // Check if competitor intelligence
      if (lower.includes('competitor') || lower.includes('relativity') || lower.includes('epiq') || lower.includes('ai product')) {
        setActiveResult({
          query: queryText,
          summary:
            "Relativity recently launched aiR 2.0 for privilege logging and case strategy. Epiq introduced automated redactions, while Lighthouse expanded its Microsoft Copilot advisory. Consilio's key defensive edge remains full-service managed delivery and proprietary Sightline without third-party seat markups.",
          evidenceCompetitors: INITIAL_COMPETITORS.slice(0, 3),
          sources: [
            { title: 'Competitor Intelligence Radar', dataset: 'Consilio Strategy & Market Tracking', lastUpdated: '03 Oct 2026' },
            { title: 'Analyst Reports Matrix', dataset: 'IDC / Gartner 2026 LegalTech MarketScape', lastUpdated: '22 Aug 2026' }
          ],
          followUpQuestions: [
            "Show me the Consilio vs Relativity capability matrix",
            "What is our win-loss ratio against Epiq?",
            "Compare managed services capabilities across competitors"
          ],
          contextualActions: [
            { label: "Open Competitor Matrix", targetView: "competitor-intelligence" },
            { label: "View Relativity Battlecard", targetView: "competitor-detail", targetId: "relativity" }
          ]
        });
        setIsSearching(false);
        return;
      }

      // Fallback search over clients
      const matchingClients = INITIAL_CLIENTS.filter(
        c =>
          c.name.toLowerCase().includes(lower) ||
          c.industry.toLowerCase().includes(lower) ||
          c.accountOwner.toLowerCase().includes(lower) ||
          c.status.toLowerCase().includes(lower)
      );

      if (matchingClients.length > 0) {
        setActiveResult({
          query: queryText,
          summary: `Found ${matchingClients.length} enterprise client accounts matching "${queryText}".`,
          evidenceClients: matchingClients.slice(0, 4),
          sources: [
            { title: 'Client Master Index', dataset: 'Consilio Client Relationship Ledger', lastUpdated: '04 Oct 2026' }
          ],
          followUpQuestions: [
            "Which of these clients are in North America?",
            "Show revenue concentration across these accounts",
            "What whitespace opportunities exist?"
          ],
          contextualActions: [
            { label: "View First Client Profile", targetView: "client-detail", targetId: matchingClients[0].id },
            { label: "Open Client Intelligence Overview", targetView: "client-intelligence" }
          ]
        });
      } else {
        // Generic synthesized query response
        setActiveResult({
          query: queryText,
          summary: `Enterprise intelligence synthesis for "${queryText}": Consilio's unified ecosystem integrates forensic collection, automated ingestion, and managed legal review across AmLaw 100 firms and Fortune 500 corporations.`,
          sources: [
            { title: 'Enterprise Intelligence Gateway', dataset: 'Consilio Unified Master Knowledge Base', lastUpdated: '04 Oct 2026' }
          ],
          followUpQuestions: [
            "Which clients have declining revenue and are using only one Consilio service?",
            "What tools are used during review?",
            "Compare Consilio against Relativity"
          ],
          contextualActions: [
            { label: "Return to Overview", targetView: "overview" },
            { label: "Open Client Intelligence", targetView: "client-intelligence" },
            { label: "Open Workflow Intelligence", targetView: "workflow-roles" }
          ]
        });
      }
      setIsSearching(false);
    }, 280);
  };

  const handleActionClick = (targetView: string, targetId?: string) => {
    closeAiSearch();
    if (targetView === 'client-detail' && targetId) {
      navigateTo('client-detail', { clientId: targetId });
    } else if (targetView === 'client-intelligence') {
      navigateTo('client-intelligence');
    } else if (targetView === 'competitor-detail' && targetId) {
      navigateTo('competitor-detail', { competitorId: targetId });
    } else if (targetView === 'competitor-intelligence') {
      navigateTo('competitor-intelligence');
    } else if (targetView === 'workflow-roles' || targetView === 'workflow') {
      navigateTo('workflow-roles', { stageId: targetId });
    } else if (targetView === 'tools-intelligence' && targetId) {
      navigateTo('tool-detail', { toolId: targetId });
    } else if (targetView === 'tools-intelligence') {
      navigateTo('tools-intelligence');
    } else {
      navigateTo('overview');
    }
  };

  return (
    <div className="chat-drawer overflow-hidden">
      <div className="bg-white/60 w-full h-full overflow-hidden flex flex-col">
        {/* Header Search Input */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search the company brain... (e.g. Which clients have declining revenue?)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                executeSearch(searchQuery);
              }
            }}
            autoFocus
            className="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden font-medium"
          />
          <button className="button-ghost !p-2 !rounded-full" title="Use browser microphone (mock flow)" onClick={() => {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) { setSearchQuery('Show high-risk clients'); executeSearch('Show high-risk clients'); return; }
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.onresult = (event: any) => { const transcript = event.results[0][0].transcript; setSearchQuery(transcript); executeSearch(transcript); };
            recognition.start();
          }}><Mic className="h-3.5 w-3.5" /></button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveResult(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={closeAiSearch}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intelligence Area Category Filter Bar */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-medium text-slate-400 mr-1 shrink-0">
            Intelligence areas:
          </span>
          {(['All', 'Clients', 'Competitors', 'Workflow', 'Tools', 'Technology'] as const).map(
            area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                  selectedArea === area
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {area === 'Competitors' ? 'Market' : area === 'Tools' ? 'Solution 360' : area}
              </button>
            )
          )}
        </div>

        {/* Body Area */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Loading state */}
          {isSearching && (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-xs font-medium">Cross-referencing enterprise intelligence repositories...</div>
            </div>
          )}

          {/* When no query executed yet: show guidelines and suggested queries */}
          {!isSearching && !activeResult && (
            <div className="space-y-5">
              <div className="text-xs text-slate-600 leading-relaxed bg-blue-50/70 border border-blue-100/80 rounded-lg p-3.5 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-0.5">
                    Consilio Cross-Platform Intelligence Gateway
                  </div>
                  <div className="text-blue-800">
                    Ask natural language questions to query client health, competitor positioning,
                    e-Discovery workflow stages, internal tools, and technology trends across our organization.
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Suggested & Benchmark Queries
                </div>
                <div className="space-y-1.5">
                  {QUICK_SEARCH_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeSearch(preset.query)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-slate-400 group-hover:text-blue-600">
                          •
                        </span>
                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                          {preset.query}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Render Active AI Intelligence Result */}
          {!isSearching && activeResult && (
            <div className="space-y-5">
              {/* 1. Direct Answer Summary */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Intelligence Gateway Answer</span>
                </div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {activeResult.summary}
                </p>
              </div>

              {/* 2. Structured Evidence Table / Cards */}
              {activeResult.evidenceClients && activeResult.evidenceClients.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Identified Client Accounts ({activeResult.evidenceClients.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Synthetic financial metrics
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-600">
                          <th className="py-2.5 px-3">Client</th>
                          <th className="py-2.5 px-3">Revenue Trend</th>
                          <th className="py-2.5 px-3">Services</th>
                          <th className="py-2.5 px-3">Health</th>
                          <th className="py-2.5 px-3">Opportunity</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeResult.evidenceClients.map(client => (
                          <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                              {client.name}
                              <div className="text-[10px] text-slate-400 font-normal">
                                {client.tier} · {client.region}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 tabular-nums font-medium text-rose-600 whitespace-nowrap">
                              ↓ {Math.abs(client.yoyGrowth)}% YoY
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="text-slate-800 font-medium">
                                {client.services.join(', ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span
                                className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                                  client.status === 'Attention'
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {client.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                              {client.whitespaceOpportunity}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleActionClick('client-detail', client.id)}
                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-xs inline-flex items-center gap-1"
                              >
                                View
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Evidence Tools (if searching for tools) */}
              {activeResult.evidenceTools && (
                <div>
                  <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Review Stage Internal Tools
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeResult.evidenceTools.map(tool => (
                      <div
                        key={tool.id}
                        className="p-3 border border-slate-200 rounded-lg bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-xs mb-1">
                            {tool.name}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            {tool.whatItDoes}
                          </p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">{tool.adoptionTier}</span>
                          <button
                            onClick={() => handleActionClick('tools-intelligence', tool.id)}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            Tool Details →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Citations & Sources */}
              {activeResult.sources && activeResult.sources.length > 0 && (
                <div className="p-3 bg-slate-50/90 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-slate-500" />
                    <span>Cited Intelligence Datasets</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeResult.sources.map((src, i) => (
                      <div
                        key={i}
                        className="text-[11px] bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-700 flex items-center gap-1.5"
                      >
                        <span className="font-medium text-slate-900">{src.title}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{src.dataset}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-400 text-[10px]">{src.lastUpdated}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Suggested Follow-Up Questions */}
              {activeResult.followUpQuestions && activeResult.followUpQuestions.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Suggested Follow-Up Investigations
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeResult.followUpQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => executeSearch(q)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Contextual Deep Actions */}
              {activeResult.contextualActions && activeResult.contextualActions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                  {activeResult.contextualActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action.targetView, action.targetId)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>{action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Prototype grounded in Consilio internal mock taxonomy</span>
          </div>
          <div>
            <span>Press </span>
            <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
              Esc
            </kbd>
            <span> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
