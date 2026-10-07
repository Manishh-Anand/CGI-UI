import React, { useMemo, useState } from 'react';
import { Maximize2, Minus, Plus, Workflow } from 'lucide-react';
import { WorkflowStage } from '../../types';

interface WorkflowOrbitProps {
  stages: WorkflowStage[];
  activeStageId: string;
  onStageChange: (stageId: string) => void;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const WorkflowOrbit: React.FC<WorkflowOrbitProps> = ({ stages, activeStageId, onStageChange }) => {
  const [zoom, setZoom] = useState(1);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(activeStageId);
  const selectedStage = stages.find(stage => stage.id === selectedStageId) || null;
  const selectedIndex = Math.max(0, stages.findIndex(stage => stage.id === selectedStageId));
  const selectedPosition = useMemo(() => {
    const angle = -90 + selectedIndex * (360 / Math.max(stages.length, 1));
    const radians = angle * Math.PI / 180;
    return { x: 50 + 37 * Math.cos(radians), y: 50 + 34 * Math.sin(radians) };
  }, [selectedIndex, stages.length]);
  const inspectorOnRight = selectedPosition.x < 50;
  const inspectorLeft = inspectorOnRight
    ? clamp(selectedPosition.x + 10, 28, 67)
    : clamp(selectedPosition.x - 29, 3, 61);
  const inspectorTop = clamp(selectedPosition.y - 14, 5, 68);

  const selectStage = (stage: WorkflowStage) => {
    const nextId = selectedStageId === stage.id ? null : stage.id;
    setSelectedStageId(nextId);
    if (nextId) onStageChange(nextId);
  };

  return <section className="premium-card workflow-orbit-card overflow-hidden">
    <div className="workflow-orbit-header"><div><div className="section-kicker">Interactive workflow map</div><h2>Explore how the workflow operates across each delivery stage.</h2><p>Select a stage to inspect ownership, tools, handoffs, and downstream actions.</p></div><div className="workflow-map-controls"><button onClick={() => setZoom(value => Math.min(1.12, value + .06))} title="Zoom in"><Plus className="h-3.5 w-3.5" /></button><button onClick={() => setZoom(value => Math.max(.9, value - .06))} title="Zoom out"><Minus className="h-3.5 w-3.5" /></button><button onClick={() => setZoom(1)} title="Reset orbit"><Maximize2 className="h-3.5 w-3.5" /></button><span>{Math.round(zoom * 100)}%</span></div></div>
    <div className="workflow-map-badges"><span>6 stages</span><span>RACI linked</span><span>Data lineage ready</span></div>
    <div className="workflow-system-orbit" style={{ '--orbit-scale': zoom } as React.CSSProperties} onClick={event => { if (event.target === event.currentTarget) setSelectedStageId(null); }}>
      <div className="workflow-atmosphere" /><div className="workflow-orbit-ring workflow-orbit-ring-outer" /><div className="workflow-orbit-ring workflow-orbit-ring-inner" /><div className="workflow-orbit-energy" />
      <svg className="workflow-connections" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="workflow-line" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9bb5eb" stopOpacity=".18" /><stop offset="1" stopColor="#396ed4" stopOpacity=".75" /></linearGradient></defs>{stages.map((stage, index) => { const angle = (-90 + index * (360 / Math.max(stages.length, 1))) * Math.PI / 180; const x = 50 + 37 * Math.cos(angle); const y = 50 + 34 * Math.sin(angle); const isSelected = stage.id === selectedStageId; return <line key={stage.id} x1="50" y1="50" x2={x} y2={y} className={isSelected ? 'is-selected' : ''} />; })}</svg>
      <div className="workflow-sun"><div className="workflow-sun-halo" /><Workflow className="h-7 w-7" /><span className="workflow-sun-label">CURRENT WORKFLOW</span><strong>eDiscovery lifecycle</strong><small>6 STAGES · ACTIVE</small></div>
      <div className="workflow-stage-planets">{stages.map((stage, index) => { const angle = (-90 + index * (360 / Math.max(stages.length, 1))) * Math.PI / 180; const x = 50 + 37 * Math.cos(angle); const y = 50 + 34 * Math.sin(angle); const isSelected = stage.id === selectedStageId; return <button key={stage.id} type="button" className={`workflow-stage-planet ${isSelected ? 'is-selected' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={event => { event.stopPropagation(); selectStage(stage); }} aria-label={`Inspect ${stage.name}`}><span className="planet-status">{stage.number}</span><strong>{stage.name}</strong><small>{stage.roles[0]?.role || 'Delivery team'}</small><em>{stage.avgCycleTime}</em></button>; })}</div>
      {selectedStage && <div className={`workflow-stage-inspector ${inspectorOnRight ? 'inspector-right' : 'inspector-left'}`} style={{ left: `${inspectorLeft}%`, top: `${inspectorTop}%` }} onClick={event => event.stopPropagation()}><div className="section-kicker">Planet detail</div><div className="workflow-inspector-title"><span>{selectedStage.number}</span><h3>{selectedStage.name}</h3></div><p>{selectedStage.fullDesc}</p><div className="workflow-inspector-grid"><div><span>Owner</span><strong>{selectedStage.roles.find(role => role.raci === 'A')?.role || selectedStage.roles[0]?.role}</strong></div><div><span>Tools</span><strong>{selectedStage.toolsUsed.slice(0, 2).join(' · ')}</strong></div><div><span>Target</span><strong>{selectedStage.throughputMetric}</strong></div></div><div className="workflow-inspector-foot"><span>Handoff</span><p>{selectedStage.handoffs}</p></div></div>}
    </div>
  </section>;
};
