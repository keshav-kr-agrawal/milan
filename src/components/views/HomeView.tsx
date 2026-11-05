import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { templeAudio } from '../../services/sound';
import {
  GopuramSilhouette,
  DiyaIcon,
  LotusIcon,
  KalashIcon,
  DeepaStambham,
  ShankhaIcon,
  RiverWaves,
  KolamDivider,
  KolamCorner,
  RakshaSutraThread,
  ShlokaBanner,
  TempleToranam,
} from '../motifs/CulturalMotifs';
import {
  AlertTriangle,
  UserPlus,
  Search,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  MapPin,
  HeartHandshake,
  Share2,
  PhoneCall,
  Volume2,
  Accessibility,
  Flame,
  SunMedium,
  Bell,
  Sparkles,
  Heart,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenStickyHelp: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenStickyHelp }) => {
  const { t, i18n } = useTranslation();

  // Pushkaralu 2027 Countdown (Festival start: 26 June 2027)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  // Interactive Deepa Samarpanam (దీప సమర్పణ / दीप दान) state
  const [offeredDiyasCount, setOfferedDiyasCount] = useState<number>(() => {
    return Number(localStorage.getItem('milan_offered_diyas') || '14820');
  });
  const [justOfferedDiya, setJustOfferedDiya] = useState<boolean>(false);

  useEffect(() => {
    const festivalDate = new Date('2027-06-26T00:00:00+05:30').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = festivalDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60),
          secs: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const openCases = useLiveQuery(() => db.cases.where('status').equals('open').count(), [], 2);
  const reunitedCount = useLiveQuery(() => db.cases.where('status').equals('reunited').count(), [], 1);

  // Quick WhatsApp Share for Missing Alerts (Gen Z & Pilgrim Community Broadcast)
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚩 *${t('home.hero_title')} - ${t('app.title')}*\n` +
      `${t('app.tagline')}\n` +
      `🔗 https://godavari-milan-2027.gov-prototype.in\n` +
      `📞 Emergency Helpline: 112 / 1098`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Perform virtual Deepa Samarpanam with audio chime
  const handleOfferDiya = () => {
    templeAudio.playAartiChime();
    const newCount = offeredDiyasCount + 1;
    setOfferedDiyasCount(newCount);
    localStorage.setItem('milan_offered_diyas', String(newCount));
    setJustOfferedDiya(true);
    setTimeout(() => {
      setJustOfferedDiya(false);
    }, 4500);
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-fadeIn pb-12 w-full max-w-7xl mx-auto overflow-hidden">
      {/* Sacred Vedic Shloka Bar with Interactive Temple Bell */}
      <div className="relative">
        <ShlokaBanner />
        <button
          onClick={() => templeAudio.ringTempleBell()}
          className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 border border-haldi/60"
          title="ఘంటానాదం / घंटी / Ring Temple Bell"
        >
          <Bell size={14} className="text-haldi animate-bounce" />
          <span>{i18n.language === 'te' ? 'ఘంటానాదం' : i18n.language === 'hi' ? 'घंटी' : 'Temple Bell'}</span>
        </button>
      </div>

      {/* Hero Section: Majestic Temple Dawn on the Sacred Godavari */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neel via-neel-deep to-[#0C0F24] text-white shadow-sutra-lg border-2 border-haldi/60">
        <TempleToranam className="w-full h-3.5 sm:h-5 opacity-90" />

        <div className="absolute inset-x-0 bottom-0 opacity-20 pointer-events-none">
          <GopuramSilhouette className="w-full h-40 sm:h-52 text-chandan" />
        </div>

        <div className="relative z-10 px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 max-w-4xl mx-auto text-center">
          {/* Sacred Astrological Badge in active language */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-haldi/20 text-haldi border border-haldi/50 text-xs sm:text-sm font-bold mb-4 shadow-sm max-w-full truncate">
            <DiyaIcon size={16} />
            <span className="truncate">
              {i18n.language === 'te'
                ? 'సింహరాశి బృహస్పతి ప్రవేశం • గోదావరి మహా పుష్కరాలు'
                : i18n.language === 'hi'
                ? 'सिंह राशि में गुरु प्रवेश • गोदावरी महा पुष्करालु'
                : 'Jupiter in Leo Transit • Godavari Maha Pushkaralu'}
            </span>
          </div>

          {/* Clean Single Language Grand Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-chandan leading-tight mb-2 drop-shadow-md">
            {t('app.title')}
          </h1>

          <div className="text-lg sm:text-2xl font-serif text-haldi font-bold mb-3 tracking-wide">
            {t('app.tagline')}
          </div>

          {/* Single Language Subtitle */}
          <div className="text-xs sm:text-sm font-sans text-chandan-border/90 max-w-xl mx-auto mb-6 leading-relaxed">
            {t('home.hero_dates')}
          </div>

          <p className="text-xs sm:text-sm md:text-base text-chandan/90 max-w-2xl mx-auto leading-relaxed mb-8">
            {t('home.hero_description')}
          </p>

          {/* Large Primary Action Buttons: Responsive Stack on Mobile, Flex on Tablet/Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            {/* Primary Emergency Button */}
            <button
              onClick={onOpenStickyHelp}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-kumkum hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-urgent transition-all hover:scale-105 active:scale-95 border border-haldi/60 flex items-center justify-center gap-2"
            >
              <AlertTriangle size={18} className="shrink-0" />
              <span>{t('home.cta_report')}</span>
            </button>

            {/* Primary Registration Button */}
            <button
              onClick={() => onNavigate('family')}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-kesari hover:bg-kesari-hover text-white font-bold text-sm sm:text-base shadow-md transition-all hover:scale-105 active:scale-95 border border-haldi/60 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} className="shrink-0" />
              <span>{t('home.cta_register')}</span>
            </button>
          </div>

          {/* Pushkaralu Countdown (Days, Hours, Mins, Secs) */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-neel-surface/80 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <div className="text-chandan-border font-medium flex items-center gap-1.5">
              <Clock size={16} className="text-haldi shrink-0" />
              <span>{t('home.countdown_days')}:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center font-mono w-full sm:w-auto">
              <div className="bg-neel-surface/90 px-2.5 sm:px-3 py-1.5 rounded-xl border border-haldi/40">
                <span className="text-base sm:text-lg font-bold text-haldi">{timeLeft.days}</span>
                <span className="block text-[10px] text-chandan-border uppercase">{t('home.countdown_days').split(' ')[0] || 'Days'}</span>
              </div>
              <div className="bg-neel-surface/90 px-2.5 sm:px-3 py-1.5 rounded-xl border border-haldi/40">
                <span className="text-base sm:text-lg font-bold text-haldi">{timeLeft.hours}</span>
                <span className="block text-[10px] text-chandan-border uppercase">{t('home.countdown_hours')}</span>
              </div>
              <div className="bg-neel-surface/90 px-2.5 sm:px-3 py-1.5 rounded-xl border border-haldi/40">
                <span className="text-base sm:text-lg font-bold text-haldi">{timeLeft.mins}</span>
                <span className="block text-[10px] text-chandan-border uppercase">{t('home.countdown_mins')}</span>
              </div>
              <div className="bg-neel-surface/90 px-2.5 sm:px-3 py-1.5 rounded-xl border border-haldi/40">
                <span className="text-base sm:text-lg font-bold text-haldi">{timeLeft.secs}</span>
                <span className="block text-[10px] text-chandan-border uppercase">{t('home.countdown_secs')}</span>
              </div>
            </div>
          </div>
        </div>

        <RiverWaves className="w-full h-8 text-godavari opacity-85" />
      </section>

      {/* Interactive Sacred Deepa Samarpanam (దీప సమర్పణ / दीप दान) Widget */}
      <section className="bg-gradient-to-r from-chandan via-[#FFFDF8] to-chandan rounded-3xl p-5 sm:p-8 border-2 border-haldi shadow-sutra relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 relative z-10 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kesari-light text-kesari font-bold text-xs border border-kesari/30">
              <Flame size={14} className="text-kumkum animate-bounce" />
              <span>
                {i18n.language === 'te'
                  ? 'పవిత్ర దీప సమర్పణ'
                  : i18n.language === 'hi'
                  ? 'पावन दीप दान'
                  : 'Sacred River Diya Offering'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-neel">
              {i18n.language === 'te'
                ? 'గోదావరి నదికి దీప సమర్పణ చేయండి'
                : i18n.language === 'hi'
                ? 'गोदावरी मैया को दीप अर्पित करें'
                : 'Offer a Sacred Diya to River Godavari'}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              {i18n.language === 'te'
                ? 'మీ కుటుంబ క్షేమం మరియు తప్పిపోయిన వారు త్వరగా చేరాలని పవిత్ర గోదావరి నదికి డిజిటల్ దీపాన్ని సమర్పించండి.'
                : i18n.language === 'hi'
                ? 'अपने परिवार की सुरक्षा और बिछड़े परिजनों के सकुशल पुनर्मिलन हेतु गोदावरी नदी में दीप प्रवाहित करें।'
                : 'Light a virtual sacred diya on the holy Godavari for your family safety and peaceful reunion.'}
            </p>
            <div className="text-xs text-kesari font-semibold flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles size={14} />
              <span>
                {i18n.language === 'te'
                  ? `ఇప్పటివరకు ${offeredDiyasCount.toLocaleString()} పవిత్ర దీపాలు సమర్పించబడ్డాయి`
                  : i18n.language === 'hi'
                  ? `अब तक ${offeredDiyasCount.toLocaleString()} दीप अर्पित किए गए`
                  : `${offeredDiyasCount.toLocaleString()} Sacred Diyas Offered Today`}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleOfferDiya}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-kesari to-haldi hover:from-kesari-hover hover:to-gold text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 border-2 border-white/60"
            >
              <DiyaIcon size={22} />
              <span>
                {i18n.language === 'te'
                  ? 'దీప సమర్పణ చేయండి'
                  : i18n.language === 'hi'
                  ? 'दीप दान करें'
                  : 'Offer Sacred Diya'}
              </span>
            </button>

            {justOfferedDiya && (
              <div className="animate-bounce text-xs font-bold text-tulsi bg-tulsi-light px-4 py-1.5 rounded-full border border-tulsi/40 shadow-xs flex items-center gap-1.5">
                <Heart size={14} className="text-kumkum fill-kumkum" />
                <span>
                  {i18n.language === 'te'
                    ? 'మీ దీపం పవిత్ర గోదావరికి సమర్పించబడింది!'
                    : i18n.language === 'hi'
                    ? 'आपका दीप पावन गोदावरी को समर्पित हुआ!'
                    : 'Your Diya was consecrated on River Godavari!'}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 Category User Experience Quick Tiles: Single Language at a Time */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Gen Z & Volunteers */}
        <div className="bg-white rounded-2xl p-5 border-2 border-chandan-border shadow-sutra flex flex-col justify-between hover:border-kesari transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-tulsi-light text-tulsi border border-tulsi/30">
                {i18n.language === 'te' ? 'సేవకులు & యువత' : i18n.language === 'hi' ? 'स्वयंसेवक व युवा' : 'Volunteers & Youth'}
              </span>
              <Share2 size={16} className="text-kesari group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-base text-neel mb-1">
              {i18n.language === 'te' ? 'వాట్సాప్ అలర్ట్ షేర్' : i18n.language === 'hi' ? 'व्हाट्सएप ब्रॉडकास्ट' : 'WhatsApp Alert Share'}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {i18n.language === 'te'
                ? 'ఒక్క ట్యాప్‌తో స్థానిక యాత్రికుల గ్రూపులకు తప్పిపోయిన వారి వివరాలను పంపండి.'
                : i18n.language === 'hi'
                ? '1-क्लिक में स्थानीय व्हाट्सएप समूहों में लापता परिजन की सूचना साझा करें।'
                : '1-click WhatsApp broadcast to alert nearby volunteers and pilgrim community groups.'}
            </p>
          </div>
          <button
            onClick={handleShareWhatsApp}
            className="mt-4 w-full py-2.5 px-3 rounded-xl bg-tulsi hover:bg-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Share2 size={14} />
            <span>{i18n.language === 'te' ? 'వాట్సాప్‌లో షేర్ చేయండి' : i18n.language === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</span>
          </button>
        </div>

        {/* Tile 2: Parents */}
        <div className="bg-white rounded-2xl p-5 border-2 border-chandan-border shadow-sutra flex flex-col justify-between hover:border-kumkum transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-kumkum-light text-kumkum border border-kumkum/30">
                {i18n.language === 'te' ? 'తల్లిదండ్రులు' : i18n.language === 'hi' ? 'माता-पिता' : 'Parents & Family'}
              </span>
              <AlertTriangle size={16} className="text-kumkum group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-base text-neel mb-1">
              {i18n.language === 'te' ? '3-ట్యాప్ శీఘ్ర రిపోర్ట్' : i18n.language === 'hi' ? '3-टैप बच्चा सुरक्षा रिपोर्ट' : '3-Tap Missing Alert'}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {i18n.language === 'te'
                ? 'జనసందోహంలో పిల్లలు కనిపించకపోతే దుస్తుల రంగు, ఫోటోతో వెంటనే నివేదించండి.'
                : i18n.language === 'hi'
                ? 'भीड़ में बच्चा बिछड़ने पर कपड़ों के रंग व फोटो के साथ 3 टैप में रिपोर्ट करें।'
                : 'Report a separated child in 3 quick taps with clothing colors and live ghat GPS.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('missing')}
            className="mt-4 w-full py-2.5 px-3 rounded-xl bg-kumkum hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <AlertTriangle size={14} />
            <span>{t('nav.report_missing')}</span>
          </button>
        </div>

        {/* Tile 3: Elders 60+ */}
        <div className="bg-white rounded-2xl p-5 border-2 border-chandan-border shadow-sutra flex flex-col justify-between hover:border-haldi transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-haldi-light text-mitti border border-haldi/40">
                {i18n.language === 'te' ? 'వృద్ధుల సహాయం' : i18n.language === 'hi' ? 'वरिष्ठ नागरिक' : 'Elders 60+ Mode'}
              </span>
              <Accessibility size={16} className="text-kesari group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-base text-neel mb-1">
              {i18n.language === 'te' ? 'పెద్దల సులభ దర్శన మోడ్' : i18n.language === 'hi' ? 'वरिष्ठ नागरिक सरल मोड' : 'Elder Easy Voice Mode'}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {i18n.language === 'te'
                ? 'పెద్ద అక్షరాలు, అధిక కాంట్రాస్ట్ మరియు చదివి వినిపించే వాయిస్ సహాయం.'
                : i18n.language === 'hi'
                ? 'बड़े अक्षर, उच्च कंट्रास्ट और बोलकर पढ़कर सुनाने की सुविधा।'
                : 'Large 22px+ fonts, maximum contrast, and Web Speech read-aloud support.'}
            </p>
          </div>
          <button
            onClick={() => {
              document.body.classList.toggle('simple-mode');
            }}
            className="mt-4 w-full py-2.5 px-3 rounded-xl bg-haldi-light hover:bg-haldi text-mitti font-bold text-xs flex items-center justify-center gap-1.5 border border-haldi/60 shadow-sm transition-colors"
          >
            <Accessibility size={14} />
            <span>{i18n.language === 'te' ? 'పెద్దల మోడ్ మార్చండి' : i18n.language === 'hi' ? 'सरल मोड टॉगल करें' : 'Toggle Simple Mode'}</span>
          </button>
        </div>

        {/* Tile 4: Police & Help Desk */}
        <div className="bg-white rounded-2xl p-5 border-2 border-chandan-border shadow-sutra flex flex-col justify-between hover:border-godavari transition-all group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-godavari-light text-godavari border border-godavari/30">
                {i18n.language === 'te' ? 'పోలీస్ & సిబ్బంది' : i18n.language === 'hi' ? 'पुलिस व हेल्प डेस्क' : 'Help Desk & Police'}
              </span>
              <ShieldCheck size={16} className="text-godavari group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-serif font-bold text-base text-neel mb-1">
              {i18n.language === 'te' ? 'పోలీస్ డెస్క్ పోర్టల్' : i18n.language === 'hi' ? 'अधिकारी पोर्टल' : 'Officer Hub (PIN 2027)'}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {i18n.language === 'te'
                ? 'PIN రక్షిత డ్యాష్‌బోర్డు మరియు 4-అంచెల ధ్రువీకరణ చెక్‌లిస్ట్.'
                : i18n.language === 'hi'
                ? 'पिन-सुरक्षित डैशबोर्ड और 4-चरणीय सत्यापन चेकलिस्ट।'
                : 'PIN 2027 triage dashboard, ghat queue, and 4-step handover verification.'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('helpdesk')}
            className="mt-4 w-full py-2.5 px-3 rounded-xl bg-neel hover:bg-neel-deep text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <ShieldCheck size={14} />
            <span>{t('nav.helpdesk')}</span>
          </button>
        </div>
      </section>

      {/* Auspicious Pushkaralu Sacred Timings & Ritual Schedule Card */}
      <section className="bg-gradient-to-r from-chandan via-chandan-card to-chandan rounded-2xl p-5 sm:p-7 border-2 border-haldi shadow-sutra">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-chandan-border gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-kesari text-white rounded-2xl shadow-sm shrink-0">
              <SunMedium size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-neel">
                {i18n.language === 'te'
                  ? 'పుష్కరాల పుణ్య కాలం & పూజా సమయాలు'
                  : i18n.language === 'hi'
                  ? 'पुष्करालु पावन काल व पूजन समय'
                  : 'Sacred Pushkaralu Timings & Schedule'}
              </h2>
              <div className="text-xs text-mitti font-semibold">
                {i18n.language === 'te'
                  ? 'బ్రాహ్మీ ముహూర్తం, గోదావరి మహా హారతి & పవిత్ర దర్శనం'
                  : i18n.language === 'hi'
                  ? 'ब्राह्मी मुहूर्त, गोदावरी महा आरती और पवित्र दर्शन'
                  : 'Brahma Muhurtham, Godavari Maha Harathi & Sacred Ghat Schedule'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('rituals')}
            className="flex items-center gap-1 text-xs font-bold text-kesari hover:text-kesari-hover"
          >
            <span>{t('nav.rituals')}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-xs">
          <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-kesari-light text-kesari font-bold">01</div>
            <div>
              <div className="font-bold text-sm text-neel">
                {i18n.language === 'te' ? 'బ్రాహ్మీ ముహూర్త స్నానం' : i18n.language === 'hi' ? 'ब्राह्मी मुहूर्त स्नान' : 'Brahma Muhurtham Snanam'}
              </div>
              <div className="text-ink-muted mt-0.5">4:15 AM – 5:45 AM</div>
              <div className="text-[11px] text-tulsi font-semibold mt-1">Most Auspicious Pushkara Snanam</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-haldi-light text-mitti font-bold">02</div>
            <div>
              <div className="font-bold text-sm text-neel">
                {i18n.language === 'te' ? 'పితృ తర్పణం' : i18n.language === 'hi' ? 'पितृ तर्पण' : 'Pitru Tarpanam'}
              </div>
              <div className="text-ink-muted mt-0.5">7:00 AM – 11:30 AM</div>
              <div className="text-[11px] text-mitti font-semibold mt-1">Conducted by authorized Purohits</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm flex items-start gap-3">
            <div className="p-2 rounded-lg bg-godavari-light text-godavari font-bold">03</div>
            <div>
              <div className="font-bold text-sm text-neel">
                {i18n.language === 'te' ? 'గోదావరి మహా హారతి' : i18n.language === 'hi' ? 'गोदावरी महा आरती' : 'Godavari Maha Harathi'}
              </div>
              <div className="text-ink-muted mt-0.5">6:30 PM (Pushkar & Kotilingala Ghats)</div>
              <div className="text-[11px] text-kesari font-semibold mt-1">Evening river Aarti with brass lamps</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step "How Milan Works" with Handcrafted Indian Cultural Motifs */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto px-2">
          <div className="flex justify-center mb-2">
            <LotusIcon size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-neel">
            {t('home.how_it_works_title')}
          </h2>
          <KolamDivider className="my-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Step 1 */}
          <div className="kalamkari-frame rounded-2xl p-5 sm:p-6 shadow-sutra flex flex-col justify-between hover:border-kesari transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-kesari-light text-kesari flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DiyaIcon size={26} />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-neel mb-1">
                {t('home.step1_title')}
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-2">
                {t('home.step1_desc')}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-chandan-border">
              <button
                onClick={() => onNavigate('family')}
                className="text-xs font-bold text-kesari hover:text-kesari-hover flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>{t('nav.register')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="kalamkari-frame rounded-2xl p-5 sm:p-6 shadow-sutra flex flex-col justify-between hover:border-godavari transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-godavari-light text-godavari flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <KalashIcon size={26} />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-neel mb-1">
                {t('home.step2_title')}
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-2">
                {t('home.step2_desc')}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-chandan-border">
              <button
                onClick={() => onNavigate('found')}
                className="text-xs font-bold text-godavari hover:text-teal-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>{t('nav.report_found')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="kalamkari-frame rounded-2xl p-5 sm:p-6 shadow-sutra flex flex-col justify-between hover:border-tulsi transition-all group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-tulsi-light text-tulsi flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LotusIcon size={26} />
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-neel mb-1">
                {t('home.step3_title')}
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-2">
                {t('home.step3_desc')}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-chandan-border">
              <button
                onClick={() => onNavigate('helpdesk')}
                className="text-xs font-bold text-tulsi hover:text-green-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>{t('nav.helpdesk')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Bathing Ghats of Rajamahendravaram Interactive Overview */}
      <section className="bg-white rounded-2xl p-5 sm:p-7 border-2 border-chandan-border shadow-sutra space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-chandan-border gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-neel flex items-center gap-2">
              <MapPin size={20} className="text-kesari shrink-0" />
              <span>
                {i18n.language === 'te'
                  ? 'రాజమహేంద్రవరం పవిత్ర పుష్కర ఘాట్లు'
                  : i18n.language === 'hi'
                  ? 'राजमहेंद्रवरम पावन पुष्करालु घाट'
                  : 'Sacred Bathing Ghats of Rajamahendravaram'}
              </span>
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              24/7 protection desks active across all 7 major river ghats with live volunteer patrols.
            </p>
          </div>
          <button
            onClick={() => onNavigate('rituals')}
            className="text-xs font-bold text-kesari hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{t('nav.rituals')}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 text-center">
          {[
            { key: 'pushkar', tel: 'పుష్కర్ ఘాట్', hi: 'पुष्कर घाट', en: 'Pushkar Ghat' },
            { key: 'kotilingala', tel: 'కోటిలింగాల', hi: 'कोटिकलिंगाल', en: 'Kotilingala Ghat' },
            { key: 'gowthami', tel: 'గౌతమి ఘాట్', hi: 'गौतमी घाट', en: 'Gowthami Ghat' },
            { key: 'saraswati', tel: 'సరస్వతి ఘాట్', hi: 'सरस्वती घाट', en: 'Saraswati Ghat' },
            { key: 'markandeya', tel: 'మార్కండేయ', hi: 'मार्कंडेय घाट', en: 'Markandeya Ghat' },
            { key: 'padmavathi', tel: 'పద్మావతి', hi: 'पद्मावती घाट', en: 'Padmavathi Ghat' },
            { key: 'subramanya', tel: 'సుబ్రహ్మణ్య', hi: 'सुब्रमण्य घाट', en: 'Subramanya Ghat' },
          ].map((ghat) => (
            <div key={ghat.key} className="bg-chandan-card p-3 rounded-xl border border-chandan-border shadow-xs hover:border-kesari transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-tulsi mx-auto mb-1.5 animate-pulse" />
              <div className="text-xs font-bold text-neel truncate">
                {i18n.language === 'te' ? ghat.tel : i18n.language === 'hi' ? ghat.hi : ghat.en}
              </div>
              <div className="text-[9px] text-tulsi font-semibold mt-1">Help Desk Active</div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency 1-Tap SOS Helpline Bar */}
      <section className="bg-gradient-to-r from-kumkum via-red-800 to-kumkum text-white rounded-2xl p-4 sm:p-6 shadow-urgent border-2 border-haldi/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="p-2.5 sm:p-3 bg-white/20 rounded-2xl shrink-0">
              <PhoneCall size={24} className="text-haldi animate-pulse" />
            </div>
            <div>
              <div className="font-serif font-bold text-base sm:text-xl text-chandan">
                {i18n.language === 'te'
                  ? 'అత్యవసర హెల్ప్‌లైన్లు (24/7)'
                  : i18n.language === 'hi'
                  ? 'आपातकालीन हेल्पलाइन (24/7)'
                  : '24/7 Emergency Helplines'}
              </div>
              <div className="text-xs text-haldi-light">
                {i18n.language === 'te'
                  ? 'ఆపదలో ఉంటే వెంటనే 1-ట్యాప్‌తో కాల్ చేయండి'
                  : i18n.language === 'hi'
                  ? 'तत्काल सहायता हेतु 1-टैप में सीधे कॉल करें'
                  : 'One-tap direct dial for assistance across all ghats'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs font-bold w-full md:w-auto">
            <a
              href="tel:112"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white text-kumkum hover:bg-chandan shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={14} />
              <span>112 (Police)</span>
            </a>
            <a
              href="tel:108"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white text-kumkum hover:bg-chandan shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={14} />
              <span>108 (Ambulance)</span>
            </a>
            <a
              href="tel:1098"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white text-kumkum hover:bg-chandan shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={14} />
              <span>1098 (Childline)</span>
            </a>
            <a
              href="tel:08832471000"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-haldi text-neel hover:bg-gold shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PhoneCall size={14} />
              <span>0883-2471000</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
