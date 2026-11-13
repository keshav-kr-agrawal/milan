import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DiyaIcon, RakshaSutraThread, KolamDivider, TempleToranam } from '../motifs/CulturalMotifs';
import { populateFreshSeedData } from '../../data/db';
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  RotateCcw,
  ShieldCheck,
  HeartHandshake,
  PhoneCall,
  X,
  ArrowLeft,
  Info,
  FileText,
  Lock,
  ExternalLink,
  Sparkles,
  MapPin,
  Users,
  Compass,
  Radio,
  Clock,
  Eye,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Flame,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

type ModalType =
  | 'privacy'
  | 'consent'
  | 'retention'
  | 'accessibility'
  | 'first_timer_guide'
  | 'how_it_works'
  | 'volunteer_ethics'
  | null;

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const isTe = i18n.language === 'te';
  const isHi = i18n.language === 'hi';

  const toggleAccordion = (col: string) => {
    setOpenAccordion(openAccordion === col ? null : col);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (tab: string) => {
    setActiveModal(null);
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResetDemoData = async () => {
    if (window.confirm(t('common.demo_reset_confirm'))) {
      await populateFreshSeedData();
      setResetMessage('నమూనా డేటా విజయవంతంగా పునరుద్ధరించబడింది • डेटा रीसेट सफल • Demo Data Reset');
      setTimeout(() => setResetMessage(null), 4000);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0a121e] via-[#0d1829] to-[#070c14] text-white border-t-2 border-haldi mt-auto select-none no-print overflow-hidden shadow-2xl">
      {/* Background historical mela texture with rich dark atmospheric overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-6 mix-blend-luminosity z-0">
        <img
          src="/images/previous_mela_gathering.jpg"
          alt="Historical Pushkaralu Mela Texture"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#070c14]/94 backdrop-blur-xs pointer-events-none z-0" />

      {/* Sacred Temple Toranam and Golden Raksha Sutra Thread */}
      <TempleToranam className="w-full h-4 opacity-85 relative z-10" />
      <RakshaSutraThread className="h-1.5 relative z-10" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative z-10 space-y-8">
        
        {/* Row 1: Brand Banner & Live System Health Strip */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-neel-surface/80 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#FFF9EE] dark:bg-[#1E2D4A] rounded-2xl border-2 border-haldi shadow-md flex items-center justify-center shrink-0">
              <img
                src="/images/diya.png"
                alt="Godavari Milan Diya Logo"
                className="w-10 h-10 object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-black text-white tracking-wide">
                  {t('app.title')}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-kesari/30 text-amber-300 text-[10px] font-bold border border-haldi/50">
                  2027
                </span>
              </div>
              <div className="text-xs text-amber-300 font-bold mt-0.5">
                {t('app.subtitle')} • Rajamahendravaram
              </div>
              <div className="text-xs text-slate-200 font-medium">
                {t('app.tagline')}
              </div>
            </div>
          </div>

          {/* Live Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0a1426] border border-tulsi/50 text-tulsi-light backdrop-blur-sm shadow-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-tulsi animate-pulse" />
              <span className="font-bold text-[11px]">
                {isTe ? '12 ఘాట్లు ప్రత్యక్ష అనుసంధానం' : isHi ? 'सभी 12 घाट लाइव सक्रिय' : 'All 12 Ghats Online'}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0a1426] border border-haldi/50 text-amber-300 backdrop-blur-sm shadow-xs font-bold">
              <Radio size={13} className="text-amber-300 animate-pulse" />
              <span className="font-bold text-[11px]">
                {isTe ? 'ఆఫ్‌లైన్ మెష్ సిద్ధం' : isHi ? 'ऑफ़लाइन मेश नेटवर्क सक्रिय' : 'Offline Mesh Active'}
              </span>
            </div>

            <button
              onClick={() => setActiveModal('how_it_works')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#132038] hover:bg-[#1a2b4c] border border-haldi/40 text-amber-200 text-[11px] font-bold transition-all shadow-xs"
            >
              <HelpCircle size={13} className="text-kesari" />
              <span>{isTe ? 'మిలన్ ఎలా పనిచేస్తుంది?' : isHi ? 'मिलन कैसे काम करता है?' : 'How Milan Works'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: 24/7 Emergency Helplines Quick-Dial Bar */}
        <div className="rounded-2xl p-4 bg-gradient-to-r from-[#0a1324] via-[#0f1d36] to-[#0a1324] border border-haldi/50 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-300 shrink-0 shadow-sm">
                <PhoneCall size={18} />
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  {isTe ? '24/7 తక్షణ అత్యవసర హెల్ప్‌లైన్లు' : isHi ? '24/7 त्वरित आपातकालीन हेल्पलाइन' : '24/7 Instant Emergency Helplines'}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {isTe ? 'ఒక్క ట్యాప్‌తో వెంటనే కాల్ చేయండి' : isHi ? 'एक टैप से सीधे कॉल करें' : 'Tap to dial immediately from any mobile phone'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-950/90 hover:bg-red-900 text-white border-2 border-red-500 text-xs font-black transition-colors shadow-sm"
                title="National Emergency Helpline"
              >
                <span>🚨</span>
                <span>112 SOS</span>
              </a>
              <a
                href="tel:1098"
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/90 hover:bg-amber-900 text-amber-200 border-2 border-amber-400 text-xs font-black transition-colors shadow-sm"
                title="Childline - Lost Children"
              >
                <span>🧒</span>
                <span>1098 చైల్డ్‌లైన్</span>
              </a>
              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-200 border-2 border-emerald-400 text-xs font-black transition-colors shadow-sm"
                title="Free River Ambulance"
              >
                <span>🚑</span>
                <span>108 అంబులెన్స్</span>
              </a>
              <a
                href="tel:100"
                className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/90 hover:bg-blue-900 text-blue-200 border-2 border-blue-400 text-xs font-black transition-colors shadow-sm"
                title="Police Control Room"
              >
                <span>👮</span>
                <span>100 పోలీస్</span>
              </a>
            </div>
          </div>
        </div>

        {/* Row 3: Previous Pushkaralu Mela Historical Photograph Card */}
        {/* Row 3: Previous Pushkaralu Mela Historical Photograph Card */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-haldi/60 shadow-xl group">
          <div className="relative min-h-[300px] sm:min-h-[250px] md:h-64 w-full flex flex-col justify-between p-4 sm:p-5">
            <img
              src="/images/previous_mela_gathering.jpg"
              alt="Previous Godavari Pushkaralu Mela in Rajamahendravaram"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 -z-10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070c14] via-[#070c14]/90 to-[#070c14]/40 -z-10" />

            <div className="w-fit bg-[#0a1224]/95 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-haldi/60 backdrop-blur-sm flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-kesari animate-pulse" />
              <span>{isTe ? 'చారిత్రక పుష్కరాల స్మృతి' : isHi ? 'ऐतिहासिक पुष्करालु स्मृतियाँ' : 'Historical Pushkaralu Memories'}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 text-white pt-6">
              <div className="space-y-1.5 max-w-2xl">
                <h4 className="font-serif font-black text-base sm:text-lg md:text-xl text-amber-200 drop-shadow-md leading-snug">
                  {isTe
                    ? 'గోదావరి మహా పుష్కరాల చారిత్రక దృశ్యం • రాజమహేంద్రవరం హేవలాక్ వంతెన తీరంలో భక్తజన సముద్రం'
                    : isHi
                    ? 'गोदावरी महा पुष्करालु ऐतिहासिक दृश्य • राजमहेंद्रवरम हेवलॉक ब्रिज तट पर लाखों श्रद्धालुओं का पावन संगम'
                    : 'Historic Godavari Pushkaralu Gathering • Millions of Devotees along Rajamahendravaram Ghats by Havelock Bridge'}
                </h4>
                <p className="text-xs text-slate-100 hidden sm:block font-medium leading-relaxed drop-shadow-sm">
                  {isTe
                    ? 'గత పుష్కరాల పవిత్ర క్షణాలు — లక్షలాది భక్తులు, రంగురంగుల పడవలు, భక్తిగీతాలు మరియు అఖండ హారతుల పవిత్ర సంగమం.'
                    : isHi
                    ? 'विगत पुष्करालु के पावन क्षण — करोड़ों श्रद्धालु, पवित्र नौकाएं, वैदिक मंत्रोच्चार और गोदावरी मैया की अविरल भक्ति।'
                    : 'Moments from previous sacred Pushkaralu fairs — millions taking holy snanam amidst Vedic chants, vibrant boats, and timeless river reverence.'}
                </p>
              </div>

              <button
                onClick={() => handleNav('heritage')}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-black shadow-lg transition-all hover:scale-105 border border-haldi/60"
              >
                <span>{isTe ? 'సాంస్కృతిక విశేషాలు చూడండి' : isHi ? 'सांस्कृतिक इतिहास देखें' : 'Explore Heritage Archives'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: 4 Trilingual Columns with High-Contrast Dark Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 py-4">
          
          {/* Column 1: Pilgrim Services & Navigation */}
          <div className="p-5 rounded-2xl bg-[#0c1628]/95 border-2 border-haldi/30 shadow-lg backdrop-blur-md space-y-3">
            <button
              onClick={() => toggleAccordion('services')}
              className="flex items-center justify-between w-full text-left font-serif font-black text-amber-300 text-base pb-2 border-b border-white/10 lg:cursor-default"
            >
              <span className="flex items-center gap-2">
                <Users size={18} className="text-amber-400" />
                <span>{isTe ? 'యాత్రికుల సేవలు' : isHi ? 'श्रद्धालु सेवाएं' : 'Pilgrim Services'}</span>
              </span>
              <span className="lg:hidden text-amber-300">
                {openAccordion === 'services' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>

            <div className={`space-y-2 text-xs sm:text-sm ${openAccordion === 'services' ? 'block' : 'hidden lg:block'}`}>
              <div>
                <button
                  onClick={() => handleNav('home')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🏠</span>
                  <span>{isTe ? 'ప్రధాన ముఖచిత్రం' : isHi ? 'मुख्य पृष्ठ' : 'Home Overview'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('family')}
                  className="text-amber-300 font-black hover:text-white hover:underline transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>👨‍👩‍👧</span>
                  <span>{t('footer.register_family_link')} & {isTe ? 'రక్షా బ్యాండ్లు' : isHi ? 'सुरक्षा बैंड' : 'Safety Bands'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('missing')}
                  className="text-red-400 hover:text-red-300 font-bold hover:underline transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🚨</span>
                  <span>{isTe ? 'తప్పిపోయిన వారి ఫిర్యాదు' : isHi ? 'लापता व्यक्ति रिपोर्ट' : 'Report Missing Pilgrim'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('found')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🤝</span>
                  <span>{isTe ? 'కనుగొన్న వారి నమోదు' : isHi ? 'मिले हुए व्यक्ति का विवरण' : 'Report Found Person'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('lookup')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🔍</span>
                  <span>{isTe ? 'తప్పిపోయిన వారి డైరెక్టరీ' : isHi ? 'लापता डायरेक्टरी खोज' : 'Search Missing Directory'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('booths')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>📍</span>
                  <span>{isTe ? 'ఘాట్లు & మిలన్ సహాయ కేంద్రాల మ్యాప్' : isHi ? 'घाट एवं सहायता केंद्र मानचित्र' : 'Ghats & Booths Map'}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('edge_nodes')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>📶</span>
                  <span>{t('footer.offline_hotspots_link')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Pushkaralu Heritage & Sacred Guides */}
          <div className="p-5 rounded-2xl bg-[#0c1628]/95 border-2 border-haldi/30 shadow-lg backdrop-blur-md space-y-3">
            <button
              onClick={() => toggleAccordion('heritage')}
              className="flex items-center justify-between w-full text-left font-serif font-black text-amber-300 text-base pb-2 border-b border-white/10 lg:cursor-default"
            >
              <span className="flex items-center gap-2">
                <Compass size={18} className="text-amber-400" />
                <span>{t('footer.col_festival')}</span>
              </span>
              <span className="lg:hidden text-amber-300">
                {openAccordion === 'heritage' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>

            <div className={`space-y-2 text-xs sm:text-sm ${openAccordion === 'heritage' ? 'block' : 'hidden lg:block'}`}>
              <div>
                <button
                  onClick={() => handleNav('heritage')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>📜</span>
                  <span>{t('footer.about_pushkaralu')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('rituals')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🌊</span>
                  <span>{t('footer.rituals_link')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('booths')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🛕</span>
                  <span>{t('footer.ghats_link')} (12 Sacred Ghats)</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('first_timer_guide')}
                  className="text-amber-300 font-bold hover:underline transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>📖</span>
                  <span>{t('footer.etiquette_link')} (Ghat Etiquette)</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('how_it_works')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>⚡</span>
                  <span>{t('footer.how_it_works_link')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleNav('heritage')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>📸</span>
                  <span>{isTe ? 'హేవలాక్ వంతెన చారిత్రక సంగ్రహం' : isHi ? 'हेवलॉक ब्रिज ऐतिहासिक संग्रह' : 'Havelock Bridge Archives'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Safety & Ghat Infrastructure */}
          <div className="p-5 rounded-2xl bg-[#0c1628]/95 border-2 border-haldi/30 shadow-lg backdrop-blur-md space-y-3">
            <button
              onClick={() => toggleAccordion('safety')}
              className="flex items-center justify-between w-full text-left font-serif font-black text-amber-300 text-base pb-2 border-b border-white/10 lg:cursor-default"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400" />
                <span>{t('footer.col_safety')}</span>
              </span>
              <span className="lg:hidden text-amber-300">
                {openAccordion === 'safety' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>

            <div className={`space-y-2 text-xs sm:text-sm ${openAccordion === 'safety' ? 'block' : 'hidden lg:block'}`}>
              <div>
                <a href="tel:112" className="text-red-400 font-black hover:underline flex items-center gap-2 py-1">
                  <span>🚨</span>
                  <span>{t('footer.emergency_112')}</span>
                </a>
              </div>
              <div>
                <a href="tel:100" className="text-slate-100 hover:text-amber-300 font-semibold flex items-center gap-2 py-1">
                  <span>👮</span>
                  <span>{t('footer.police_100')}</span>
                </a>
              </div>
              <div>
                <a href="tel:108" className="text-emerald-300 font-bold hover:underline flex items-center gap-2 py-1">
                  <span>🚑</span>
                  <span>{t('footer.ambulance_108')}</span>
                </a>
              </div>
              <div>
                <a href="tel:1098" className="text-amber-300 font-bold hover:underline flex items-center gap-2 py-1">
                  <span>🧒</span>
                  <span>{t('footer.childline_1098')}</span>
                </a>
              </div>
              <div>
                <button
                  onClick={() => handleNav('helpdesk')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🏢</span>
                  <span>{t('footer.helpdesks_link')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('volunteer_ethics')}
                  className="text-slate-200 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-2 py-1"
                >
                  <span>🤝</span>
                  <span>{isTe ? 'వాలంటీర్ ప్రవర్తనా నియమావళి' : isHi ? 'स्वयंसेवक आचार संहिता' : 'Volunteer Code of Ethics'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Legal & DPDP Act 2023 */}
          <div className="p-5 rounded-2xl bg-[#0c1628]/95 border-2 border-haldi/30 shadow-lg backdrop-blur-md space-y-3">
            <button
              onClick={() => toggleAccordion('legal')}
              className="flex items-center justify-between w-full text-left font-serif font-black text-amber-300 text-base pb-2 border-b border-white/10 lg:cursor-default"
            >
              <span className="flex items-center gap-2">
                <Lock size={18} className="text-amber-400" />
                <span>{t('footer.col_legal')}</span>
              </span>
              <span className="lg:hidden text-amber-300">
                {openAccordion === 'legal' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>

            <div className={`space-y-2 text-xs sm:text-sm ${openAccordion === 'legal' ? 'block' : 'hidden lg:block'}`}>
              <div>
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-amber-300 font-black hover:underline flex items-center gap-2 py-1 text-left"
                >
                  <ShieldCheck size={15} className="shrink-0 text-amber-400" />
                  <span>{t('footer.privacy_policy')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('consent')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors flex items-center gap-2 py-1 text-left"
                >
                  <FileText size={15} className="shrink-0" />
                  <span>{t('footer.consent_terms')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('retention')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors flex items-center gap-2 py-1 text-left"
                >
                  <Clock size={15} className="shrink-0" />
                  <span>{t('footer.data_retention')}</span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('accessibility')}
                  className="text-slate-100 hover:text-amber-300 font-semibold transition-colors flex items-center gap-2 py-1 text-left"
                >
                  <Eye size={15} className="shrink-0" />
                  <span>{t('footer.accessibility_stmt')}</span>
                </button>
              </div>
              <div className="pt-2 border-t border-white/10 text-xs text-slate-300 font-bold">
                <span>🛡️ DPDP Act 2023 Section 7 Architecture</span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 5: DPDP Act 2023 Compliance Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0c1628] via-[#101e38] to-[#0c1628] border-2 border-haldi/40 text-xs sm:text-sm leading-relaxed text-slate-100 flex flex-col sm:flex-row items-start gap-3 shadow-md">
          <ShieldCheck size={26} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="font-black text-amber-300 text-sm flex items-center gap-2">
              <span>{t('footer.dpdp_badge')}</span>
              <button
                onClick={() => setActiveModal('privacy')}
                className="text-xs text-white underline hover:text-amber-300"
              >
                {isTe ? 'విధానం చదవండి' : isHi ? 'नीति पढ़ें' : 'Read Full Policy'}
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-200 font-medium">
              {t('footer.dpdp_note')}
            </div>
          </div>
        </div>

        {/* Row 6: Prototype Notice & Footer Actions */}
        <div className="pt-4 text-xs sm:text-sm text-slate-200 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-amber-300 text-center md:text-left space-y-0.5">
            <div>{t('footer.disclaimer_warning')}</div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#142340] hover:bg-[#1c325c] text-amber-300 border border-haldi/50 text-xs font-bold transition-colors shadow-sm"
              title={t('footer.reset_demo_btn')}
            >
              <RotateCcw size={14} />
              <span>{t('footer.reset_demo_btn')}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#142340] hover:bg-[#1c325c] text-white border border-white/20 text-xs font-bold transition-colors shadow-sm"
              title={t('footer.back_to_top')}
            >
              <ArrowUp size={14} />
              <span>{t('footer.back_to_top')}</span>
            </button>
          </div>
        </div>

        {resetMessage && (
          <div className="text-center py-2.5 text-xs font-bold text-tulsi-light bg-tulsi/30 rounded-xl animate-fadeIn border border-tulsi/40">
            ✓ {resetMessage}
          </div>
        )}

        <div className="text-center text-xs text-slate-300 font-medium pb-2">
          {t('footer.version')} • Rajamahendravaram, Andhra Pradesh, Bharat
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS FOR ALL FOOTER POPUPS WITH EXPLICIT CROSS & BACK BUTTONS */}
      {/* ========================================================================= */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neel/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-[#121A2D] text-ink dark:text-slate-100 p-5 sm:p-7 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border-2 border-kesari shadow-2xl space-y-4 my-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-chandan-border dark:border-slate-700 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-chandan dark:bg-[#1E2D4A] rounded-xl border border-haldi text-kesari">
                  {activeModal === 'privacy' && <ShieldCheck size={22} />}
                  {activeModal === 'consent' && <FileText size={22} />}
                  {activeModal === 'retention' && <Clock size={22} />}
                  {activeModal === 'accessibility' && <Eye size={22} />}
                  {activeModal === 'first_timer_guide' && <Compass size={22} />}
                  {activeModal === 'how_it_works' && <Radio size={22} />}
                  {activeModal === 'volunteer_ethics' && <HeartHandshake size={22} />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-neel dark:text-white">
                    {activeModal === 'privacy' && (isTe ? 'గోప్యతా విధానం (DPDP చట్టం 2023)' : isHi ? 'गोपनीयता नीति (DPDP अधिनियम 2023)' : 'Privacy Policy (DPDP Act 2023)')}
                    {activeModal === 'consent' && (isTe ? 'సంరక్షకుని సమ్మతి నిబంధనలు' : isHi ? 'अभिभावक सहमति शर्तें' : 'Guardian Consent Terms')}
                    {activeModal === 'retention' && (isTe ? '30 రోజుల డేటా తొలగింపు నిబంధన' : isHi ? '30 दिवसीय डेटा विलोपन नीति' : '30-Day Auto-Purge Policy')}
                    {activeModal === 'accessibility' && (isTe ? 'సౌలభ్య నివేదిక (Accessibility)' : isHi ? 'सुलभता विवरण (Accessibility)' : 'Accessibility Statement (WCAG 2.1 AA)')}
                    {activeModal === 'first_timer_guide' && (isTe ? 'యాత్రికుల సూచనలు & పవిత్ర నియమాలు' : isHi ? 'प्रथम बार आने वाले तीर्थयात्रियों हेतु दिशानिर्देश' : 'First-Timer Pilgrimage & Ghat Etiquette')}
                    {activeModal === 'how_it_works' && (isTe ? 'గోదావరి మిలన్ ఎలా పనిచేస్తుంది?' : isHi ? 'गोदावरी मिलन कैसे कार्य करता है?' : 'How Godavari Milan Works')}
                    {activeModal === 'volunteer_ethics' && (isTe ? 'స్వచ్ఛంద సేవకుల నియమావళి' : isHi ? 'स्वयंसेवक आचार संहिता' : 'Volunteer Code of Ethics')}
                  </h3>
                  <div className="text-[11px] text-ink-muted dark:text-slate-400">
                    {activeModal === 'privacy' && 'Digital Personal Data Protection Act, 2023 • Emergency Disaster Section 7'}
                    {activeModal === 'consent' && 'Mandatory parental & guardian authorization for minors and elders'}
                    {activeModal === 'retention' && 'Automated cryptographic deletion exactly 30 days post-Pushkaralu'}
                    {activeModal === 'accessibility' && 'WCAG 2.1 AA compliance • Trilingual audio • High contrast'}
                    {activeModal === 'first_timer_guide' && 'Sacred Godavari river safety, brass chain protocols, and rendezvous spots'}
                    {activeModal === 'how_it_works' && 'Thermal wristbands, offline BLE/Wi-Fi mesh, and instant SMS reunification'}
                    {activeModal === 'volunteer_ethics' && 'Strict non-commercial protocol, child protection, and respectful assistance'}
                  </div>
                </div>
              </div>

              {/* Close Cross Button */}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full bg-chandan dark:bg-[#1E2D4A] hover:bg-kumkum-light hover:text-kumkum text-neel dark:text-slate-200 transition-colors shrink-0 shadow-xs"
                aria-label="Close Modal"
                title="Close (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="text-xs text-ink dark:text-slate-200 leading-relaxed space-y-3.5">
              
              {/* MODAL 1: PRIVACY POLICY */}
              {activeModal === 'privacy' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'గోదావరి మిలన్ వేదిక భారత డిజిటల్ వ్యక్తిగత సమాచార రక్షణ (DPDP) చట్టం 2023 లోని సెక్షన్ 7 (విపత్తు నిర్వహణ మరియు పబ్లిక్ సేఫ్టీ) నిబంధనల ప్రకారం పనిచేస్తుంది.'
                        : isHi
                        ? 'गोदावरी मिलन मंच भारत के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 की धारा 7 (आपदा प्रबंधन एवं सार्वजनिक सुरक्षा) के तहत संचालित है।'
                        : 'Godavari Milan operates strictly under Section 7 of India’s Digital Personal Data Protection (DPDP) Act 2023, covering lawful processing for emergency response, disaster relief, and family reunification.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-neel">
                      {isTe ? 'ప్రధాన రక్షణ సూత్రాలు:' : isHi ? 'मुख्य सुरक्षा सिद्धांत:' : 'Key Protection Guarantees:'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                      <li>
                        <strong className="text-neel">{isTe ? 'కనీస సమాచార సేకరణ (Data Minimisation):' : isHi ? 'न्यूनतम डेटा संग्रह:' : 'Strict Data Minimisation:'}</strong>{' '}
                        {isTe
                          ? 'కేవలం పేరు, వయస్సు, స్వస్థలం మరియు సంరక్షకుని ఫోన్ నంబర్ మాత్రమే సేకరించబడుతుంది. ఆధార్ లేదా ఆర్థిక వివరాలు సేకరించబడవు.'
                          : isHi
                          ? 'केवल नाम, आयु, गृह नगर और अभिभावक का फ़ोन नंबर लिया जाता है। कोई आधार या वित्तीय डेटा नहीं लिया जाता।'
                          : 'Only essential details (name, age, home town, guardian phone) are recorded. We never collect Aadhaar numbers, biometric registries, or bank data.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'రక్షిత ఫోన్ నంబర్లు (Masked Contacts):' : isHi ? 'सुरक्षित फ़ोन नंबर:' : 'Masked Guardian Contacts:'}</strong>{' '}
                        {isTe
                          ? 'రిస్ట్‌బ్యాండ్‌పై QR స్కాన్ చేసినప్పుడు ఫోన్ నంబర్ నేరుగా కనిపించదు. రక్షిత SMS OTP ధృవీకరణ ద్వారా మాత్రమే సంప్రదింపు సాధ్యమవుతుంది.'
                          : isHi
                          ? 'कलाई बैंड पर QR स्कैन करने पर फ़ोन नंबर खुला नहीं दिखता। सुरक्षित SMS OTP सत्यापन से ही संपर्क होता है।'
                          : 'Wristband QR codes never display raw phone numbers. Contacting guardians requires explicit 4-digit SMS OTP consent.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'వాణిజ్య ప్రకటనలు లేవు:' : isHi ? 'शून्य व्यावसायिक उपयोग:' : 'Zero Commercialization:'}</strong>{' '}
                        {isTe
                          ? 'డేటా ఎట్టి పరిస్థితుల్లోనూ మూడవ పక్షాలకు లేదా ప్రకటనదారులకు విక్రయించబడదు.'
                          : isHi
                          ? 'डेटा किसी तीसरे पक्ष या विज्ञापनदाता को कभी नहीं दिया जाता।'
                          : 'Data is strictly non-commercial. No ads, no profiling, and zero third-party brokers.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'శాశ్వత తొలగింపు:' : isHi ? 'स्थायी विलोपन:' : 'Permanent Auto-Purge:'}</strong>{' '}
                        {isTe
                          ? 'పుష్కరాలు పూర్తయిన 30 రోజుల్లో మొత్తం సమాచారం శాశ్వతంగా తొలగించబడుతుంది.'
                          : isHi
                          ? 'पुष्करालु संपन्न होने के 30 दिनों में समस्त डेटा स्थायी रूप से हटा दिया जाता है।'
                          : 'All records, photos, and match caches are cryptographically deleted exactly 30 days post-Pushkaralu.'}
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* MODAL 2: GUARDIAN CONSENT */}
              {activeModal === 'consent' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'మైనర్లు (18 సంవత్సరాలలోపు వారు) మరియు వృద్ధుల నమోదుకు తల్లిదండ్రులు లేదా సంరక్షకుని అనుమతి తప్పనిసరి.'
                        : isHi
                        ? 'नाबालिगों (18 वर्ष से कम) और वरिष्ठ नागरिकों के पंजीकरण हेतु अभिभावक की सहमति अनिवार्य है।'
                        : 'Mandatory parental or lawful guardian authorization is required prior to registering minors and elderly family members.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-neel">
                      {isTe ? 'సమ్మతి నిబంధనల వివరాలు:' : isHi ? 'सहमति शर्तों के विवरण:' : 'Terms of Guardian Authorization:'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                      <li>
                        <strong className="text-neel">{isTe ? 'రిస్ట్‌బ్యాండ్ ధరించడం:' : isHi ? 'सुरक्षा बैंड पहनना:' : 'Wristband Issuance:'}</strong>{' '}
                        {isTe
                          ? 'కుటుంబ సభ్యులకు రక్షా రిస్ట్‌బ్యాండ్ లేదా పాకెట్ కార్డు అందించడానికి సంరక్షకుడు పూర్తి అనుమతినిస్తారు.'
                          : isHi
                          ? 'परिवार के सदस्यों को सुरक्षा रिस्टबैंड या पॉकेट कार्ड जारी करने हेतु अभिभावक सहमति देते हैं।'
                          : 'The guardian authorizes issuance of thermal waterproof wristbands or ID cards containing an encrypted reunion link.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'రక్షణ సిబ్బంది సహకారం:' : isHi ? 'सुरक्षा बल सहयोग:' : 'Emergency Police & SDRF Assistance:'}</strong>{' '}
                        {isTe
                          ? 'తప్పిపోయిన సందర్భంలో ఆంధ్రప్రదేశ్ పోలీస్, విపత్తు బృందాలు (SDRF) సహాయం అందించడానికి అధికారముంటుంది.'
                          : isHi
                          ? 'लापता होने पर आंध्र प्रदेश पुलिस व आपदा दल (SDRF) को सहायता पहुंचाने का अधिकार होगा।'
                          : 'Andhra Pradesh Police, SDRF, and verified Milan volunteers are authorized to expedite identification during active search operations.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'సవరణ & రద్దు హక్కు:' : isHi ? 'संशोधन व वापसी का अधिकार:' : 'Right to Revoke & Update:'}</strong>{' '}
                        {isTe
                          ? 'సంరక్షకులు ఏ సమయంలోనైనా ఏదైనా సహాయ కేంద్రం వద్ద తమ వివరాలను నవీకరించవచ్చు లేదా తొలగించవచ్చు.'
                          : isHi
                          ? 'अभिभावक किसी भी सहायता केंद्र पर कभी भी अपने विवरण में बदलाव या निरस्तीकरण करा सकते हैं।'
                          : 'Guardians retain full control to update phone numbers or revoke profiles at any designated pink booth or helpdesk.'}
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* MODAL 3: 30-DAY AUTO-PURGE */}
              {activeModal === 'retention' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'గోదావరి మహా పుష్కరాలు 2027 ముగిసిన సరిగ్గా 30 రోజులకు అన్ని వివరాలు స్వయంచాలకంగా మరియు శాశ్వతంగా తొలగించబడతాయి.'
                        : isHi
                        ? 'गोदावरी महा पुष्करालु 2027 के समापन के ठीक 30 दिनों बाद समस्त डेटा स्वचालित और स्थायी रूप से मिटा दिया जाएगा।'
                        : 'All personally identifiable pilgrim data is automatically and permanently purged exactly 30 calendar days after the conclusion of Godavari Pushkaralu 2027.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-neel">
                      {isTe ? 'తొలగింపు ప్రక్రియ:' : isHi ? 'विलोपन प्रक्रिया:' : 'Purge Process & Guarantees:'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                      <li>
                        <strong className="text-neel">{isTe ? 'క్లౌడ్ మరియు ఆఫ్‌లైన్ మెష్:' : isHi ? 'क्लाउड और ऑफ़लाइन मेश:' : 'Cloud & Edge Deletion:'}</strong>{' '}
                        {isTe
                          ? 'సుపాబేస్ క్లౌడ్ డేటాబేస్ మరియు ఘాట్ల వద్ద ఉన్న ఆఫ్‌లైన్ మెష్ పరికరాలు రెండింటి నుండి డేటా తుడిచివేయబడుతుంది.'
                          : isHi
                          ? 'क्लाउड डेटाबेस और सभी घाटों के ऑफ़लाइन मेश डिवाइस दोनों से डेटा पूरी तरह हटा दिया जाएगा।'
                          : 'Database records, face embedding vectors, and local IndexedDB edge caches are cryptographically overwritten.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'అనామక గణాంకాలు మాత్రమే:' : isHi ? 'केवल अनाम सांख्यिकी:' : 'Anonymized Statistics Only:'}</strong>{' '}
                        {isTe
                          ? 'ప్రభుత్వ విపత్తు నిర్వహణ నివేదిక కోసం కేవలం అనామక సంఖ్యలు (ఉదా: 1,420 మంది పునఃకలయిక) మాత్రమే భద్రపరచబడతాయి.'
                          : isHi
                          ? 'सरकारी आपदा रिपोर्ट हेतु केवल समग्र सांख्यिकी (जैसे 1,420 सफल मिलन) रखी जाएगी, बिना किसी व्यक्तिगत नाम के।'
                          : 'Only non-identifiable aggregate metrics (e.g. total families reunited) are retained for state after-action review.'}
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* MODAL 4: ACCESSIBILITY STATEMENT */}
              {activeModal === 'accessibility' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'గోదావరి మిలన్ ప్రతి ఒక్కరికీ, ముఖ్యంగా వృద్ధులు మరియు చదవలేని భక్తులందరికీ అందుబాటులో ఉండేలా రూపొందించబడింది (WCAG 2.1 AA).'
                        : isHi
                        ? 'गोदावरी मिलन सभी के लिए, विशेषकर वरिष्ठ नागरिकों और निरक्षर श्रद्धालुओं के लिए सुलभ बनाया गया है (WCAG 2.1 AA)।'
                        : 'Godavari Milan is built to WCAG 2.1 AA accessibility standards, ensuring frictionless usability for elderly pilgrims, low-vision users, and non-literate devotees.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-neel">
                      {isTe ? 'సౌలభ్యాలు:' : isHi ? 'सुलभता सुविधाएं:' : 'Built-in Universal Features:'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                      <li>
                        <strong className="text-neel">{isTe ? 'వాయిస్ ఓవర్ (ఆడియో):' : isHi ? 'ऑडियो वाचन:' : 'Trilingual Voice Synthesis:'}</strong>{' '}
                        {isTe
                          ? 'తెలుగు, హిందీ, ఇంగ్లీష్ భాషలలో వాయిస్ అసిస్టెంట్ ద్వారా బటన్లు మరియు సందేశాలను చదివి వినిపించే సౌలభ్యం.'
                          : isHi
                          ? 'तेलुगु, हिंदी और अंग्रेजी में वॉइस असिस्टेंट द्वारा सामग्री सुनकर समझने की सुविधा।'
                          : 'High-clarity native speech synthesis reads out missing broadcasts, prayer shlokas, and safety instructions.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'పెద్ద అక్షరాలు & అధిక కాంట్రాస్ట్:' : isHi ? 'बड़े अक्षर व उच्च कंट्रास्ट:' : 'Elder-Friendly High Contrast & Font Sizing:'}</strong>{' '}
                        {isTe
                          ? '60+ వయస్సు గల వారి కోసం స్పష్టమైన పెద్ద అక్షరాలు మరియు సులభమైన రంగులు.'
                          : isHi
                          ? '60+ आयु वर्ग के लिए स्पष्ट बड़े अक्षर और पढ़ने में आसान रंग।'
                          : 'Generous touch targets, adjustable font sizes, and dark/high-contrast options.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'స్క్రీన్ రీడర్ సదుపాయం:' : isHi ? 'स्क्रीन रीडर समर्थन:' : 'Full Screen-Reader Support:'}</strong>{' '}
                        {isTe
                          ? 'దృష్టిలోపం ఉన్న భక్తుల కోసం పూర్తి ARIA నావిగేషన్ సదుపాయం.'
                          : isHi
                          ? 'दृष्टिबाधित श्रद्धालुओं हेतु पूर्ण ARIA कीबोर्ड नेविगेशन।'
                          : 'Semantic HTML5, ARIA live-regions, and keyboard navigation.'}
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* MODAL 5: FIRST-TIMER GUIDE & GHAT ETIQUETTE */}
              {activeModal === 'first_timer_guide' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'మొదటిసారి గోదావరి పుష్కరాలకు వచ్చే భక్తులకు పవిత్ర స్నాన నియమాలు మరియు భద్రతా సూచనలు.'
                        : isHi
                        ? 'प्रथम बार गोदावरी पुष्करालु में आने वाले श्रद्धालुओं हेतु पावन स्नान नियम एवं सुरक्षा निर्देश।'
                        : 'Essential guide for first-time Pushkaralu pilgrims: river safety protocols, sacred ghat etiquette, and family reunion steps.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-sm text-neel">
                      {isTe ? 'ముఖ్యమైన సూచనలు:' : isHi ? 'महत्वपूर्ण निर्देश:' : 'Essential Pilgrim Rules:'}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                      <li>
                        <strong className="text-neel">{isTe ? 'ఇత్తడి రక్షణ గొలుసులు:' : isHi ? 'पीतल सुरक्षा जंजीरें:' : 'Hold the Brass Safety Chains:'}</strong>{' '}
                        {isTe
                          ? 'ఘాట్ మెట్ల వద్ద ఉండే ఇత్తడి రక్షణ గొలుసులను పట్టుకుని మాత్రమే పవిత్ర స్నానం ఆచరించండి. నది లోపలికి వెళ్లవద్దు.'
                          : isHi
                          ? 'घाट की सीढ़ियों पर लगी पीतल की सुरक्षा जंजीरें पकड़कर ही स्नान करें। गहरे पानी में कभी न जाएं।'
                          : 'Always grip the sturdy brass safety chains along the ghat steps. Never step beyond the orange warning buoys.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'కలిసే స్థలాన్ని ముందుగా నిర్ణయించండి:' : isHi ? 'मिलन स्थल पहले से तय करें:' : 'Pre-Agree on a Family Landmark:'}</strong>{' '}
                        {isTe
                          ? 'ఘాట్‌పైకి వెళ్ళే ముందే కుటుంబమంతా ఒక ముఖ్యమైన గుర్తు వద్ద (ఉదా: కోటిలింగాల శివాలయం లేదా పింక్ బూత్ #2) కలవాలని మాట్లాడుకోండి.'
                          : isHi
                          ? 'घाट पर जाने से पहले परिवार के साथ एक निश्चित मिलन स्थल (जैसे कोटिलिंगाला शिव मंदिर या बूथ #2) तय कर लें।'
                          : 'Before stepping into crowd areas, designate an exact physical meeting spot in case you get separated.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'రిస్ట్‌బ్యాండ్‌ను ఎల్లప్పుడూ ఉంచండి:' : isHi ? 'सुरक्षा बैंड हमेशा पहने रहें:' : 'Wear Wristbands 24/7:'}</strong>{' '}
                        {isTe
                          ? 'పిల్లలు మరియు పెద్దల చేతికి ఉన్న వాటర్‌ప్రూఫ్ రిస్ట్‌బ్యాండ్‌ను తీసివేయవద్దు.'
                          : isHi
                          ? 'बच्चों और बुजुर्गों के हाथ का वाटरप्रूफ रिस्टबैंड कभी न उतारें।'
                          : 'Thermal wristbands are 100% waterproof and sweatproof. Keep them securely wrapped throughout your pilgrimage.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'తప్పిపోతే ఆందోళన చెందవద్దు:' : isHi ? 'लापता होने पर घबराएं नहीं:' : 'If Separated, Do Not Panic:'}</strong>{' '}
                        {isTe
                          ? 'వెంటనే సమీప గోదావరి మిలన్ బూత్ లేదా నీలం రంగు దుస్తులు ధరించిన వాలంటీర్ వద్దకు వెళ్లండి.'
                          : isHi
                          ? 'तुरंत निकटतम गोदावरी मिलन बूथ या सेवादारों के पास जाएं।'
                          : 'Head directly to the nearest Milan Booth or approach any volunteer in high-visibility vests.'}
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* MODAL 6: HOW IT WORKS */}
              {activeModal === 'how_it_works' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'గోదావరి మిలన్ ఎలా పనిచేస్తుంది: 60 సెకన్ల నమోదు నుండి తక్షణ పునఃకలయిక వరకు.'
                        : isHi
                        ? 'गोदावरी मिलन कैसे काम करता है: 60 सेकंड के पंजीकरण से तत्काल पारिवारिक मिलन तक।'
                        : 'How Godavari Milan safely protects 50+ million pilgrims: from instant registration to rapid offline reunion.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-chandan/20 border border-chandan-border">
                      <span className="font-bold text-kesari text-sm font-mono shrink-0">1.</span>
                      <div>
                        <strong className="text-neel">{isTe ? 'సులభ నమోదు:' : isHi ? 'सरल पंजीकरण:' : 'Instant Registration:'}</strong>{' '}
                        {isTe
                          ? 'ఇంటి వద్ద లేదా రైల్వే స్టేషన్/ఘాట్ బూత్ వద్ద 60 సెకన్లలో కుటుంబ సభ్యులను నమోదు చేయండి.'
                          : isHi
                          ? 'घर पर या स्टेशन/घाट बूथ पर 60 सेकंड में परिवार का पंजीकरण करें।'
                          : 'Register family in 60 seconds at home or any arriving transit booth.'}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-chandan/20 border border-chandan-border">
                      <span className="font-bold text-kesari text-sm font-mono shrink-0">2.</span>
                      <div>
                        <strong className="text-neel">{isTe ? 'వాటర్‌ప్రూఫ్ రిస్ట్‌బ్యాండ్:' : isHi ? 'वाटरप्रूफ रिस्टबैंड:' : 'Waterproof Thermal Wristband:'}</strong>{' '}
                        {isTe
                          ? 'ప్రత్యేక QR కోడ్ మరియు ID తో కూడిన రక్షా సూత్ర బ్యాండ్ లేదా పాకెట్ కార్డును పొందండి.'
                          : isHi
                          ? 'विशिष्ट QR कोड व ID युक्त रक्षा सूत्र बैंड या कार्ड तुरंत प्राप्त करें।'
                          : 'Get a tear-resistant, thermal wristband or pocket card with encrypted QR code.'}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-chandan/20 border border-chandan-border">
                      <span className="font-bold text-kesari text-sm font-mono shrink-0">3.</span>
                      <div>
                        <strong className="text-neel">{isTe ? 'ఆఫ్‌లైన్ మెష్ నెట్‌వర్క్:' : isHi ? 'ऑफ़लाइन मेश नेटवर्क:' : 'Offline Mesh Reliability:'}</strong>{' '}
                        {isTe
                          ? 'లక్షలాది మంది భక్తుల తాకిడికి మొబైల్ సిగ్నల్స్ నిలిచిపోయినా బ్లూటూత్/వైఫై మెష్ ద్వారా సిస్టమ్ నిరంతరం పనిచేస్తుంది.'
                          : isHi
                          ? 'भीड़ के कारण मोबाइल नेटवर्क ठप होने पर भी ब्लूटूथ/वाईफाई मेश से सिस्टम निरंतर काम करता है।'
                          : 'Even if cellular towers crash during peak crowds, our offline edge mesh synchronizes cases seamlessly.'}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-chandan/20 border border-chandan-border">
                      <span className="font-bold text-kesari text-sm font-mono shrink-0">4.</span>
                      <div>
                        <strong className="text-neel">{isTe ? 'తక్షణ పునఃకలయిక:' : isHi ? 'त्वरित पुनर्मिलन:' : 'Rapid Safe Reunion:'}</strong>{' '}
                        {isTe
                          ? 'QR కోడ్ స్కాన్ చేయగానే సంరక్షకునికి తక్షణ SMS అలర్ట్ వెళ్లి సహాయ కేంద్రం వద్ద కుటుంబాలు కలుస్తాయి.'
                          : isHi
                          ? 'QR कोड स्कैन होते ही अभिभावक को SMS अलर्ट जाता है और परिवार सुरक्षित मिल जाता है।'
                          : 'Scanning the QR code triggers an instant SMS notification with exact booth location to reunite loved ones.'}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* MODAL 7: VOLUNTEER ETHICS */}
              {activeModal === 'volunteer_ethics' && (
                <>
                  <div className="p-3 bg-chandan/40 rounded-xl border border-chandan-border">
                    <p className="font-semibold text-neel">
                      {isTe
                        ? 'గోదావరి మిలన్ స్వచ్ఛంద సేవకుల నైతిక నియమావళి మరియు పిల్లల భద్రతా ప్రమాణాలు.'
                        : isHi
                        ? 'गोदावरी मिलन स्वयंसेवक आचार संहिता एवं बाल सुरक्षा मानक।'
                        : 'Official Volunteer Code of Conduct: ethics, dignity, child safety, and professional assistance protocols.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <ul className="list-disc pl-5 space-y-1.5 text-ink-muted">
                      <li>
                        <strong className="text-neel">{isTe ? 'అత్యవసర ప్రాధాన్యత:' : isHi ? 'सर्वोच्च प्राथमिकता:' : 'Priority Care for Vulnerable Pilgrims:'}</strong>{' '}
                        {isTe
                          ? 'ఒంటరిగా ఉన్న పిల్లలు మరియు దివ్యాంగులకు మొదటి ప్రాధాన్యతనిచ్చి సురక్షిత ఆశ్రయం కల్పించాలి.'
                          : isHi
                          ? 'अकेले पाए गए बच्चों और दिव्यांगों को तत्काल सुरक्षित आश्रय प्रदान करें।'
                          : 'Unaccompanied children, seniors, and distressed pilgrims must be escorted to nearest verified Milan Booth.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'వ్యక్తిగత ఫోటోలు నిషేధం:' : isHi ? 'निजी फ़ोटो निषेध:' : 'Zero Personal Media Sharing:'}</strong>{' '}
                        {isTe
                          ? 'తప్పిపోయిన భక్తుల ఫోటోలను వ్యక్తిగత సోషల్ మీడియాలో పోస్ట్ చేయడం ఖచ్చితంగా నిషిద్ధం.'
                          : isHi
                          ? 'लापता श्रद्धालुओं की तस्वीरें व्यक्तिगत सोशल मीडिया पर पोस्ट करना पूर्णतः प्रतिबंधित है।'
                          : 'Volunteers are strictly prohibited from taking personal selfies or sharing pilgrim photos on private social channels.'}
                      </li>
                      <li>
                        <strong className="text-neel">{isTe ? 'పోలీస్ సమన్వయం:' : isHi ? 'पुलिस समन्वय:' : 'Law Enforcement Coordination:'}</strong>{' '}
                        {isTe
                          ? 'ఏదైనా అనుమానాస్పద స్థితి కనిపిస్తే వెంటనే ఆంధ్రప్రదేశ్ పోలీస్ మరియు 112 కంట్రోల్ రూమ్‌కు సమాచారమివ్వాలి.'
                          : isHi
                          ? 'किसी भी संदिग्ध स्थिति में तत्काल पुलिस एवं 112 कंट्रोल रूम को सूचित करें।'
                          : 'Escalate any child endangerment or suspicious behavior immediately to AP Police and 112 Control Room.'}
                      </li>
                    </ul>
                  </div>
                </>
              )}

            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-chandan-border gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-chandan hover:bg-chandan-border text-xs font-bold text-neel transition-colors"
              >
                <ArrowLeft size={14} />
                <span>{t('common.close')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm transition-colors"
              >
                ✓ {isTe ? 'అర్థమైంది' : isHi ? 'समझ गया' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
