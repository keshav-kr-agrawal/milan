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
  action: 'view_public' | 'request_consent' | 'emergency_override' | 'reunite_release' | 'print_override';
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
  access_log!: Table<AccessLog, string>;
  prints!: Table<PrintLog, string>;
  helpdesks!: Table<HelpDesk, string>;

  constructor() {
    super('GodavariMilanDB');
    this.version(1).stores({
      families: 'id, phone, language',
      members: 'id, family_id, status',
      cases: 'id, type, status, member_id, location, age_group, queued_offline',
      matches: 'id, case_a, case_b_or_member',
      consent_requests: 'id, member_id, status',
      access_log: 'id, actor, role, at',
      prints: 'id, member_id, by, at',
      helpdesks: 'id, ghat',
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
    db.consent_requests, db.access_log, db.prints, db.helpdesks
  ], async () => {
    // Clear all
    await db.families.clear();
    await db.members.clear();
    await db.cases.clear();
    await db.matches.clear();
    await db.consent_requests.clear();
    await db.access_log.clear();
    await db.prints.clear();
    await db.helpdesks.clear();

    // 1. Help Desks across Rajamahendravaram Ghats
    const desks: HelpDesk[] = [
      { id: 'DESK-01', name: 'Pushkar Ghat Central Desk', ghat: 'pushkar', lat: 17.0012, lng: 81.7781, officer_in_charge: 'Insp. K. Ramanayya', phone: '112-EXT-01' },
      { id: 'DESK-02', name: 'Kotilingala Ghat North Desk', ghat: 'kotilingala', lat: 17.0045, lng: 81.7762, officer_in_charge: 'SI P. Venkatesh', phone: '112-EXT-02' },
      { id: 'DESK-03', name: 'Gowthami Ghat Sector Desk', ghat: 'gowthami', lat: 16.9984, lng: 81.7815, officer_in_charge: 'SI M. Sunitha', phone: '112-EXT-03' },
      { id: 'DESK-04', name: 'Saraswati Ghat West Desk', ghat: 'saraswati', lat: 17.0078, lng: 81.7741, officer_in_charge: 'HC T. Satyanarayana', phone: '112-EXT-04' },
      { id: 'DESK-05', name: 'Markandeya Ghat Safety Post', ghat: 'markandeya', lat: 16.9950, lng: 81.7840, officer_in_charge: 'SI D. Nageswara Rao', phone: '112-EXT-05' },
    ];
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
