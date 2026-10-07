import React, { useState } from 'react';
import {
  Workflow,
  Users,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Wrench,
  CheckCircle,
  Briefcase,
  Sparkles,
  Layers,
  ArrowDown
  ,ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkflowStage, RoleRecord } from '../../types';
import { UNIFIED_WORKFLOW_LAYERS } from '../../data/mockData';
import { DataFreshnessBanner, HelpButton } from '../ui/PageChrome';
import { DataTableTools } from '../ui/DataTableTools';

export const WorkflowRolesView: React.FC = () => {
  const {
    workflowStages,
    roles,
    selectedWorkflowStageId,
    selectedRoleId,
    navigateTo,
    openAiSearch
  } = useApp();

  const [activeStageId, setActiveStageId] = useState<string>(
    selectedWorkflowStageId || 'stage-5'
  );
  const [activeTab, setActiveTab] = useState<'workflow' | 'roles' | 'raci'>('workflow');
  const [activeLayer, setActiveLayer] = useState<'System' | 'Business' | 'Application' | 'Data'>('System');
  const [workflowZoom, setWorkflowZoom] = useState(1);

  const currentStage =
    workflowStages.find(s => s.id === activeStageId) || workflowStages[0];

  return (
    <div className="space-y-6"><DataFreshnessBanner source="Workflow operating model" age="Validated today" />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Intelligence Area 03 · Unified Workflows
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Unified workflow <span className="font-serif italic font-normal text-blue-950">· the operating model</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            See how work moves through the system, the money chain, applications, and data — then expand into stages, roles, tools, and controls.
          </p>
        </div>

        <div className="flex items-center gap-2"><HelpButton title="How to read Workflows" body="Start with a layer of the operating model, then select a stage to inspect ownership, inputs, outputs, tools, and bottlenecks." /><button
          onClick={() =>
            openAiSearch('How does review fit into the e-Discovery workflow?')
          }
          className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/90 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask AI: Review Workflow Fit</span>
        </button></div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">{[
        ['System', 'How work gets done', Workflow],
        ['Business', 'How value moves', Briefcase],
        ['Application', 'Where work happens', Wrench],
        ['Data', 'How signal flows', Layers]
      ].map(([name, copy, Icon]) => { const LayerIcon = Icon as React.ElementType; const isActive = activeLayer === name; return <button key={name as string} className={`premium-card group p-4 text-left transition hover:-translate-y-1 hover:border-blue-200 ${isActive ? 'border-blue-400 bg-blue-50/40 ring-1 ring-blue-200' : ''}`} onClick={() => { setActiveLayer(name as typeof activeLayer); setActiveTab('workflow'); }}><span className="icon-badge"><LayerIcon className="h-4 w-4" /></span><div className="mt-4 text-sm font-semibold text-slate-950">{name as string}</div><div className="mt-1 text-xs text-slate-500">{copy as string}</div><div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-900 transition">{isActive ? 'Layer expanded · inspect below' : 'Explore layer →'}</div></button>; })}</div>
      <div className="premium-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="section-kicker">Active layer</div><div className="mt-2 text-lg font-semibold text-slate-950">{activeLayer} workflow</div><p className="mt-1 text-xs leading-5 text-slate-500">The six delivery stages below are the current eDiscovery subflow. Select a stage to inspect the internal work, owners, tools, and handoffs.</p></div><div className="flex flex-wrap gap-2"><span className="tag tag-blue">6 stages</span><span className="tag bg-slate-100 text-slate-600">RACI linked</span><span className="tag bg-slate-100 text-slate-600">Data lineage ready</span></div></div>
      <section className="premium-card overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4"><div><div className="section-kicker">Interactive workflow orbit</div><div className="mt-1 text-sm font-semibold text-slate-950">Expand the {activeLayer.toLowerCase()} layer</div></div><div className="flex items-center gap-1"><button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-blue-900" onClick={() => setWorkflowZoom(value => Math.min(1.2, value + .1))} title="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></button><button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-blue-900" onClick={() => setWorkflowZoom(value => Math.max(.8, value - .1))} title="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></button><button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:text-blue-900" onClick={() => setWorkflowZoom(1)} title="Reset canvas"><Maximize2 className="h-3.5 w-3.5" /></button><span className="ml-2 text-[10px] font-bold text-slate-400">{Math.round(workflowZoom * 100)}%</span></div></div><div className="workflow-canvas workflow-orbital p-5" style={{ transform: `scale(${workflowZoom})`, transformOrigin: 'top center' }}><div className="workflow-orbit-core"><Workflow className="h-7 w-7" /><span>{activeLayer}<br /><small>operating layer</small></span></div>{UNIFIED_WORKFLOW_LAYERS.find(layer => layer.name.startsWith(activeLayer))?.nodes.map((node, index) => <React.Fragment key={node.id}><article className={`workflow-node premium-card group p-5 transition hover:-translate-y-1 hover:border-blue-200 workflow-node-${index + 1}`}><div className="flex items-start justify-between gap-3"><div><span className="tag tag-blue">{node.metric}</span><h3 className="mt-4 text-base font-semibold text-slate-950">{node.label}</h3></div><ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-900" /></div><p className="mt-2 text-sm leading-6 text-slate-600">{node.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{node.tools.map(tool => <span className="tag bg-slate-100 text-slate-600" key={tool}>{tool}</span>)}</div><div className="mt-4 border-t border-slate-100 pt-3"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Owner · {node.owner}</div><div className="mt-2 flex flex-wrap gap-1.5">{node.subflowStages.map(stage => <span className="text-[11px] font-semibold text-blue-900" key={stage}>{stage}</span>)}</div></div></article></React.Fragment>)}</div></section>

      {/* Top View Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('workflow')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'workflow'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Interactive e-Discovery Lifecycle</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Role Catalog & KPIs ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('raci')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'raci'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>RACI Accountability Matrix</span>
        </button>
      </div>

      {/* TAB 1: WORKFLOW VIEW */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          {/* Horizontal Desktop Flow / Vertical Mobile Flow */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                End-to-End Delivery Stages (Click to Inspect)
              </span>
              <span className="text-[11px] text-slate-400">
                Select a stage below to view tools, inputs & outputs
              </span>
            </div>

            {/* Desktop Horizontal Workflow */}
            <div className="hidden lg:grid grid-cols-6 gap-2">
              {workflowStages.map((stage, idx) => {
                const isSelected = stage.id === activeStageId;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isSelected ? 'text-blue-700' : 'text-slate-400'
                          }`}
                        >
                          {stage.number}
                        </span>
                        {idx < workflowStages.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
                        )}
                      </div>
                      <div
                        className={`font-semibold text-xs leading-snug ${
                          isSelected ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {stage.name}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                        {stage.shortDesc}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-medium">
                      {stage.avgCycleTime}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile / Tablet Vertical Workflow List */}
            <div className="lg:hidden space-y-2">
              {workflowStages.map((stage, idx) => {
                const isSelected = stage.id === activeStageId;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setActiveStageId(stage.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {stage.number}
                      </span>
                      <div>
                        <div className="font-semibold text-xs text-slate-900">
                          {stage.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {stage.shortDesc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Stage Inspector Panel */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Stage {currentStage.number}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {currentStage.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 mt-1">{currentStage.fullDesc}</p>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200/80 self-start sm:self-auto">
                <span className="font-semibold text-slate-700">Throughput Metric:</span>{' '}
                <span>{currentStage.throughputMetric}</span>
              </div>
            </div>

            {/* Stage Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Roles in Stage */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Responsible Roles</span>
                </span>
                <div className="space-y-1.5 pt-1">
                  {currentStage.roles.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200/80"
                    >
                      <span className="font-medium text-slate-800">{r.role}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          r.raci === 'R'
                            ? 'bg-blue-100 text-blue-800'
                            : r.raci === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.raci === 'R'
                          ? 'Responsible'
                          : r.raci === 'A'
                          ? 'Accountable'
                          : r.raci === 'C'
                          ? 'Consulted'
                          : 'Informed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Tools Deployed */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tools & Technologies Deployed</span>
                </span>
                <div className="space-y-1.5 pt-1">
                  {currentStage.toolsUsed.map((toolName, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200/80"
                    >
                      <span className="font-medium text-slate-800">{toolName}</span>
                      <button
                        onClick={() => navigateTo('tools-intelligence')}
                        className="text-blue-600 hover:underline text-[11px]"
                      >
                        Tool Specs →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: Data Lineage (Inputs & Outputs) */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Data Ingestion & Deliverables</span>
                </span>
                <div className="text-xs space-y-2 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      Primary Inputs:
                    </span>
                    <ul className="list-disc list-inside text-slate-700 text-[11px]">
                      {currentStage.primaryInputs.map((inp, idx) => (
                        <li key={idx} className="truncate">
                          {inp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500">
                      Primary Outputs:
                    </span>
                    <ul className="list-disc list-inside text-slate-700 text-[11px]">
                      {currentStage.primaryOutputs.map((out, idx) => (
                        <li key={idx} className="truncate">
                          {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Handoffs and Common Bottlenecks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-semibold text-slate-900 block mb-1">
                  Stage Handoff Protocol:
                </span>
                <p className="text-slate-600 leading-relaxed">{currentStage.handoffs}</p>
              </div>

              <div className="p-3.5 bg-rose-50/70 rounded-lg border border-rose-200 text-xs">
                <span className="font-semibold text-rose-900 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Identified Operational Bottlenecks:</span>
                </span>
                <ul className="list-disc list-inside text-rose-800 text-[11px] space-y-0.5">
                  {currentStage.commonBottlenecks.map((bn, i) => (
                    <li key={i}>{bn}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES CATALOG */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => (
              <div
                key={role.id}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">{role.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{role.department}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-3">{role.overview}</p>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        Primary Tools:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.primaryTools.map(t => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        Target KPIs:
                      </span>
                      <div className="mt-1 space-y-0.5 text-[11px] text-slate-700">
                        {role.kpis.map((kpi, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-slate-500">{kpi.label}:</span>
                            <span className="font-semibold text-slate-900">{kpi.target}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">{role.experienceLevel}</span>
                  <button
                    onClick={() =>
                      openAiSearch(`What are the core responsibilities of a ${role.title}?`)
                    }
                    className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>Ask AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RACI MATRIX */}
      {activeTab === 'raci' && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                End-to-End EDRM RACI Responsibility Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Legend: <strong>R</strong>esponsible, <strong>A</strong>ccountable,{' '}
                <strong>C</strong>onsulted, <strong>I</strong>nformed.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <DataTableTools count={roles.length} sortLabel="Role" onSort={() => setActiveTab('roles')} /><table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                  <th className="p-3">e-Discovery Stage</th>
                  {roles.map(r => (
                    <th key={r.id} className="p-3 whitespace-nowrap">
                      {r.title.split('/')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workflowStages.map(stage => (
                  <tr key={stage.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900 whitespace-nowrap">
                      {stage.number} {stage.name}
                    </td>
                    {roles.map(r => {
                      const match = stage.roles.find(sr => sr.role.includes(r.title.split('/')[0].trim()));
                      const raci = match ? match.raci : '-';
                      return (
                        <td key={r.id} className="p-3 text-center">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-xs ${
                              raci === 'R'
                                ? 'bg-blue-100 text-blue-900'
                                : raci === 'A'
                                ? 'bg-emerald-100 text-emerald-900'
                                : raci === 'C'
                                ? 'bg-amber-100 text-amber-900'
                                : raci === 'I'
                                ? 'bg-slate-100 text-slate-700'
                                : 'text-slate-300'
                            }`}
                          >
                            {raci}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
