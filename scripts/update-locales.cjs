const fs = require('fs');
const path = require('path');

const localesDir = path.resolve(__dirname, '../locales');
const enPath = path.join(localesDir, 'en.json');
const tePath = path.join(localesDir, 'te.json');
const hiPath = path.join(localesDir, 'hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const te = JSON.parse(fs.readFileSync(tePath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

// 1. Add nav keys
en.nav.booths = "Ghats & Volunteer Booths";
en.nav.heritage = "Culture & Heritage";

te.nav.booths = "ఘాట్లు & వాలంటీర్ బూత్‌లు";
te.nav.heritage = "సంస్కృతి & వారసత్వం";

hi.nav.booths = "घाट व स्वयंसेवक बूथ";
hi.nav.heritage = "संस्कृति और विरासत";

// 2. Add family keys
const enFamily = {
  live_requests_heading: "Live Contact Permission Requests",
  live_requests_desc: "A volunteer or finder has scanned this member's QR code and is asking permission to contact you.",
  grant_access_btn: "Grant 1-Hour Access",
  reject_access_btn: "Decline",
  print_all_bands: "Print All Family Wristbands (1-Click)",
  batch_print_subtitle: "Print waterproof bands for all registered family members on a single sheet",
  wristband_title: "Godavari Sacred Raksha Band",
  id_card_title: "Pilgrim Identity Card (CR80)",
  self_dependent_badge: "Atmanirbhar Bharat • Self-Dependent Bharat",
  made_in_india: "Made in India Tech"
};

const teFamily = {
  live_requests_heading: "లైవ్ కాంటాక్ట్ అనుమతి అభ్యర్థనలు",
  live_requests_desc: "ఒక వాలంటీర్ లేదా యాత్రికుడు ఈ సభ్యుని క్యూఆర్ కోడ్ స్కాన్ చేసి, మీతో మాట్లాడటానికి అనుమతి కోరుతున్నారు.",
  grant_access_btn: "1-గంట అనుమతి ఇవ్వండి",
  reject_access_btn: "తిరస్కరించండి",
  print_all_bands: "అందరి రక్షా బ్యాండ్‌లు ముద్రించండి (1-క్లిక్)",
  batch_print_subtitle: "కుటుంబ సభ్యులందరికీ ఒకే పేజీపై వాటర్‌ప్రూఫ్ బ్యాండ్‌ల ప్రింట్",
  wristband_title: "గోదావరి రక్షా బ్యాండ్",
  id_card_title: "యాత్రికుల గుర్తింపు కార్డు",
  self_dependent_badge: "ఆత్మనిర్భర్ భారత్ • స్వయం సమృద్ధి భారత్",
  made_in_india: "భారతీయ సాంకేతిక పరిజ్ఞానం"
};

const hiFamily = {
  live_requests_heading: "सम्पर्क अनुमति अनुरोध",
  live_requests_desc: "किसी स्वयंसेवक या श्रद्धालु ने इस सदस्य का क्यूआर स्कैन कर आपसे संपर्क करने की अनुमति माँगी है।",
  grant_access_btn: "1-घंटे की अनुमति दें",
  reject_access_btn: "अस्वीकार करें",
  print_all_bands: "सभी सदस्यों के रिस्टबैंड प्रिंट करें (1-क्लिक)",
  batch_print_subtitle: "सभी पंजीकृत परिजनों के लिए एक ही शीट पर वाटरप्रूफ बैंड प्रिंट",
  wristband_title: "गोदावरी रक्षा सूत्र बैंड",
  id_card_title: "तीर्थयात्री पहचान पत्र",
  self_dependent_badge: "आत्मनिर्भर भारत • स्वदेशी तकनीक",
  made_in_india: "मेक इन इंडिया टेक"
};

Object.assign(en.family, enFamily);
Object.assign(te.family, teFamily);
Object.assign(hi.family, hiFamily);

// 3. Add booths section
en.booths = {
  title: "Pushkaralu Volunteering Booths & Ghat Map",
  desc: "Locate nearby volunteering booths, control posts, first aid desks, and child wristband stations across Rajamahendravaram ghats.",
  filter_all: "All Booths",
  filter_wristband: "Wristband Printing",
  filter_reunion: "Reunion Desk",
  filter_medical: "First Aid & Medical",
  filter_milk: "Toddler Milk & Water",
  booth_number: "Booth No.",
  in_charge: "Officer In-Charge",
  hotline: "Emergency Hotline",
  phone: "Direct Phone",
  call_booth: "Call Booth",
  directions: "Directions",
  crowd_status: "Ghat Crowd Status",
  crowd_low: "Calm / Low",
  crowd_moderate: "Moderate Flow",
  crowd_peak: "Peak Devotee Crowd",
  services_offered: "Available Services",
  nearest_booth_badge: "Nearest Volunteer Desk",
  select_your_ghat: "Select Your Current Ghat:"
};

te.booths = {
  title: "పుష్కరాల వాలంటీరింగ్ బూత్‌లు & ఘాట్ల మ్యాప్",
  desc: "రాజమండ్రి ఘాట్ల వెంబడి సమీపంలోని వాలంటీర్ బూత్‌లు, కంట్రోల్ పోస్ట్‌లు, ప్రథమ చికిత్స కేంద్రాలు మరియు పిల్లల బ్యాండ్ స్టేషన్‌లను కనుగొనండి.",
  filter_all: "అన్ని బూత్‌లు",
  filter_wristband: "బ్యాండ్ ప్రింటింగ్",
  filter_reunion: "పునఃకలయిక డెస్క్",
  filter_medical: "ప్రథమ చికిత్స కేంద్రం",
  filter_milk: "పసిపిల్లల పాలు & తాగునీరు",
  booth_number: "బూత్ సంఖ్య",
  in_charge: "ఇన్‌ఛార్జ్ అధికారి",
  hotline: "అత్యవసర హాట్‌లైన్",
  phone: "ప్రత్యక్ష ఫోన్",
  call_booth: "బూత్‌కు కాల్ చేయండి",
  directions: "దారి చూపించు",
  crowd_status: "ఘాట్ రద్దీ స్థితి",
  crowd_low: "సాధారణ రద్దీ",
  crowd_moderate: "మితమైన రద్దీ",
  crowd_peak: "అత్యధిక రద్దీ",
  services_offered: "అందుబాటులో ఉన్న సేవలు",
  nearest_booth_badge: "సమీప వాలంటీర్ డెస్క్",
  select_your_ghat: "మీ ప్రస్తుత ఘాట్‌ను ఎంచుకోండి:"
};

hi.booths = {
  title: "पुष्करालु स्वयंसेवक बूथ व घाट मानचित्र",
  desc: "राजमहेंद्रवरम के घाटों पर निकटतम स्वयंसेवक बूथ, नियंत्रण पोस्ट, प्राथमिक चिकित्सा और बाल सुरक्षा बैंड केंद्र खोजें।",
  filter_all: "सभी सहायता बूथ",
  filter_wristband: "रिस्टबैंड प्रिंटिंग",
  filter_reunion: "पुनर्मिलन डेस्क",
  filter_medical: "प्राथमिक चिकित्सा शिविर",
  filter_milk: "शिशु दुग्ध व पेयजल",
  booth_number: "बूथ संख्या",
  in_charge: "प्रभारी अधिकारी",
  hotline: "आपातकालीन हेल्पलाइन",
  phone: "सीधा फोन",
  call_booth: "बूथ पर कॉल करें",
  directions: "दिशा निर्देश",
  crowd_status: "घाट भीड़ स्थिति",
  crowd_low: "सामान्य प्रवाह",
  crowd_moderate: "मध्यम भीड़",
  crowd_peak: "अत्यधिक भीड़",
  services_offered: "उपलब्ध सेवाएं",
  nearest_booth_badge: "निकटतम स्वयंसेवक डेस्क",
  select_your_ghat: "अपना वर्तमान घाट चुनें:"
};

// 4. Add profile section
en.profile = {
  title: "Pilgrim Safety Profile",
  verified_pilgrim: "Verified Pushkaralu Pilgrim",
  user_id_label: "Unique Pilgrim ID",
  family_id_label: "Family Safety ID",
  place_label: "Hometown / District",
  language_label: "Primary Language",
  status_safe: "Safe with Family",
  status_separated: "Reported Separated / Lost",
  privacy_title: "DPDP Act Privacy Shield",
  privacy_desc: "Guardian phone number is strictly masked under Section 6 of DPDP Act 2023 to protect pilgrim privacy. You can request direct contact access.",
  request_contact_btn: "Request Guardian Contact Access",
  request_modal_title: "Request Guardian Contact Permission",
  requester_name: "Your Name / Volunteer ID",
  requester_booth: "Your Location / Volunteer Booth",
  requester_phone: "Your Contact Number (Optional)",
  send_request_btn: "Send Real-Time Permission Request",
  request_sent: "Permission Request Sent! Waiting for Guardian to Approve...",
  access_approved_banner: "Access Approved by Guardian!",
  call_guardian_now: "Call Guardian Directly",
  officer_override_btn: "Official Police Override (PIN)",
  officer_pin_prompt: "Enter 4-Digit Police Control Room PIN",
  officer_unlocked: "Emergency Access Granted via Control Room Override"
};

te.profile = {
  title: "యాత్రికుల రక్షా ప్రొఫైల్",
  verified_pilgrim: "ధ్రువీకరించబడిన పుష్కర యాత్రికుడు",
  user_id_label: "యూజర్ ఐడీ",
  family_id_label: "కుటుంబ రక్షా ఐడీ",
  place_label: "స్వగ్రామం / జిల్లా",
  language_label: "ప్రాథమిక భాష",
  status_safe: "కుటుంబంతో సురక్షితం",
  status_separated: "తప్పిపోయినట్లు నివేదించబడింది",
  privacy_title: "DPDP చట్టం రక్షా కవచం",
  privacy_desc: "DPDP చట్టం 2023 సెక్షన్ 6 ప్రకారం యాత్రికుల గోప్యత కొరకు సంరక్షకుని ఫోన్ నంబర్ దాచబడింది. మీరు అనుమతి కోరవచ్చు.",
  request_contact_btn: "సంరక్షకుని ఫోన్ అనుమతి కోరండి",
  request_modal_title: "సంరక్షకుని సంప్రదింపు అనుమతి",
  requester_name: "మీ పేరు / వాలంటీర్ ఐడీ",
  requester_booth: "మీ ప్రదేశం / వాలంటీర్ బూత్",
  requester_phone: "మీ ఫోన్ నంబర్ (ఐచ్ఛికం)",
  send_request_btn: "లైవ్ అనుమతి అభ్యర్థన పంపండి",
  request_sent: "అభ్యర్థన పంపబడింది! సంరక్షకుని అనుమతి కోసం వేచి చూస్తున్నాము...",
  access_approved_banner: "సంరక్షకుడు అనుమతి మంజూరు చేసారు!",
  call_guardian_now: "సంరక్షకుడికి నేరుగా కాల్ చేయండి",
  officer_override_btn: "అధికారిక పోలీస్ PIN అన్‌లాక్",
  officer_pin_prompt: "4-అంకెల పోలీస్ కంట్రోల్ రూమ్ PIN నమోదు చేయండి",
  officer_unlocked: "కంట్రోల్ రూమ్ ద్వారా అత్యవసర ప్రవేశం మంజూరైంది"
};

hi.profile = {
  title: "श्रद्धालु सुरक्षा प्रोफाइल",
  verified_pilgrim: "सत्यापित पुष्करालु तीर्थयात्री",
  user_id_label: "यूजर आईडी",
  family_id_label: "परिवार सुरक्षा आईडी",
  place_label: "मूल निवास / जिला",
  language_label: "प्राथमिक भाषा",
  status_safe: "परिवार के साथ सुरक्षित",
  status_separated: "बिछड़े होने की सूचना",
  privacy_title: "DPDP अधिनियम गोपनीयता ढाल",
  privacy_desc: "DPDP अधिनियम 2023 की धारा 6 के अनुसार सुरक्षा हेतु अभिभावक का फोन नंबर छिपा है। आप संपर्क अनुमति माँग सकते हैं।",
  request_contact_btn: "अभिभावक संपर्क अनुमति माँगें",
  request_modal_title: "अभिभावक संपर्क अनुमति अनुरोध",
  requester_name: "आपका नाम / स्वयंसेवक आईडी",
  requester_booth: "आपका स्थान / स्वयंसेवक बूथ",
  requester_phone: "आपका संपर्क नंबर (वैकल्पिक)",
  send_request_btn: "लाइव अनुमति अनुरोध भेजें",
  request_sent: "अनुरोध भेजा गया! अभिभावक की स्वीकृति की प्रतीक्षा है...",
  access_approved_banner: "अभिभावक द्वारा अनुमति स्वीकृत!",
  call_guardian_now: "अभिभावक को सीधे कॉल करें",
  officer_override_btn: "आधिकारिक पुलिस पिन अनलॉक",
  officer_pin_prompt: "4-अंकीय पुलिस कंट्रोल रूम पिन दर्ज करें",
  officer_unlocked: "कंट्रोल रूम द्वारा आपातकालीन पहुंच स्वीकृत"
};

// 5. Add heritage section
en.heritage = {
  culture_title: "Pushkaralu Sacred Heritage & Culture",
  culture_desc: "Discover the timeless heritage of Dakshina Ganga, the 5 sacred maha ghats, and ancient traditions of Rajamahendravaram.",
  story_title: "The Legend of Godavari & Sage Gautama",
  story_body: "Sage Gautama Maharshi, through severe penance on the Brahmagiri hills, brought the celestial river Godavari to sanctify South India. During Pushkaralu, all 33 crore divine energies reside in her sacred waves.",
  ghats_lore_title: "The 5 Sacred Maha Ghats of Rajamahendravaram",
  kotilingala_lore: "Kotilingala Ghat: Consecrated with 10 million Shiva Lingams by Sage Vyasa and King Janamejaya. The highest spiritual seat for Punya Snanam.",
  pushkar_lore: "Pushkar Ghat: The grand spiritual center where Brihaspati first entered the river. Site of the spellbinding evening Godavari Maha Harathi.",
  gowthami_lore: "Gowthami Ghat: Named after Maharshi Gautama, a sprawling spiritual haven for pilgrims, sadhus, and families.",
  saraswati_lore: "Saraswati Ghat: Dedicated to the Goddess of Learning and Fine Arts; students and artists take holy dips for divine wisdom.",
  markandeya_lore: "Markandeya Ghat: Ancient site where Sage Markandeya received the boon of eternal youth from Lord Shiva on the riverbank.",
  eco_pledge_title: "Eco-Pushkaralu: Sacred Nadi Swachhata Pledge",
  eco_pledge_body: "Mother Godavari gives life. We pledge: Zero plastic in holy waters, only natural earthen diyas, organic flower offerings, and pristine riverbanks.",
  play_harathi_audio: "Play Maha Harathi Aarti Chime",
  ring_bell: "Ring Sacred Temple Bell",
  sound_shankha: "Sound Sacred Shankha"
};

te.heritage = {
  culture_title: "పుష్కరాల పవిత్ర సంస్కృతి & వారసత్వం",
  culture_desc: "దక్షిణ గంగ దివ్య చరిత్ర, రాజమండ్రి 5 మహా ఘాట్లు మరియు ప్రాచీన సంప్రదాయాలను తెలుసుకోండి.",
  story_title: "గోదావరి ఆవిర్భావం & గౌతమ మహర్షి చరిత్ర",
  story_body: "గౌతమ మహర్షి బ్రహ్మగిరి కొండలపై చేసిన ఘోర తపస్సుతో దక్షిణ భారత దేశాన్ని పావనం చేయడానికి దివ్య గోదావరిని భూమికి రప్పించారు. పుష్కర సమయంలో సమస్త 33 కోట్ల దేవతా శక్తులు ఈ జలాల్లో కొలువై ఉంటాయి.",
  ghats_lore_title: "రాజమహేంద్రవరం 5 పవిత్ర మహా ఘాట్లు",
  kotilingala_lore: "కోటిలింగాల ఘాట్: వ్యాస మహర్షి మరియు జనమేజయ మహారాజుచే ప్రతిష్ఠించబడిన కోటి శివలింగాల క్షేత్రం.",
  pushkar_lore: "పుష్కర్ ఘాట్: బృహస్పతి తొలిసారి ప్రవేశించిన పవిత్ర స్థలం. సాయంత్రం గోదావరి మహా హారతి జరిగే దివ్య వేదిక.",
  gowthami_lore: "గౌతమి ఘాట్: గౌతమ మహర్షి పేరు మీద వెలసిన విశాలమైన, ప్రశాంతమైన కుటుంబ స్నాన ఘట్టం.",
  saraswati_lore: "సరస్వతి ఘాట్: జ్ఞాన సరస్వతి సన్నిధి; విద్యార్థులు మరియు కళాకారులు విశేషంగా పూజించే క్షేత్రం.",
  markandeya_lore: "మార్కండేయ ఘాట్: మార్కండేయుడు పరమశివుని అనుగ్రహంతో మృత్యుంజయుడై చిరంజీవిత్వం పొందిన పుణ్యభూమి.",
  eco_pledge_title: "ఈకో-పుష్కరాలు: పవిత్ర నదీ స్వచ్ఛత ప్రతిజ్ఞ",
  eco_pledge_body: "గోదావరి మాత మనకు జీవనాధారం. మన సంకల్పం: నదిలో సున్నా ప్లాస్టిక్, కేవలం మట్టి ప్రమిదలు, సహజ పూజా ద్రవ్యాలు మరియు పరిశుభ్రమైన ఘాట్లు.",
  play_harathi_audio: "గోదావరి మహా హారతి ఆడియో వినండి",
  ring_bell: "పవిత్ర దేవాలయ గంట మోగించండి",
  sound_shankha: "దివ్య శంఖారావం వినండి"
};

hi.heritage = {
  culture_title: "पुष्करालु पावन संस्कृति व विरासत",
  culture_desc: "दक्षिण गंगा का पावन इतिहास, राजमहेंद्रवरम के 5 महा घाट और प्राचीन आध्यात्मिक परंपराएं।",
  story_title: "गोदावरी अवतरण व महर्षि गौतम की कथा",
  story_body: "महर्षि गौतम ने ब्रह्मगिरि पर्वत पर घोर तपस्या कर दक्षिण भारत को पावन करने हेतु दिव्य गोदावरी का आह्वान किया। पुष्करालु महापर्व में समस्त 33 करोड़ देवी-देवताओं का वास इस पावन जल में होता है।",
  ghats_lore_title: "राजमहेंद्रवरम के 5 पावन महा घाट",
  kotilingala_lore: "कोटिलिंगाला घाट: महर्षि वेदव्यास और राजा जनमेजय द्वारा स्थापित एक करोड़ शिवलिंगों की पावन भूमि।",
  pushkar_lore: "पुष्कर घाट: गुरु बृहस्पति का सर्वप्रथम पावन प्रवेश स्थल और अलौकिक गोदावरी महा आरती का साक्षी।",
  gowthami_lore: "गौतमी घाट: महर्षि गौतम की पावन तपोभूमि, परिवारों और साधुओं हेतु अत्यंत शांत स्नान घाट।",
  saraswati_lore: "सरस्वती घाट: विद्यादायिनी माँ सरस्वती के सानिध्य में स्थित; छात्र व कलाकार ज्ञान हेतु स्नान करते हैं।",
  markandeya_lore: "मार्कंडेय घाट: भगवान शिव के अनुग्रह से महर्षि मार्कंडेय को अमरत्व प्रदान करने वाला पावन तीर्थ।",
  eco_pledge_title: "ईको-पुष्करालु: पावन नदी स्वच्छता संकल्प",
  eco_pledge_body: "गोदावरी मैया जीवनदायिनी हैं। हमारा संकल्प: नदी में शून्य प्लास्टिक, केवल मिट्टी के दीप, प्राकृतिक पुष्प और स्वच्छ घाट।",
  play_harathi_audio: "गोदावरी महा आरती की ध्वनि सुनें",
  ring_bell: "पवित्र मंदिर की घंटी बजाएं",
  sound_shankha: "दिव्य शंखनाद सुनें"
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
fs.writeFileSync(tePath, JSON.stringify(te, null, 2) + '\n', 'utf8');
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2) + '\n', 'utf8');

console.log('✅ Locales updated successfully!');
