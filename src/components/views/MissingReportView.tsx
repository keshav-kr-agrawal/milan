import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import confetti from 'canvas-confetti';
import { db, type Case, type Member } from '../../data/db';
import { ClientFaceMatcher } from '../../services/adapters';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
  TempleToranam,
} from '../motifs/CulturalMotifs';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Send,
  Navigation,
  FileCheck,
  PhoneCall,
  Search,
  Share2,
} from 'lucide-react';

interface MissingReportViewProps {
  initialMemberId?: string;
  onNavigateToLookup: () => void;
}

export const MissingReportView: React.FC<MissingReportViewProps> = ({ initialMemberId, onNavigateToLookup }) => {
  const { t } = useTranslation();

  // All registered members to pick from
  const allMembers = useLiveQuery(() => db.members.toArray(), [], []);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialMemberId || '');
  const [lastSeenPlace, setLastSeenPlace] = useState('kotilingala');
  const [lastSeenTime, setLastSeenTime] = useState(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });
  const [clothing, setClothing] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Active missing cases
  const missingCases = useLiveQuery(
    () => db.cases.where('type').equals('missing').reverse().sortBy('created_at'),
    [],
    []
  );

  useEffect(() => {
    if (initialMemberId) {
      setSelectedMemberId(initialMemberId);
    } else if (allMembers.length > 0 && !selectedMemberId) {
      setSelectedMemberId(allMembers[0].id);
    }
  }, [initialMemberId, allMembers]);

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setLocationStatus('GPS not supported');
      return;
    }
    setLocationStatus('Acquiring Ghat GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (Rajamahendravaram)`);
      },
      () => {
        setLocationStatus('GPS permission denied. Using selected Ghat.');
      }
    );
  };

  const handleSubmitMissingCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setIsSubmitting(true);
    const member = await db.members.get(selectedMemberId);
    const family = member ? await db.families.get(member.family_id) : undefined;

    const caseId = 'CASE-2027-' + Math.floor(100 + Math.random() * 900);

    const newCase: Case = {
      id: caseId,
      type: 'missing',
      status: 'open',
      member_id: selectedMemberId,
      person_name: member?.name || 'Separated Member',
      location: lastSeenPlace,
      age_group: (member?.age || 10) < 13 ? 'child' : (member?.age || 10) > 60 ? 'elder' : 'adult',
      language: family?.language || 'te',
      clothing: clothing.trim() || 'Traditional pilgrim attire',
      notes: notes.trim() + (locationStatus ? ` [${locationStatus}]` : ''),
      source: 'family',
      created_at: new Date().toISOString(),
      queued_offline: !navigator.onLine,
      face_descriptor: member?.face_descriptor,
    };

    await db.cases.add(newCase);
    await db.members.update(selectedMemberId, { status: 'missing', last_seen: `${lastSeenPlace} at ${lastSeenTime}` });

    // Automatic Client-Side match lookup against found cases
    if (member?.face_descriptor) {
      const openFoundCases = await db.cases.where('type').equals('found').and((c) => c.status === 'open').toArray();
      for (const fc of openFoundCases) {
        if (fc.face_descriptor) {
          const dist = ClientFaceMatcher.calculateDistance(member.face_descriptor, fc.face_descriptor);
          const conf = ClientFaceMatcher.getConfidence(dist);
          if (conf !== 'none') {
            await db.matches.add({
              id: 'MATCH-' + Date.now(),
              case_a: caseId,
              case_b_or_member: fc.id,
              distance: dist,
              confidence: conf,
            });
          }
        }
      }
    }

    setIsSubmitting(false);
  };

  const handleMarkSafe = async (caseItem: Case) => {
    const elapsedMinutes = Math.round((Date.now() - new Date(caseItem.created_at).getTime()) / 60000);
    await db.cases.update(caseItem.id, {
      status: 'reunited',
      reunited_at: new Date().toISOString(),
    });

    if (caseItem.member_id) {
      await db.members.update(caseItem.member_id, { status: 'safe' });
    }

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#C8691A', '#D9A21B', '#3F6B3A', '#1F6F78'],
    });

    alert(`వ్యక్తి క్షేమంగా దొరికారు! / व्यक्ति सुरक्षित मिल गए! / Reunited safely in ${elapsedMinutes} mins!`);
  };

  const handleShareCaseWhatsApp = (caseItem: Case) => {
    const msg = encodeURIComponent(
      `🚨 *గోదావరి పుష్కరాలు 2027 తప్పిపోయిన వారి అలర్ట్ / گمشدہ الرٹ*\n` +
      `పేరు / Name: *${caseItem.person_name}*\n` +
      `కేసు కోడ్ / Case ID: *${caseItem.id}*\n` +
      `చివరిగా చూసిన ప్రదేశం / Last seen: *${caseItem.location} Ghat*\n` +
      `ధరించిన దుస్తులు / Clothing: *${caseItem.clothing}*\n` +
      `గమనించినవారు వెంటనే సమీప పోలీస్ / సహాయ కేంద్రానికి తెలియజేయండి.\n` +
      `📞 Emergency Hotline: 112 / 1098`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Top Header with Clean Single-Language Heading */}
      <div className="pb-4 border-b border-chandan-border">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-kumkum flex items-center gap-2">
          <AlertTriangle size={28} />
          <span>{t('missing_report.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-1">
          {t('missing_report.desc')}
        </p>
      </div>

      {/* 3-Tap Quick Missing Report Form */}
      <form onSubmit={handleSubmitMissingCase} className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-kumkum shadow-urgent space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold text-kumkum bg-kumkum-light px-3 py-2 rounded-xl border border-kumkum/30">
          <Clock size={16} />
          <span>{t('missing_report.instant_broadcast_badge')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Member Selector */}
          <div>
            <label className="block text-xs font-bold text-neel mb-1">
              {t('missing_report.select_member_label')} *
            </label>
            <select
              required
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm font-semibold text-neel bg-white focus:border-kumkum"
            >
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.relation}, {m.age} {t('family.years_old')}) - {m.id}
                </option>
              ))}
            </select>
          </div>

          {/* Last Seen Ghat */}
          <div>
            <label className="block text-xs font-bold text-neel mb-1">
              {t('missing_report.last_seen_place')} *
            </label>
            <select
              value={lastSeenPlace}
              onChange={(e) => setLastSeenPlace(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm font-semibold text-neel bg-white focus:border-kumkum"
            >
              <option value="kotilingala">{t('common.ghats.kotilingala')}</option>
              <option value="pushkar">{t('common.ghats.pushkar')}</option>
              <option value="gowthami">{t('common.ghats.gowthami')}</option>
              <option value="saraswati">{t('common.ghats.saraswati')}</option>
              <option value="markandeya">{t('common.ghats.markandeya')}</option>
              <option value="padmavathi">{t('common.ghats.padmavathi')}</option>
              <option value="subramanya">{t('common.ghats.subramanya')}</option>
            </select>
          </div>

          {/* Time & GPS */}
          <div>
            <label className="block text-xs font-bold text-neel mb-1">
              {t('missing_report.last_seen_time')}
            </label>
            <input
              type="time"
              value={lastSeenTime}
              onChange={(e) => setLastSeenTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-chandan-border text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neel mb-1">
              {t('missing_report.gps_coordinates')}
            </label>
            <button
              type="button"
              onClick={handleGetGps}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-chandan-card hover:bg-chandan border border-chandan-border text-xs font-semibold text-neel"
            >
              <Navigation size={14} className="text-kesari" />
              <span>{locationStatus || t('missing_report.detect_gps')}</span>
            </button>
          </div>
        </div>

        {/* Clothing Description */}
        <div>
          <label className="block text-xs font-bold text-neel mb-1">
            {t('missing_report.clothing')} *
          </label>
          <input
            type="text"
            required
            placeholder={t('missing_report.clothing_placeholder')}
            value={clothing}
            onChange={(e) => setClothing(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm bg-white focus:border-kumkum"
          />
        </div>

        {/* Additional notes */}
        <div>
          <label className="block text-xs font-bold text-neel mb-1">
            {t('missing_report.additional_notes')}
          </label>
          <textarea
            rows={2}
            placeholder={t('missing_report.notes_placeholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-chandan-border text-sm bg-white focus:border-kumkum"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-kumkum hover:bg-red-700 text-white font-bold text-base shadow-urgent transition-colors flex items-center justify-center gap-2"
        >
          <Send size={18} />
          <span>
            {isSubmitting ? t('missing_report.submitting') : t('missing_report.submit_alert')}
          </span>
        </button>
      </form>

      {/* Live Case Timelines Section with WhatsApp Sharing */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-neel flex items-center gap-2">
          <Clock size={22} className="text-kesari" />
          <span>{t('missing_report.active_missing_cases')}</span>
        </h2>

        {missingCases.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-chandan-border text-ink-muted text-sm">
            ప్రస్తుతం ఎటువంటి మిస్సింగ్ కేసులు లేవు. కుటుంబ సభ్యులందరూ క్షేమంగా ఉన్నారు.
            <br />
            No active missing cases. All registered family members are safe.
          </div>
        ) : (
          missingCases.map((caseItem) => {
            const isReunited = caseItem.status === 'reunited';
            const elapsedMins = Math.round((Date.now() - new Date(caseItem.created_at).getTime()) / 60000);

            return (
              <div
                key={caseItem.id}
                className={`bg-white rounded-2xl p-6 border-2 shadow-sutra space-y-4 ${
                  isReunited ? 'border-tulsi bg-tulsi-light/10' : 'border-kumkum'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-chandan-border gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-lg text-neel">
                        {caseItem.person_name}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-chandan text-mitti border border-chandan-border">
                        {caseItem.id}
                      </span>
                    </div>
                    <div className="text-xs text-ink-muted">
                      చివరిగా చూసిన ప్రదేశం: <strong>{caseItem.location} Ghat</strong> • {elapsedMins} mins ago
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp Alert Broadcast */}
                    {!isReunited && (
                      <button
                        onClick={() => handleShareCaseWhatsApp(caseItem)}
                        className="px-3 py-2 rounded-xl bg-tulsi hover:bg-green-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
                        title={t('missing_report.share_whatsapp')}
                      >
                        <Share2 size={14} />
                        <span>{t('missing_report.share_whatsapp')}</span>
                      </button>
                    )}

                    {isReunited ? (
                      <span className="px-3.5 py-1.5 rounded-full bg-tulsi text-white text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span>{t('missing_report.step_reunited')}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkSafe(caseItem)}
                        className="px-4 py-2 rounded-xl bg-godavari hover:bg-teal-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle size={15} />
                        <span>{t('missing_report.mark_safe_btn')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4-Step Single-Language Visual Progress Timeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-kesari text-white flex items-center justify-center font-bold text-xs mb-1">
                      1
                    </div>
                    <span className="font-bold text-neel text-[11px]">{t('missing_report.step_reported')}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-haldi text-neel font-bold flex items-center justify-center text-xs mb-1 shadow-sm">
                      2
                    </div>
                    <span className="font-bold text-neel text-[11px]">{t('missing_report.step_desk_alerted')}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                      isReunited ? 'bg-godavari text-white' : 'bg-chandan text-ink-muted border border-chandan-border'
                    }`}>
                      3
                    </div>
                    <span className="font-semibold text-ink-muted text-[11px]">{t('missing_report.step_match_found')}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 ${
                      isReunited ? 'bg-tulsi text-white' : 'bg-chandan text-ink-muted border border-chandan-border'
                    }`}>
                      4
                    </div>
                    <span className="font-semibold text-ink-muted text-[11px]">{t('missing_report.step_reunited')}</span>
                  </div>
                </div>

                {/* Clothing & Notes summary */}
                <div className="p-3 rounded-xl bg-chandan/30 text-xs text-ink-muted flex flex-col gap-1 border border-chandan-border/60">
                  <div><strong>{t('missing_report.clothing')}:</strong> {caseItem.clothing}</div>
                  {caseItem.notes && <div><strong>{t('missing_report.additional_notes')}:</strong> {caseItem.notes}</div>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
