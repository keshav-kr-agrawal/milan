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
import { CultureHeritageView } from './components/views/CultureHeritageView';
import { GhatsMapView } from './components/views/GhatsMapView';
import { PilgrimProfileView } from './components/views/PilgrimProfileView';
import { EdgeNodesView } from './components/views/EdgeNodesView';
import { useSpeech } from './hooks/useSpeech';

export const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { speak, stop, isSpeaking, isSupported } = useSpeech();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [stickyHelpOpen, setStickyHelpOpen] = useState<boolean>(false);
  const [selectedMissingMemberId, setSelectedMissingMemberId] = useState<string | undefined>(undefined);
  const [elderModeActive, setElderModeActive] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('milan_simple_mode') === 'true';
  });

  // Direct physical QR code scan from URL (e.g. ?scan=GM27-K7M2-1)
  const [scannedMemberId, setScannedMemberId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('scan') || null;
    }
    return null;
  });

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
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  // Listen to hash change from browser URL or footer links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash) return;
      if (hash === 'heritage' || hash === 'culture') {
        setCurrentTab('heritage');
      } else if (hash === 'booths' || hash === 'ghats') {
        setCurrentTab('booths');
      } else if (hash === 'family' || hash === 'register') {
        setCurrentTab('family');
      } else if (hash === 'missing') {
        setCurrentTab('missing');
      } else if (hash === 'found') {
        setCurrentTab('found');
      } else if (hash === 'lookup' || hash === 'verify') {
        setCurrentTab('lookup');
      } else if (hash === 'helpdesk') {
        setCurrentTab('helpdesk');
      } else if (hash === 'edge' || hash === 'nodes') {
        setCurrentTab('edge');
      } else if (hash === 'home') {
        setCurrentTab('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const handleElderToggle = (e: any) => {
      if (e.detail && typeof e.detail.enabled === 'boolean') {
        setElderModeActive(e.detail.enabled);
      }
    };
    window.addEventListener('milan:elder-mode-toggle', handleElderToggle);
    return () => window.removeEventListener('milan:elder-mode-toggle', handleElderToggle);
  }, []);

  const handleReadCurrentPageAloud = () => {
    if (isSpeaking) {
      stop();
    } else {
      const mainEl = document.getElementById('main-content');
      const textToRead = mainEl ? mainEl.innerText.slice(0, 500) : t('home.hero_description');
      speak(textToRead);
    }
  };

  const handleDisableElderMode = () => {
    window.dispatchEvent(new CustomEvent('milan:elder-mode-sync', { detail: { enabled: false } }));
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    setScannedMemberId(null);
    window.location.hash = tab === 'booths' ? 'ghats' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkMemberMissing = (memberId: string) => {
    setSelectedMissingMemberId(memberId);
    setCurrentTab('missing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStickyHelpAction = (action: 'missing' | 'found' | 'lookup') => {
    setCurrentTab(action);
    setScannedMemberId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-chandan/20 dark:bg-[#0A0F1D] text-ink dark:text-[#F8FAFC] antialiased selection:bg-kesari selection:text-white transition-colors duration-200">
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

      {/* Elder Mode Dedicated High-Contrast Accessibility Banner */}
      {elderModeActive && (
        <aside
          role="region"
          aria-label="Elder Easy Assistance Bar"
          className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-slate-950 px-3 sm:px-6 py-2.5 shadow-md border-b-2 border-amber-600 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-fadeIn select-none z-30"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">👴</span>
            <div>
              <span className="text-slate-900 font-extrabold text-sm sm:text-base">
                {i18n.language === 'te'
                  ? 'పెద్దల సులభ దర్శన మోడ్ క్రియాశీలం'
                  : i18n.language === 'hi'
                  ? 'वरिष्ठ नागरिक सरल मोड सक्रिय'
                  : 'Elder Easy Mode Active'}
              </span>
              <span className="hidden sm:inline font-semibold text-slate-800 text-xs ml-2">
                (20px+ Large Fonts • High Contrast AAA)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSupported && (
              <button
                type="button"
                onClick={handleReadCurrentPageAloud}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-900 text-xs sm:text-sm font-bold shadow-sm transition-transform active:scale-95 ${
                  isSpeaking ? 'bg-kumkum text-white animate-pulse' : 'bg-slate-900 text-amber-300 hover:bg-slate-800'
                }`}
                title="పేజీని చదివి వినిపించు"
              >
                <span>{isSpeaking ? '⏹' : '🔊'}</span>
                <span>
                  {isSpeaking
                    ? (i18n.language === 'te' ? 'ఆపండి' : i18n.language === 'hi' ? 'रोकें' : 'Stop Audio')
                    : (i18n.language === 'te' ? 'చదివి వినిపించు' : i18n.language === 'hi' ? 'पढ़कर सुनाएं' : 'Read Aloud')}
                </span>
              </button>
            )}

            <a
              href="tel:112"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-sm border border-red-800 transition-colors"
              title="Emergency Helpline"
            >
              <span>🚨</span>
              <span>112</span>
            </a>

            <button
              type="button"
              onClick={handleDisableElderMode}
              className="px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-900 text-xs font-bold border border-slate-400 transition-colors"
              title="సాధారణ మోడ్ / Standard Mode"
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Router View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8" id="main-content">
        {/* If scanned via physical wristband QR code URL */}
        {scannedMemberId ? (
          <div className="py-4">
            <PilgrimProfileView
              memberId={scannedMemberId}
              onBack={() => {
                setScannedMemberId(null);
                window.history.replaceState({}, '', window.location.pathname);
              }}
              onNavigateToBooths={() => {
                setScannedMemberId(null);
                setCurrentTab('booths');
              }}
            />
          </div>
        ) : (
          <>
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

            {currentTab === 'booths' && (
              <GhatsMapView />
            )}

            {currentTab === 'helpdesk' && (
              <HelpDeskView />
            )}

            {(currentTab === 'heritage' || currentTab === 'rituals') && (
              <CultureHeritageView onNavigateToGhats={() => setCurrentTab('booths')} />
            )}

            {currentTab === 'edge_nodes' && (
              <EdgeNodesView />
            )}
          </>
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
