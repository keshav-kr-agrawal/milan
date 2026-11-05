import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, type Case, type HelpDesk } from '../../data/db';
import { ClientFaceMatcher, OfflineSyncQueue } from '../../services/adapters';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
  TempleToranam,
} from '../motifs/CulturalMotifs';
import {
  HelpCircle,
  Camera,
  MapPin,
  Clock,
  ShieldAlert,
  Send,
  Navigation,
  CheckCircle,
  PhoneCall,
  UserCheck,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const FoundReportView: React.FC = () => {
  const { t } = useTranslation();

  // 30-Second Fast Form Fields
  const [personName, setPersonName] = useState('');
  const [ageGroup, setAgeGroup] = useState<'child' | 'teen' | 'adult' | 'elder'>('child');
  const [spokenLang, setSpokenLang] = useState('te');
  const [clothing, setClothing] = useState('');
  const [ghatLocation, setGhatLocation] = useState('pushkar');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | undefined>(undefined);
  const [locationGps, setLocationGps] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success view state
  const [submittedCase, setSubmittedCase] = useState<Case | null>(null);
  const [nearestDesk, setNearestDesk] = useState<HelpDesk | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 120, 120);
          const descriptor = ClientFaceMatcher.extractDescriptorFromCanvas(canvas);
          setPhotoUrl(dataUrl);
          setFaceDescriptor(descriptor);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setLocationGps('GPS not supported');
      return;
    }
    setLocationGps('Detecting coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationGps(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocationGps('GPS unavailable. Using chosen Ghat.');
      }
    );
  };

  const handleSubmitFoundCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isOffline = !navigator.onLine;
    const caseId = 'CASE-FOUND-' + Math.floor(100 + Math.random() * 900);

    const newCase: Case = {
      id: caseId,
      type: 'found',
      status: 'open',
      person_name: personName.trim() || 'Unknown Pilgrim',
      location: ghatLocation,
      age_group: ageGroup,
      language: spokenLang,
      clothing: clothing.trim() || 'Not specified',
      photo_url: photoUrl,
      face_descriptor: faceDescriptor,
      source: 'volunteer',
      created_at: new Date().toISOString(),
      queued_offline: isOffline,
      notes: locationGps ? `Found via ${locationGps}` : 'Reported at ghat steps',
    };

    await db.cases.add(newCase);

    // Automatic match search against open missing cases
    if (faceDescriptor) {
      const missingCases = await db.cases.where('type').equals('missing').and((c) => c.status === 'open').toArray();
      for (const mc of missingCases) {
        if (mc.face_descriptor) {
          const dist = ClientFaceMatcher.calculateDistance(faceDescriptor, mc.face_descriptor);
          const conf = ClientFaceMatcher.getConfidence(dist);
          if (conf !== 'none') {
            await db.matches.add({
              id: 'MATCH-' + Date.now(),
              case_a: mc.id,
              case_b_or_member: caseId,
              distance: dist,
              confidence: conf,
            });
          }
        }
      }
    }

    // Lookup nearest helpdesk
    const desk = await db.helpdesks.where('ghat').equals(ghatLocation).first();
    setNearestDesk(desk || null);
    setSubmittedCase(newCase);
    setIsSubmitting(false);

    if (isOffline) {
      OfflineSyncQueue.checkQueue();
    }
  };

  const handleResetForNext = () => {
    setSubmittedCase(null);
    setPersonName('');
    setClothing('');
    setPhotoUrl('');
    setFaceDescriptor(undefined);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-2xl mx-auto">
      {/* Top Header with Clean Single-Language Heading */}
      <div className="pb-3 border-b border-chandan-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-godavari flex items-center gap-2">
            <HelpCircle size={28} />
            <span>{t('found_report.title')}</span>
          </h1>
          <span className="px-3 py-1 rounded-full bg-godavari-light text-godavari text-xs font-bold border border-godavari/30">
            {t('found_report.badge_30s')}
          </span>
        </div>
        <p className="text-xs text-ink-muted mt-1">
          {t('family.desc')}
        </p>
      </div>

      {/* Safety Protocol Banner */}
      <div className="bg-chandan rounded-2xl p-4 sm:p-5 border-2 border-haldi text-xs sm:text-sm space-y-3 text-ink shadow-sm">
        <div className="font-serif font-bold text-neel flex items-center gap-2">
          <ShieldAlert size={20} className="text-kumkum" />
          <span>{t('found_report.safety_warning_title')}</span>
        </div>
        <div className="space-y-2 text-xs leading-relaxed text-ink-muted">
          <div className="p-2.5 rounded-lg bg-white border border-chandan-border">
            <strong className="text-neel">{t('found_report.rule1_title')}</strong>
            <div className="text-[11px] text-ink-muted mt-0.5">{t('found_report.rule1_desc')}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-chandan-border">
            <strong className="text-neel">{t('found_report.rule2_title')}</strong>
            <div className="text-[11px] text-ink-muted mt-0.5">{t('found_report.rule2_desc')}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-chandan-border">
            <strong className="text-neel">{t('found_report.rule3_title')}</strong>
            <div className="text-[11px] text-ink-muted mt-0.5">{t('found_report.rule3_desc')}</div>
          </div>
        </div>
      </div>

      {/* If Form Submitted, show Nearest Help Desk instructions */}
      {submittedCase ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-godavari shadow-sutra space-y-5 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-godavari text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-serif font-bold text-neel">
              {t('found_report.report_success_title')}
            </h2>
            <div className="font-mono font-bold text-sm text-kesari">
              Case Ref: {submittedCase.id}
            </div>
            {submittedCase.queued_offline && (
              <div className="text-xs font-bold text-mitti bg-haldi-light p-2.5 rounded-xl border border-haldi/40">
                {t('found_report.offline_notice')}
              </div>
            )}
          </div>

          <div className="bg-chandan-card rounded-xl p-5 border border-chandan-border space-y-3">
            <div className="font-bold text-sm text-neel flex items-center gap-2">
              <MapPin size={18} className="text-kesari" />
              <span>{t('found_report.nearest_helpdesk_title')}</span>
            </div>
            <p className="text-xs text-ink-muted">
              {t('found_report.take_to_desk')}
            </p>
            {nearestDesk && (
              <div className="bg-white p-4 rounded-xl border border-chandan-border text-xs space-y-1.5 shadow-xs">
                <div className="font-bold text-base text-neel">{nearestDesk.name}</div>
                <div>{t('found_report.officer_in_charge')}: <strong className="text-ink">{nearestDesk.officer_in_charge}</strong></div>
                <div>{t('found_report.helpdesk_phone')}: <strong className="text-kesari font-mono text-sm">{nearestDesk.phone}</strong></div>
              </div>
            )}
          </div>

          <button
            onClick={handleResetForNext}
            className="w-full py-3.5 rounded-xl bg-godavari hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-colors"
          >
            + {t('found_report.report_another')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitFoundCase} className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-godavari shadow-sutra space-y-5">
          {/* Photo Capture */}
          <div>
            <label className="block text-xs font-bold text-neel mb-1">
              {t('found_report.photo_label')}
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-godavari-light hover:bg-godavari text-godavari hover:text-white font-bold text-xs cursor-pointer border border-godavari/40 transition-colors shadow-sm">
                <Camera size={18} />
                <span>{photoUrl ? '✓ ' + t('found_report.photo_captured') : t('found_report.take_photo')}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Found Person"
                  className="w-14 h-14 rounded-xl object-cover border-2 border-godavari shadow-sm"
                />
              )}
            </div>
            <div className="text-[11px] text-ink-muted mt-1">
              ఫేస్ డేటా మీ ఫోన్‌లోనే సురక్షితంగా ప్రాసెస్ అవుతుంది (On-device vision).
            </div>
          </div>

          {/* Age Group Buttons with Clean Single-Language Labels */}
          <div>
            <label className="block text-xs font-bold text-neel mb-1.5">
              {t('found_report.approx_age')} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'child', label: t('found_report.age_child') },
                { id: 'teen', label: t('found_report.age_teen') },
                { id: 'adult', label: t('found_report.age_adult') },
                { id: 'elder', label: t('found_report.age_elder') },
              ].map((ag) => (
                <button
                  type="button"
                  key={ag.id}
                  onClick={() => setAgeGroup(ag.id as any)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    ageGroup === ag.id
                      ? 'border-godavari bg-godavari text-white shadow-sm font-bold'
                      : 'border-chandan-border bg-chandan-card hover:bg-white text-ink font-semibold'
                  }`}
                >
                  <div className="text-xs">{ag.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location Ghat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('found_report.location_found')} *
              </label>
              <select
                value={ghatLocation}
                onChange={(e) => setGhatLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm font-semibold text-neel bg-white focus:border-godavari"
              >
                <option value="pushkar">{t('common.ghats.pushkar')}</option>
                <option value="kotilingala">{t('common.ghats.kotilingala')}</option>
                <option value="gowthami">{t('common.ghats.gowthami')}</option>
                <option value="saraswati">{t('common.ghats.saraswati')}</option>
                <option value="markandeya">{t('common.ghats.markandeya')}</option>
                <option value="padmavathi">{t('common.ghats.padmavathi')}</option>
                <option value="subramanya">{t('common.ghats.subramanya')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('found_report.spoken_lang')}
              </label>
              <select
                value={spokenLang}
                onChange={(e) => setSpokenLang(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm font-semibold text-neel bg-white focus:border-godavari"
              >
                <option value="te">తెలుగు (Telugu)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          {/* Name & Clothing Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('found_report.person_name')}
              </label>
              <input
                type="text"
                placeholder={t('found_report.name_placeholder')}
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm bg-white focus:border-godavari"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('found_report.clothing_desc')} *
              </label>
              <input
                type="text"
                required
                placeholder={t('found_report.clothing_placeholder')}
                value={clothing}
                onChange={(e) => setClothing(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm bg-white focus:border-godavari"
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGetGps}
              className="flex items-center gap-1.5 text-xs font-bold text-godavari hover:underline"
            >
              <Navigation size={14} />
              <span>{locationGps || t('found_report.use_gps')}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-godavari hover:bg-teal-800 text-white font-bold text-base shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span>
              {isSubmitting ? t('found_report.submitting') : t('found_report.submit_found')}
            </span>
          </button>
        </form>
      )}
    </div>
  );
};
