import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  IntelligenceArea,
  GlobalFilterState,
  ClientRecord,
  CompetitorRecord,
  InternalToolRecord,
  RoleRecord,
  WorkflowStage,
  ContributorSubmission,
  AiSearchResult
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_COMPETITORS,
  INTERNAL_TOOLS,
  INTERNAL_ROLES,
  E_DISCOVERY_WORKFLOW_STAGES,
  INITIAL_CONTRIBUTOR_SUBMISSIONS,
  SEEDED_AI_SEARCH_RESULT,
  DEMO_AI_SEEDED_QUERY
} from '../data/mockData';

export type ActiveView =
  | 'about'
  | 'overview'
  | 'client-intelligence'
  | 'client-detail'
  | 'competitor-intelligence'
  | 'competitor-detail'
  | 'workflow-roles'
  | 'role-detail'
  | 'tools-intelligence'
  | 'tool-detail'
  | 'technology-intelligence'
  | 'learning'
  | 'assessments'
  | 'contributor-portal'
  | 'admin-approvals';

interface AppContextType {
  activeView: ActiveView;
  activeRole: UserRole;
  selectedClientId: string | null;
  selectedCompetitorId: string | null;
  selectedRoleId: string | null;
  selectedToolId: string | null;
  selectedWorkflowStageId: string | null;
  globalFilters: GlobalFilterState;
  isAiSearchOpen: boolean;
  aiSearchInitialQuery: string;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isAgentDrawerOpen: boolean;
  setIsAgentDrawerOpen: (open: boolean) => void;
  clients: ClientRecord[];
  competitors: CompetitorRecord[];
  tools: InternalToolRecord[];
  roles: RoleRecord[];
  workflowStages: WorkflowStage[];
  contributorSubmissions: ContributorSubmission[];
  notifications: { id: string; title: string; time: string; read: boolean; type: 'info' | 'success' | 'alert' }[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  savedViews: { name: string; filters: GlobalFilterState }[];
  
  // Navigation actions
  navigateTo: (
    view: ActiveView,
    params?: {
      clientId?: string;
      competitorId?: string;
      roleId?: string;
      toolId?: string;
      stageId?: string;
    }
  ) => void;
  setActiveRole: (role: UserRole) => void;
  updateGlobalFilters: (newFilters: Partial<GlobalFilterState>) => void;
  saveCurrentView: (name: string) => void;
  applySavedView: (viewName: string) => void;
  openAiSearch: (query?: string) => void;
  closeAiSearch: () => void;
  submitContributorProposal: (data: { title: string; area: IntelligenceArea; summary: string; proposedChanges: string }) => void;
  reviewSubmission: (id: string, status: 'Approved' | 'Rejected') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('about');
  // Default to Management so evaluator can explore all features immediately, but can toggle freely
  const [activeRole, setActiveRoleState] = useState<UserRole>('Management');
  
  const [selectedClientId, setSelectedClientId] = useState<string | null>('apex-legal');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>('relativity');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>('discovery-counsel');
  const [selectedToolId, setSelectedToolId] = useState<string | null>('consilio-sightline');
  const [selectedWorkflowStageId, setSelectedWorkflowStageId] = useState<string | null>('stage-5');
  
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [aiSearchInitialQuery, setAiSearchInitialQuery] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);

  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>({
    region: 'All',
    department: 'All',
    dateRange: 'LTM',
    savedViewName: 'Global Overview'
  });

  const [savedViews, setSavedViews] = useState<{ name: string; filters: GlobalFilterState }[]>([
    {
      name: 'Global Overview',
      filters: { region: 'All', department: 'All', dateRange: 'LTM', savedViewName: 'Global Overview' }
    },
    {
      name: 'North America Leadership View',
      filters: { region: 'North America', department: 'Legal Solutions', dateRange: 'LTM', savedViewName: 'North America Leadership View' }
    },
    {
      name: 'EMEA Regulatory & Forensics',
      filters: { region: 'EMEA', department: 'Forensics', dateRange: 'YTD', savedViewName: 'EMEA Regulatory & Forensics' }
    }
  ]);

  const [clients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [competitors] = useState<CompetitorRecord[]>(INITIAL_COMPETITORS);
  const [tools] = useState<InternalToolRecord[]>(INTERNAL_TOOLS);
  const [roles] = useState<RoleRecord[]>(INTERNAL_ROLES);
  const [workflowStages] = useState<WorkflowStage[]>(E_DISCOVERY_WORKFLOW_STAGES);
  const [contributorSubmissions, setContributorSubmissions] = useState<ContributorSubmission[]>(INITIAL_CONTRIBUTOR_SUBMISSIONS);

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Q3 Single-Service Client Warning: Apex Legal Group flagged for churn attention', time: '12m ago', read: false, type: 'alert' as const },
    { id: '2', title: 'Competitor Intel: Relativity deployed aiR 2.0 pricing update in NA', time: '2h ago', read: false, type: 'info' as const },
    { id: '3', title: 'Learning journey: New assessment available on Continuous Active Learning (CAL)', time: '1d ago', read: false, type: 'info' as const }
  ]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAiSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo: AppContextType['navigateTo'] = (view, params) => {
    setActiveView(view);
    if (params?.clientId) setSelectedClientId(params.clientId);
    if (params?.competitorId) setSelectedCompetitorId(params.competitorId);
    if (params?.roleId) setSelectedRoleId(params.roleId);
    if (params?.toolId) setSelectedToolId(params.toolId);
    if (params?.stageId) setSelectedWorkflowStageId(params.stageId);
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
  };

  const updateGlobalFilters = (newFilters: Partial<GlobalFilterState>) => {
    setGlobalFilters(prev => ({ ...prev, ...newFilters, savedViewName: undefined }));
  };

  const saveCurrentView = (name: string) => {
    const newSavedView = {
      name,
      filters: { ...globalFilters, savedViewName: name }
    };
    setSavedViews(prev => [...prev.filter(v => v.name !== name), newSavedView]);
    setGlobalFilters(prev => ({ ...prev, savedViewName: name }));
  };

  const applySavedView = (viewName: string) => {
    const match = savedViews.find(v => v.name === viewName);
    if (match) {
      setGlobalFilters(match.filters);
    }
  };

  const openAiSearch = (query?: string) => {
    setAiSearchInitialQuery(query || '');
    setIsAiSearchOpen(true);
    setIsAgentDrawerOpen(true);
  };

  const closeAiSearch = () => {
    setIsAiSearchOpen(false);
  };

  const submitContributorProposal = (data: { title: string; area: IntelligenceArea; summary: string; proposedChanges: string }) => {
    const newSubmission: ContributorSubmission = {
      id: `sub-${Date.now()}`,
      title: data.title,
      area: data.area,
      submittedBy: 'Current User',
      role: activeRole,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending Approval',
      summary: data.summary,
      proposedChanges: data.proposedChanges
    };
    setContributorSubmissions(prev => [newSubmission, ...prev]);
  };

  const reviewSubmission = (id: string, status: 'Approved' | 'Rejected') => {
    setContributorSubmissions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, status } : sub))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        activeRole,
        selectedClientId,
        selectedCompetitorId,
        selectedRoleId,
        selectedToolId,
        selectedWorkflowStageId,
        globalFilters,
        isAiSearchOpen,
        aiSearchInitialQuery,
        isMobileNavOpen,
        setIsMobileNavOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isAgentDrawerOpen,
        setIsAgentDrawerOpen,
        clients,
        competitors,
        tools,
        roles,
        workflowStages,
        contributorSubmissions,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        savedViews,
        navigateTo,
        setActiveRole,
        updateGlobalFilters,
        saveCurrentView,
        applySavedView,
        openAiSearch,
        closeAiSearch,
        submitContributorProposal,
        reviewSubmission
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
