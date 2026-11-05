import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '../../hooks/useSpeech';
import {
  DiyaIcon,
  LotusIcon,
  KalashIcon,
  GopuramSilhouette,
  RiverWaves,
  KolamDivider,
  RakshaSutraThread,
  TempleToranam,
  ShlokaBanner,
  DeepaStambham,
  ShankhaIcon,
} from '../motifs/CulturalMotifs';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Volume2,
  VolumeX,
  SunMedium,
  Heart,
} from 'lucide-react';

export const RitualsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { speak, stop, isSpeaking } = useSpeech();

  const ritualsList = [
    {
      id: 'snanam',
      num: '01',
      titleTel: 'పుష్కర స్నానం (పుణ్య స్నానం)',
      titleHi: 'पुष्कर स्नान (पवित्र नदी स्नान)',
      titleEn: 'Pushkara Snanam (The Holy River Dip)',
      descTel: 'పవిత్ర గోదావరి నదిలో బ్రాహ్మీ ముహూర్తంలో సంకల్పం చెప్పుకుని మునక వేసి మనస్సు, శరీరాన్ని పవిత్రం చేసుకోవడం. సమస్త నదీ శక్తుల ఆశీస్సులు లభిస్తాయి.',
      descHi: 'पवित्र गोदावरी में श्रद्धापूर्वक प्रार्थना कर डुबकी लगाना, जिससे मन और तन निर्मल होते हैं और समस्त 33 करोड़ देवी-देवताओं का आशीर्वाद मिलता है।',
      descEn: 'Taking a holy dip in the sacred waters with prayer, cleansing mind and spirit while invoking the blessings of ancestors and the sacred confluence.',
      timing: '4:30 AM – 6:00 AM & Sunset',
      icon: <RiverWaves className="w-8 h-8 text-godavari" />,
      tag: 'Sacred River Dip',
    },
    {
      id: 'tarpanam',
      num: '02',
      titleTel: 'పితృ తర్పణం & పిండ ప్రదానం',
      titleHi: 'पितृ तर्पण और पिंड दान',
      titleEn: 'Pitru Tarpanam & Pinda Pradanam',
      descTel: 'నదీ తీరంలో శాస్త్రోక్తంగా అర్హులైన పండితుల సమక్షంలో దివంగతులైన పూర్వీకులకు తర్పణాలు మరియు పిండ ప్రదానం సమర్పించి వారి రుణం తీర్చుకోవడం.',
      descHi: 'शास्त्रोक्त विधि से योग्य पुरोहितों के सानिध्य में दिवंगत पितरों की शांति हेतु घाटों पर तर्पण और पिंडदान का पावन अनुष्ठान।',
      descEn: 'Traditional offerings made to departed ancestors along designated ghat steps under the guidance of verified purohits for generational blessings.',
      timing: '7:00 AM – 11:30 AM',
      icon: <KalashIcon size={30} />,
      tag: 'Ancestral Homage',
    },
    {
      id: 'harathi',
      num: '03',
      titleTel: 'గోదావరి మహా హారతి',
      titleHi: 'गोदावरी महा आरती',
      titleEn: 'Godavari Maha Harathi (Evening Aarti)',
      descTel: 'పుష్కర్ ఘాట్ వద్ద ప్రతిరోజూ సంధ్యా సమయంలో వేద మంత్రోచ్ఛారణల మధ్య బహుళ అంతస్తుల ఇత్తడి దీపాలతో గోదావరి మాతకు సమర్పించే కమనీయ హారతి.',
      descHi: 'पुष्कर घाट पर प्रत्येक संध्या को वैदिक मंत्रोच्चार के साथ विशाल पीतल के दीपों से गोदावरी मैया को अर्पित की जाने वाली भव्य आरती।',
      descEn: 'The majestic evening river aarti at Pushkar Ghat, where multi-tiered brass lamps are offered to Mother Godavari accompanied by sacred Vedic chants.',
      timing: '6:30 PM Sunset Daily',
      icon: <DiyaIcon size={32} />,
      tag: 'Pushkar Aarti',
    },
    {
      id: 'deepam',
      num: '04',
      titleTel: 'దీప దానం (నదిలో దీపాలు వదలడం)',
      titleHi: 'दीप दान (नदी में दीप प्रज्वलन)',
      titleEn: 'Deepa Daanam (Floating Earthen Lamps)',
      descTel: 'సంధ్యా సమయంలో మట్టి ప్రమిదలలో ఆవు నేతితో దీపాలు వెలిగించి, పసుపు-కుంకుమ పువ్వులతో అలంకరించి గోదావరి తరంగాలపై కృతజ్ఞతతో వదలడం.',
      descHi: 'संध्या समय मिट्टी के दीयों में घी व पुष्प सजाकर कृतज्ञता भाव से गोदावरी की पवित्र लहरों पर प्रवाहित करना।',
      descEn: 'Devotees light earthen diyas with natural ghee and flowers, gently releasing them onto the dusk currents as an offering of gratitude and hope.',
      timing: '7:00 PM Dusk',
      icon: <LotusIcon size={28} />,
      tag: 'Floating Diyas',
    },
    {
      id: 'annadanam',
      num: '05',
      titleTel: 'దానం & అన్నదానం',
      titleHi: 'दान और अन्नदान',
      titleEn: 'Daanam & Annadanam (Sacred Feeding)',
      descTel: 'పుష్కరాలకు విచ్చేసిన భక్తులకు, సాధువులకు, వృద్ధులకు స్వచ్ఛందంగా అన్నదానం, వస్త్రదానం మరియు జలదానం చేయడం విశేష పుణ్యఫలాన్నిస్తుంది.',
      descHi: 'तीर्थयात्रियों, साधु-संतों और श्रद्धालुओं को भोजन, वस्त्र और जल वितरित करना इस महापर्व में असीम पुण्यकारी माना जाता है।',
      descEn: 'The noble tradition of distributing meals, water, and clothing to visiting pilgrims, sadhus, and devotees across all ghat pilgrim sheds.',
      timing: 'All Day (11:00 AM – 4:00 PM & Night)',
      icon: <Sparkles size={28} className="text-haldi" />,
      tag: 'Sacred Charity',
    },
    {
      id: 'temple',
      num: '06',
      titleTel: 'ప్రాచీన ఆలయ దర్శనాలు',
      titleHi: 'ऐतिहासिक देवालय दर्शन',
      titleEn: 'Ancient Riverbank Temple Darshans',
      descTel: 'తీరంలో వెలసిన ప్రాచీన కోటిలింగేశ్వర స్వామి, మార్కండేయ స్వామి, ఉమా రామలింగేశ్వర స్వామి ఆలయాలను దర్శించుకుని ఈశ్వరానుగ్రహం పొందడం.',
      descHi: 'तट पर स्थित प्राचीन कोटिलिंगेश्वर, मार्कंडेय और श्री उमा रामलिंगेश्वर स्वामी मंदिरों का दर्शन कर भगवान शिव का आशीर्वाद प्राप्त करना।',
      descEn: 'Pilgrims visit the historic Kotilingeshwara, Markandeya, and Sri Uma Ramalingeswara Swamy temples gracing the sacred riverbank.',
      timing: '6:00 AM – 12:30 PM & 4:30 PM – 9:00 PM',
      icon: <GopuramSilhouette className="w-12 h-10 text-kesari" />,
      tag: 'Ancient Shrines',
    },
  ];

  const getRitualTitle = (r: typeof ritualsList[0]) => {
    if (i18n.language === 'te') return r.titleTel;
    if (i18n.language === 'hi') return r.titleHi;
    return r.titleEn;
  };

  const getRitualDesc = (r: typeof ritualsList[0]) => {
    if (i18n.language === 'te') return r.descTel;
    if (i18n.language === 'hi') return r.descHi;
    return r.descEn;
  };

  const handleReadAloudRitual = (text: string) => {
    speak(text);
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Top Sacred Shloka Bar */}
      <ShlokaBanner />

      {/* Hero Header with Divine Toranam */}
      <div className="bg-gradient-to-b from-chandan via-chandan-card to-chandan rounded-3xl p-6 sm:p-10 border-2 border-haldi shadow-sutra text-center space-y-4 relative overflow-hidden">
        <TempleToranam className="w-full h-4 sm:h-5 opacity-90 mb-2" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-haldi-light text-mitti border border-haldi/50 text-xs sm:text-sm font-bold shadow-xs">
          <DiyaIcon size={18} />
          <span>{t('rituals.badge')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-neel">
          {t('rituals.title')}
        </h1>

        <div className="text-base sm:text-lg font-serif text-kesari font-bold">
          {t('rituals.subtitle')}
        </div>

        <p className="text-xs sm:text-sm text-ink-muted max-w-2xl mx-auto leading-relaxed">
          {t('rituals.dates_caption')}
        </p>

        {/* Sacred Godavari Ashtakam Stotram Verse Card */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-haldi/60 text-xs sm:text-sm font-serif text-neel shadow-xs space-y-1.5">
          <div className="font-bold text-kumkum text-sm sm:text-base">
            "{t('rituals.stotram_verse')}"
          </div>
          <div className="text-xs text-mitti font-sans font-medium">
            "{t('rituals.stotram_meaning')}"
          </div>
        </div>
      </div>

      {/* What is Pushkaralu & The Sanctity of Dakshina Ganga (Dual Cards in Active Language) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="kalamkari-frame rounded-2xl p-6 sm:p-7 shadow-sutra space-y-3">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-neel pb-2 border-b border-chandan-border">
            <Sparkles size={22} className="text-kesari" />
            <h2>{t('rituals.intro_title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {t('rituals.intro_body')}
          </p>
        </div>

        <div className="kalamkari-frame rounded-2xl p-6 sm:p-7 shadow-sutra space-y-3">
          <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-neel pb-2 border-b border-chandan-border">
            <RiverWaves className="w-6 h-6 text-godavari" />
            <h2>{t('rituals.why_matters_title')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {t('rituals.why_matters_body')}
          </p>
        </div>
      </div>

      <KolamDivider className="my-6" />

      {/* 6 Sacred Rituals Detailed Cards with Single-Language Text & Voice Read-Aloud */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neel">
            {t('rituals.rituals_heading')}
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            {t('rituals.rituals_subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ritualsList.map((r) => {
            const title = getRitualTitle(r);
            const desc = getRitualDesc(r);

            return (
              <div
                key={r.id}
                className="kalamkari-frame rounded-2xl p-6 shadow-sutra flex flex-col justify-between hover:border-kesari transition-all group"
              >
                <div>
                  {/* Header row */}
                  <div className="flex items-center justify-between pb-3 border-b border-chandan-border mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-chandan-card flex items-center justify-center border-2 border-haldi shadow-xs group-hover:scale-105 transition-transform">
                        {r.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-haldi-light text-mitti border border-haldi/40">
                          {r.tag}
                        </span>
                        <div className="text-[11px] text-ink-muted mt-0.5">
                          {t('rituals.time_label')}: <strong>{r.timing}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Read aloud button */}
                    <button
                      onClick={() => handleReadAloudRitual(`${title}. ${desc}`)}
                      className="p-2 rounded-xl bg-chandan hover:bg-white text-kesari border border-chandan-border transition-colors shadow-xs"
                      title={t('rituals.listen_label')}
                      aria-label={`Listen to ${title}`}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>

                  {/* Clean Single-Language Title */}
                  <h3 className="font-serif font-bold text-lg text-neel group-hover:text-kesari transition-colors">
                    {title}
                  </h3>

                  {/* Clean Single-Language Description */}
                  <div className="text-xs text-ink-muted leading-relaxed space-y-2 mt-3">
                    <p className="text-ink">{desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* First-Timer Pilgrim Guide & Ghat Etiquette */}
      <div className="bg-gradient-to-r from-chandan via-chandan-card to-chandan rounded-3xl p-6 sm:p-8 border-2 border-haldi shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-serif font-bold text-xl text-neel">
          <ShieldCheck size={24} className="text-kesari" />
          <h2>{t('rituals.guide_title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-ink">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-chandan-border shadow-xs">
            <CheckCircle size={18} className="text-tulsi shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-neel">{t('rituals.rule_snanam_title')}</div>
              <div className="text-ink-muted mt-0.5">{t('rituals.rule_snanam_desc')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-chandan-border shadow-xs">
            <CheckCircle size={18} className="text-tulsi shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-neel">{t('rituals.rule_band_title')}</div>
              <div className="text-ink-muted mt-0.5">{t('rituals.rule_band_desc')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-chandan-border shadow-xs">
            <CheckCircle size={18} className="text-tulsi shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-neel">{t('rituals.rule_valuables_title')}</div>
              <div className="text-ink-muted mt-0.5">{t('rituals.rule_valuables_desc')}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-chandan-border shadow-xs">
            <CheckCircle size={18} className="text-tulsi shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-neel">{t('rituals.rule_police_title')}</div>
              <div className="text-ink-muted mt-0.5">{t('rituals.rule_police_desc')}</div>
            </div>
          </div>
        </div>

        {/* Official AP Endowments Verification Notice */}
        <div className="pt-3 border-t border-haldi/60 text-[11px] text-ink-muted flex items-center gap-2 italic">
          <Info size={15} className="text-kesari shrink-0" />
          <span>
            {t('rituals.verification_notice')}
          </span>
        </div>
      </div>
    </div>
  );
};
