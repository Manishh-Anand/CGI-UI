import React, { useState } from 'react';
import { CircleHelp, Filter, RotateCcw, Sparkles } from 'lucide-react';

export const Freshness: React.FC<{ label?: string }> = ({ label = 'Updated just now' }) => <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.12)]" />{label}</span>;

export const HelpButton: React.FC<{ title: string; body: string }> = ({ title, body }) => {
  const [open, setOpen] = useState(false);
  return <div className="relative"><button onClick={() => setOpen(!open)} title={`Help: ${title}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-900"><CircleHelp className="h-3.5 w-3.5 text-blue-700" /> Help</button>{open && <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 text-xs leading-5 text-slate-600 shadow-xl"><div className="flex items-center gap-2 font-bold text-slate-900"><Sparkles className="h-3.5 w-3.5 text-blue-700" />{title}</div><p className="mt-2">{body}</p></div>}</div>;
};

export const FilterBar: React.FC<{ label?: string; count?: number; onReset?: () => void; children?: React.ReactNode }> = ({ label = 'Refine signal', count, onReset, children }) => <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/75 p-3 shadow-sm backdrop-blur md:flex-row md:items-center"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-slate-500"><Filter className="h-3.5 w-3.5 text-blue-800" />{label}{typeof count === 'number' && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-900">{count}</span>}</div><div className="flex flex-1 flex-wrap gap-2">{children}</div>{onReset && <button onClick={onReset} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"><RotateCcw className="h-3 w-3" /> Reset</button>}</div>;

export const FilterChip: React.FC<{ active?: boolean; children: React.ReactNode; onClick?: () => void }> = ({ active, children, onClick }) => <button onClick={onClick} className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${active ? 'border-blue-900 bg-blue-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900'}`}>{children}</button>;

export const BrandMark: React.FC<{ name: string; tone?: 'blue' | 'ink' }> = ({ name, tone = 'blue' }) => <span aria-label={`${name} logo`} className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-extrabold tracking-tight ${tone === 'blue' ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-800'}`}>{name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase()}</span>;
