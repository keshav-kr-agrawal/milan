import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeech } from '../../hooks/useSpeech';
import { templeAudio } from '../../services/sound';
import {
  LotusIcon,
  KalashIcon,
  GopuramSilhouette,
  RiverWaves,
  TempleToranam,
  ShankhaIcon,
} from '../motifs/CulturalMotifs';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Volume2,
  VolumeX,
  Bell,
  Flame,
  Leaf,
  MapPin,
  Clock,
  ChevronRight,
  Award,
} from 'lucide-react';

interface CultureHeritageViewProps {
  onNavigateToGhats?: () => void;
}

export const CultureHeritageView: React.FC<CultureHeritageViewProps> = ({ onNavigateToGhats }) => {
  const { t, i18n } = useTranslation();
  const { speak, stop, isSpeaking } = useSpeech();

  // Active section tab: 'history' | 'ghats' | 'rituals' | 'pledge'
  const [activeTab, setActiveTab] = useState<'history' | 'ghats' | 'rituals' | 'pledge'>('history');

  // Active selected ghat in explorer
  const [selectedGhatId, setSelectedGhatId] = useState<string>('kotilingala');

  // Eco pledge state
  const [pledgeName, setPledgeName] = useState<string>(() => {
    return localStorage.getItem('milan_eco_pledge_name') || '';
  });
  const [pledgeAccepted, setPledgeAccepted] = useState<boolean>(() => {
    return localStorage.getItem('milan_eco_pledge') === 'true';
  });
  const [showCertificate, setShowCertificate] = useState<boolean>(() => {
    return localStorage.getItem('milan_eco_pledge') === 'true';
  });

  // Sound playing animation state
  const [activeAudioEffect, setActiveAudioEffect] = useState<string | null>(null);

  const triggerAudio = (type: 'bell' | 'aarti' | 'shankha') => {
    setActiveAudioEffect(type);
    if (type === 'bell') templeAudio.ringTempleBell();
    if (type === 'aarti') templeAudio.playAartiChime();
    if (type === 'shankha') templeAudio.soundShankha();

    setTimeout(() => {
      setActiveAudioEffect(null);
    }, 2500);
  };

  const handleTakePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;

    localStorage.setItem('milan_eco_pledge', 'true');
    localStorage.setItem('milan_eco_pledge_name', pledgeName.trim());
    localStorage.setItem('milan_eco_pledge_date', new Date().toLocaleDateString());

    setPledgeAccepted(true);
    setShowCertificate(true);
    triggerAudio('aarti');
  };

  const ghatsData = [
    {
      id: 'kotilingala',
      nameTel: 'కోటిలింగాల ఘాట్ (కోటి లింగాల తీర్థం)',
      nameHi: 'कोटिलिंगाला घाट (करोड़ शिवलिंग तीर्थ)',
      nameEn: 'Kotilingala Ghat (10 Million Shiva Lingas)',
      badgeTel: 'సర్వోన్నత శైవ క్షేత్రం • వేదవ్యాస తీర్థం',
      badgeHi: 'परम शैव तीर्थ • महर्षि वेदव्यास संगम',
      badgeEn: 'Spiritual Seat of Lord Shiva & Sage Vyasa',
      loreTel:
        'వేద వ్యాస మహర్షి మరియు జనమేజయ మహారాజుచే ప్రతిష్ఠించబడిన కోటి శివలింగాల పవిత్ర క్షేత్రం. ఇక్కడ పుష్కర స్నానం ఆచరిస్తే అశ్వమేధ యాగం చేసినంత పుణ్యఫలం దక్కుతుందని పురాణాలు చెబుతున్నాయి. విశాలమైన మెట్లు మరియు సీనియర్ సిటిజన్లకు ప్రత్యేక రక్షణ ఏర్పాట్లు ఉన్నాయి.',
      loreHi:
        'महर्षि वेदव्यास और राजा जनमेजय द्वारा प्रतिष्ठित कोटि (एक करोड़) शिवलिंगों का अति पावन संगम। यहाँ स्नान करने से अश्वमेध यज्ञ के समान पुण्य प्राप्त होता है। बुजुर्गों के लिए विशेष रेलिंग व सुरक्षित स्नान व्यवस्था उपलब्ध है।',
      loreEn:
        'Consecrated with ten million Shiva Lingams by Sage Vyasa and King Janamejaya. Revered as the highest spiritual seat for Punya Snanam. Equipped with spacious steps and dedicated elder safety railings.',
      deity: 'Sri Kotilingeswara Swamy & Mother Annapurna',
      timing: '4:00 AM – 10:00 PM',
      crowdTip: 'Optimal bathing between 5:30 AM – 7:00 AM for sunrise tranquility.',
      image: '/images/kotilingala_sacred_ghat.jpg',
      color: 'border-kesari',
    },
    {
      id: 'pushkar',
      nameTel: 'పుష్కర్ ఘాట్ (మహా హారతి వేదిక)',
      nameHi: 'पुष्कर घाट (महा आरती संगम)',
      nameEn: 'Pushkar Ghat (The Grand Harathi Concourse)',
      badgeTel: 'పుష్కరుని ప్రవేశ స్థలం • అఖండ హారతి',
      badgeHi: 'पुष्कर देव प्रवेश स्थल • भव्य गोदावरी आरती',
      badgeEn: 'Epicenter of Pushkara & Evening Maha Harathi',
      loreTel:
        'దేవగురు బృహస్పతితో కలిసి పుష్కరుడు తొలిసారిగా గోదావరిలో ప్రవేశించిన దివ్య స్థలం. ప్రతి సంధ్యావేళ 108 ఇత్తడి ప్రమిదలతో వేద పండితుల మంత్రోచ్ఛారణల మధ్య జరిగే గోదావరి మహా హారతి ప్రపంచ ప్రసిద్ధి చెందింది.',
      loreHi:
        'देवगुरु बृहस्पति के साथ पुष्कर देव का गोदावरी में सर्वप्रथम पावन प्रवेश स्थल। प्रत्येक संध्या को 108 दीपों व वैदिक ऋचाओं के साथ होने वाली अलौकिक गोदावरी महा आरती का साक्षी।',
      loreEn:
        'The historic river confluence where Pushkara and Jupiter first entered Godavari. The world-famous venue for the mesmerizing 108-diya evening Godavari Maha Harathi accompanied by Vedic chants.',
      deity: 'Pushkara Purusha & Godavari Matha',
      timing: 'Open 24 Hours (Aarti at 6:30 PM Dusk)',
      crowdTip: 'Arrive by 5:30 PM to secure seating for the evening 108-diya Maha Harathi.',
      image: '/images/godavari_maha_harathi.jpg',
      color: 'border-haldi',
    },
    {
      id: 'gowthami',
      nameTel: 'గౌతమి ఘాట్ (గౌతమ మహర్షి తపోభూమి)',
      nameHi: 'गौतमी घाट (गौतम ऋषि तपोभूमि)',
      nameEn: 'Gowthami Ghat (Sage Gautama Hermitage)',
      badgeTel: 'నదీ అవతరణ క్షేత్రం • ఇస్కాన్ మందిరం',
      badgeHi: 'गोदावरी अवतरण तीर्थ • इस्कॉन देवालय',
      badgeEn: 'Hermitage of Gautama Maharshi & Peace',
      loreTel:
        'గోదావరి నదిని దక్షిణ భారతానికి రప్పించిన గౌతమ మహర్షి పవిత్ర తపోభూమి. ఇస్కాన్ ఆలయ సముదాయం, పచ్చని ఉద్యానవనాలు మరియు కుటుంబ యాత్రికులకు అత్యంత ప్రశాంతమైన స్నాన సౌకర్యాలు ఇక్కడ ఉన్నాయి.',
      loreHi:
        'गोदावरी को धरा पर लाने वाले महर्षि गौतम की पावन तपोस्थली। इस्कॉन मंदिर प्रांगण के साथ परिवार और संतों हेतु अत्यंत शांत एवं मनोरम घाट।',
      loreEn:
        'Named after Sage Gautama whose austere penance brought holy Godavari to peninsular India. Featuring the serene ISKCON cultural complex and verdant promenades ideal for families.',
      deity: 'Maharshi Gautama & Sri Radha Gopinath',
      timing: '5:00 AM – 9:30 PM',
      crowdTip: 'Ideal for peaceful family holy dips and safe for children.',
      image: '/images/sage_gautama_origin.jpg',
      color: 'border-tulsi',
    },
    {
      id: 'saraswati',
      nameTel: 'సరస్వతి ఘాట్ (జ్ఞాన & విద్యా క్షేత్రం)',
      nameHi: 'सरस्वती घाट (ज्ञान व विद्या तीर्थ)',
      nameEn: 'Saraswati Ghat (Sanctum of Wisdom & Arts)',
      badgeTel: 'విద్యా ప్రదాయిని • అక్షరాభ్యాస వేదిక',
      badgeHi: 'विद्यादायिनी तीर्थ • अक्षराभ्यास केंद्र',
      badgeEn: 'Seat of Wisdom, Fine Arts & Students',
      loreTel:
        'చదువుల తల్లి సరస్వతి దేవి ఆలయ సన్నిధిలో ఉన్న పవిత్ర ఘాట్. విద్యార్థులు, పండితులు, కళాకారులు జ్ఞానార్జన కోసం, అక్షరాభ్యాసం నిర్వహించేందుకు ఈ ఘాట్‌ను విశేషంగా దర్శిస్తారు.',
      loreHi:
        'ज्ञानदायिनी माँ सरस्वती के मंदिर के सानिध्य में स्थित पावन घाट। विद्यार्थी, विद्वान और कलाकार ज्ञान व सद्बुद्धि की प्राप्ति हेतु यहाँ अक्षराभ्यास व पावन स्नान करते हैं।',
      loreEn:
        'Adjoining the sacred Saraswati shrine, where students, artists, and scholars take sacred dips and perform auspicious Aksharabhyasam ceremonies seeking blessings of divine wisdom.',
      deity: 'Maha Saraswati Devi',
      timing: '5:30 AM – 8:30 PM',
      crowdTip: 'Popular for morning Aksharabhyasam and student blessings.',
      image: '/images/kotilingala_sacred_ghat.jpg',
      color: 'border-godavari',
    },
    {
      id: 'markandeya',
      nameTel: 'మార్కండేయ ఘాట్ (మృత్యుంజయ క్షేత్రం)',
      nameHi: 'मार्कండేय घाट (महामृत्युंजय तीर्थ)',
      nameEn: 'Markandeya Ghat (The Eternal Youth Shrine)',
      badgeTel: 'మృత్యుంజయ తీర్థం • ఆయురారోగ్య ప్రదాత',
      badgeHi: 'महामृत्युंजय तीर्थ • दीर्घायु प्रदाता',
      badgeEn: 'Shrine of Mahamrityunjaya & Longevity',
      loreTel:
        'పరమశివుని అనుగ్రహంతో యముడిని జయించి చిరంజీవిగా మారిన భక్త మార్కండేయ మహర్షి నదీ తీర ఆలయం. ఆయురారోగ్యాలు, దీర్ఘాయుష్షు కోసం భక్తులు ఇక్కడ ప్రత్యేక పూజలు, సంకల్పాలు చేస్తారు.',
      loreHi:
        'भगवान शिव की अनुकंपा से काल पर विजय पाकर अमरत्व प्राप्त करने वाले भक्त मार्कंडेय का पावन तट। उत्तम स्वास्थ्य, आरोग्य और दीर्घायु हेतु यहाँ महामृत्युंजय अनुष्ठान होते हैं।',
      loreEn:
        'The historic riverbank temple where Sage Markandeya conquered mortality through Lord Shiva’s eternal grace. Devotees offer prayers here for vitality, wellness, and longevity.',
      deity: 'Sri Markandeyeswara Swamy',
      timing: '5:00 AM – 9:00 PM',
      crowdTip: 'Elderly pilgrims frequently visit for health and healing prayers.',
      image: '/images/kotilingala_sacred_ghat.jpg',
      color: 'border-mitti',
    },
  ];

  const currentGhat = ghatsData.find((g) => g.id === selectedGhatId) || ghatsData[0];

  const timelineMilestones = [
    {
      yuga: 'Treta Yuga',
      yugaTel: 'త్రేతాయుగం',
      yugaHi: 'त्रेतायुग',
      badge: 'Brahmagiri Descent',
      badgeTel: 'బ్రహ్మగిరి అవతరణ',
      badgeHi: 'ब्रह्मगिरि अवतरण',
      title: t('heritage.timeline_gautama_title'),
      desc: t('heritage.timeline_gautama_desc'),
      image: '/images/sage_gautama_origin.jpg',
      highlight: 'Sage Gautama brings celestial Godavari to Earth as Dakshina Ganga.',
      highlightTel: 'గౌతమ మహర్షి తపస్సుతో దక్షిణ గంగగా అవతరించిన గోదావరి.',
      highlightHi: 'महर्षि गौतम की तपस्या से दक्षिणा गंगा का भूलोक पर अवतरण।',
    },
    {
      yuga: 'Dvapara Yuga',
      yugaTel: 'ద్వాపరయుగం',
      yugaHi: 'द्वापरयुग',
      badge: '10 Million Shiva Lingams',
      badgeTel: 'కోటి శివలింగాలు',
      badgeHi: 'करोड़ शिवलिंग',
      title: t('heritage.timeline_vyasa_title'),
      desc: t('heritage.timeline_vyasa_desc'),
      image: '/images/kotilingala_sacred_ghat.jpg',
      highlight: 'Maharshi Vyasa & King Janamejaya sanctify Kotilingala Kshetram.',
      highlightTel: 'వ్యాస మహర్షి, జనమేజయుడు ప్రతిష్ఠించిన కోటి శివలింగాలు.',
      highlightHi: 'महर्षि व्यास और जनमेजय द्वारा कोटि शिवलिंग प्रतिष्ठा।',
    },
    {
      yuga: '1022 CE',
      yugaTel: 'క్రీ.శ. 1022',
      yugaHi: '1022 ईस्वी',
      badge: 'Telugu Golden Age',
      badgeTel: 'తెలుగు స్వర్ణయుగం',
      badgeHi: 'तेलुगु स्वर्णयुग',
      title: t('heritage.timeline_nannaya_title'),
      desc: t('heritage.timeline_nannaya_desc'),
      image: '/images/godavari_maha_harathi.jpg',
      highlight: 'Adi Kavi Nannaya translates Mahabharata on the banks of Godavari.',
      highlightTel: 'గోదావరి ఒడ్డున ఆదికవి నన్నయ మహాభారత ఆంధ్రీకరణ.',
      highlightHi: 'गोदावरी तट पर आदिकवि नन्नय द्वारा महाभारत रचना।',
    },
    {
      yuga: '1852 CE',
      yugaTel: 'క్రీ.శ. 1852',
      yugaHi: '1852 ईस्वी',
      badge: 'Dowleswaram Barrage',
      badgeTel: 'ధవళేశ్వరం ఆనకట్ట',
      badgeHi: 'धवलेश्वरम बैराज',
      title: t('heritage.timeline_cotton_title'),
      desc: t('heritage.timeline_cotton_desc'),
      image: '/images/dowleswaram_barrage_historic.jpg',
      highlight: 'Sir Arthur Cotton constructs the engineering marvel feeding millions.',
      highlightTel: 'సర్ ఆర్థర్ కాటన్ నిర్మించిన అన్నపూర్ణ బ్యారేజీ అద్భుతం.',
      highlightHi: 'सर आर्थर कॉटन द्वारा निर्मित ऐतिहासिक धवलेश्वरम बैराज।',
    },
    {
      yuga: '2027 CE',
      yugaTel: '2027 మహా పుష్కరాలు',
      yugaHi: '2027 महा पुष्करालु',
      badge: 'Brihaspati in Simha Rashi',
      badgeTel: 'సింహరాశి గురు ప్రవేశం',
      badgeHi: 'सिंह राशि गुरु प्रवेश',
      title: t('heritage.timeline_2027_title'),
      desc: t('heritage.timeline_2027_desc'),
      image: '/images/previous_mela_gathering.jpg',
      highlight: '50 Million pilgrims gather in Rajamahendravaram for holy liberation.',
      highlightTel: '5 కోట్ల మంది భక్తుల పుణ్యస్నానాలతో రాజమహేంద్రవరం పునీతం.',
      highlightHi: '5 करोड़ से अधिक श्रद्धालुओं का पावन संगम व मोक्ष स्नान।',
    },
  ];

  const ritualsList = [
    {
      id: 'snanam',
      num: '01',
      titleTel: 'పుష్కర స్నానం (పుణ్య స్నానం)',
      titleHi: 'पुष्कर स्नान (पवित्र नदी स्नान)',
      titleEn: 'Pushkara Snanam (The Holy River Dip)',
      descTel: 'పవిత్ర గోదావరి నదిలో బ్రాహ్మీ ముహూర్తంలో సంకల్పం చెప్పుకుని మునక వేసి మనస్సు, శరీరాన్ని పవిత్రం చేసుకోవడం.',
      descHi: 'पवित्र गोदावरी में श्रद्धापूर्वक प्रार्थना कर डुबकी लगाना, जिससे मन और तन निर्मल होते हैं।',
      descEn: 'Taking a holy dip in the sacred waters with prayer during Bramha Muhurtham, cleansing body and soul.',
      timing: '4:30 AM – 6:30 AM & Sunset',
      icon: <RiverWaves className="w-8 h-8 text-godavari" />,
      bgImage: '/images/kotilingala_sacred_ghat.jpg',
    },
    {
      id: 'tarpanam',
      num: '02',
      titleTel: 'పితృ తర్పణం & పిండ ప్రదానం',
      titleHi: 'पितृ तर्पण और पिंड दान',
      titleEn: 'Pitru Tarpanam & Pinda Pradanam',
      descTel: 'శాస్త్రోక్తంగా అర్హులైన పండితుల సమక్షంలో పూర్వీకులకు తర్పణాలు మరియు పిండ ప్రదానం సమర్పించి వారి రుణం తీర్చుకోవడం.',
      descHi: 'शास्त्रोक्त विधि से योग्य पुरोहितों के सानिध्य में दिवंगत पितरों की शांति हेतु तर्पण और पिंडदान।',
      descEn: 'Sacred ancestral homage performed along designated ghat steps under verified purohits for multi-generational peace.',
      timing: '7:00 AM – 11:30 AM',
      icon: <KalashIcon size={30} />,
      bgImage: '/images/vedic_rituals_tarpanam.jpg',
    },
    {
      id: 'harathi',
      num: '03',
      titleTel: 'గోదావరి మహా హారతి',
      titleHi: 'गोदावरी महा आरती',
      titleEn: 'Godavari Maha Harathi (Evening Aarti)',
      descTel: 'పుష్కర్ ఘాట్ వద్ద ప్రతి సంధ్యావేళ వేద మంత్రోచ్ఛారణల మధ్య 108 ఇత్తడి దీపాలతో గోదావరి మాతకు సమర్పించే కమనీయ హారతి.',
      descHi: 'पुष्कर घाट पर प्रत्येक संध्या को वैदिक मंत्रोच्चार के साथ 108 दीपों से गोदावरी मैया को अर्पित की जाने वाली भव्य आरती।',
      descEn: 'The majestic evening river aarti at Pushkar Ghat, where multi-tiered brass lamps illuminate Mother Godavari.',
      timing: '6:30 PM Daily Sunset',
      icon: <img src="/images/diya.png" alt="Aarti Diya" className="w-8 h-8 object-contain" />,
      bgImage: '/images/godavari_maha_harathi.jpg',
    },
    {
      id: 'deepam',
      num: '04',
      titleTel: 'దీప దానం (నదిలో దీపాలు వదలడం)',
      titleHi: 'दीप दान (नदी में दीप प्रज्वलन)',
      titleEn: 'Deepa Daanam (Floating Earthen Diyas)',
      descTel: 'మట్టి ప్రమిదలలో ఆవు నేతితో దీపాలు వెలిగించి, పసుపు-కుంకుమ పువ్వులతో గోదావరి తరంగాలపై కృతజ్ఞతతో వదలడం.',
      descHi: 'मिट्टी के दीयों में घी व पुष्प सजाकर कृतज्ञता भाव से गोदावरी की पवित्र लहरों पर प्रवाहित करना।',
      descEn: 'Devotees gently float earthen diyas with natural ghee and marigolds upon dusk currents with heartfelt gratitude.',
      timing: '7:00 PM Dusk',
      icon: <LotusIcon size={28} />,
      bgImage: '/images/deepa_daanam_floating_diyas.jpg',
    },
    {
      id: 'annadanam',
      num: '05',
      titleTel: 'దానం & అన్నదానం',
      titleHi: 'दान और अन्नदान',
      titleEn: 'Daanam & Annadanam (Sacred Feeding)',
      descTel: 'యాత్రికులకు, సాధువులకు, వృద్ధులకు స్వచ్ఛందంగా అన్నదానం, వస్త్రదానం మరియు జలదానం చేయడం విశేష పుణ్యం.',
      descHi: 'तीर्थयात्रियों, साधु-संतों और श्रद्धालुओं को भोजन, वस्त्र और जल वितरित करना इस महापर्व में असीम पुण्यकारी है।',
      descEn: 'Feeding visiting pilgrims, sadhus, and elders across designated anna prasadam sheds along the riverbank.',
      timing: '11:00 AM – 3:30 PM & Night',
      icon: <Sparkles size={28} className="text-haldi" />,
      bgImage: '/images/previous_mela_gathering.jpg',
    },
    {
      id: 'temple',
      num: '06',
      titleTel: 'ప్రాచీన ఆలయ దర్శనాలు',
      titleHi: 'ऐतिहासिक देवालय दर्शन',
      titleEn: 'Ancient Riverbank Temple Darshans',
      descTel: 'కోటిలింగేశ్వర స్వామి, మార్కండేయ స్వామి, ఉమా రామలింగేశ్వర స్వామి ఆలయాలను దర్శించుకుని ఈశ్వరానుగ్రహం పొందడం.',
      descHi: 'कोटिलिंगेश्वर, मार्कंडेय और श्री उमा रामलिंगेश्वर स्वामी मंदिरों का दर्शन कर भगवान शिव का आशीर्वाद प्राप्त करना।',
      descEn: 'Visiting historic centuries-old Shaivite shrines gracing Rajamahendravaram during the sacred 12-day window.',
      timing: '6:00 AM – 12:30 PM & 4:30 PM – 9:00 PM',
      icon: <GopuramSilhouette className="w-12 h-10 text-kesari" />,
      bgImage: '/images/sage_gautama_origin.jpg',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16 w-full max-w-6xl mx-auto">
      {/* 1. CINEMATIC HERO SECTION WITH HIGH-CONTRAST PROTECTED BACKDROP */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-haldi/60 bg-neel-deep text-white">
        {/* Atmospheric Background Artwork with Deep Protective Veil */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/godavari_maha_harathi.jpg"
            alt="Godavari Maha Harathi Dusk"
            className="w-full h-full object-cover object-center opacity-20 transform scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-[#0b1426]/90 to-[#070e1c]/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 space-y-6 text-center">
          <TempleToranam className="w-full h-4 sm:h-5 opacity-90 mx-auto max-w-xl" />

          {/* Astrological Transit Badge with Diya logo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1224]/90 text-amber-300 border border-haldi/70 text-xs sm:text-sm font-black shadow-lg backdrop-blur-md">
            <img src="/images/diya.png" alt="Diya" className="w-4 h-4 object-contain inline-block shrink-0" />
            <span>
              {i18n.language === 'te'
                ? 'సింహరాశి బృహస్పతి ప్రవేశం • గోదావరి మహా పుష్కరాలు 2027'
                : i18n.language === 'hi'
                ? 'सिंह राशि में देवगुरु बृहस्पति प्रवेश • गोदावरी महा पुष्करालु 2027'
                : 'Jupiter Transits Leo • Godavari Maha Pushkaralu 2027'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-white drop-shadow-xl">
            {t('heritage.culture_title')}
          </h1>

          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-[#081022]/75 border border-haldi/30 backdrop-blur-md shadow-md">
            <p className="text-sm sm:text-base md:text-lg text-white font-medium leading-relaxed drop-shadow-sm">
              {t('heritage.culture_desc')}
            </p>
          </div>

          {/* Interactive Sacred Audio Synthesizers - HIGH CONTRAST & CLEAR TEXT VISIBILITY */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {/* Button 1: Temple Bell (Bright White Text on Vibrant Saffron Orange) */}
            <button
              type="button"
              onClick={() => triggerAudio('bell')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 border-2 border-haldi ${
                activeAudioEffect === 'bell'
                  ? 'bg-kesari text-white ring-4 ring-haldi animate-pulse'
                  : 'bg-kesari hover:bg-kesari-hover text-white'
              }`}
            >
              <Bell size={18} className={`text-haldi ${activeAudioEffect === 'bell' ? 'animate-bounce' : ''}`} />
              <span className="text-white drop-shadow-sm">{t('heritage.ring_bell')}</span>
            </button>

            {/* Button 2: Maha Harathi Chime (Bold Deep Navy Text on Bright Golden Turmeric) */}
            <button
              type="button"
              onClick={() => triggerAudio('aarti')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 border-2 border-kesari ${
                activeAudioEffect === 'aarti'
                  ? 'bg-yellow-400 !text-[#0A1128] ring-4 ring-kesari animate-pulse'
                  : 'bg-haldi hover:bg-yellow-400 !text-[#0A1128]'
              }`}
            >
              <img src="/images/diya.png" alt="Diya" className="w-5 h-5 object-contain shrink-0" />
              <span className="!text-[#0A1128] font-black">{t('heritage.play_harathi_audio')}</span>
            </button>

            {/* Button 3: Sacred Shankha (Bright Amber Text on Deep Indigo with Golden Border) */}
            <button
              type="button"
              onClick={() => triggerAudio('shankha')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-lg active:scale-95 border-2 border-haldi/80 ${
                activeAudioEffect === 'shankha'
                  ? 'bg-[#1a234f] text-amber-200 ring-4 ring-haldi animate-pulse'
                  : 'bg-[#131b40] hover:bg-[#1a234f] text-amber-200'
              }`}
            >
              <ShankhaIcon size={18} className="text-haldi" />
              <span className="text-amber-200 drop-shadow-sm">{t('heritage.sound_shankha')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SACRED VEDIC SHLOKA BANNER WITH HIGH CONTRAST & CLEAR BACKGROUND */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FFFDF8] via-[#FFF9EC] to-[#FFFDF8] dark:from-[#111A2E] dark:via-[#16223B] dark:to-[#111A2E] p-5 sm:p-6 rounded-2xl border-2 border-haldi dark:border-amber-500/40 shadow-md">
        {/* Subtle decorative watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/images/kotilingala_sacred_ghat.jpg"
            alt="Godavari Dawn"
            className="w-full h-full object-cover opacity-16 dark:opacity-12"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/75 to-white/85 dark:from-[#111A2E]/90 dark:via-[#111A2E]/75 dark:to-[#111A2E]/90" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-kesari text-white flex items-center justify-center font-serif text-2xl font-bold shrink-0 shadow-md border border-haldi/60">
              ॐ
            </div>
            <div>
              <div className="text-xs font-black text-[#881912] dark:text-amber-300 tracking-wider uppercase">
                {t('heritage.shloka_title')}
              </div>
              <div className="font-serif font-black text-[#0c1328] dark:text-white text-base sm:text-lg">
                {t('heritage.shloka_sanskrit')}
              </div>
              <div className="text-xs sm:text-sm text-[#1e293b] dark:text-slate-200 font-bold mt-0.5 max-w-2xl leading-relaxed">
                {t('heritage.shloka_meaning')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stop();
              } else {
                speak(t('heritage.shloka_sanskrit') + '. ' + t('heritage.shloka_meaning'));
              }
            }}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 dark:bg-[#16223B] dark:hover:bg-[#1E2D4A] border-2 border-haldi dark:border-amber-400 text-xs font-bold text-neel dark:text-amber-200 shadow-sm transition-transform active:scale-95"
          >
            {isSpeaking ? <VolumeX size={16} className="text-kesari" /> : <Volume2 size={16} className="text-kesari" />}
            <span>{isSpeaking ? t('common.close') : t('common.read_aloud')}</span>
          </button>
        </div>
      </div>

      {/* 3. MODERN INTERACTIVE TAB NAVIGATION */}
      <div className="flex items-center justify-center border-b border-chandan-border/60 dark:border-slate-700/60 pb-3">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-chandan/60 dark:bg-[#16223B]/80 rounded-2xl border border-chandan-border dark:border-slate-700 max-w-full overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-kesari text-white shadow-md font-extrabold scale-102'
                : 'text-ink-muted hover:text-neel hover:bg-white/60 dark:hover:text-white dark:hover:bg-white/10'
            }`}
          >
            <BookOpen size={16} />
            <span>{t('heritage.tab_history')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ghats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ghats'
                ? 'bg-kesari text-white shadow-md font-extrabold scale-102'
                : 'text-ink-muted hover:text-neel hover:bg-white/60 dark:hover:text-white dark:hover:bg-white/10'
            }`}
          >
            <MapPin size={16} />
            <span>{t('heritage.tab_ghats')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rituals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'rituals'
                ? 'bg-kesari text-white shadow-md font-extrabold scale-102'
                : 'text-ink-muted hover:text-neel hover:bg-white/60 dark:hover:text-white dark:hover:bg-white/10'
            }`}
          >
            <Flame size={16} />
            <span>{t('heritage.tab_rituals')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pledge')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pledge'
                ? 'bg-tulsi text-white shadow-md font-extrabold scale-102'
                : 'text-ink-muted hover:text-tulsi hover:bg-white/60 dark:hover:text-emerald-300 dark:hover:bg-white/10'
            }`}
          >
            <Leaf size={16} />
            <span>{t('heritage.tab_pledge')}</span>
          </button>
        </div>
      </div>

      {/* 4. TAB 1: SACRED HISTORY & YUGAS CHRONICLE */}
      {activeTab === 'history' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="text-center space-y-1">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-neel dark:text-white">
              {t('heritage.timeline_title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#1e293b] dark:text-slate-300 max-w-xl mx-auto font-semibold">
              {t('heritage.timeline_subtitle')}
            </p>
          </div>

          {/* Timeline Milestones - CRISP 100% READABLE CARDS WITH VISIBLE BACKGROUND */}
          <div className="space-y-6">
            {timelineMilestones.map((m, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-8 border-2 border-haldi/80 shadow-sutra hover:border-kesari transition-all space-y-4 group"
              >
                {/* Visible atmospheric watermark without interfering with reading text */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <img
                    src={m.image}
                    alt=""
                    className="w-full h-full object-cover opacity-20 dark:opacity-15 group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/82 to-white/92 dark:from-[#111A2E]/94 dark:via-[#111A2E]/85 dark:to-[#111A2E]/94" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-chandan-border pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-full bg-kesari text-white font-mono text-xs font-black tracking-wider shadow-xs">
                        {i18n.language === 'te' ? m.yugaTel : i18n.language === 'hi' ? m.yugaHi : m.yuga}
                      </span>
                      <span className="text-xs font-black text-kesari">
                        {i18n.language === 'te' ? m.badgeTel : i18n.language === 'hi' ? m.badgeHi : m.badge}
                      </span>
                    </div>

                    <div className="text-xs font-black text-[#7A3609] dark:text-amber-200 bg-[#FFF4E5] dark:bg-[#1C263D] border border-amber-300 dark:border-amber-500/40 px-3.5 py-1 rounded-xl w-fit shadow-xs">
                      {i18n.language === 'te' ? m.highlightTel : i18n.language === 'hi' ? m.highlightHi : m.highlight}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      <h3 className="font-serif font-black text-xl sm:text-2xl text-[#0C1328] dark:text-white drop-shadow-xs">
                        {m.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#1E293B] dark:text-slate-200 font-semibold leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    <div className="lg:col-span-4 rounded-2xl overflow-hidden shadow-lg border-2 border-haldi/70 aspect-video lg:aspect-[4/3] relative">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neel-deep/50 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 2: 5 SACRED MAHA GHATS EXPLORER */}
      {activeTab === 'ghats' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center space-y-1">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-neel dark:text-white flex items-center justify-center gap-2">
              <MapPin size={28} className="text-kesari" />
              <span>{t('heritage.ghats_lore_title')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink dark:text-slate-300 font-medium">
              Select any maha ghat to discover its spiritual significance, lore, and visitor crowd tips.
            </p>
          </div>

          {/* Interactive Ghat Selector Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            {ghatsData.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGhatId(g.id)}
                className={`p-3 rounded-2xl text-left border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                  selectedGhatId === g.id
                    ? 'bg-kesari text-white border-haldi shadow-lg scale-102'
                    : 'bg-white dark:bg-[#16223B] hover:bg-chandan dark:hover:bg-[#1E2D4A] border-chandan-border dark:border-slate-700 text-neel dark:text-slate-100'
                }`}
              >
                <div className="text-xs font-serif font-bold truncate relative z-10">
                  {i18n.language === 'te'
                    ? g.nameTel.split('(')[0]
                    : i18n.language === 'hi'
                    ? g.nameHi.split('(')[0]
                    : g.nameEn.split('(')[0]}
                </div>
                <div
                  className={`text-[10px] mt-1 font-bold truncate relative z-10 ${
                    selectedGhatId === g.id ? 'text-haldi' : 'text-kesari'
                  }`}
                >
                  {i18n.language === 'te' ? g.badgeTel : i18n.language === 'hi' ? g.badgeHi : g.badgeEn}
                </div>
              </button>
            ))}
          </div>

          {/* Featured Ghat Detail Showcase Card WITH CRISP HIGH-CONTRAST TEXT & CLEAR BACKGROUND */}
          <div className="relative overflow-hidden bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border-2 border-haldi dark:border-amber-500/50 shadow-xl space-y-6">
            {/* Subtle decorative watermark */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <img
                src={currentGhat.image}
                alt=""
                className="w-full h-full object-cover opacity-20 dark:opacity-15 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/82 to-white/92 dark:from-[#111A2E]/94 dark:via-[#111A2E]/85 dark:to-[#111A2E]/94" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Image Frame */}
              <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-lg border-2 border-chandan-border aspect-video lg:aspect-[4/3] relative">
                <img
                  src={currentGhat.image}
                  alt={currentGhat.nameEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#0a1224]/90 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-haldi/40 backdrop-blur-sm">
                  {i18n.language === 'te'
                    ? currentGhat.badgeTel
                    : i18n.language === 'hi'
                    ? currentGhat.badgeHi
                    : currentGhat.badgeEn}
                </div>
              </div>

              {/* Information */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#0C1328] dark:text-white">
                    {i18n.language === 'te'
                      ? currentGhat.nameTel
                      : i18n.language === 'hi'
                      ? currentGhat.nameHi
                      : currentGhat.nameEn}
                  </h3>
                  <div className="text-xs font-black text-[#881912] dark:text-rose-400">
                    Presiding Deity: {currentGhat.deity}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#1E293B] dark:text-slate-200 font-semibold leading-relaxed">
                  {i18n.language === 'te'
                    ? currentGhat.loreTel
                    : i18n.language === 'hi'
                    ? currentGhat.loreHi
                    : currentGhat.loreEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#16223B] border-2 border-amber-200 dark:border-amber-500/30 text-xs space-y-1 shadow-xs">
                    <span className="font-black text-[#0C1328] dark:text-amber-300 flex items-center gap-1.5">
                      <Clock size={15} className="text-kesari" />
                      <span>Bathing Timings:</span>
                    </span>
                    <span className="text-[#1E293B] dark:text-slate-200 font-bold text-xs block">{currentGhat.timing}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#16223B] border-2 border-amber-200 dark:border-amber-500/30 text-xs space-y-1 shadow-xs">
                    <span className="font-black text-[#0C1328] dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles size={15} className="text-amber-500" />
                      <span>Crowd & Safety Tip:</span>
                    </span>
                    <span className="text-[#1E293B] dark:text-slate-200 font-bold text-xs block">{currentGhat.crowdTip}</span>
                  </div>
                </div>

                {onNavigateToGhats && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onNavigateToGhats}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-neel hover:bg-neel-deep text-white text-xs font-bold shadow-md transition-all active:scale-95 border border-haldi/60"
                    >
                      <MapPin size={16} className="text-haldi" />
                      <span>View Ghat on Map & Locate Nearby Volunteer Booths</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 3: 6 SACRED PUSHKARA RITUALS GUIDE WITH HIGH CONTRAST */}
      {activeTab === 'rituals' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center space-y-1">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-neel dark:text-white flex items-center justify-center gap-2">
              <Flame size={28} className="text-kesari" />
              <span>{t('rituals.rituals_heading')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#1e293b] dark:text-slate-300 font-semibold">
              Prescribed Vedic rituals, auspicious muhurthams, and spiritual guidelines for all 12 days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ritualsList.map((r) => (
              <div
                key={r.id}
                className="relative overflow-hidden bg-white dark:bg-[#111A2E] rounded-3xl p-6 border-2 border-haldi/80 dark:border-amber-500/40 shadow-sutra flex flex-col justify-between hover:border-kesari hover:shadow-lg transition-all space-y-4 group"
              >
                {/* Visible decorative watermark */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <img
                    src={r.bgImage}
                    alt=""
                    className="w-full h-full object-cover opacity-20 dark:opacity-15 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/82 to-white/92 dark:from-[#111A2E]/94 dark:via-[#111A2E]/85 dark:to-[#111A2E]/94" />
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-chandan-border">
                    <span className="font-mono text-xs font-black text-kesari bg-kesari-light px-3 py-1 rounded-lg border border-kesari/30">
                      Ritual #{r.num}
                    </span>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#16223B] shadow-xs border border-haldi/60">{r.icon}</div>
                  </div>

                  <h3 className="font-serif font-black text-lg sm:text-xl text-[#0C1328] dark:text-white mt-2 drop-shadow-xs">
                    {i18n.language === 'te' ? r.titleTel : i18n.language === 'hi' ? r.titleHi : r.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#1E293B] dark:text-slate-200 font-semibold mt-2 leading-relaxed">
                    {i18n.language === 'te' ? r.descTel : i18n.language === 'hi' ? r.descHi : r.descEn}
                  </p>
                </div>

                <div className="relative z-10 pt-3 border-t border-chandan-border">
                  <div className="p-2.5 rounded-xl bg-[#FFF9EE] dark:bg-[#1C263D] border border-amber-200 dark:border-amber-500/30 flex items-center gap-1.5 text-xs text-[#7A3609] dark:text-amber-200 font-black">
                    <Clock size={15} className="text-kesari" />
                    <span>{r.timing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 4: ECO-PUSHKARALU "NADI SWACHHATA" SANKALPAM & CERTIFICATE */}
      {activeTab === 'pledge' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Pledge Form & Core Pillars WITH HIGH CONTRAST */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-[#0D1F18] dark:via-[#11241C] dark:to-[#0D1F18] rounded-3xl p-6 sm:p-10 border-2 border-tulsi dark:border-emerald-500/50 shadow-xl space-y-6">
            {/* Subtle decorative watermark */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <img
                src="/images/deepa_daanam_floating_diyas.jpg"
                alt="Floating Diyas"
                className="w-full h-full object-cover opacity-18 dark:opacity-12"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/85 via-white/80 to-emerald-50/85 dark:from-[#0D1F18]/90 dark:via-[#11241C]/80 dark:to-[#0D1F18]/90" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 text-tulsi">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#162E24] shadow-sm border border-tulsi/40">
                  <Leaf size={28} className="text-tulsi" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#064e3b] dark:text-emerald-300">
                    {t('heritage.eco_pledge_title')}
                  </h2>
                  <div className="text-xs font-black text-tulsi dark:text-emerald-400 mt-0.5">
                    Eco-Pushkaralu 2027 • Nadi Swachhata Sankalpam
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#1E293B] dark:text-emerald-100 font-semibold leading-relaxed">
                {t('heritage.eco_pledge_body')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Pillar 1 */}
                <div className="relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-[#162E24] border-2 border-tulsi/50 dark:border-emerald-500/40 text-xs space-y-1.5 shadow-sm">
                  <div className="font-black text-[#064e3b] dark:text-emerald-300 text-sm flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-tulsi" />
                    <span>1. Zero Plastic</span>
                  </div>
                  <div className="text-[#1E293B] dark:text-emerald-100 font-bold leading-relaxed">
                    {t('heritage.pledge_point_1')}
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-[#162E24] border-2 border-tulsi/50 dark:border-emerald-500/40 text-xs space-y-1.5 shadow-sm">
                  <div className="font-black text-[#064e3b] dark:text-emerald-300 text-sm flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-tulsi" />
                    <span>2. Natural Offerings</span>
                  </div>
                  <div className="text-[#1E293B] dark:text-emerald-100 font-bold leading-relaxed">
                    {t('heritage.pledge_point_2')}
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-[#162E24] border-2 border-tulsi/50 dark:border-emerald-500/40 text-xs space-y-1.5 shadow-sm">
                  <div className="font-black text-[#064e3b] dark:text-emerald-300 text-sm flex items-center gap-1.5">
                    <CheckCircle size={16} className="text-tulsi" />
                    <span>3. Riverbank Dignity</span>
                  </div>
                  <div className="text-[#1E293B] dark:text-emerald-100 font-bold leading-relaxed">
                    {t('heritage.pledge_point_3')}
                  </div>
                </div>
              </div>

              {/* Signature Input Form */}
              <form onSubmit={handleTakePledge} className="pt-4 border-t border-tulsi/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={pledgeName}
                  onChange={(e) => setPledgeName(e.target.value)}
                  placeholder="Enter your name / కుటుంబం పేరు నమోదు చేయండి"
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-tulsi/60 bg-white dark:bg-[#070B16] text-sm text-ink font-semibold focus:outline-none focus:border-tulsi shadow-xs"
                  required
                />

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-tulsi hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border border-haldi/40"
                >
                  <Award size={18} />
                  <span>{pledgeAccepted ? t('heritage.pledge_taken_badge') : t('heritage.take_pledge_btn')}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Official Digital Certificate Card WITH VISIBLE WATERMARK */}
          {showCertificate && (
            <div className="relative overflow-hidden bg-white dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border-4 border-tulsi dark:border-emerald-500/60 shadow-2xl space-y-6 animate-fadeIn">
              {/* Visible watermark image of sacred Kotilingala ghat */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <img
                  src="/images/kotilingala_sacred_ghat.jpg"
                  alt=""
                  className="w-full h-full object-cover opacity-18 dark:opacity-12"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/82 to-white/92 dark:from-[#111A2E]/94 dark:via-[#111A2E]/85 dark:to-[#111A2E]/94" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="text-center space-y-2 border-b-2 border-chandan-border pb-6">
                  <TempleToranam className="w-full h-4 opacity-90 mx-auto max-w-sm mb-1" />
                  <div className="text-xs font-mono font-bold text-tulsi uppercase tracking-widest">
                    {t('heritage.pledge_cert_subtitle')}
                  </div>
                  <h3 className="font-serif font-black text-2xl sm:text-4xl text-neel dark:text-white">
                    {t('heritage.pledge_cert_title')}
                  </h3>
                </div>

                <div className="text-center py-4 space-y-3">
                  <div className="text-xs text-[#1e293b] dark:text-slate-300 font-bold">This sacred certificate of honor is proudly bestowed upon:</div>
                  <div className="font-serif font-black text-2xl sm:text-4xl text-kesari tracking-wide">
                    {pledgeName || 'Sri Pushkaralu Pilgrim'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#0c1328] dark:text-slate-200 font-semibold max-w-xl mx-auto leading-relaxed">
                    For solemnly taking the sacred oath to keep Mother Godavari and the historic ghats of Rajamahendravaram pristine, plastic-free, and spiritually pure during Pushkaralu 2027.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-emerald-200 dark:border-emerald-500/40 text-xs text-[#0c1328] dark:text-slate-200 font-bold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-tulsi" />
                    <span>Sanctified by Godavari Milan Community Initiative</span>
                  </div>
                  <div className="font-mono text-[11px] font-black text-[#78350f] dark:text-amber-300">
                    Dated: {localStorage.getItem('milan_eco_pledge_date') || new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
