/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';
import { AiSearchModal } from './components/search/AiSearchModal';
import { OverviewView } from './components/views/OverviewView';
import { ClientIntelligenceView } from './components/views/ClientIntelligenceView';
import { ClientDetailView } from './components/views/ClientDetailView';
import { CompetitorIntelligenceView } from './components/views/CompetitorIntelligenceView';
import { CompetitorDetailView } from './components/views/CompetitorDetailView';
import { WorkflowRolesView } from './components/views/WorkflowRolesView';
import { ToolsIntelligenceView } from './components/views/ToolsIntelligenceView';
import { TechnologyRadarView } from './components/views/TechnologyRadarView';
import { LearningView } from './components/views/LearningView';
import { AssessmentsView } from './components/views/AssessmentsView';
import { ContributorAdminView } from './components/views/ContributorAdminView';
import { AboutConsilioView } from './components/views/AboutConsilioView';

const MainViewRouter: React.FC = () => {
  const { activeView } = useApp();

  switch (activeView) {
    case 'about':
      return <AboutConsilioView />;
    case 'overview':
      return <OverviewView />;
    case 'client-intelligence':
      return <ClientIntelligenceView />;
    case 'client-detail':
      return <ClientDetailView />;
    case 'competitor-intelligence':
      return <CompetitorIntelligenceView />;
    case 'competitor-detail':
      return <CompetitorDetailView />;
    case 'workflow-roles':
    case 'role-detail':
      return <WorkflowRolesView />;
    case 'tools-intelligence':
    case 'tool-detail':
      return <ToolsIntelligenceView />;
    case 'technology-intelligence':
      return <TechnologyRadarView />;
    case 'learning':
      return <LearningView />;
    case 'assessments':
      return <AssessmentsView />;
    case 'contributor-portal':
    case 'admin-approvals':
      return <ContributorAdminView />;
    default:
      return <OverviewView />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <MainViewRouter />
      </Shell>
      <AiSearchModal />
    </AppProvider>
  );
}
