import Dexie, { type Table } from 'dexie';

export interface Family {
  id: string; // e.g. "GM27-K7M2"
  guardian_name: string;
  phone: string;
  language: string;
  village: string;
  stay_location: string;
  consent_at: string;
  created_at: string;
}

export interface Member {
  id: string; // e.g. "GM27-K7M2-1"
  family_id: string;
  name: string;
  age: number;
  relation: string;
  note?: string;
  photo_url?: string;
  face_descriptor?: number[]; // Local 16-element embedding vector
  status: 'safe' | 'missing';
  last_seen?: string;
  prints_used: number; // Max 3 per member for family
}

export interface Case {
  id: string; // e.g. "CASE-2027-0101"
  type: 'missing' | 'found';
  status: 'open' | 'matched' | 'reunited';
  member_id?: string;
  person_name?: string;
  location: string;
  age_group: 'child' | 'teen' | 'adult' | 'elder';
  language: string;
  clothing: string;
  photo_url?: string;
  face_descriptor?: number[];
  source: 'family' | 'volunteer' | 'node';
  created_at: string;
  reunited_at?: string;
  queued_offline: boolean;
  notes?: string;
}

export interface Match {
  id: string;
  case_a: string;
  case_b_or_member: string;
  distance: number; // 0 to 1, lower means higher similarity
  confidence: 'strong' | 'possible';
  confirmed_by?: string;
  confirmed_at?: string;
}

export interface ConsentRequest {
  id: string;
  member_id: string;
  requester_hash: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  created_at: string;
  expires_at: string;
}

export interface AccessLog {
  id: string;
  actor: string;
  role: 'public' | 'desk' | 'admin';
  action: 'view_public' | 'request_consent' | 'grant_consent' | 'emergency_override' | 'reunite_release' | 'print_override';
  target: string;
  reason: string;
  at: string;
}

export interface PrintLog {
  id: string;
  member_id: string;
  kind: 'band' | 'card';
  by: string; // 'family' | officer name
  at: string;
}

export interface ContactRequest {
  id: string; // e.g. "REQ-93821"
  member_id: string;
  family_id: string;
  requester_name: string;
  requester_phone?: string;
  requester_booth?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  expires_at: string;
}

export interface VolunteerBooth {
  id: string; // e.g. "BOOTH-01"
  name: string;
  name_tel: string;
  name_hi: string;
  ghat: string;
  location_detail: string;
  location_detail_tel: string;
  location_detail_hi: string;
  officer_in_charge: string;
  phone: string;
  hotline: string;
  services: string[];
  crowd_level: 'low' | 'moderate' | 'peak';
  lat: number;
  lng: number;
  is_active: boolean;
}

export interface HelpDesk {
  id: string;
  name: string;
  ghat: string;
  lat: number;
  lng: number;
  officer_in_charge: string;
  phone: string;
}

export class MilanDatabase extends Dexie {
  families!: Table<Family, string>;
  members!: Table<Member, string>;
  cases!: Table<Case, string>;
  matches!: Table<Match, string>;
  consent_requests!: Table<ConsentRequest, string>;
  contact_requests!: Table<ContactRequest, string>;
  access_log!: Table<AccessLog, string>;
  prints!: Table<PrintLog, string>;
  helpdesks!: Table<HelpDesk, string>;
  volunteer_booths!: Table<VolunteerBooth, string>;

  constructor() {
    super('GodavariMilanDB');
    this.version(2).stores({
      families: 'id, phone, language',
      members: 'id, family_id, status',
      cases: 'id, type, status, member_id, location, age_group, queued_offline',
      matches: 'id, case_a, case_b_or_member',
      consent_requests: 'id, member_id, status',
      contact_requests: 'id, member_id, family_id, status',
      access_log: 'id, actor, role, at',
      prints: 'id, member_id, by, at',
      helpdesks: 'id, ghat',
      volunteer_booths: 'id, ghat, crowd_level',
    });
  }
}

export const db = new MilanDatabase();

// --- Seed Data & Demo Reset ---
export async function seedInitialData() {
  const familyCount = await db.families.count();
  if (familyCount > 0) return; // Already seeded

  await populateFreshSeedData();
}

export async function populateFreshSeedData() {
  await db.transaction('rw', [
    db.families, db.members, db.cases, db.matches,
    db.consent_requests, db.contact_requests, db.access_log, db.prints, db.helpdesks, db.volunteer_booths
  ], async () => {
    // Clear all
    await db.families.clear();
    await db.members.clear();
    await db.cases.clear();
    await db.matches.clear();
    await db.consent_requests.clear();
    await db.contact_requests.clear();
    await db.access_log.clear();
    await db.prints.clear();
    await db.helpdesks.clear();
    await db.volunteer_booths.clear();

    // 1. Volunteer Booths across Rajamahendravaram Ghats & Transit Hubs
    const booths: VolunteerBooth[] = [
      {
        id: 'BOOTH-01',
        name: 'Pushkar Ghat Central Control & Safety Booth',
        name_tel: 'పుష్కర్ ఘాట్ ప్రధాన కంట్రోల్ & భద్రతా బూత్',
        name_hi: 'पुष्कर घाट मुख्य नियंत्रण एवं सुरक्षा बूथ',
        ghat: 'pushkar',
        location_detail: 'Main Riverbank Promenade, Near Grand Harathi Brass Stage',
        location_detail_tel: 'ప్రధాన నదీ తీర వేదిక, మహా హారతి ఇత్తడి వేదిక సమీపంలో',
        location_detail_hi: 'मुख्य नदी तट, महा आरती पीतल मंच के समीप',
        officer_in_charge: 'Insp. K. Ramanayya (AP Police)',
        phone: '+91 883 244 1101',
        hotline: '112-EXT-01',
        services: ['Child Wristband Printing', 'Rapid Reunification Desk', 'First Aid Station', 'Free Drinking Water', 'Wheelchair Support'],
        crowd_level: 'peak',
        lat: 17.0012,
        lng: 81.7781,
        is_active: true,
      },
      {
        id: 'BOOTH-02',
        name: 'Kotilingala North Pilgrim Assistance Post',
        name_tel: 'కోటిలింగాల ఉత్తర యాత్రికుల సహాయ కేంద్రం',
        name_hi: 'कोटिलिंगाला उत्तर तीर्थयात्री सहायता पोस्ट',
        ghat: 'kotilingala',
        location_detail: 'Kotilingeshwara Temple Steps, Barricade Sector 3',
        location_detail_tel: 'కోటిలింగేశ్వర ఆలయ మెట్లు, బారికేడ్ సెక్టార్ 3',
        location_detail_hi: 'कोटिलिंगेश्वर मंदिर सीढ़ियाँ, बैरिकेड सेक्टर 3',
        officer_in_charge: 'SI P. Venkatesh (Rajahmundry Urban)',
        phone: '+91 883 244 1102',
        hotline: '112-EXT-02',
        services: ['QR Hand Band Tagging', 'Missing Person Intake', 'River Safety Life Jackets', 'Elderly Assistance'],
        crowd_level: 'peak',
        lat: 17.0045,
        lng: 81.7762,
        is_active: true,
      },
      {
        id: 'BOOTH-03',
        name: 'Gowthami Ghat Family Care & Milk Booth',
        name_tel: 'గౌతమి ఘాట్ కుటుంబ రక్షణ & పసిపిల్లల పాల కేంద్రం',
        name_hi: 'गौतमी घाट परिवार सेवा एवं बाल दुग्ध केंद्र',
        ghat: 'gowthami',
        location_detail: 'ISKON Temple Riverfront Park Entrance',
        location_detail_tel: 'ఇస్కాన్ ఆలయ నదీ ఉద్యానవన ప్రవేశ ద్వారం',
        location_detail_hi: 'इस्कॉन मंदिर रिवरफ्रंट पार्क मुख्य द्वार',
        officer_in_charge: 'SI M. Sunitha (Women Protection Cell)',
        phone: '+91 883 244 1103',
        hotline: '112-EXT-03',
        services: ['Toddler Milk & Feeding Shed', 'Child QR Wristbands', 'Family Resting Camp', 'Lost & Found Coordination'],
        crowd_level: 'moderate',
        lat: 16.9984,
        lng: 81.7815,
        is_active: true,
      },
      {
        id: 'BOOTH-04',
        name: 'Saraswati Ghat Youth Volunteer Hub',
        name_tel: 'సరస్వతి ఘాట్ యువ స్వచ్ఛంద సేవకుల కేంద్రం',
        name_hi: 'सरस्वती घाट युवा स्वयंसेवक केंद्र',
        ghat: 'saraswati',
        location_detail: 'Saraswati Temple Complex & Ghat Bathing Terrace',
        location_detail_tel: 'సరస్వతి ఆలయ ప్రాంగణం & ఘాట్ స్నాన ఘట్టం',
        location_detail_hi: 'सरस्वती मंदिर प्रांगण एवं स्नान घाट',
        officer_in_charge: 'HC T. Satyanarayana (NSS/NCC Lead)',
        phone: '+91 883 244 1104',
        hotline: '112-EXT-04',
        services: ['Multilingual Translation', 'Lost Belongings Counter', 'Senior Citizen Escort', 'Emergency Battery Bank'],
        crowd_level: 'low',
        lat: 17.0078,
        lng: 81.7741,
        is_active: true,
      },
      {
        id: 'BOOTH-05',
        name: 'Markandeya Ghat Rapid Reunion Post',
        name_tel: 'మార్కండేయ ఘాట్ శీఘ్ర పునఃకలయిక కేంద్రం',
        name_hi: 'मार्कंडेय घाट त्वरित पुनर्मिलन केंद्र',
        ghat: 'markandeya',
        location_detail: 'Near Markandeya Swamy Temple Arch & Boat Jetty',
        location_detail_tel: 'మార్కండేయ స్వామి ఆలయ తోరణం & పడవల జెట్టీ సమీపంలో',
        location_detail_hi: 'मार्कंडेय स्वामी मंदिर कमान एवं बोट जेटी के समीप',
        officer_in_charge: 'SI D. Nageswara Rao',
        phone: '+91 883 244 1105',
        hotline: '112-EXT-05',
        services: ['Rapid Face Match Terminal', 'Public Address Announcements', 'Paramedic Medical Bed', 'Instant Family Calling'],
        crowd_level: 'moderate',
        lat: 16.9950,
        lng: 81.7840,
        is_active: true,
      },
      {
        id: 'BOOTH-06',
        name: 'Rajahmundry Railway Station Pilgrim Welcome Post',
        name_tel: 'రాజమండ్రి రైల్వే స్టేషన్ యాత్రికుల స్వాగత బూత్',
        name_hi: 'राजमंड्री रेलवे स्टेशन तीर्थयात्री स्वागत केंद्र',
        ghat: 'station',
        location_detail: 'Platform 1 Main Exit Concourse, East Gate',
        location_detail_tel: 'ప్లాట్‌ఫారమ్ 1 ప్రధాన నిష్క్రమణ మార్గం, తూర్పు ద్వారం',
        location_detail_hi: 'प्लेटफॉर्म 1 मुख्य निकास द्वार, पूर्वी गेट',
        officer_in_charge: 'ASI Ch. Apparao (Railway Police)',
        phone: '+91 883 244 1106',
        hotline: '112-EXT-06',
        services: ['Immediate Arrival Wristband Tagging', 'Free Ghat Shuttle Route Map', 'Wheelchair Support', 'Helpdesk in 5 Languages'],
        crowd_level: 'peak',
        lat: 17.0040,
        lng: 81.7890,
        is_active: true,
      },
      {
        id: 'BOOTH-07',
        name: 'RTC Central Bus Stand Transit Safety Post',
        name_tel: 'ఆర్టీసీ సెంట్రల్ బస్ స్టాండ్ రవాణా భద్రతా బూత్',
        name_hi: 'आरटीसी सेंट्रल बस स्टैंड पारगमन सुरक्षा केंद्र',
        ghat: 'bus_stand',
        location_detail: 'Bay 3 Inter-District Arrival Platform',
        location_detail_tel: 'బే 3 జిల్లాల బస్సుల రాక ప్లాట్‌ఫారమ్',
        location_detail_hi: 'बे 3 अंतर-जिला बस आगमन प्लेटफॉर्म',
        officer_in_charge: 'Volunteer Lead K. Lakshmi (Red Cross)',
        phone: '+91 883 244 1107',
        hotline: '112-EXT-07',
        services: ['Arrival Registration', 'Child Protection Bands', 'Luggage Tagging', 'Lost Child Holding Room'],
        crowd_level: 'moderate',
        lat: 16.9920,
        lng: 81.7880,
        is_active: true,
      },
    ];
    await db.volunteer_booths.bulkAdd(booths);

    // Help Desks across Ghats
    const desks: HelpDesk[] = booths.slice(0, 5).map(b => ({
      id: b.id,
      name: b.name,
      ghat: b.ghat,
      lat: b.lat,
      lng: b.lng,
      officer_in_charge: b.officer_in_charge,
      phone: b.phone,
    }));
    await db.helpdesks.bulkAdd(desks);

    // 2. Family 1: GM27-K7M2 (Telugu family from West Godavari)
    const f1: Family = {
      id: 'GM27-K7M2',
      guardian_name: 'Anjaneyulu Rao',
      phone: '+919848023456',
      language: 'te',
      village: 'Narsapur, West Godavari',
      stay_location: 'Kotilingala Ghat pilgrim camp tent #42',
      consent_at: '2027-06-27T08:15:00.000Z',
      created_at: '2027-06-27T08:15:00.000Z',
    };
    await db.families.add(f1);

    const m1_1: Member = {
      id: 'GM27-K7M2-1',
      family_id: 'GM27-K7M2',
      name: 'Sai Krishna Rao',
      age: 7,
      relation: 'Son',
      note: 'Speaks Telugu. Responds to pet name Chinnu. Has mild allergy.',
      status: 'missing',
      last_seen: 'Kotilingala Ghat steps around 10:30 AM',
      prints_used: 1,
      // Sample normalized 16-element feature vector
      face_descriptor: [0.15, 0.22, 0.65, 0.11, 0.45, 0.82, 0.19, 0.33, 0.58, 0.74, 0.12, 0.38, 0.49, 0.63, 0.28, 0.51],
    };

    const m1_2: Member = {
      id: 'GM27-K7M2-2',
      family_id: 'GM27-K7M2',
      name: 'Lakshmi Kameswari',
      age: 64,
      relation: 'Mother',
      note: 'Walks with wooden stick, diabetic.',
      status: 'safe',
      prints_used: 1,
    };
    await db.members.bulkAdd([m1_1, m1_2]);

    // Active Missing Case for Sai Krishna
    const caseMissing1: Case = {
      id: 'CASE-2027-001',
      type: 'missing',
      status: 'open',
      member_id: 'GM27-K7M2-1',
      person_name: 'Sai Krishna Rao',
      location: 'kotilingala',
      age_group: 'child',
      language: 'te',
      clothing: 'Bright yellow cotton kurta with navy blue shorts',
      notes: 'Separated near flower stalls during crowd surge towards river steps.',
      source: 'family',
      created_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 mins ago
      queued_offline: false,
      face_descriptor: [0.15, 0.22, 0.65, 0.11, 0.45, 0.82, 0.19, 0.33, 0.58, 0.74, 0.12, 0.38, 0.49, 0.63, 0.28, 0.51],
    };
    await db.cases.add(caseMissing1);

    // 3. Family 2: GM27-P4X9 (Odia family visiting Pushkaralu)
    const f2: Family = {
      id: 'GM27-P4X9',
      guardian_name: 'Biswanath Patra',
      phone: '+919437012890',
      language: 'hi',
      village: 'Berhampur, Ganjam, Odisha',
      stay_location: 'Gowthami Ghat Community Hall',
      consent_at: '2027-06-27T09:00:00.000Z',
      created_at: '2027-06-27T09:00:00.000Z',
    };
    await db.families.add(f2);

    const m2_1: Member = {
      id: 'GM27-P4X9-1',
      family_id: 'GM27-P4X9',
      name: 'Subhadra Patra',
      age: 68,
      relation: 'Mother',
      note: 'Speaks only Odia, understands broken Hindi. Mild hearing difficulty.',
      status: 'safe',
      prints_used: 1,
      face_descriptor: [0.72, 0.54, 0.18, 0.89, 0.23, 0.41, 0.67, 0.35, 0.81, 0.19, 0.48, 0.92, 0.14, 0.33, 0.77, 0.61],
    };
    await db.members.add(m2_1);

    // 4. Open Found Case 1: Young child found by volunteer at Pushkar Ghat
    const caseFound1: Case = {
      id: 'CASE-2027-002',
      type: 'found',
      status: 'open',
      person_name: 'Chinnu (Says his name)',
      location: 'pushkar',
      age_group: 'child',
      language: 'te',
      clothing: 'Yellow shirt and blue trousers, holding toy brass bell',
      notes: 'Found crying near Pushkar Ghat barricade 4. Volunteer brought to Desk 01.',
      source: 'volunteer',
      created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14 mins ago
      queued_offline: false,
      // Very close feature vector to Sai Krishna (distance < 0.2)
      face_descriptor: [0.16, 0.23, 0.63, 0.12, 0.44, 0.80, 0.20, 0.34, 0.57, 0.73, 0.13, 0.37, 0.50, 0.62, 0.29, 0.50],
    };

    // 5. Open Found Case 2: Elder grandmother found at Saraswati Ghat
    const caseFound2: Case = {
      id: 'CASE-2027-003',
      type: 'found',
      status: 'open',
      person_name: 'Unknown Elder Amma',
      location: 'saraswati',
      age_group: 'elder',
      language: 'hi',
      clothing: 'Green Sambalpuri handloom cotton saree, red bindi',
      notes: 'Sitting peacefully under banyan tree. Speaks Odia. Guided to Saraswati help desk.',
      source: 'volunteer',
      created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      queued_offline: false,
      face_descriptor: [0.70, 0.53, 0.20, 0.87, 0.25, 0.40, 0.66, 0.36, 0.80, 0.21, 0.47, 0.90, 0.15, 0.34, 0.76, 0.60],
    };
    await db.cases.bulkAdd([caseFound1, caseFound2]);

    // 6. Pre-computed match candidate for Sai Krishna & Found Boy
    const match1: Match = {
      id: 'MATCH-001',
      case_a: 'CASE-2027-001',
      case_b_or_member: 'CASE-2027-002',
      distance: 0.08,
      confidence: 'strong',
    };
    await db.matches.add(match1);

    // 7. Completed Reunited Case: Case Reunited in 18 minutes!
    const caseReunited: Case = {
      id: 'CASE-2027-000',
      type: 'missing',
      status: 'reunited',
      person_name: 'Tarun Varma',
      location: 'markandeya',
      age_group: 'teen',
      language: 'te',
      clothing: 'White kurta and saffron scarf',
      source: 'family',
      created_at: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      reunited_at: new Date(Date.now() - 162 * 60 * 1000).toISOString(),
      queued_offline: false,
    };
    await db.cases.add(caseReunited);

    // 8. Access Audit Logs
    const initialLogs: AccessLog[] = [
      {
        id: 'LOG-1001',
        actor: 'Insp. K. Ramanayya (PIN 2027)',
        role: 'desk',
        action: 'emergency_override',
        target: 'GM27-K7M2-1',
        reason: 'Missing child reported at Kotilingala Ghat. Verified against volunteer intake.',
        at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      },
      {
        id: 'LOG-1002',
        actor: 'SI D. Nageswara Rao (PIN 2027)',
        role: 'desk',
        action: 'reunite_release',
        target: 'CASE-2027-000',
        reason: 'Parent Aadhaar verified. Family confirmed matching mark. Handed over safely.',
        at: new Date(Date.now() - 162 * 60 * 1000).toISOString(),
      },
      {
        id: 'LOG-1003',
        actor: 'Volunteer App (IP 192.168.4.15)',
        role: 'public',
        action: 'view_public',
        target: 'GM27-K7M2-1',
        reason: 'Public QR scan. Displayed masked profile and helpline contact button.',
        at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      }
    ];
    await db.access_log.bulkAdd(initialLogs);
  });
}
