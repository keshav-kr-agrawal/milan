import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type VolunteerBooth } from '../../data/db';
import {
  DiyaIcon,
  RiverWaves,
  TempleToranam,
  KolamDivider,
  RakshaSutraThread,
} from '../motifs/CulturalMotifs';
import {
  MapPin,
  PhoneCall,
  ShieldCheck,
  Users,
  Navigation,
  CheckCircle,
  Clock,
  Compass,
  AlertCircle,
  Filter,
  Search,
  Printer,
  HeartHandshake,
  Baby,
  Activity,
  Accessibility,
  Radio,
  LifeBuoy,
  Flame,
  Phone,
  Sparkles,
  Shield,
  Droplet,
  ExternalLink,
} from 'lucide-react';

export const GhatsMapView: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedGhat, setSelectedGhat] = useState<string>('all');
  const [userLocationGhat, setUserLocationGhat] = useState<string>('pushkar');
  const [activeBoothId, setActiveBoothId] = useState<string>('BOOTH-01');

  const isTe = i18n.language === 'te';
  const isHi = i18n.language === 'hi';

  const booths = useLiveQuery(() => db.volunteer_booths.toArray(), [], []);

  // Walking distance estimate matrix from selected ghat
  const getDistanceToGhat = (boothGhat: string, currentGhat: string) => {
    if (boothGhat === currentGhat) {
      return isTe
        ? '50 మీటర్లు (ఈ ఘాట్ వద్దనే అందుబాటులో ఉంది)'
        : isHi
        ? '50 मीटर (इसी घाट पर तत्काल उपलब्ध)'
        : '50m (Immediate - On this Ghat)';
    }
    const distances: Record<string, Record<string, string>> = {
      pushkar: {
        kotilingala: isTe ? '400 మీ (నది ఒడ్డున 5 నిమిషాల నడక)' : isHi ? '400 मीटर (5 मिनट पैदल)' : '400m (5 min walk north)',
        gowthami: isTe ? '650 మీ (8 నిమిషాల నడక)' : isHi ? '650 मीटर (8 मिनट पैदल)' : '650m (8 min walk south-east)',
        saraswati: isTe ? '900 మీ (12 నిమిషాల నడక)' : isHi ? '900 मीटर (12 मिनट पैदल)' : '900m (12 min walk north-west)',
        markandeya: isTe ? '1.2 కి.మీ (15 నిమిషాల నడక)' : isHi ? '1.2 किमी (15 मिनट)' : '1.2 km (15 min walk south)',
        station: isTe ? '1.8 కి.మీ (ఉచిత షటిల్ 6 నిమిషాలు)' : isHi ? '1.8 किमी (शटल 6 मिनट)' : '1.8 km (Auto / Free Shuttle 6 mins)',
        bus_stand: isTe ? '2.4 కి.మీ (ఉచిత పుష్కర బస్సు 8 నిమిషాలు)' : isHi ? '2.4 किमी (बस 8 मिनट)' : '2.4 km (Free Pilgrim Shuttle 8 mins)',
      },
      kotilingala: {
        pushkar: isTe ? '400 మీ (5 నిమిషాల నడక దక్షిణం)' : isHi ? '400 मीटर (5 मिनट दक्षिण)' : '400m (5 min walk south)',
        gowthami: isTe ? '1.0 కి.మీ (12 నిమిషాల నడక)' : isHi ? '1.0 किमी (12 मिनट)' : '1.0 km (12 min walk)',
        saraswati: isTe ? '550 మీ (7 నిమిషాల నడక)' : isHi ? '550 मीटर (7 मिनट)' : '550m (7 min walk)',
        markandeya: isTe ? '1.6 కి.మీ (20 నిమిషాల నడక)' : isHi ? '1.6 किमी (20 मिनट)' : '1.6 km (20 min walk)',
        station: isTe ? '2.1 కి.మీ (ఉచిత షటిల్ 7 నిమిషాలు)' : isHi ? '2.1 किमी (शटल 7 मिनट)' : '2.1 km (Shuttle 7 mins)',
        bus_stand: isTe ? '2.7 కి.మీ (ఉచిత బస్సు 10 నిమిషాలు)' : isHi ? '2.7 किमी (बस 10 मिनट)' : '2.7 km (Shuttle 10 mins)',
      },
    };

    if (distances[currentGhat] && distances[currentGhat][boothGhat]) {
      return distances[currentGhat][boothGhat];
    }
    return isTe
      ? '800 మీ - 1.5 కి.మీ (ప్రత్యేక యాత్రికుల నడక మార్గం)'
      : isHi
      ? '800 मीटर - 1.5 किमी (तीर्थयात्री मार्ग)'
      : '800m - 1.5 km (Designated Pilgrim Walkway)';
  };

  const filteredBooths = booths.filter((booth) => {
    if (selectedGhat !== 'all' && booth.ghat !== selectedGhat) return false;
    if (selectedService !== 'all') {
      const match = booth.services.some((s) =>
        s.toLowerCase().includes(selectedService.toLowerCase())
      );
      if (!match) return false;
    }
    return true;
  });

  const getBoothName = (b: VolunteerBooth) => {
    if (isTe && b.name_tel) return b.name_tel;
    if (isHi && b.name_hi) return b.name_hi;
    return b.name;
  };

  const getBoothLocation = (b: VolunteerBooth) => {
    if (isTe && b.location_detail_tel) return b.location_detail_tel;
    if (isHi && b.location_detail_hi) return b.location_detail_hi;
    return b.location_detail;
  };

  const activeBooth = booths.find((b) => b.id === activeBoothId) || booths[0];

  const ghatList = [
    { id: 'all', name: isTe ? 'అన్ని ఘాట్లు' : isHi ? 'सभी घाट' : 'All Ghats', count: booths.length },
    { id: 'pushkar', name: isTe ? 'పుష్కర ఘాట్' : isHi ? 'पुष्कर घाट' : 'Pushkar Ghat', crowd: 'peak', crowdLabel: 'Peak' },
    { id: 'kotilingala', name: isTe ? 'కోటిలింగాల ఘాట్' : isHi ? 'कोटिलिंगाला घाट' : 'Kotilingala Ghat', crowd: 'moderate', crowdLabel: 'Moderate' },
    { id: 'gowthami', name: isTe ? 'గౌతమి ఘాట్' : isHi ? 'गौतमी घाट' : 'Gowthami Ghat', crowd: 'low', crowdLabel: 'Calm' },
    { id: 'saraswati', name: isTe ? 'సరస్వతి ఘాట్' : isHi ? 'सरस्वती घाट' : 'Saraswati Ghat', crowd: 'low', crowdLabel: 'Calm' },
    { id: 'markandeya', name: isTe ? 'మార్కండేయ ఘాట్' : isHi ? 'मार्कंडेय घाट' : 'Markandeya Ghat', crowd: 'moderate', crowdLabel: 'Moderate' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12 w-full max-w-7xl mx-auto overflow-hidden">
      
      {/* ========================================================================= */}
      {/* HERO SECTION: PHOTO SHOWCASE & LIVE GHAT CONTROL NETWORK */}
      {/* ========================================================================= */}
      <section className="relative rounded-3xl overflow-hidden border-2 border-haldi/60 shadow-2xl bg-gradient-to-b from-neel via-neel-deep to-[#0C0F24] text-white">
        <TempleToranam className="w-full h-4 opacity-90 relative z-10" />

        <div className="relative z-10 p-5 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Titles & Live Grid Stats */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 dark:bg-[#0A1224]/85 text-amber-950 dark:text-amber-300 border border-amber-400/80 dark:border-haldi/60 text-xs sm:text-sm font-black shadow-sm">
                <MapPin size={16} className="text-kesari dark:text-amber-400" />
                <span>
                  {isTe
                    ? 'రాజమహేంద్రవరం మహా ఘాట్లు • 2027 రక్షా నెట్‌వర్క్'
                    : isHi
                    ? 'राजमहेंद्रवरम महा घाट • 2027 सुरक्षा तंत्र'
                    : 'Rajamahendravaram Ghats • 2027 Safety Grid'}
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">
                  {t('booths.title')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-100 font-medium mt-2 max-w-xl leading-relaxed">
                  {t('booths.desc')}
                </p>
              </div>

              {/* Live Operational Capability Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-neel-surface/90 border border-haldi/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>7 {isTe ? 'కేంద్రాలు' : isHi ? 'केंद्र' : 'Booths'}</span>
                  </div>
                  <div className="text-[10px] text-slate-200 font-medium">
                    {isTe ? 'ప్రత్యక్ష సహాయం' : isHi ? 'लाइव सहायता' : 'Active Assistance'}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-neel-surface/90 border border-haldi/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <LifeBuoy size={14} className="text-kesari" />
                    <span>SDRF Patrol</span>
                  </div>
                  <div className="text-[10px] text-slate-200 font-medium">
                    {isTe ? 'నదీ రక్షణ పడవలు' : isHi ? 'नदी बचाव नौकाएं' : 'River Rescue Boats'}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-neel-surface/90 border border-haldi/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-pink-300 font-bold">
                    <Baby size={14} className="text-pink-400" />
                    <span>Pink Booths</span>
                  </div>
                  <div className="text-[10px] text-slate-200 font-medium">
                    {isTe ? 'మహిళలు & శిశువులు' : isHi ? 'महिला व शिशु' : 'Women & Children'}
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-neel-surface/90 border border-haldi/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Droplet size={14} className="text-cyan-400" />
                    <span>Free Water</span>
                  </div>
                  <div className="text-[10px] text-slate-200 font-medium">
                    {isTe ? 'త్రాగునీరు & పాలు' : isHi ? 'जल एवं दूध' : 'RO Water & Milk'}
                  </div>
                </div>
              </div>

              {/* Current Ghat Distance Reference Selector */}
              <div className="p-3.5 rounded-2xl bg-neel-deep/95 border border-haldi/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2 text-xs">
                  <Compass size={17} className="text-amber-300 shrink-0" />
                  <span className="font-bold text-white">{t('booths.select_your_ghat')}</span>
                </div>
                <select
                  value={userLocationGhat}
                  onChange={(e) => setUserLocationGhat(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-[#0c1628] border border-amber-400/60 text-amber-300 text-xs font-bold focus:ring-2 focus:ring-kesari cursor-pointer"
                >
                  <option value="pushkar">{t('common.ghats.pushkar')}</option>
                  <option value="kotilingala">{t('common.ghats.kotilingala')}</option>
                  <option value="gowthami">{t('common.ghats.gowthami')}</option>
                  <option value="saraswati">{t('common.ghats.saraswati')}</option>
                  <option value="markandeya">{t('common.ghats.markandeya')}</option>
                </select>
              </div>
            </div>

            {/* Right Column: Hero Photograph of Rajamahendravaram Ghats & Booths */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-3xl overflow-hidden border-2 border-haldi/70 shadow-2xl bg-neel-surface/60">
                <div className="relative h-64 sm:h-80 md:h-96 w-full">
                  <img
                    src="/images/ghats_booths_hero.jpg"
                    alt="Godavari Milan Pilgrim Assistance Booth along Ghat Promenade"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070c14] via-transparent to-black/30" />

                  {/* Live Official Booth Badge */}
                  <div className="absolute top-3 left-3 bg-[#0a1224]/95 text-amber-300 text-[11px] font-black px-3 py-1.5 rounded-full border border-haldi/60 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-kesari animate-pulse" />
                    <span>
                      {isTe ? 'ప్రత్యక్ష సేవా కేంద్రం • కోటిలింగాల ఘాట్' : isHi ? 'सेवा केंद्र • कोटिलिंगाला घाट' : 'Live Assistance • Kotilingala Ghat'}
                    </span>
                  </div>

                  {/* Caption Card */}
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-[#081022]/95 border border-haldi/50 backdrop-blur-md text-white text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-black text-xs sm:text-sm text-amber-300">
                        {isTe
                          ? 'యాత్రికుల రక్షా కేంద్రాలు & రెస్క్యూ నెట్‌వర్క్'
                          : isHi
                          ? 'तीर्थयात्री सुरक्षा केंद्र व बचाव तंत्र'
                          : 'Official Milan Helpdesks & River Patrol'}
                      </span>
                      <span className="text-[10px] font-bold text-tulsi-light bg-tulsi/30 px-2 py-0.5 rounded-full border border-tulsi/40">
                        24/7 OPEN
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-100 font-medium line-clamp-2">
                      {isTe
                        ? 'స్వచ్ఛంద సేవకులు వాటర్‌ప్రూఫ్ రిస్ట్‌బ్యాండ్లు అందిస్తూ, SDRF బృందాలతో కలిసి నిరంతరం భద్రత కల్పిస్తున్నారు.'
                        : isHi
                        ? 'समर्पित स्वयंसेवक वाटरप्रूफ बैंड वितरण और SDRF टीम के साथ 24 घंटे सुरक्षा निगरानी में तत्पर हैं।'
                        : 'Dedicated volunteers issuing thermal wristbands, supported by SDRF river rescue patrol boats.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <RiverWaves className="w-full h-8 text-godavari opacity-85" />
      </section>

      {/* ========================================================================= */}
      {/* GHAT STREAMLINE & SERVICE FILTERS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Ghat Selector Bar with Live Crowd Density Pills */}
        <div className="bg-white rounded-2xl p-4 border-2 border-chandan-border shadow-sutra space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-neel">
            <span className="flex items-center gap-1.5">
              <Compass size={16} className="text-godavari" />
              <span>{isTe ? 'ఘాట్ వారీగా సహాయ కేంద్రాలను ఎంచుకోండి:' : isHi ? 'घाट अनुसार सहायता केंद्र चुनें:' : 'Filter Assistance by Ghat:'}</span>
            </span>
            <span className="text-ink-muted text-[11px]">
              {filteredBooths.length} {isTe ? 'కేంద్రాలు అందుబాటులో ఉన్నాయి' : isHi ? 'केंद्र उपलब्ध' : 'Booths Available'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ghatList.map((g) => {
              const isSelected = selectedGhat === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGhat(g.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-neel text-white shadow-md ring-2 ring-kesari'
                      : 'bg-chandan/40 hover:bg-chandan text-neel border border-chandan-border'
                  }`}
                >
                  <span>{g.name}</span>
                  {g.crowd && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        g.crowd === 'peak'
                          ? 'bg-kumkum animate-ping'
                          : g.crowd === 'moderate'
                          ? 'bg-haldi'
                          : 'bg-tulsi'
                      }`}
                      title={`Crowd: ${g.crowdLabel}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-neel flex items-center gap-1.5 mr-1">
            <Filter size={15} className="text-kesari" />
            <span>{t('booths.services_offered')}:</span>
          </span>

          {[
            { id: 'all', icon: '✦', label: t('booths.filter_all') },
            { id: 'wristband', icon: '🎫', label: t('booths.filter_wristband') },
            { id: 'reunification', icon: '🚨', label: t('booths.filter_reunion') },
            { id: 'first aid', icon: '🩺', label: t('booths.filter_medical') },
            { id: 'milk', icon: '🍼', label: t('booths.filter_milk') },
            { id: 'pink', icon: '🌸', label: isTe ? 'పింక్ బూత్ (మహిళలు & పిల్లలు)' : isHi ? 'पिंक बूथ (महिला व शिशु)' : 'Pink Booth' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedService(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedService === btn.id
                  ? 'bg-kesari text-white shadow-md scale-102 ring-1 ring-haldi'
                  : 'bg-white hover:bg-chandan border border-chandan-border text-ink'
              }`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE BOOTH HIGHLIGHT SPOTLIGHT CARD */}
      {/* ========================================================================= */}
      {activeBooth && (
        <div className="bg-gradient-to-r from-neel via-[#101b2d] to-neel rounded-3xl p-5 sm:p-7 text-white border-2 border-haldi/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-kesari/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold bg-kesari px-3 py-1 rounded-full text-white shadow-sm">
                  {activeBooth.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-tulsi/30 text-emerald-300 border border-emerald-400/40">
                  {isTe ? 'అత్యవసర కేంద్రం' : isHi ? 'प्राथमिक केंद्र' : 'Selected Focus Station'}
                </span>
              </div>

              <h2 className="font-serif font-black text-xl sm:text-2xl text-white leading-tight">
                {getBoothName(activeBooth)}
              </h2>

              <div className="text-xs text-slate-100 font-medium flex flex-wrap items-center gap-4 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={15} className="text-amber-400" />
                  <span>{getBoothLocation(activeBooth)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={15} className="text-amber-400" />
                  <span>{t('booths.in_charge')}: <strong className="text-white font-bold">{activeBooth.officer_in_charge}</strong></span>
                </span>
              </div>

              <div className="text-xs text-amber-200 font-bold bg-[#0c1628]/90 px-3.5 py-1.5 rounded-xl border border-amber-400/40 inline-block">
                🚶 {getDistanceToGhat(activeBooth.ghat, userLocationGhat)}
              </div>
            </div>

            {/* Direct Action Dialers */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href={`tel:${activeBooth.phone}`}
                className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-tulsi hover:bg-green-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-103"
              >
                <PhoneCall size={16} />
                <span>{t('booths.call_booth')}: {activeBooth.phone}</span>
              </a>

              <a
                href="tel:112"
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-kumkum hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-urgent transition-all hover:scale-103"
              >
                <span>🚨 112 SOS</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GRID OF VOLUNTEER BOOTH DIRECTORY CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooths.map((booth) => {
          const isSelected = booth.id === activeBoothId;
          const isPeak = booth.crowd_level === 'peak';

          return (
            <div
              key={booth.id}
              onClick={() => setActiveBoothId(booth.id)}
              className={`bg-white rounded-3xl p-5 border-2 shadow-sutra transition-all flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'border-kesari ring-2 ring-kesari/30 shadow-sutra-lg scale-101'
                  : 'border-chandan-border hover:border-haldi hover:shadow-md'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header: ID + Crowd Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-chandan-border">
                  <span className="font-mono text-xs font-bold text-neel bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                    {booth.id}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                      isPeak
                        ? 'bg-kumkum-light text-kumkum'
                        : booth.crowd_level === 'moderate'
                        ? 'bg-amber-100 text-[#78350f]'
                        : 'bg-emerald-50 text-emerald-900'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPeak ? 'bg-kumkum animate-ping' : booth.crowd_level === 'moderate' ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                    />
                    <span>
                      {isPeak
                        ? t('booths.crowd_peak')
                        : booth.crowd_level === 'moderate'
                        ? t('booths.crowd_moderate')
                        : t('booths.crowd_low')}
                    </span>
                  </span>
                </div>

                {/* Booth Title & Ghat */}
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#0c1328] group-hover:text-kesari transition-colors leading-snug">
                    {getBoothName(booth)}
                  </h3>
                  <div className="text-xs text-[#1e293b] font-medium mt-1 flex items-start gap-1.5">
                    <MapPin size={15} className="text-kesari shrink-0 mt-0.5" />
                    <span>{getBoothLocation(booth)}</span>
                  </div>
                </div>

                {/* In-Charge Officer & Direct Contacts */}
                <div className="bg-[#fcf9f2] dark:bg-[#16223B] p-3.5 rounded-2xl border border-chandan-border/60 dark:border-amber-500/30 text-xs space-y-1.5">
                  <div className="text-[#334155] dark:text-slate-300 font-semibold flex items-center justify-between">
                    <span>{t('booths.in_charge')}:</span>
                    <strong className="text-[#0c1328] dark:text-white font-bold">{booth.officer_in_charge}</strong>
                  </div>
                  <div className="text-[#334155] dark:text-slate-300 font-semibold flex items-center justify-between">
                    <span>{t('booths.hotline')}:</span>
                    <strong className="font-mono text-kesari font-bold">{booth.hotline}</strong>
                  </div>
                  <div className="text-[#334155] dark:text-slate-300 font-semibold flex items-center justify-between pt-1 border-t border-chandan-border/50 dark:border-slate-700">
                    <span>{isTe ? 'నడక దూరం:' : isHi ? 'दूरी:' : 'Distance:'}</span>
                    <strong className="text-[#065f46] dark:text-emerald-400 font-bold text-right max-w-[180px] truncate">
                      {getDistanceToGhat(booth.ghat, userLocationGhat)}
                    </strong>
                  </div>
                </div>

                {/* Service Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {booth.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-chandan dark:bg-[#1E2D4A] text-[11px] font-semibold text-neel dark:text-slate-200 border border-chandan-border dark:border-slate-700"
                    >
                      ✓ {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Call Booth Button */}
              <div className="pt-4 mt-4 border-t border-chandan-border flex items-center gap-2">
                <a
                  href={`tel:${booth.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neel hover:bg-neel-deep text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <PhoneCall size={14} />
                  <span>{t('booths.call_booth')}</span>
                </a>
                <a
                  href={`tel:${booth.hotline.replace(/[^0-9]/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3.5 py-2.5 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm transition-colors font-mono"
                  title="Police / Emergency Extension"
                >
                  112
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* GHAT SAFETY & RIVER PROTOCOL CARD */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-[#FFFDF8] dark:bg-[#111A2E] border-2 border-amber-300 dark:border-amber-500/40 shadow-sutra text-xs text-[#0c1328] space-y-3">
        <div className="flex items-center gap-2 font-serif font-bold text-base text-[#0c1328]">
          <ShieldCheck size={20} className="text-kesari" />
          <span>{isTe ? 'గోదావరి ఘాట్ వద్ద భద్రతా నియమాలు' : isHi ? 'गोदावरी घाट सुरक्षा दिशानिर्देश' : 'Godavari Ghat River Safety Guidelines'}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[#1e293b] font-medium">
          <div className="p-3 bg-white dark:bg-[#16223B] rounded-xl border border-amber-300 dark:border-amber-500/30 space-y-1 shadow-xs">
            <strong className="text-[#0c1328] font-bold block">⛓️ {isTe ? 'ఇత్తడి గొలుసులు' : isHi ? 'सुरक्षा जंजीरें' : 'Hold Brass Chains'}</strong>
            <p>{isTe ? 'నది ప్రవాహం బలంగా ఉన్నందున ఇత్తడి రక్షణ గొలుసులను పట్టుకుని మాత్రమే స్నానం ఆచరించండి.' : isHi ? 'तीव्र जल प्रवाह के कारण पीतल सुरक्षा जंजीर पकड़कर ही स्नान करें।' : 'Hold on to brass safety chains firmly. Never venture into deep currents.'}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#16223B] rounded-xl border border-amber-300 dark:border-amber-500/30 space-y-1 shadow-xs">
            <strong className="text-[#0c1328] font-bold block">🏷️ {isTe ? 'రక్షా బ్యాండ్ తప్పనిసరి' : isHi ? 'रक्षा बैंड अनिवार्य' : 'Wear Wristbands 24/7'}</strong>
            <p>{isTe ? 'చిన్నారులు, వృద్ధుల చేతికి రిస్ట్‌బ్యాండ్ ఎల్లప్పుడూ ఉండేలా చూసుకోండి. ఇది వాటర్‌ప్రూఫ్.' : isHi ? 'बच्चों व बुजुर्गों को हर समय वाटरप्रूफ रक्षा सूत्र बैंड पहनाए रखें।' : 'Ensure children and elders wear their waterproof thermal wristband at all times.'}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#16223B] rounded-xl border border-amber-300 dark:border-amber-500/30 space-y-1 shadow-xs">
            <strong className="text-[#0c1328] font-bold block">🚩 {isTe ? 'పునఃకలయిక కేంద్రాలు' : isHi ? 'मिलन केंद्र' : 'Reunion Landmarks'}</strong>
            <p>{isTe ? 'ఒకవేళ తప్పిపోతే వెంటనే సమీప గోదావరి మిలన్ కేంద్రం వద్దకు చేరుకోండి లేదా 112 కు డయల్ చేయండి.' : isHi ? 'लापता होने पर तुरंत निकटतम मिलन बूथ पर जाएं या 112 डायल करें।' : 'If separated, proceed directly to the nearest Milan Booth or dial 112.'}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
