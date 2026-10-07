import React, { useState } from 'react';
import { ArrowUpRight, Maximize2, Minus, Plus, Workflow } from 'lucide-react';
import { UnifiedWorkflowLayer } from '../../types';
import { UNIFIED_WORKFLOW_LAYERS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface WorkflowOrbitProps {
  areas?: UnifiedWorkflowLayer[];
}

export const WorkflowOrbit: React.FC<WorkflowOrbitProps> = ({ areas = UNIFIED_WORKFLOW_LAYERS }) => {
  const { navigateTo } = useApp();
  const [zoom, setZoom] = useState(1);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>('system');
  const selectedArea = areas.find(area => area.id === selectedAreaId) || null;
  const selectedIndex = Math.max(0, areas.findIndex(area => area.id === selectedAreaId));
  const inspectorOnRight = selectedIndex === 1 || selectedIndex === 2;

  return <section className="premium-card workflow-orbit-card">
    <div className="workflow-orbit-header"><div><div className="section-kicker">Interactive workflow map</div><h2>Explore the intelligence system across its top-level areas.</h2><p>The sun is the company brain. Select a planet to inspect the workflows operating inside that area.</p></div><div className="workflow-map-controls"><button onClick={() => setZoom(value => Math.min(1.12, value + .06))} title="Zoom in"><Plus className="h-3.5 w-3.5" /></button><button onClick={() => setZoom(value => Math.max(.9, value - .06))} title="Zoom out"><Minus className="h-3.5 w-3.5" /></button><button onClick={() => setZoom(1)} title="Reset orbit"><Maximize2 className="h-3.5 w-3.5" /></button><span>{Math.round(zoom * 100)}%</span></div></div>
    <div className="workflow-map-badges"><span>{areas.length} intelligence areas</span><span>Internal workflows connected</span><span>Data lineage ready</span></div>
    <div className="workflow-system-orbit" style={{ '--orbit-scale': zoom } as React.CSSProperties} onClick={event => { if (event.target === event.currentTarget) setSelectedAreaId(null); }}>
      <div className="workflow-atmosphere" /><div className="workflow-orbit-ring workflow-orbit-ring-outer" /><div className="workflow-orbit-ring workflow-orbit-ring-inner" /><div className="workflow-orbit-energy" />
      <svg className="workflow-connections" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="workflow-line" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9bb5eb" stopOpacity=".18" /><stop offset="1" stopColor="#396ed4" stopOpacity=".75" /></linearGradient></defs>{areas.map((area, index) => { const angle = (-90 + index * (360 / Math.max(areas.length, 1))) * Math.PI / 180; const x = 50 + 36 * Math.cos(angle); const y = 50 + 32 * Math.sin(angle); return <line key={area.id} x1="50" y1="50" x2={x} y2={y} className={area.id === selectedAreaId ? 'is-selected' : ''} />; })}</svg>
      <div className="workflow-sun"><div className="workflow-sun-halo" /><Workflow className="h-7 w-7" /><span className="workflow-sun-label">CENTRAL INTELLIGENCE SYSTEM</span><strong>Consilio Gateway</strong><small>COMPANY BRAIN · ACTIVE</small></div>
      <div className="workflow-stage-planets">{areas.map((area, index) => { const angle = (-90 + index * (360 / Math.max(areas.length, 1))) * Math.PI / 180; const x = 50 + 36 * Math.cos(angle); const y = 50 + 32 * Math.sin(angle); const isSelected = area.id === selectedAreaId; return <button key={area.id} type="button" className={`workflow-stage-planet workflow-area-planet ${isSelected ? 'is-selected' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={event => { event.stopPropagation(); setSelectedAreaId(isSelected ? null : area.id); }} aria-label={`Inspect ${area.name} intelligence area`}><span className="planet-status">{String(index + 1).padStart(2, '0')}</span><strong>{area.name}</strong><small>{area.nodes.length} internal workflows</small><em>{area.nodes[0]?.metric}</em></button>; })}</div>
      {selectedArea && <div className={`workflow-stage-inspector workflow-area-inspector area-detail-${selectedIndex + 1} ${inspectorOnRight ? 'inspector-right' : 'inspector-left'}`} onClick={event => event.stopPropagation()}><div className="section-kicker">Intelligence area detail</div><div className="workflow-inspector-title"><span>AREA {String(selectedIndex + 1).padStart(2, '0')}</span><h3>{selectedArea.name}</h3></div><p>{selectedArea.summary}</p><div className="workflow-inspector-area-grid"><div><span>Key workflows</span><div>{selectedArea.nodes.map(node => <button key={node.id} onClick={() => navigateTo('workflow-roles')}><strong>{node.label}</strong><small>{node.metric}</small><ArrowUpRight className="h-3 w-3" /></button>)}</div></div><div className="workflow-inspector-grid"><div><span>Owners</span><strong>{Array.from(new Set(selectedArea.nodes.map(node => node.owner))).join(' · ')}</strong></div><div><span>Connected systems</span><strong>{Array.from(new Set(selectedArea.nodes.flatMap(node => node.tools))).slice(0, 4).join(' · ')}</strong></div><div><span>Data / stages</span><strong>{Array.from(new Set(selectedArea.nodes.flatMap(node => node.subflowStages))).slice(0, 3).join(' · ')}</strong></div></div></div></div>}
    </div>
  </section>;
};
