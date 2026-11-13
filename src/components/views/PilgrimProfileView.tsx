import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { db, type Member, type Family, type ContactRequest } from '../../data/db';
import { createContactRequest, respondToContactRequest, getApprovedContactRequest } from '../../services/contactAccess';
import { subscribeToMilanEvents } from '../../services/supabase';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
  TempleToranam,
} from '../motifs/CulturalMotifs';
import {
  QrCode,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  Lock,
  Unlock,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  Clock,
  Share2,
  MapPin,
  Globe,
  HeartHandshake,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface PilgrimProfileViewProps {
  memberId: string;
  onBack?: () => void;
  onNavigateToBooths?: () => void;
}

export const PilgrimProfileView: React.FC<PilgrimProfileViewProps> = ({
  memberId,
  onBack,
  onNavigateToBooths,
}) => {
  const { t, i18n } = useTranslation();

  const [member, setMember] = useState<Member | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Contact access state
  const [approvedRequest, setApprovedRequest] = useState<ContactRequest | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [requesterName, setRequesterName] = useState<string>('');
  const [requesterBooth, setRequesterBooth] = useState<string>('Booth #01 - Pushkar Ghat');
  const [requesterPhone, setRequesterPhone] = useState<string>('');
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // Police Emergency PIN Override
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState<boolean>(false);
  const [officerPin, setOfficerPin] = useState<string>('');
  const [officerError, setOfficerError] = useState<string>('');
  const [isOfficerUnlocked, setIsOfficerUnlocked] = useState<boolean>(false);

  // Load Member & Family details
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const cleanId = memberId.trim().toUpperCase().replace('GM27:', '');
      const foundMember = await db.members.get(cleanId);
      if (foundMember) {
        const foundFamily = await db.families.get(foundMember.family_id);
        const existingApproved = await getApprovedContactRequest(cleanId);

        if (isMounted) {
          setMember(foundMember);
          setFamily(foundFamily || null);
          setApprovedRequest(existingApproved);

          // Generate QR code for this specific member
          const scanUrl = `${window.location.origin}/?scan=${foundMember.id}`;
          QRCode.toDataURL(scanUrl, {
            errorCorrectionLevel: 'M',
            width: 220,
            margin: 1,
            color: { dark: '#1F2A5C', light: '#FFFFFF' },
          }).then((url) => {
            if (isMounted) setQrDataUrl(url);
          });

          // Log public view in DPDP audit log
          await db.access_log.add({
            id: 'LOG-' + Date.now(),
            actor: 'Public Finder / Scanner',
            role: 'public',
            action: 'view_public',
            target: foundMember.id,
            reason: 'Scanned public pilgrim safety profile QR',
            at: new Date().toISOString(),
          });
        }
      }
      if (isMounted) setLoading(false);
    }

    loadData();

    // Listen to real-time events for contact request updates
    const unsubscribe = subscribeToMilanEvents((event) => {
      if (event.type === 'CONTACT_REQUEST_UPDATED' && event.payload) {
        const updated = event.payload as ContactRequest;
        if (updated.member_id === memberId || updated.member_id === memberId.replace('GM27:', '')) {
          if (updated.status === 'approved') {
            setApprovedRequest(updated);
            setRequestSubmitted(false);
            setPendingRequestId(null);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [memberId]);

  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 8) return '+91 98*** **321';
    const clean = phone.replace(/\s+/g, '');
    const prefix = clean.slice(0, 5);
    const suffix = clean.slice(-3);
    return `${prefix}*** **${suffix}`;
  };

  const handleSendContactRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !family) return;

    const req = await createContactRequest({
      memberId: member.id,
      familyId: family.id,
      requesterName: requesterName || 'Ghat Volunteer',
      requesterBooth: requesterBooth,
      requesterPhone: requesterPhone,
    });

    setPendingRequestId(req.id);
    setRequestSubmitted(true);
    setIsRequestModalOpen(false);
  };

  const handleOfficerOverride = async () => {
    if (officerPin.trim() !== '2027') {
      setOfficerError('Invalid Police PIN. Prototype PIN is: 2027');
      return;
    }

    if (!member) return;

    await db.access_log.add({
      id: 'OVERRIDE-' + Date.now(),
      actor: 'Ghat Police Officer (PIN 2027)',
      role: 'desk',
      action: 'emergency_override',
      target: member.id,
      reason: 'Emergency on-site override to reunite separated pilgrim',
      at: new Date().toISOString(),
    });

    setIsOfficerUnlocked(true);
    setIsOfficerModalOpen(false);
    setOfficerPin('');
    setOfficerError('');
  };

  const handleShareOnWhatsApp = () => {
    if (!member || !family) return;
    const msg = encodeURIComponent(
      `🚩 *గోదావరి పుష్కరాలు రక్షా ప్రొఫైల్ / గోదావరి మిలన్*\n` +
      `యాత్రికుని పేరు / Pilgrim Name: *${member.name}*\n` +
      `యూజర్ ఐడీ / User ID: *${member.id}*\n` +
      `స్థలం / Native Place: *${family.village}*\n` +
      `హెల్ప్‌లైన్ / Emergency Helpline: 112\n` +
      `${window.location.origin}/?scan=${member.id}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <DiyaIcon size={40} className="mx-auto text-kesari animate-pulse" />
        <div className="font-serif font-bold text-lg text-neel">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (!member || !family) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border-2 border-kumkum text-center space-y-4 shadow-sutra">
        <AlertTriangle size={48} className="text-kumkum mx-auto" />
        <h2 className="font-serif font-bold text-2xl text-kumkum">
          {t('lookup.not_found_title')}
        </h2>
        <p className="text-sm text-ink-muted">
          {t('lookup.not_found_desc')} ({memberId})
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-neel text-white text-xs font-bold shadow hover:bg-neel-deep transition-colors"
          >
            {t('common.close')}
          </button>
        )}
      </div>
    );
  }

  const isContactUnlocked = Boolean(isOfficerUnlocked || approvedRequest);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Back button if opened as modal/view */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-neel hover:text-kesari transition-colors"
        >
          <ArrowLeft size={16} />
          <span>{t('family.back_to_family')}</span>
        </button>
      )}

      {/* Main Instagram-like Public Pilgrim Card */}
      <div className="bg-white rounded-3xl border-2 border-kesari/70 shadow-sutra-lg overflow-hidden relative">
        <TempleToranam className="w-full h-3.5 opacity-90" />

        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-neel via-neel-surface to-neel px-6 py-6 text-white text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-kesari text-white text-xs font-bold shadow-sm mb-2 border border-haldi/50">
            <Sparkles size={13} className="text-haldi" />
            <span>{t('profile.verified_pilgrim')}</span>
          </div>

          <div className="font-serif font-bold text-2xl sm:text-3xl text-white">
            {member.name}
          </div>

          <div className="text-xs text-haldi font-medium mt-1">
            {t('app.subtitle')} • 2027
          </div>
        </div>

        {/* Pilgrim Identity & Quick Stats */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-chandan-border">
            {/* Avatar / Photo */}
            <div className="relative shrink-0">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-haldi shadow-md"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-chandan border-4 border-haldi flex items-center justify-center font-serif font-bold text-4xl text-kesari shadow-md">
                  {member.name.charAt(0)}
                </div>
              )}

              {member.status === 'missing' ? (
                <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-kumkum text-white text-[11px] font-bold shadow animate-pulse flex items-center gap-1 border-2 border-white">
                  <AlertTriangle size={12} />
                  <span>{t('family.status_missing')}</span>
                </span>
              ) : (
                <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-tulsi text-white text-[11px] font-bold shadow flex items-center gap-1 border-2 border-white">
                  <CheckCircle size={12} />
                  <span>{t('profile.status_safe')}</span>
                </span>
              )}
            </div>

            {/* Public Attributes (Name, Hometown, Language ONLY) */}
            <div className="space-y-2.5 text-center sm:text-left flex-1">
              <div>
                <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider block">
                  {t('profile.user_id_label')}
                </span>
                <span className="font-mono font-bold text-lg text-neel bg-chandan px-2.5 py-0.5 rounded-lg border border-chandan-border">
                  {member.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-chandan/40 p-2.5 rounded-xl border border-chandan-border">
                  <span className="text-ink-muted block text-[11px]">{t('profile.place_label')}</span>
                  <strong className="text-neel flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                    <MapPin size={13} className="text-kesari shrink-0" />
                    <span>{family.village || 'Rajahmundry'}</span>
                  </strong>
                </div>

                <div className="bg-chandan/40 p-2.5 rounded-xl border border-chandan-border">
                  <span className="text-ink-muted block text-[11px]">{t('profile.language_label')}</span>
                  <strong className="text-neel flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                    <Globe size={13} className="text-godavari shrink-0" />
                    <span>{family.language === 'te' ? 'తెలుగు (Telugu)' : family.language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
                  </strong>
                </div>
              </div>

              <div className="text-xs text-ink-muted">
                {t('family.age_label')}: <strong className="text-neel">{member.age} {t('family.years_old')}</strong> • {member.relation}
              </div>
            </div>
          </div>

          {/* Dedicated Scannable QR Code */}
          <div className="bg-chandan/30 p-5 rounded-2xl border border-chandan-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-serif font-bold text-base text-neel flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode size={18} className="text-kesari" />
                <span>{member.name} {t('family.wristband_title')}</span>
              </div>
              <p className="text-xs text-ink-muted max-w-sm">
                {t('lookup.privacy_tier_notice')}
              </p>
            </div>

            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Member Secure QR"
                className="w-24 h-24 rounded-xl border-2 border-neel/80 shadow-sm shrink-0 bg-white p-1"
              />
            )}
          </div>

          {/* DPDP Act 2023 Privacy Wall & Contact Access Box */}
          <div className="bg-gradient-to-br from-chandan via-chandan-card to-chandan p-5 rounded-2xl border-2 border-haldi space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-haldi shrink-0" />
              <div>
                <h3 className="font-serif font-bold text-sm text-neel">
                  {t('profile.privacy_title')}
                </h3>
                <p className="text-[11px] text-ink-muted leading-tight mt-0.5">
                  {t('profile.privacy_desc')}
                </p>
              </div>
            </div>

            {/* Masked Contact Display */}
            <div className="p-4 rounded-xl bg-white border border-chandan-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-[11px] text-ink-muted block">
                  {t('family.guardian_heading')} ({family.guardian_name.charAt(0)}***):
                </span>
                <div className="font-mono font-bold text-lg text-neel flex items-center justify-center sm:justify-start gap-2">
                  {isContactUnlocked ? (
                    <span className="text-tulsi font-extrabold">{family.phone}</span>
                  ) : (
                    <span>{maskPhoneNumber(family.phone)}</span>
                  )}
                  {isContactUnlocked ? (
                    <Unlock size={16} className="text-tulsi" />
                  ) : (
                    <Lock size={16} className="text-mitti" />
                  )}
                </div>
              </div>

              {/* Action: Call Directly (if unlocked) or Request Access */}
              {isContactUnlocked ? (
                <a
                  href={`tel:${family.phone}`}
                  className="px-5 py-2.5 rounded-xl bg-tulsi hover:bg-green-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 animate-bounce"
                >
                  <PhoneCall size={16} />
                  <span>{t('profile.call_guardian_now')}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <HeartHandshake size={15} />
                  <span>{t('profile.request_contact_btn')}</span>
                </button>
              )}
            </div>

            {/* Real-time Pending Notice */}
            {requestSubmitted && !isContactUnlocked && (
              <div className="p-3.5 rounded-xl bg-haldi-light text-mitti border border-haldi/60 text-xs font-semibold flex items-center gap-2 animate-pulse">
                <Clock size={16} />
                <span>{t('profile.request_sent')}</span>
              </div>
            )}

            {/* Quick Share on WhatsApp & Volunteer Booth Locator Links */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs gap-2">
              <button
                type="button"
                onClick={handleShareOnWhatsApp}
                className="flex items-center gap-1.5 text-tulsi font-bold hover:underline"
              >
                <Share2 size={14} />
                <span>{t('lookup.share_band')}</span>
              </button>

              {onNavigateToBooths && (
                <button
                  type="button"
                  onClick={onNavigateToBooths}
                  className="flex items-center gap-1.5 text-godavari font-bold hover:underline"
                >
                  <MapPin size={14} />
                  <span>{t('booths.nearest_booth_badge')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOfficerModalOpen(true)}
                className="text-kesari font-bold hover:underline flex items-center gap-1 ml-auto"
              >
                <KeyRound size={13} />
                <span>{t('profile.officer_override_btn')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Request Contact Permission Form */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neel/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSendContactRequest}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-kesari shadow-sutra-lg space-y-4"
          >
            <div className="flex items-center gap-2.5 font-serif font-bold text-lg text-neel pb-2 border-b border-chandan-border">
              <HeartHandshake size={22} className="text-kesari" />
              <span>{t('profile.request_modal_title')}</span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              {t('profile.privacy_desc')}
            </p>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('profile.requester_name')} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sravan (Volunteer / Pilgrim)"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('profile.requester_booth')}
              </label>
              <select
                value={requesterBooth}
                onChange={(e) => setRequesterBooth(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari bg-white"
              >
                <option value="Booth #01 - Pushkar Ghat Central">Booth #01 - Pushkar Ghat Central</option>
                <option value="Booth #02 - Kotilingala North Safety Desk">Booth #02 - Kotilingala North Safety Desk</option>
                <option value="Booth #03 - Gowthami Ghat Family Care">Booth #03 - Gowthami Ghat Family Care</option>
                <option value="Booth #04 - Saraswati Ghat Youth Post">Booth #04 - Saraswati Ghat Youth Post</option>
                <option value="Booth #05 - Markandeya Ghat Reunion Post">Booth #05 - Markandeya Ghat Reunion Post</option>
                <option value="Booth #06 - Railway Station Transit Post">Booth #06 - Railway Station Transit Post</option>
                <option value="Booth #07 - RTC Central Bus Station">Booth #07 - RTC Central Bus Station</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('profile.requester_phone')}
              </label>
              <input
                type="tel"
                placeholder="+91 98480 99999"
                value={requesterPhone}
                onChange={(e) => setRequesterPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-chandan-border">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-chandan text-xs font-bold text-ink"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-md transition-colors"
              >
                {t('profile.send_request_btn')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Officer Emergency Override PIN */}
      {isOfficerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neel/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-kesari shadow-sutra-lg space-y-4">
            <div className="flex items-center gap-2 font-serif font-bold text-lg text-neel pb-2 border-b border-chandan-border">
              <KeyRound size={22} className="text-kesari" />
              <span>{t('profile.officer_override_btn')}</span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              {t('lookup.audit_logged_msg')}
            </p>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('profile.officer_pin_prompt')}
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="2027"
                value={officerPin}
                onChange={(e) => setOfficerPin(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-center text-xl font-mono font-bold tracking-widest focus:border-kesari"
              />
              <span className="text-[11px] text-tulsi font-semibold block mt-1">
                {t('helpdesk.test_pin_hint')}
              </span>
            </div>

            {officerError && (
              <div className="text-xs font-bold text-kumkum bg-kumkum-light p-2.5 rounded-xl">
                ⚠️ {officerError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfficerModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-chandan text-xs font-bold text-ink"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleOfficerOverride}
                className="px-5 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow transition-colors"
              >
                {t('lookup.unlock_full')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
