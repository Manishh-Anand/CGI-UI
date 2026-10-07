import React from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEARNING_MODULES } from '../../data/mockData';

export const LearningView: React.FC = () => {
  const { navigateTo, openAiSearch, activeRole } = useApp();

  const journeyProgress = [
    { area: 'Client Intelligence', pct: 82 },
    { area: 'Competitor Intelligence', pct: 64 },
    { area: 'Workflow & Roles', pct: 91 },
    { area: 'Tools & Technology', pct: 73 },
    { area: 'Industry Technology', pct: 58 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Enterprise Enablement
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Consilio Intelligence Learning Journey
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Personalized learning curriculum, operational baseline certifications, and knowledge
            assessments tailored for your role ({activeRole}).
          </p>
        </div>

        <button
          onClick={() => navigateTo('assessments')}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Take Knowledge Assessment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Your Intelligence Journey Progress Bars */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Your Intelligence Journey Across 5 Areas
            </h3>
            <p className="text-xs text-slate-500">
              Composite mastery score based on completed modules and verified assessments.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700">73.6% Overall Average</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-1">
          {journeyProgress.map(item => (
            <div key={item.area} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-800 mb-1.5">
                <span className="truncate">{item.area}</span>
                <span className="tabular-nums font-bold text-blue-700">{item.pct}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active & Recommended Learning Modules */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Curated Intelligence Modules ({LEARNING_MODULES.length})
          </h2>
          <span className="text-xs text-slate-400">Self-paced with certified verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_MODULES.map(module => (
            <div
              key={module.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs">
                  <span className="font-semibold text-slate-500">{module.area}</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      module.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800'
                        : module.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {module.status}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 leading-snug mb-1.5">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">{module.summary}</p>

                <div className="space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{module.durationMinutes} min read</span>
                    <span>·</span>
                    <span>{module.difficulty}</span>
                  </div>

                  {module.score && (
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Assessment Score: {module.score}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">
                  {module.progressPct}% complete
                </div>
                <button
                  onClick={() => navigateTo('assessments')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>{module.status === 'Completed' ? 'Review Test' : 'Open Module'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
