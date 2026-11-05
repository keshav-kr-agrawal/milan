import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, type Member, type Family } from '../../data/db';
import { CallGateway } from '../../services/adapters';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
  TempleToranam,
} from '../motifs/CulturalMotifs';
import {
  Search,
  QrCode,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  Lock,
  Unlock,
  KeyRound,
  AlertTriangle,
  CheckCircle,
  Eye,
  Camera,
  FileText,
  Clock,
  Share2,
} from 'lucide-react';

export const LookupView: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [inputBandId, setInputBandId] = useState('GM27-K7M2-1');
  const [searchedMember, setSearchedMember] = useState<Member | null>(null);
  const [searchedFamily, setSearchedFamily] = useState<Family | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Signage "Show all three" toggle
  const [showAllThreeLanguages, setShowAllThreeLanguages] = useState(true);

  // Masked calling state
  const [callStatus, setCallStatus] = useState<string | null>(null);

  // Consent request flow state
  const [consentStatus, setConsentStatus] = useState<'idle' | 'pending' | 'approved' | 'escalated'>('idle');

  // Help Desk Officer Emergency Override state
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [officerPin, setOfficerPin] = useState('');
  const [officerReason, setOfficerReason] = useState('Found crying near ghat barricade, assisting');
  const [isUnlockedByOfficer, setIsUnlockedByOfficer] = useState(false);
  const [officerError, setOfficerError] = useState('');

  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 10) return '+91 98*** **321';
    const clean = phone.replace(/\s+/g, '');
    const prefix = clean.slice(0, 5);
    const suffix = clean.slice(-3);
    return `${prefix}*** **${suffix}`;
  };

  const handleLookup = async (bandCodeToFind?: string) => {
    const rawId = (bandCodeToFind || inputBandId).trim().toUpperCase();
    const cleanId = rawId.replace('GM27:', '');

    setNotFound(false);
    setCallStatus(null);
    setConsentStatus('idle');
    setIsUnlockedByOfficer(false);

    const member = await db.members.get(cleanId);
    if (member) {
      const family = await db.families.get(member.family_id);
      setSearchedMember(member);
      setSearchedFamily(family || null);

      // Public view audit log
      await db.access_log.add({
        id: 'LOG-' + Date.now(),
        actor: 'Public User / Volunteer',
        role: 'public',
        action: 'view_public',
        target: cleanId,
        reason: 'Public QR band lookup on ghat',
        at: new Date().toISOString(),
      });
    } else {
      setSearchedMember(null);
      setSearchedFamily(null);
      setNotFound(true);
    }
  };

  const handleCallGuardian = async () => {
    if (!searchedMember || !searchedFamily) return;
    setCallStatus('సంరక్షకుడికి కనెక్ట్ చేస్తున్నాము... / हेल्पलाइन से कॉल कनेक्ट हो रही है / Connecting via Masked Helpline Bridge to +91 98*** **321');
    await CallGateway.initiateMaskedCall(searchedMember.id, maskPhoneNumber(searchedFamily.phone));
  };

  const handleRequestConsent = async () => {
    if (!searchedMember) return;
    setConsentStatus('pending');

    await db.consent_requests.add({
      id: 'CONSENT-' + Date.now(),
      member_id: searchedMember.id,
      requester_hash: 'VOLUNTEER-' + Math.random().toString(36).substring(2, 8),
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    // In 3.5 seconds, simulate guardian approval for demonstration
    setTimeout(() => {
      setConsentStatus('approved');
    }, 3500);
  };

  const handleOfficerOverride = async () => {
    if (officerPin.trim() !== '2027') {
      setOfficerError('Invalid Officer Access PIN. Prototype PIN is: 2027');
      return;
    }

    if (!searchedMember) return;

    // Log audited override into DPDP access log
    await db.access_log.add({
      id: 'OVERRIDE-' + Date.now(),
      actor: 'Officer (PIN 2027)',
      role: 'desk',
      action: 'emergency_override',
      target: searchedMember.id,
      reason: officerReason,
      at: new Date().toISOString(),
    });

    setIsUnlockedByOfficer(true);
    setShowOfficerModal(false);
    setOfficerPin('');
    setOfficerError('');
  };

  const handleShareOnWhatsApp = () => {
    if (!searchedMember) return;
    const msg = encodeURIComponent(
      `🚩 *గోదావరి పుష్కరాలు రక్షా బ్యాండ్ స్కాన్ / గోదావరి మిలన్*\n` +
      `బ్యాండ్ కోడ్ / Band ID: *${searchedMember.id}*\n` +
      `పేరు / Name: *${searchedMember.name}*\n` +
      `సంరక్షకుని సంప్రదించండి / Helpline: 112\n` +
      `https://godavari-milan-2027.gov-prototype.in`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-3xl mx-auto">
      {/* Top Header with Clean Single-Language Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-chandan-border gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neel flex items-center gap-2">
            <QrCode size={28} className="text-kesari" />
            <span>{t('lookup.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted mt-1">
            {t('lookup.desc')}
          </p>
        </div>
      </div>

      {/* Search & Scan Box */}
      <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra space-y-4">
        <label className="block text-xs font-bold text-neel">
          {t('lookup.type_id')}
        </label>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="e.g. GM27-K7M2-1"
            value={inputBandId}
            onChange={(e) => setInputBandId(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-chandan-border font-mono font-bold text-base text-neel bg-chandan/20 focus:border-kesari focus:bg-white uppercase"
          />

          <button
            onClick={() => handleLookup()}
            className="px-6 py-3 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            <span>{t('lookup.search_btn')}</span>
          </button>
        </div>

        {/* Quick Sample Band shortcuts */}
        <div className="flex items-center gap-2 text-xs text-ink-muted pt-2 flex-wrap">
          <span>{t('lookup.sample_codes_label')}</span>
          <button
            type="button"
            onClick={() => { setInputBandId('GM27-K7M2-1'); handleLookup('GM27-K7M2-1'); }}
            className="px-2.5 py-1 rounded-lg bg-haldi-light text-mitti font-mono font-bold border border-haldi/40 hover:bg-haldi transition-colors"
          >
            GM27-K7M2-1 (Sai Krishna Rao - Child)
          </button>
          <button
            type="button"
            onClick={() => { setInputBandId('GM27-P4X9-1'); handleLookup('GM27-P4X9-1'); }}
            className="px-2.5 py-1 rounded-lg bg-haldi-light text-mitti font-mono font-bold border border-haldi/40 hover:bg-haldi transition-colors"
          >
            GM27-P4X9-1 (Subhadra Patra - Elder)
          </button>
        </div>
      </div>

      {notFound && (
        <div className="p-6 rounded-2xl bg-white border-2 border-kumkum text-center space-y-2">
          <AlertTriangle size={32} className="text-kumkum mx-auto" />
          <h3 className="font-serif font-bold text-lg text-kumkum">
            {t('lookup.not_found_title')}
          </h3>
          <p className="text-xs text-ink-muted">
            {t('lookup.not_found_desc')}
          </p>
        </div>
      )}

      {/* Lookup Result: Tiered Privacy Display with Trilingual Hardcoding */}
      {searchedMember && searchedFamily && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-kesari shadow-sutra-lg space-y-6 animate-fadeIn">
          {/* Signage Trilingual Banner */}
          {showAllThreeLanguages && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-chandan via-chandan-card to-chandan text-center font-serif border border-haldi space-y-1 shadow-xs">
              <div className="text-base font-bold text-neel">
                తప్పిపోయిన యాత్రికుల రక్షా ప్రొఫైల్
              </div>
              <div className="text-sm font-bold text-kesari">
                लापता श्रद्धालु सुरक्षा प्रोफाइल
              </div>
              <div className="text-xs text-ink-muted font-sans font-medium">
                Separated Pilgrim Assistance Profile • Godavari Pushkaralu 2027
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="flex items-center gap-2 text-xs font-semibold text-tulsi bg-tulsi-light px-3.5 py-2.5 rounded-xl border border-tulsi/30">
            <ShieldCheck size={18} className="shrink-0" />
            <span>
              {t('lookup.privacy_tier_notice')}
            </span>
          </div>

          {/* Main Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-chandan-border gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-kesari-light text-kesari flex items-center justify-center font-serif font-bold text-2xl border-2 border-kesari/40 shadow-sm shrink-0">
                {searchedMember.name.charAt(0)}
              </div>
              <div>
                <div className="font-serif font-bold text-xl sm:text-2xl text-neel">
                  {searchedMember.name}
                </div>
                <div className="text-xs sm:text-sm text-ink-muted">
                  {t('family.age_label')}: <strong>{searchedMember.age} {t('family.years_old')}</strong> • {searchedMember.relation}
                </div>
                <div className="font-mono text-xs font-bold text-mitti mt-1">
                  {t('family.band_id_label')}: <span className="bg-haldi-light px-2 py-0.5 rounded border border-haldi/40">{searchedMember.id}</span>
                </div>
              </div>
            </div>

            {/* Masked Contact & Call action */}
            <div className="bg-chandan-card p-4 rounded-xl border border-chandan-border text-center sm:text-right space-y-2 w-full sm:w-auto shadow-xs">
              <div className="text-xs text-ink-muted">
                {t('lookup.masked_phone')}:
              </div>
              <div className="font-mono font-bold text-base text-neel">
                {isUnlockedByOfficer ? searchedFamily.phone : maskPhoneNumber(searchedFamily.phone)}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleCallGuardian}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-tulsi hover:bg-green-700 text-white font-bold text-xs shadow transition-colors"
                >
                  <PhoneCall size={14} />
                  <span>{t('lookup.call_helpline')}</span>
                </button>
                <button
                  onClick={handleShareOnWhatsApp}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-chandan hover:bg-white text-ink border border-chandan-border text-xs font-bold transition-colors"
                  title={t('lookup.share_band')}
                >
                  <Share2 size={13} className="text-tulsi" />
                  <span>{t('lookup.share_band')}</span>
                </button>
              </div>
            </div>
          </div>

          {callStatus && (
            <div className="p-3.5 rounded-xl bg-godavari-light text-godavari text-xs font-bold border border-godavari/30 flex items-center gap-2 animate-fadeIn">
              <PhoneCall size={16} className="animate-bounce" />
              <span>{callStatus}</span>
            </div>
          )}

          {/* Tier 2: Requester Consent Flow */}
          <div className="p-4 rounded-xl bg-chandan/40 border border-chandan-border space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs font-bold text-neel">
                {t('lookup.request_full_profile')}
              </div>
              {consentStatus === 'idle' && (
                <button
                  onClick={handleRequestConsent}
                  className="px-3.5 py-1.5 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm"
                >
                  {t('lookup.request_full_profile')}
                </button>
              )}
            </div>

            {consentStatus === 'pending' && (
              <div className="text-xs text-mitti font-semibold flex items-center gap-1.5 animate-pulse">
                <Clock size={14} />
                <span>{t('lookup.consent_requested')}</span>
              </div>
            )}

            {consentStatus === 'approved' && (
              <div className="text-xs text-tulsi font-bold flex items-center gap-1.5 bg-tulsi-light p-2.5 rounded-xl border border-tulsi/30">
                <CheckCircle size={16} />
                <span>{t('lookup.consent_approved')}</span>
              </div>
            )}
          </div>

          {/* Tier 3: Unlocked Details (Consent or Police Override) */}
          {(isUnlockedByOfficer || consentStatus === 'approved') && (
            <div className="p-5 rounded-xl bg-godavari-light/40 border-2 border-godavari space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-godavari">
                <span className="flex items-center gap-1.5">
                  <Unlock size={16} />
                  <span>{t('lookup.full_profile_unlocked')}</span>
                </span>
                <span className="text-[11px] text-ink-muted">{t('lookup.audit_logged_msg')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink-muted block">{t('family.guardian_name')}:</span>
                  <strong className="text-neel text-sm">{searchedFamily.guardian_name}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block">{t('lookup.full_phone')}:</span>
                  <strong className="text-neel text-sm font-mono">{searchedFamily.phone}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block">{t('lookup.village')}:</span>
                  <strong className="text-neel">{searchedFamily.village}</strong>
                </div>
                <div>
                  <span className="text-ink-muted block">{t('lookup.stay_camp')}:</span>
                  <strong className="text-neel">{searchedFamily.stay_location}</strong>
                </div>
              </div>

              {searchedMember.note && (
                <div className="pt-2 border-t border-godavari/30 text-xs">
                  <span className="text-ink-muted block">{t('lookup.medical_note')}:</span>
                  <div className="font-semibold text-ink bg-white p-2.5 rounded-lg mt-1 border border-chandan-border">
                    {searchedMember.note}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Officer Emergency Override Trigger */}
          <div className="pt-3 border-t border-chandan-border flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
            <span className="text-ink-muted">{t('lookup.officer_override')}</span>
            <button
              onClick={() => setShowOfficerModal(true)}
              className="text-kesari font-bold hover:underline flex items-center gap-1"
            >
              <KeyRound size={13} />
              <span>{t('lookup.unlock_full')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Officer Override PIN Modal */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neel/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full border-2 border-kesari shadow-sutra-lg space-y-4">
            <div className="flex items-center gap-2 font-serif font-bold text-lg text-neel">
              <KeyRound size={22} className="text-kesari" />
              <span>{t('lookup.officer_override')}</span>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              {t('lookup.audit_logged_msg')}
            </p>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('lookup.officer_pin_prompt')}
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

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('lookup.officer_reason_prompt')}
              </label>
              <input
                type="text"
                value={officerReason}
                onChange={(e) => setOfficerReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-chandan-border text-xs focus:border-kesari"
              />
            </div>

            {officerError && (
              <div className="text-xs font-bold text-kumkum bg-kumkum-light p-2 rounded-lg">
                ⚠️ {officerError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowOfficerModal(false)}
                className="px-4 py-2 rounded-xl bg-chandan text-xs font-bold text-ink"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleOfficerOverride}
                className="px-5 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow"
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
