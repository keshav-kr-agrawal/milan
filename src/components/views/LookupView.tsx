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
import { PilgrimProfileView } from './PilgrimProfileView';

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

      {/* Lookup Result: Privacy-Preserving Instagram-Style Pilgrim Profile */}
      {searchedMember && (
        <div className="pt-2">
          <PilgrimProfileView memberId={searchedMember.id} />
        </div>
      )}
    </div>
  );
};
