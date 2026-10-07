import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lock,
  ArrowUpDown,
  Sparkles,
  DollarSign,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClientRecord } from '../../types';
import { DEMO_AI_SEEDED_QUERY } from '../../data/mockData';
import { BrandMark, FilterBar, FilterChip, Freshness, HelpButton } from '../ui/PageChrome';
import { clientRisk } from '../../lib/intelligence';
import { DataTableTools } from '../ui/DataTableTools';

export const ClientIntelligenceView: React.FC = () => {
  const { clients, activeRole, navigateTo, openAiSearch, globalFilters } = useApp();

  const isFinancialRestricted = activeRole === 'New Joiner';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'growth' | 'health'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter clients based on search and global region filters
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      // Global region filter check
      if (globalFilters.region !== 'All' && client.region !== globalFilters.region) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'All' && client.status !== selectedStatus) {
        return false;
      }
      // Industry filter
      if (selectedIndustry !== 'All' && !client.industry.includes(selectedIndustry)) {
        return false;
      }
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        return (
          client.name.toLowerCase().includes(query) ||
          client.industry.toLowerCase().includes(query) ||
          client.accountOwner.toLowerCase().includes(query) ||
          client.services.some(s => s.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [clients, globalFilters.region, selectedStatus, selectedIndustry, searchTerm]);

  // Sort filtered clients
  const sortedClients = useMemo(() => {
    return [...filteredClients].sort((a, b) => {
      let result = 0;
      if (sortBy === 'name') {
        result = a.name.localeCompare(b.name);
      } else if (sortBy === 'revenue') {
        result = a.annualRevenue - b.annualRevenue;
      } else if (sortBy === 'growth') {
        result = a.yoyGrowth - b.yoyGrowth;
      } else if (sortBy === 'health') {
        result = a.healthScore - b.healthScore;
      }
      return sortDirection === 'desc' ? -result : result;
    });
  }, [filteredClients, sortBy, sortDirection]);

  // Calculate high-level KPIs
  const totalRevenue = clients.reduce((acc, c) => acc + c.annualRevenue, 0);
  const singleServiceDeclining = clients.filter(
    c => c.services.length === 1 && c.yoyGrowth < 0
  );
  const totalMatters = clients.reduce((acc, c) => acc + c.activeMattersCount, 0);

  const toggleSort = (field: 'name' | 'revenue' | 'growth' | 'health') => {
    if (sortBy === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            Intelligence Area 01 · Clients
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Clients <span className="font-serif italic font-normal text-blue-950">· Account health</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Portfolio visibility, revenue trajectories, service cross-sell opportunities, and churn
            vulnerability detection across Consilio enterprise clients.
          </p>
        </div>

        <div className="flex items-center gap-2"><HelpButton title="How to read Clients" body="Start with the risk signal beside each client, then use the filters and table sort controls to prioritize revenue, health, services, or growth." /><button
          onClick={() => openAiSearch(DEMO_AI_SEEDED_QUERY)}
          className="px-3.5 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100/90 text-blue-900 rounded-lg text-xs font-medium flex items-center gap-2 transition-all shadow-2xs self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ask AI: Single-Service Churn Risks</span>
        </button></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Portfolio ARR</span>
          {isFinancialRestricted ? (
            <div className="my-1.5 flex items-center gap-1.5 text-slate-400 text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted for New Joiners</span>
            </div>
          ) : (
            <div className="my-1 font-bold text-xl text-slate-900 tabular-nums">
              ${(totalRevenue / 1000000).toFixed(2)}M
            </div>
          )}
          <div className="text-[11px] text-slate-500">
            Across 15 tracked synthetic enterprise accounts
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Single-Service Declining</span>
          <div className="my-1 font-bold text-xl text-rose-700 tabular-nums flex items-center gap-2">
            <span>{singleServiceDeclining.length} Accounts</span>
            <span className="text-xs font-normal text-rose-600">(Apex, Northstar, Meridian)</span>
          </div>
          <div className="text-[11px] text-rose-600 font-medium">
            Immediate cross-sell opportunity
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Active Litigation Matters</span>
          <div className="my-1 font-bold text-xl text-slate-900 tabular-nums">
            {totalMatters}
          </div>
          <div className="text-[11px] text-slate-500">
            Managed across global delivery centers
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Identified Whitespace</span>
          <div className="my-1 font-bold text-xl text-blue-700 tabular-nums">
            $8.2M
          </div>
          <div className="text-[11px] text-slate-500">
            Forensics, Managed Services & Advisory
          </div>
        </div>
      </div>

      {/* Single-Service Churn Warning Banner */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900">
              Single-Service Dependency Risk Alert (3 Accounts)
            </div>
            <div className="text-amber-800">
              Accounts consuming only 1 Consilio service show an average revenue decline of 9.9%
              YoY. Apex Legal Group (-14.2% YoY) has urgent competitor exposure to RelativityOne and Epiq.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigateTo('client-detail', { clientId: 'apex-legal' })}
            className="px-3 py-1.5 bg-amber-900 text-white rounded text-xs font-medium hover:bg-amber-950 transition-colors"
          >
            Investigate Apex Profile
          </button>
        </div>
      </div>

      {/* Directory Filter Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by client name, industry, account owner, service..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Health Statuses</option>
              <option value="Active">Active</option>
              <option value="Growth">Growth</option>
              <option value="Watch">Watch</option>
              <option value="Attention">Attention</option>
            </select>

            <select
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Industries</option>
              <option value="AmLaw">AmLaw Law Firms</option>
              <option value="Financial">Financial Services</option>
              <option value="Healthcare">Healthcare & Pharma</option>
              <option value="Aerospace">Aerospace & Defense</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('All');
                setSelectedIndustry('All');
              }}
              className="text-slate-500 hover:text-slate-800 text-xs px-2 py-1"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white"><DataTableTools count={sortedClients.length} sortLabel={sortBy === 'revenue' ? 'Revenue' : sortBy === 'growth' ? 'Growth' : sortBy === 'health' ? 'Health' : 'Name'} sortDirection={sortDirection} onSort={() => toggleSort(sortBy)} /><div>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th
                  onClick={() => toggleSort('name')}
                  className="py-2.5 px-3.5 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Client Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Tier / Region</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Industry</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Services Active</th>
                <th
                  onClick={() => toggleSort('revenue')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Revenue (Synthetic)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('growth')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>YoY Growth</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('health')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Health Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {sortedClients.map(client => { const risk = clientRisk(client); return (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  onClick={() => navigateTo('client-detail', { clientId: client.id })}
                >
                  <td className="py-2.5 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <BrandMark name={client.name} tone="ink" />
                      <span>{client.name}</span>
                      <span title={`${risk.risk} churn risk: ${risk.reasons.join(', ') || 'No elevated signals'}`} className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${risk.risk === 'High' ? 'border-rose-200 bg-rose-50 text-rose-700' : risk.risk === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{risk.risk}</span>
                      {client.services.length === 1 && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-normal">
                          1 Service
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Owner: {client.accountOwner}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                    <div>{client.tier}</div>
                    <div className="text-[10px] text-slate-400">{client.region}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                    {client.industry}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {client.services.slice(0, 2).map(svc => (
                        <span
                          key={svc}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700"
                        >
                          {svc}
                        </span>
                      ))}
                      {client.services.length > 2 && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">+{client.services.length - 2} more</span>}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                    {isFinancialRestricted ? (
                      <span className="text-slate-400 font-normal italic text-[11px]">
                        Restricted
                      </span>
                    ) : (
                      `$${(client.annualRevenue / 1000000).toFixed(2)}M`
                    )}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums font-medium whitespace-nowrap">
                    {client.yoyGrowth >= 0 ? (
                      <span className="text-emerald-700">+{client.yoyGrowth}%</span>
                    ) : (
                      <span className="text-rose-600">{client.yoyGrowth}%</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 tabular-nums font-semibold whitespace-nowrap">
                    <span
                      className={
                        client.healthScore >= 80
                          ? 'text-emerald-700'
                          : client.healthScore >= 65
                          ? 'text-amber-700'
                          : 'text-rose-600'
                      }
                    >
                      {client.healthScore}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        client.status === 'Growth'
                          ? 'bg-emerald-50 text-emerald-800'
                          : client.status === 'Active'
                          ? 'bg-blue-50 text-blue-800'
                          : client.status === 'Watch'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigateTo('client-detail', { clientId: client.id });
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table></div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
          <span>Showing {sortedClients.length} of {clients.length} synthetic accounts</span>
          <span>Click any row to open the full account profile</span>
        </div>
      </div>
    </div>
  );
};
