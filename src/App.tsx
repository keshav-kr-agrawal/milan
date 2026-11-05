import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/common/Header';
import { StatusStrip } from './components/common/StatusStrip';
import { Footer } from './components/common/Footer';
import { StickyHelpModal } from './components/common/StickyHelpModal';
import { LanguagePickerModal } from './components/common/LanguagePickerModal';

// Views
import { HomeView } from './components/views/HomeView';
import { FamilyView } from './components/views/FamilyView';
import { MissingReportView } from './components/views/MissingReportView';
import { FoundReportView } from './components/views/FoundReportView';
import { LookupView } from './components/views/LookupView';
import { HelpDeskView } from './components/views/HelpDeskView';
import { RitualsView } from './components/views/RitualsView';
import { EdgeNodesView } from './components/views/EdgeNodesView';

export const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [stickyHelpOpen, setStickyHelpOpen] = useState<boolean>(false);
  const [selectedMissingMemberId, setSelectedMissingMemberId] = useState<string | undefined>(undefined);

  // Allow users to experience the sacred temple dawn loader before graceful fade
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof (window as any).dismissMilanLoader === 'function') {
        (window as any).dismissMilanLoader();
      } else {
        const loader = document.getElementById('initial-loader');
        if (loader) {
          loader.style.opacity = '0';
          loader.style.pointerEvents = 'none';
          setTimeout(() => {
            loader.remove();
          }, 850);
        }
      }
    }, 4300);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkMemberMissing = (memberId: string) => {
    setSelectedMissingMemberId(memberId);
    setCurrentTab('missing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStickyHelpAction = (action: 'missing' | 'found' | 'lookup') => {
    setCurrentTab(action);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-chandan/20 text-ink antialiased selection:bg-kesari selection:text-white">
      {/* First-launch trilingual language picker modal */}
      <LanguagePickerModal />

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        onOpenStickyHelp={() => setStickyHelpOpen(true)}
      />

      {/* Live Online/Offline & Case Status Strip */}
      <StatusStrip />

      {/* Main Content Router View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8" id="main-content">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenStickyHelp={() => setStickyHelpOpen(true)}
          />
        )}

        {currentTab === 'family' && (
          <FamilyView onMarkMissing={handleMarkMemberMissing} />
        )}

        {currentTab === 'missing' && (
          <MissingReportView
            initialMemberId={selectedMissingMemberId}
            onNavigateToLookup={() => setCurrentTab('lookup')}
          />
        )}

        {currentTab === 'found' && (
          <FoundReportView />
        )}

        {currentTab === 'lookup' && (
          <LookupView />
        )}

        {currentTab === 'helpdesk' && (
          <HelpDeskView />
        )}

        {currentTab === 'rituals' && (
          <RitualsView />
        )}

        {currentTab === 'edge_nodes' && (
          <EdgeNodesView />
        )}
      </main>

      {/* Sticky Help Me Now Emergency Modal */}
      <StickyHelpModal
        isOpen={stickyHelpOpen}
        onClose={() => setStickyHelpOpen(false)}
        onSelectAction={handleStickyHelpAction}
      />

      {/* Professional Trilingual Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
