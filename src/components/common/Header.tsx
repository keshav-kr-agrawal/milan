import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DiyaIcon, RakshaSutraThread, TempleToranam, ShankhaIcon } from '../motifs/CulturalMotifs';
import { useSpeech } from '../../hooks/useSpeech';
import { templeAudio } from '../../services/sound';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Accessibility,
  Menu,
  X,
  PhoneCall,
  UserCheck,
  Search,
  AlertTriangle,
  BookOpen,
  Wifi,
  Home as HomeIcon,
  HelpCircle,
  Share2,
  Bell,
  Globe,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenStickyHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenStickyHelp }) => {
  const { t, i18n } = useTranslation();
  const { speak, stop, isSpeaking, isSupported } = useSpeech();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple Mode state (elder 60+ persona)
  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
    return localStorage.getItem('milan_simple_mode') === 'true';
  });

  // Dark Mode state (Sandhya / Ratri Darshan)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('milan_dark_mode') === 'true';
  });

  // Text size state: 0 (A-), 1 (A), 2 (A+), 3 (A++)
  const [textSizeIndex, setTextSizeIndex] = useState<number>(() => {
    return Number(localStorage.getItem('milan_text_size') || '1');
  });

  useEffect(() => {
    if (simpleMode) {
      document.body.classList.add('simple-mode');
    } else {
      document.body.classList.remove('simple-mode');
    }
    localStorage.setItem('milan_simple_mode', String(simpleMode));
  }, [simpleMode]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('milan_dark_mode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.body.classList.remove('text-size-sm', 'text-size-base', 'text-size-lg', 'text-size-xl');
    if (textSizeIndex === 0) document.body.classList.add('text-size-sm');
    if (textSizeIndex === 1) document.body.classList.add('text-size-base');
    if (textSizeIndex === 2) document.body.classList.add('text-size-lg');
    if (textSizeIndex === 3) document.body.classList.add('text-size-xl');
    localStorage.setItem('milan_text_size', String(textSizeIndex));
  }, [textSizeIndex]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('milan_lang_chosen', 'true');
    localStorage.setItem('milan_user_lang', lang);
  };

  const openLanguageModal = () => {
    window.dispatchEvent(new CustomEvent('milan:open-lang-picker'));
  };

  const handleReadAloudCurrentPage = () => {
    if (isSpeaking) {
      stop();
    } else {
      const mainEl = document.querySelector('main');
      const textToRead = mainEl ? mainEl.innerText.slice(0, 450) : t('home.hero_description');
      speak(textToRead);
    }
  };

  const cycleTextSize = () => {
    setTextSizeIndex((prev) => (prev + 1) % 4);
  };

  const textSizeLabels = ['A-', 'A', 'A+', 'A++'];

  return (
    <header className="sticky top-0 z-40 bg-neel text-white shadow-sutra select-none border-b border-neel-surface">
      {/* Auspicious Temple Mango Leaves & Marigold Garland (తోరణం) */}
      <TempleToranam className="w-full h-3.5 sm:h-5 opacity-90" />

      {/* Top Essential Accessibility & Prominent Language Control Bar */}
      <div className="bg-neel-deep px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-neel/50">
        {/* Sacred Festival Tagline in active single language */}
        <div className="flex items-center gap-2 text-haldi font-medium truncate">
          <span className="text-kesari font-serif text-sm">ॐ</span>
          <span className="font-serif font-bold tracking-wide">
            {i18n.language === 'te'
              ? 'గోదావరి పుష్కరాలు 2027 • రాజమహేంద్రవరం'
              : i18n.language === 'hi'
              ? 'गोदावरी पुष्करालु 2027 • राजमहेंद्रवरम'
              : 'Godavari Pushkaralu 2027 • Rajamahendravaram'}
          </span>
          <span className="hidden xl:inline text-chandan-border/80 text-[11px]">| 26 June – 7 July 2027</span>
        </div>

        {/* PROMINENT HIGH-VISIBILITY LANGUAGE SWITCHER & ACCESSIBILITY CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* HIGHLY VISIBLE LANGUAGE SWITCHER (Very clear segmented pills + modal trigger) */}
          <div className="flex items-center bg-[#0C1026] p-1 rounded-2xl border-2 border-haldi/70 shadow-md">
            <button
              onClick={() => handleLanguageChange('te')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                i18n.language === 'te'
                  ? 'bg-kesari text-white shadow-md ring-1 ring-haldi font-extrabold scale-105'
                  : 'text-chandan-border hover:text-white hover:bg-white/10'
              }`}
              title="తెలుగు భాషను ఎంచుకోండి"
              aria-label="Switch to Telugu"
            >
              తెలుగు
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                i18n.language === 'hi'
                  ? 'bg-kesari text-white shadow-md ring-1 ring-haldi font-extrabold scale-105'
                  : 'text-chandan-border hover:text-white hover:bg-white/10'
              }`}
              title="हिन्दी भाषा चुनें"
              aria-label="Switch to Hindi"
            >
              हिन्दी
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                i18n.language === 'en'
                  ? 'bg-kesari text-white shadow-md ring-1 ring-haldi font-extrabold scale-105'
                  : 'text-chandan-border hover:text-white hover:bg-white/10'
              }`}
              title="Switch to English"
              aria-label="Switch to English"
            >
              English
            </button>

            {/* Popup Dialog Trigger Button */}
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-1 ml-1 px-2 py-1 rounded-xl bg-haldi/20 hover:bg-haldi/30 text-haldi border border-haldi/40 text-[11px] font-bold transition-all hover:scale-105 active:scale-95"
              title="భాషల ఎంపిక పాప్అప్ / Open Language Selection Popup"
              aria-label="Open Language Selector Popup"
            >
              <Globe size={13} className="text-haldi" />
              <span className="hidden sm:inline">భాష / Lang</span>
            </button>
          </div>

          {/* Sacred Temple Bell Audio Button */}
          <button
            onClick={() => templeAudio.ringTempleBell()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-haldi/20 hover:bg-haldi/30 text-haldi border border-haldi/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xs"
            title="ఘంటానాదం / घंटी / Temple Bell"
            aria-label="Ring Temple Bell"
          >
            <Bell size={14} className="text-haldi animate-bounce" />
            <span className="hidden md:inline">
              {i18n.language === 'te' ? 'ఘంటానాదం' : i18n.language === 'hi' ? 'घंटी' : 'Temple Bell'}
            </span>
          </button>

          {/* Read Aloud Button */}
          {isSupported && (
            <button
              onClick={handleReadAloudCurrentPage}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSpeaking ? 'bg-kumkum text-white animate-pulse' : 'bg-neel-surface/90 hover:bg-neel-surface text-haldi border border-haldi/30'
              }`}
              title="చదివి వినిపించు / पढ़कर सुनाएं / Read Aloud"
              aria-label="Read Aloud"
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="hidden lg:inline">
                {i18n.language === 'te' ? 'వినిపించు' : i18n.language === 'hi' ? 'सुने' : 'Listen'}
              </span>
            </button>
          )}

          {/* Simple Elder Mode (60+) Toggle */}
          <button
            onClick={() => setSimpleMode(!simpleMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
              simpleMode
                ? 'bg-haldi text-neel font-bold shadow-md ring-2 ring-kesari'
                : 'bg-neel-surface/90 hover:bg-neel-surface text-chandan border border-chandan-border/40'
            }`}
            title="పెద్దల సులభ దర్శన మోడ్ / वरिष्ठ नागरिक सरल मोड / Elder Easy Mode"
            aria-pressed={simpleMode}
          >
            <Accessibility size={15} className="text-kesari" />
            <span className="font-bold">
              {simpleMode
                ? (i18n.language === 'te' ? '✓ పెద్దల మోడ్' : i18n.language === 'hi' ? '✓ सरल मोड' : '✓ Elder Mode')
                : (i18n.language === 'te' ? 'పెద్దల మోడ్' : i18n.language === 'hi' ? 'सरल मोड' : 'Elder Mode')}
            </span>
          </button>

          {/* Text Size Control */}
          <button
            onClick={cycleTextSize}
            className="px-2 py-1.5 rounded-xl bg-neel-surface/90 hover:bg-neel-surface text-haldi font-bold text-xs border border-neel/60"
            title="అక్షరాల పరిమాణం / अक्षर आकार / Text Size"
            aria-label={`Text Size: ${textSizeLabels[textSizeIndex]}`}
          >
            {textSizeLabels[textSizeIndex]}
          </button>

          {/* Dark Mode Switch (Sandhya / Ratri Darshan) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 rounded-xl bg-neel-surface/90 hover:bg-neel-surface text-haldi border border-neel/60"
            title={darkMode ? 'ఉదయ దర్శనం / Light Mode' : 'సంధ్యా దర్శనం / Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>

      {/* Main Sacred Header Brand & Navigation Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand identity: Single Clean Language at a time */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelectTab('home')}
        >
          <div className="p-2 sm:p-2.5 bg-chandan rounded-2xl border-2 border-haldi shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
            <DiyaIcon size={28} />
          </div>
          <div>
            <div className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-chandan group-hover:text-haldi transition-colors leading-tight">
              {i18n.language === 'te' ? 'గోదావరి మిలన్' : i18n.language === 'hi' ? 'गोदावरी मिलन' : 'Godavari Milan'}
            </div>
            <div className="text-[11px] sm:text-xs text-haldi font-medium tracking-wide">
              {t('app.tagline')}
            </div>
          </div>
        </div>

        {/* Desktop Nav Links: Single Clean Language at a time */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-bold">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'home' ? 'bg-kesari text-white shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <HomeIcon size={14} />
            <span>{t('nav.home')}</span>
          </button>

          <button
            onClick={() => onSelectTab('family')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'family' ? 'bg-kesari text-white shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <UserCheck size={14} />
            <span>{t('nav.register')}</span>
          </button>

          <button
            onClick={() => onSelectTab('missing')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'missing' ? 'bg-kumkum text-white shadow-urgent' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <AlertTriangle size={14} />
            <span>{t('nav.report_missing')}</span>
          </button>

          <button
            onClick={() => onSelectTab('found')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'found' ? 'bg-godavari text-white shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <HelpCircle size={14} />
            <span>{t('nav.report_found')}</span>
          </button>

          <button
            onClick={() => onSelectTab('lookup')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'lookup' ? 'bg-kesari text-white shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <Search size={14} />
            <span>{t('nav.lookup')}</span>
          </button>

          <button
            onClick={() => onSelectTab('helpdesk')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'helpdesk' ? 'bg-haldi text-neel font-bold shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <PhoneCall size={14} />
            <span>{t('nav.helpdesk')}</span>
          </button>

          <button
            onClick={() => onSelectTab('rituals')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'rituals' ? 'bg-kesari text-white shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <BookOpen size={14} />
            <span>{t('nav.rituals')}</span>
          </button>

          <button
            onClick={() => onSelectTab('edge_nodes')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              currentTab === 'edge_nodes' ? 'bg-kesari text-white shadow-md' : 'text-chandan hover:bg-neel-surface'
            }`}
          >
            <Wifi size={14} />
            <span>{t('nav.edge_nodes')}</span>
          </button>
        </nav>

        {/* Action Button: Sticky Emergency CTA + Mobile Menu Hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStickyHelp}
            className="flex items-center gap-1.5 sm:gap-2 bg-kumkum hover:bg-red-700 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-urgent animate-pulse transition-transform hover:scale-105 active:scale-95 border border-haldi/60"
            title={t('home.sticky_help')}
          >
            <AlertTriangle size={16} />
            <span className="font-bold">{t('home.sticky_help')}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-neel-surface text-chandan hover:text-white border border-neel/60"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Single Clean Language at a time */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neel-deep border-t border-neel/60 px-4 py-4 space-y-2 text-sm animate-fadeIn">
          {/* Mobile In-Menu Language Switcher Bar */}
          <div className="p-2.5 rounded-2xl bg-[#0C1026] border border-haldi/60 flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-haldi flex items-center gap-1.5">
              <Globe size={14} />
              <span>భాష / Language:</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleLanguageChange('te')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  i18n.language === 'te' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  i18n.language === 'hi' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                  i18n.language === 'en' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <button
            onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'home' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <HomeIcon size={18} />
            <span className="font-bold text-sm">{t('nav.home')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('family'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'family' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <UserCheck size={18} />
            <span className="font-bold text-sm">{t('nav.register')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('missing'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'missing' ? 'bg-kumkum text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <AlertTriangle size={18} />
            <span className="font-bold text-sm">{t('nav.report_missing')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('found'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'found' ? 'bg-godavari text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <HelpCircle size={18} />
            <span className="font-bold text-sm">{t('nav.report_found')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('lookup'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'lookup' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <Search size={18} />
            <span className="font-bold text-sm">{t('nav.lookup')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('helpdesk'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'helpdesk' ? 'bg-haldi text-neel font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <PhoneCall size={18} />
            <span className="font-bold text-sm">{t('nav.helpdesk')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('rituals'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'rituals' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <BookOpen size={18} />
            <span className="font-bold text-sm">{t('nav.rituals')}</span>
          </button>

          <button
            onClick={() => { onSelectTab('edge_nodes'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${currentTab === 'edge_nodes' ? 'bg-kesari text-white font-bold' : 'text-chandan hover:bg-neel-surface'}`}
          >
            <Wifi size={18} />
            <span className="font-bold text-sm">{t('nav.edge_nodes')}</span>
          </button>
        </div>
      )}

      {/* Holy Raksha Sutra thread line at base of header */}
      <RakshaSutraThread className="h-1.5" />
    </header>
  );
};

export default Header;
