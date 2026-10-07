import React, { useState } from 'react';
import {
  Edit3,
  ShieldCheck,
  Check,
  X,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IntelligenceArea } from '../../types';

export const ContributorAdminView: React.FC = () => {
  const {
    activeView,
    activeRole,
    contributorSubmissions,
    submitContributorProposal,
    reviewSubmission
  } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState<IntelligenceArea>('Clients');
  const [newSummary, setNewSummary] = useState('');
  const [newChanges, setNewChanges] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const isAdminView = activeView === 'admin-approvals' || activeRole === 'Admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    submitContributorProposal({
      title: newTitle.trim(),
      area: newArea,
      summary: newSummary.trim(),
      proposedChanges: newChanges.trim()
    });

    setNewTitle('');
    setNewSummary('');
    setNewChanges('');
    setIsSubmitModalOpen(false);
    setFeedbackNotice('Your change proposal has been submitted to the Admin Approval Queue.');
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const pendingSubmissions = contributorSubmissions.filter(s => s.status === 'Pending Approval');
  const resolvedSubmissions = contributorSubmissions.filter(s => s.status !== 'Pending Approval');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Governance & Content Management
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isAdminView ? 'Admin Approval Queue & Governance' : 'Contributor Content Submission Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Propose, review, and approve updates to client records, battlecards, tool guides, and
            workflow documentation. Follows the strict <strong>Draft → Pending Approval → Approved</strong> lifecycle.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Propose Intelligence Update</span>
        </button>
      </div>

      {/* Temporary feedback banner */}
      {feedbackNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Submissions Queue */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Pending Submissions Awaiting Approval ({pendingSubmissions.length})
          </h2>

          {pendingSubmissions.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border border-slate-200 text-center text-xs text-slate-400">
              No pending contributor updates at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{sub.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                          {sub.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Area: <strong>{sub.area}</strong> · Submitted by {sub.submittedBy} ({sub.role}) on {sub.submittedAt}
                      </div>
                    </div>

                    {/* Admin Approval Buttons */}
                    {(activeRole === 'Admin' || activeRole === 'Management') && (
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          onClick={() => reviewSubmission(sub.id, 'Approved')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => reviewSubmission(sub.id, 'Rejected')}
                          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-2 text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Summary: </span>
                      <span>{sub.summary}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Proposed Content Changes: </span>
                      <p className="p-2.5 bg-slate-50 rounded border border-slate-200 mt-1 text-[11px] font-mono text-slate-800">
                        {sub.proposedChanges}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolved / Approved History */}
        <div className="pt-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Resolved Intelligence Changes ({resolvedSubmissions.length})
          </h2>
          <div className="space-y-2.5">
            {resolvedSubmissions.map(sub => (
              <div
                key={sub.id}
                className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span>{sub.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        sub.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {sub.area} · Submitted by {sub.submittedBy}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Change Proposal Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Propose Intelligence Update</h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Update Relativity aiR 2.0 Pricing Battlecard"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Intelligence Area</label>
                <select
                  value={newArea}
                  onChange={e => setNewArea(e.target.value as IntelligenceArea)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-hidden"
                >
                  <option value="Clients">Client Intelligence</option>
                  <option value="Competitors">Competitor Intelligence</option>
                  <option value="Workflow">Team & Workflow</option>
                  <option value="Tools">Internal Tools & Tech</option>
                  <option value="Technology">Technology Intelligence</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Summary of Change</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief justification for this update..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Proposed Content / Notes</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter verbatim proposed additions or text changes..."
                  value={newChanges}
                  onChange={e => setNewChanges(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-hidden font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Admin Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
