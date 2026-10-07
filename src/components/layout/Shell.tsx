import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Layers,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  Edit3,
  ShieldCheck,
  Search,
  Bell,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Menu,
  X,
  Users,
  Building2,
  Wrench,
  Cpu,
  Workflow,
  Sparkles,
  Info,
  Check,
  Clock
  ,PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { UserRole } from '../../types';
import consilioLogo from '../../images/consilio_logo.png';
import { Freshness } from '../ui/PageChrome';
import { FilterBar, FilterChip } from '../ui/PageChrome';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeView,
    activeRole,
    navigateTo,
    setActiveRole,
    globalFilters,
    updateGlobalFilters,
    savedViews,
    applySavedView,
    saveCurrentView,
    openAiSearch,
    isMobileNavOpen,
    setIsMobileNavOpen,
    notifications,
    unreadNotificationCount,
    markNotificationsAsRead,
    contributorSubmissions
    ,isSidebarCollapsed,
    setIsSidebarCollapsed,
    isAgentDrawerOpen,
    setIsAgentDrawerOpen
  } = useApp();

  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(
    activeView.startsWith('client') ||
    activeView.startsWith('competitor') ||
    activeView.startsWith('workflow') ||
    activeView.startsWith('role') ||
    activeView.startsWith('tool') ||
    activeView === 'technology-intelligence'
  );

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [showSaveViewInput, setShowSaveViewInput] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: UserRole[] = ['New Joiner', 'Employee', 'Contributor', 'Admin', 'Management'];

  const pendingApprovalsCount = contributorSubmissions.filter(s => s.status === 'Pending Approval').length;

  const getBreadcrumbs = () => {
    switch (activeView) {
      case 'about':
        return ['Consilio Gateway', 'About Consilio'];
      case 'overview':
        return ['Workspace', 'Overview'];
      case 'client-intelligence':
        return ['Intelligence', 'Client Intelligence'];
      case 'client-detail':
        return ['Intelligence', 'Client Intelligence', 'Account Profile'];
      case 'competitor-intelligence':
        return ['Intelligence', 'Market Intelligence'];
      case 'competitor-detail':
        return ['Intelligence', 'Competitor Intelligence', 'Battlecard'];
      case 'workflow-roles':
        return ['Intelligence', 'Team, Workflow & Roles'];
      case 'role-detail':
        return ['Intelligence', 'Team, Workflow & Roles', 'Role Profile'];
      case 'tools-intelligence':
        return ['Intelligence', 'Solution 360 · Product Atlas'];
      case 'tool-detail':
        return ['Intelligence', 'Internal Tools & Tech', 'Tool Profile'];
      case 'technology-intelligence':
        return ['Intelligence', 'Technology Radar & Trends'];
      case 'learning':
        return ['Enablement', 'Learning Journey'];
      case 'assessments':
        return ['Enablement', 'Assessments & Knowledge Checks'];
      case 'contributor-portal':
        return ['Governance', 'Contributor Portal'];
      case 'admin-approvals':
        return ['Governance', 'Admin Approval Queue'];
      default:
        return ['Consilio Intelligence'];
    }
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Left Navigation Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen ${isSidebarCollapsed ? 'md:w-[76px] sidebar-rail' : 'md:w-68'} w-72 bg-white text-slate-700 border-r border-slate-200 flex flex-col transition-all duration-300 ease-out shrink-0 ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Lockup */}
        <div className={`h-[76px] ${isSidebarCollapsed ? 'px-2 justify-center' : 'px-5'} flex items-center justify-between border-b border-slate-200`}>
          <div className="flex items-center gap-2.5">
            <img src={consilioLogo} alt="Consilio" className={`${isSidebarCollapsed ? 'h-9 w-9' : 'h-10 w-10'} rounded-lg object-contain`} />
            {!isSidebarCollapsed && <div>
              <div className="brand-lockup text-slate-950 font-bold text-[15px] tracking-tight leading-tight">
                Consilio Gateway
              </div>
              <div className="text-[11px] text-blue-700 font-semibold tracking-tight">of Intelligence</div>
            </div>}
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900" title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`flex-1 overflow-y-auto ${isSidebarCollapsed ? 'px-2' : 'px-3'} py-4 space-y-6`}>
          {/* Main Workspace Navigation */}
          <div>
            {!isSidebarCollapsed && <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Workspace</div>}
            <nav className="space-y-1">
              <button
                onClick={() => navigateTo('about')}
                title="About Consilio"
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'about' ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>About Consilio</span>}
              </button>
              <button
                onClick={() => navigateTo('overview')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'overview'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Overview</span>}
              </button>

              {/* Intelligence Master Item with Submenu */}
              <div>
                <button
                  onClick={() => setIsIntelligenceOpen(!isIntelligenceOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeView.startsWith('client') ||
                    activeView.startsWith('competitor') ||
                    activeView.startsWith('workflow') ||
                    activeView.startsWith('role') ||
                    activeView.startsWith('tool') ||
                    activeView === 'technology-intelligence'
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 shrink-0 text-blue-600" />
                    {!isSidebarCollapsed && <span>Intelligence</span>}
                  </div>
                  {!isSidebarCollapsed && (isIntelligenceOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  ))}
                </button>

                {isIntelligenceOpen && (
                  <div className={`${isSidebarCollapsed ? 'mt-1 ml-0 pl-0 border-0' : 'mt-1 ml-4 pl-3 border-l border-slate-200'} space-y-1 py-1`}>
                    <button
                      onClick={() => navigateTo('client-intelligence')}
                      title="Clients"
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2.5'} py-2 rounded text-xs transition-colors ${
                        activeView === 'client-intelligence' || activeView === 'client-detail'
                          ? 'text-blue-700 font-semibold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">Clients</span>}
                    </button>

                    <button
                      onClick={() => navigateTo('competitor-intelligence')}
                      title="Market Intelligence"
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2.5'} py-2 rounded text-xs transition-colors ${
                        activeView === 'competitor-intelligence' || activeView === 'competitor-detail'
                          ? 'text-blue-700 font-semibold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">Market Intelligence</span>}
                    </button>

                    <button
                      onClick={() => navigateTo('workflow-roles')}
                      title="Workflows"
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2.5'} py-2 rounded text-xs transition-colors ${
                        activeView === 'workflow-roles' || activeView === 'role-detail'
                          ? 'text-blue-700 font-semibold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Workflow className="w-3.5 h-3.5 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">Workflows</span>}
                    </button>

                    <button
                      onClick={() => navigateTo('tools-intelligence')}
                      title="Solution 360"
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2.5'} py-2 rounded text-xs transition-colors ${
                        activeView === 'tools-intelligence' || activeView === 'tool-detail'
                          ? 'text-blue-700 font-semibold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">Solution 360</span>}
                    </button>

                    <button
                      onClick={() => navigateTo('technology-intelligence')}
                      title="Technology"
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2 px-2.5'} py-2 rounded text-xs transition-colors ${
                        activeView === 'technology-intelligence'
                          ? 'text-blue-700 font-semibold bg-blue-50/80'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5 shrink-0" />
                        {!isSidebarCollapsed && <span className="truncate">Technology</span>}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo('learning')}
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'learning'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Learning</span>}
              </button>

              <button
                onClick={() => navigateTo('assessments')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'assessments'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Assessments</span>}
              </button>
            </nav>
          </div>

          {/* Governance / Contributor / Admin Options */}
          <div>
            {!isSidebarCollapsed && <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Governance</div>}
            <nav className="space-y-1">
              <button
                onClick={() => navigateTo('contributor-portal')}
                title="Contributor Portal"
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2 rounded-md text-xs font-medium transition-colors ${
                  activeView === 'contributor-portal'
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Contributor Portal</span>}
                </div>
                {!isSidebarCollapsed && activeRole === 'Contributor' && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                    Active
                  </span>
                )}
              </button>

              {(activeRole === 'Admin' || activeRole === 'Management') && (
                <button
                  onClick={() => navigateTo('admin-approvals')}
                  title="Admin Approvals"
                  className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2 rounded-md text-xs font-medium transition-colors ${
                    activeView === 'admin-approvals'
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span>Admin Approvals</span>}
                  </div>
                  {!isSidebarCollapsed && pendingApprovalsCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white">
                      {pendingApprovalsCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Saved Views & Recents */}
          <div>
            {!isSidebarCollapsed && <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Saved Views</div>}
            <div className="space-y-1">
              {isSidebarCollapsed && <button className="w-full flex justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100" title="Saved views"><Bookmark className="h-4 w-4" /></button>}
              {!isSidebarCollapsed && savedViews.map(view => (
                <button
                  key={view.name}
                  onClick={() => applySavedView(view.name)}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs truncate transition-colors flex items-center justify-between ${
                    globalFilters.savedViewName === view.name
                      ? 'text-blue-700 bg-blue-50/80 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{view.name}</span>
                  {globalFilters.savedViewName === view.name && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Atlas Knowledge Link */}
          <div className="pt-2 border-t border-slate-200">
            <a
              href="https://atlas.consilio.com"
              target="_blank"
              rel="noreferrer"
              title="Atlas Documentation"
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-3'} py-2 rounded text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                {!isSidebarCollapsed && <span>Atlas Documentation</span>}
              </div>
              {!isSidebarCollapsed && <ExternalLink className="w-3 h-3 text-slate-400" />}
            </a>
          </div>
        </div>

        {/* Bottom User Profile & Role Switcher */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className={`${isSidebarCollapsed ? 'justify-center p-1' : 'justify-between p-2.5'} rounded-lg bg-white border border-slate-200 shadow-2xs flex items-center`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                MM
              </div>
              {!isSidebarCollapsed && <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">Manish M.</div>
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <span>Role:</span>
                  <span className="text-blue-700 font-bold">{activeRole}</span>
                </div>
              </div>}
            </div>
          </div>
          {!isSidebarCollapsed && <div className="mt-2 text-[10px] text-slate-400 text-center tracking-tight">Consilio Gateway · Synthetic Data</div>}
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Global Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left Zone: Hamburger (Mobile) + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 overflow-hidden whitespace-nowrap">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  <span
                    className={
                      idx === breadcrumbs.length - 1
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-500'
                    }
                  >
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
            <div className="hidden xl:block"><Freshness label="Workspace synced just now" /></div>
          </div>

          {/* Center Zone: Global Intelligence Search Trigger */}
          <div className="flex-1 max-w-xl mx-2">
            <button
              onClick={() => openAiSearch()}
              className="w-full h-10 px-3.5 bg-slate-50 hover:bg-slate-100/90 text-slate-600 rounded-lg border border-slate-200/90 flex items-center justify-between text-xs transition-all shadow-2xs group focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                <span className="truncate text-slate-500 group-hover:text-slate-700">
                  Ask Consilio Gateway, clients, tools, workflows...
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Zone: Global Filters, Role Switcher, Notifications, Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Global Filter Trigger Popover */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className={`flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-xs font-medium border transition-colors ${
                  globalFilters.region !== 'All' || globalFilters.department !== 'All'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
                title="Filter dataset across region and practice area"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">
                  {globalFilters.region !== 'All' ? globalFilters.region : 'Filters'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Global Intelligence Filters</span>
                    <button
                      onClick={() =>
                        updateGlobalFilters({ region: 'All', department: 'All', dateRange: 'LTM' })
                      }
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-3.5 py-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Region
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['All', 'North America', 'EMEA', 'APAC'] as const).map(reg => (
                          <button
                            key={reg}
                            onClick={() => updateGlobalFilters({ region: reg })}
                            className={`py-1 px-1.5 rounded text-center truncate text-[11px] font-medium border transition-colors ${
                              globalFilters.region === reg
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {reg}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Department / Practice Area
                      </label>
                      <select
                        value={globalFilters.department}
                        onChange={e =>
                          updateGlobalFilters({ department: e.target.value as any })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden"
                      >
                        <option value="All">All Practice Areas</option>
                        <option value="Legal Solutions">Legal Solutions & Advisory</option>
                        <option value="Forensics">Forensics & Expert Testimony</option>
                        <option value="Managed Services">Managed Review Services</option>
                        <option value="Data Operations">Data Operations & Tech</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Time Horizon
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {(['LTM', 'YTD', 'Q3 2026', 'Q2 2026'] as const).map(dt => (
                          <button
                            key={dt}
                            onClick={() => updateGlobalFilters({ dateRange: dt })}
                            className={`py-1 px-1.5 rounded text-center text-[11px] font-medium border transition-colors ${
                              globalFilters.dateRange === dt
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {dt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {!showSaveViewInput ? (
                      <button
                        onClick={() => setShowSaveViewInput(true)}
                        className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save as View</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          placeholder="View name..."
                          value={newViewName}
                          onChange={e => setNewViewName(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                        />
                        <button
                          onClick={() => {
                            if (newViewName.trim()) {
                              saveCurrentView(newViewName.trim());
                              setNewViewName('');
                              setShowSaveViewInput(false);
                            }
                          }}
                          className="bg-slate-900 text-white px-2 py-1 rounded text-[11px]"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Selector */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 h-9 px-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                title="Switch persona to experience role-based views"
              >
                <span className="hidden sm:inline text-slate-500 font-normal">Role:</span>
                <span className="font-semibold text-slate-900">{activeRole}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Simulate Enterprise Role
                  </div>
                  {rolesList.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setActiveRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        activeRole === r ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div>{r}</div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {r === 'Management' && 'Unlocks revenue, concentration & M&A'}
                          {r === 'New Joiner' && 'Focus on learning, SOPs & workflows'}
                          {r === 'Employee' && 'Balanced operational intelligence'}
                          {r === 'Contributor' && 'Content editing & draft proposals'}
                          {r === 'Admin' && 'Full governance & approvals queue'}
                        </div>
                      </div>
                      {activeRole === r && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen) markNotificationsAsRead();
                }}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-40 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Intelligence Notifications</span>
                    <span className="text-[11px] text-slate-400">Real-time alerts</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto py-1">
                    {notifications.map(n => (
                      <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 transition-colors rounded">
                        <div className="font-medium text-slate-800 leading-snug">{n.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <div className="mb-5"><FilterBar label="Global scope" count={(globalFilters.region !== 'All' ? 1 : 0) + (globalFilters.department !== 'All' ? 1 : 0) + (globalFilters.dateRange !== 'LTM' ? 1 : 0)} onReset={() => updateGlobalFilters({ region: 'All', department: 'All', dateRange: 'LTM' })}><FilterChip active={globalFilters.region === 'All'} onClick={() => updateGlobalFilters({ region: 'All' })}>All regions</FilterChip>{(['North America', 'EMEA', 'APAC'] as const).map(region => <FilterChip key={region} active={globalFilters.region === region} onClick={() => updateGlobalFilters({ region })}>{region}</FilterChip>)}<select value={globalFilters.department} onChange={event => updateGlobalFilters({ department: event.target.value as any })} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-800"><option value="All">All practices</option><option value="Legal Solutions">Legal Solutions</option><option value="Forensics">Forensics</option><option value="Managed Services">Managed Services</option><option value="Data Operations">Data Operations</option></select><select value={globalFilters.dateRange} onChange={event => updateGlobalFilters({ dateRange: event.target.value as any })} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-800"><option value="LTM">Last 12 months</option><option value="YTD">Year to date</option><option value="Q3 2026">Q3 2026</option><option value="Q2 2026">Q2 2026</option></select></FilterBar></div>
          {children}
        </main>
      </div>
    </div>
  );
};
