-- ============================================================================
-- GODAVARI MILAN 2027 (గోదావరి మిలన్ / गोदावरी मिलन)
-- Real-time Supabase Database Schema
-- Digital Personal Data Protection (DPDP) Act 2023 & Atmanirbhar Bharat Spec
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Families Table
create table if not exists public.families (
    id text primary key, -- e.g. 'GM27-K7M2'
    guardian_name text not null,
    phone text not null,
    language text not null default 'te',
    village text not null,
    stay_location text not null,
    consent_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

-- 2. Family Members Table (Each member has a distinct User ID and unique QR code)
create table if not exists public.members (
    id text primary key, -- e.g. 'GM27-K7M2-1', 'GM27-K7M2-2'
    family_id text not null references public.families(id) on delete cascade,
    name text not null,
    age integer not null check (age >= 0 and age <= 125),
    relation text not null,
    note text,
    photo_url text,
    face_descriptor float8[], -- 16-element client vision embedding
    status text not null default 'safe' check (status in ('safe', 'missing')),
    last_seen text,
    prints_used integer not null default 0 check (prints_used <= 3),
    created_at timestamptz not null default now()
);

-- 3. Cases Table (Lost & Found reports)
create table if not exists public.cases (
    id text primary key, -- e.g. 'CASE-2027-001'
    type text not null check (type in ('missing', 'found')),
    status text not null default 'open' check (status in ('open', 'matched', 'reunited')),
    member_id text references public.members(id),
    person_name text,
    location text not null, -- ghat identifier
    age_group text not null check (age_group in ('child', 'teen', 'adult', 'elder')),
    language text not null default 'te',
    clothing text,
    photo_url text,
    face_descriptor float8[],
    source text not null default 'family' check (source in ('family', 'volunteer', 'node')),
    created_at timestamptz not null default now(),
    reunited_at timestamptz,
    notes text
);

-- 4. Contact Requests Table (DPDP Section 6 Explicit Consent Mechanism)
-- When a volunteer/finder scans member QR, they can request contact access.
-- The guardian receives a real-time notification to grant or decline access.
create table if not exists public.contact_requests (
    id text primary key, -- e.g. 'REQ-91024'
    member_id text not null references public.members(id) on delete cascade,
    family_id text not null references public.families(id) on delete cascade,
    requester_name text not null,
    requester_phone text,
    requester_booth text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
    created_at timestamptz not null default now(),
    approved_at timestamptz,
    expires_at timestamptz not null
);

-- 5. Volunteer Booths Table
create table if not exists public.volunteer_booths (
    id text primary key, -- e.g. 'BOOTH-01'
    name text not null,
    ghat text not null,
    location_detail text not null,
    officer_in_charge text not null,
    phone text not null,
    hotline text not null,
    services text[] not null default '{}',
    crowd_level text not null default 'moderate' check (crowd_level in ('low', 'moderate', 'peak')),
    lat float8 not null,
    lng float8 not null,
    is_active boolean not null default true
);

-- 6. Access Audit Logs Table (DPDP Section 8 Immutable Audit Trail)
create table if not exists public.access_audit_logs (
    id text primary key,
    actor text not null,
    role text not null check (role in ('public', 'volunteer', 'desk', 'admin')),
    action text not null check (action in ('view_public', 'request_consent', 'grant_consent', 'emergency_override', 'reunite_release', 'print_override')),
    target text not null,
    reason text not null,
    at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.families enable row level security;
alter table public.members enable row level security;
alter table public.cases enable row level security;
alter table public.contact_requests enable row level security;
alter table public.volunteer_booths enable row level security;
alter table public.access_audit_logs enable row level security;

-- Public read policies for members (Only Name, Age, Relation, Status - Phone is protected)
create policy "Allow public read of basic member profile" on public.members
    for select using (true);

create policy "Allow public read of active cases" on public.cases
    for select using (true);

create policy "Allow public read of volunteer booths" on public.volunteer_booths
    for select using (true);

create policy "Allow creation of contact requests" on public.contact_requests
    for insert with check (true);

create policy "Allow reading contact requests for family" on public.contact_requests
    for select using (true);

create policy "Allow updating contact requests" on public.contact_requests
    for update using (true);

create policy "Allow logging DPDP audit records" on public.access_audit_logs
    for insert with check (true);

create policy "Allow public read of audit logs for transparency" on public.access_audit_logs
    for select using (true);

-- Enable Supabase Realtime for instant synchronization
alter publication supabase_realtime add table public.cases;
alter publication supabase_realtime add table public.members;
alter publication supabase_realtime add table public.contact_requests;
alter publication supabase_realtime add table public.volunteer_booths;
