import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import QRCode from 'qrcode';
import { db, type Family, type Member } from '../../data/db';
import { SmsOtpGateway, ClientFaceMatcher } from '../../services/adapters';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
  RiverWaves,
} from '../motifs/CulturalMotifs';
import {
  UserPlus,
  QrCode,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Phone,
  Trash2,
  Camera,
  LogIn,
  KeyRound,
  FileText,
  User,
  Bell,
  Eye,
  HeartHandshake,
  Share2,
  X,
  ArrowLeft,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { PilgrimProfileView } from './PilgrimProfileView';
import { respondToContactRequest } from '../../services/contactAccess';
import { templeAudio } from '../../services/sound';

interface FamilyViewProps {
  onMarkMissing: (memberId: string) => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({ onMarkMissing }) => {
  const { t, i18n } = useTranslation();

  // Active loaded family
  const [activeFamilyId, setActiveFamilyId] = useState<string>(() => {
    return localStorage.getItem('milan_active_family_id') || 'GM27-K7M2';
  });

  // Mode: 'view' | 'register' | 'otp_login'
  const [viewMode, setViewMode] = useState<'view' | 'register' | 'otp_login'>('view');

  // Form State for new registration
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianVillage, setGuardianVillage] = useState('');
  const [preferredLang, setPreferredLang] = useState('te');
  const [stayLocation, setStayLocation] = useState('pushkar');
  const [consentAgreed, setConsentAgreed] = useState(false);

  // Dynamic Members list
  const [members, setMembers] = useState<
    Array<{
      tempId: string;
      name: string;
      age: number;
      relation: string;
      note: string;
      photoUrl?: string;
      descriptor?: number[];
    }>
  >([
    { tempId: 'temp-1', name: '', age: 8, relation: 'Son', note: '' },
  ]);

  // Returning User OTP state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Print Station State (Zero Paper Waste Selective Print)
  const [printStationOpen, setPrintStationOpen] = useState(false);
  const [printSelections, setPrintSelections] = useState<
    Record<string, { selected: boolean; kind: 'band' | 'card' }>
  >({});
  const [memberQrMap, setMemberQrMap] = useState<Record<string, string>>({});

  // Single Member Public Profile preview state
  const [previewPublicProfileMemberId, setPreviewPublicProfileMemberId] = useState<string | null>(null);

  // Live query for active family
  const currentFamily = useLiveQuery(
    () => (activeFamilyId ? db.families.get(activeFamilyId) : undefined),
    [activeFamilyId]
  );

  const familyMembers = useLiveQuery(
    () => (activeFamilyId ? db.members.where('family_id').equals(activeFamilyId).toArray() : []),
    [activeFamilyId],
    []
  );

  // Live query for incoming real-time contact access requests from volunteers/finders
  const pendingRequests = useLiveQuery(
    () => (activeFamilyId ? db.contact_requests.where('family_id').equals(activeFamilyId).filter((r) => r.status === 'pending').toArray() : []),
    [activeFamilyId],
    []
  );

  // Generate & cache high-resolution QR codes for all family members
  useEffect(() => {
    if (!familyMembers || familyMembers.length === 0) return;
    const generateQRs = async () => {
      const qrs: Record<string, string> = { ...memberQrMap };
      let changed = false;
      for (const m of familyMembers) {
        if (!qrs[m.id]) {
          const scanUrl = `${window.location.origin}/?scan=${m.id}`;
          const url = await QRCode.toDataURL(scanUrl, {
            errorCorrectionLevel: 'M',
            width: 220,
            margin: 1,
            color: { dark: '#0C0F24', light: '#FFFFFF' },
          });
          qrs[m.id] = url;
          changed = true;
        }
      }
      if (changed) {
        setMemberQrMap(qrs);
      }
    };
    generateQRs();
  }, [familyMembers]);

  const handleRespondContactRequest = async (requestId: string, decision: 'approved' | 'rejected') => {
    await respondToContactRequest(requestId, decision);
    if (decision === 'approved') {
      templeAudio.playAartiChime();
    }
  };

  const openPrintStation = (targetMemberId?: string, targetKind: 'band' | 'card' = 'band') => {
    if (!familyMembers || familyMembers.length === 0) return;

    const initialSelections: Record<string, { selected: boolean; kind: 'band' | 'card' }> = {};

    familyMembers.forEach((m) => {
      if (targetMemberId) {
        initialSelections[m.id] = {
          selected: m.id === targetMemberId,
          kind: m.id === targetMemberId ? targetKind : (printSelections[m.id]?.kind || 'band'),
        };
      } else {
        initialSelections[m.id] = {
          selected: true,
          kind: printSelections[m.id]?.kind || 'band',
        };
      }
    });

    setPrintSelections(initialSelections);
    setPrintStationOpen(true);
  };

  const toggleMemberSelection = (memberId: string) => {
    setPrintSelections((prev) => ({
      ...prev,
      [memberId]: {
        selected: !prev[memberId]?.selected,
        kind: prev[memberId]?.kind || 'band',
      },
    }));
  };

  const setMemberKind = (memberId: string, kind: 'band' | 'card') => {
    setPrintSelections((prev) => ({
      ...prev,
      [memberId]: {
        selected: true,
        kind,
      },
    }));
  };

  const setAllSelections = (selected: boolean) => {
    setPrintSelections((prev) => {
      const next: typeof prev = {};
      familyMembers.forEach((m) => {
        next[m.id] = {
          selected,
          kind: prev[m.id]?.kind || 'band',
        };
      });
      return next;
    });
  };

  const setAllKinds = (kind: 'band' | 'card') => {
    setPrintSelections((prev) => {
      const next: typeof prev = {};
      familyMembers.forEach((m) => {
        next[m.id] = {
          selected: prev[m.id]?.selected ?? true,
          kind,
        };
      });
      return next;
    });
  };

  const handleAddMemberRow = () => {
    setMembers((prev) => [
      ...prev,
      { tempId: 'temp-' + Date.now(), name: '', age: 10, relation: '', note: '' },
    ]);
  };

  const handleRemoveMemberRow = (tempId: string) => {
    if (members.length > 1) {
      setMembers((prev) => prev.filter((m) => m.tempId !== tempId));
    }
  };

  const handleMemberChange = (tempId: string, field: string, val: any) => {
    setMembers((prev) =>
      prev.map((m) => (m.tempId === tempId ? { ...m, [field]: val } : m))
    );
  };

  const handlePhotoUpload = (tempId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 100, 100);
          const descriptor = ClientFaceMatcher.extractDescriptorFromCanvas(canvas);
          handleMemberChange(tempId, 'photoUrl', dataUrl);
          handleMemberChange(tempId, 'descriptor', descriptor);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRegisterFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentAgreed) {
      alert(t('family.consent_title') + ': Please agree to the DPDP Act consent terms.');
      return;
    }

    if (!guardianName.trim() || !guardianPhone.trim()) {
      alert('Please fill in Guardian name and mobile number.');
      return;
    }

    // Generate unique Family ID
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newFamilyId = `GM27-${randomSuffix}`;

    const newFamily: Family = {
      id: newFamilyId,
      guardian_name: guardianName.trim(),
      phone: guardianPhone.trim(),
      language: preferredLang,
      village: guardianVillage.trim(),
      stay_location: stayLocation,
      consent_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const newDbMembers: Member[] = members.map((m, idx) => ({
      id: `${newFamilyId}-${idx + 1}`,
      family_id: newFamilyId,
      name: m.name.trim() || `Member ${idx + 1}`,
      age: Number(m.age) || 10,
      relation: m.relation.trim() || 'Family Member',
      note: m.note.trim(),
      photo_url: m.photoUrl,
      face_descriptor: m.descriptor,
      status: 'safe',
      prints_used: 0,
    }));

    await db.families.add(newFamily);
    await db.members.bulkAdd(newDbMembers);

    setActiveFamilyId(newFamilyId);
    localStorage.setItem('milan_active_family_id', newFamilyId);
    setViewMode('view');
  };

  const handleSendOtp = async () => {
    if (!otpPhone.trim()) return;
    await SmsOtpGateway.sendOtp(otpPhone);
    setOtpSent(true);
    setOtpError('');
  };

  const handleVerifyOtp = async () => {
    const isValid = await SmsOtpGateway.verifyOtp(otpPhone, otpCode);
    if (isValid) {
      // Find matching family or load default
      const found = await db.families.where('phone').equals(otpPhone).first();
      if (found) {
        setActiveFamilyId(found.id);
        localStorage.setItem('milan_active_family_id', found.id);
      } else {
        // Fallback to sample seed family
        setActiveFamilyId('GM27-K7M2');
        localStorage.setItem('milan_active_family_id', 'GM27-K7M2');
      }
      setViewMode('view');
      setOtpSent(false);
      setOtpCode('');
    } else {
      setOtpError('Invalid OTP. Use test code: 123456');
    }
  };

  const handleConfirmPrintNow = async () => {
    const selected = familyMembers.filter((m) => printSelections[m.id]?.selected);
    if (selected.length === 0) {
      alert(t('family.select_all'));
      return;
    }

    for (const m of selected) {
      const kind = printSelections[m.id]?.kind || 'band';
      await db.members.update(m.id, { prints_used: (m.prints_used || 0) + 1 });
      await db.prints.add({
        id: 'PRINT-' + Date.now() + '-' + m.id,
        member_id: m.id,
        kind,
        by: 'family',
        at: new Date().toISOString(),
      });
    }

    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-chandan-border gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neel flex items-center gap-2">
            <UserPlus className="text-kesari" size={28} />
            <span>{t('family.title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted">
            {t('family.desc')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === 'view' ? (
            <>
              <button
                onClick={() => setViewMode('register')}
                className="px-4 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
              >
                {t('family.register_new_btn')}
              </button>
              <button
                onClick={() => setViewMode('otp_login')}
                className="px-3 py-2 rounded-xl bg-white hover:bg-chandan-card border border-chandan-border text-xs sm:text-sm font-semibold text-neel shadow-sm transition-colors flex items-center gap-1.5"
              >
                <LogIn size={15} />
                <span>{t('family.returning_user')}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setViewMode('view')}
              className="px-4 py-2 rounded-xl bg-chandan-card hover:bg-white border border-chandan-border text-xs sm:text-sm font-bold text-neel transition-colors"
            >
              {t('family.back_to_family')}
            </button>
          )}
        </div>
      </div>

      {/* Mode 1: Returning User OTP Login */}
      {viewMode === 'otp_login' && (
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 border-2 border-haldi shadow-sutra">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-haldi-light text-mitti">
              <KeyRound size={24} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-neel">
                {t('family.otp_title')}
              </h2>
              <div className="text-xs text-ink-muted">
                {t('app.subtitle')}
              </div>
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed mb-4">
            {t('family.otp_desc')}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('family.guardian_phone')}
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="+91 98480 23456"
                  value={otpPhone}
                  onChange={(e) => setOtpPhone(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-chandan-border bg-chandan/30 text-ink text-sm focus:border-kesari focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-3 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm whitespace-nowrap"
                >
                  {t('family.send_otp')}
                </button>
              </div>
            </div>

            {otpSent && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold text-neel mb-1">
                  {t('family.otp_code_label')}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-center text-lg font-mono font-bold tracking-widest bg-chandan/20 focus:border-kesari"
                />
                <div className="text-[11px] text-tulsi font-semibold mt-1">
                  {t('family.test_otp_hint')}
                </div>
              </div>
            )}

            {otpError && (
              <div className="text-xs font-bold text-kumkum bg-kumkum-light p-2.5 rounded-lg">
                ⚠️ {otpError}
              </div>
            )}

            {otpSent && (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-xl bg-tulsi hover:bg-green-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                {t('family.verify_otp')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Registration Form */}
      {viewMode === 'register' && (
        <form onSubmit={handleRegisterFamily} className="max-w-3xl mx-auto space-y-6">
          {/* Guardian Info Card */}
          <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra">
            <h2 className="text-lg font-serif font-bold text-neel mb-4 flex items-center gap-2">
              <User size={20} className="text-kesari" />
              <span>{t('family.guardian_heading')}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neel mb-1">
                  {t('family.guardian_name')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sitaramiah Varma"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neel mb-1">
                  {t('family.guardian_phone')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile (e.g. 9848012345)"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neel mb-1">
                  {t('family.guardian_village')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tanuku, West Godavari"
                  value={guardianVillage}
                  onChange={(e) => setGuardianVillage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari"
                />
              </div>
            </div>
          </div>

          {/* Members Dynamic List */}
          <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-chandan-border">
              <h2 className="text-lg font-serif font-bold text-neel flex items-center gap-2">
                <UserPlus size={20} className="text-godavari" />
                <span>{t('family.members_heading')}</span>
              </h2>
              <button
                type="button"
                onClick={handleAddMemberRow}
                className="text-xs font-bold text-kesari hover:text-kesari-hover flex items-center gap-1"
              >
                + {t('family.add_member')}
              </button>
            </div>

            {members.map((member, index) => (
              <div
                key={member.tempId}
                className="p-4 rounded-xl bg-chandan/30 border border-chandan-border space-y-3 relative"
              >
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMemberRow(member.tempId)}
                    className="absolute top-3 right-3 text-ink-muted hover:text-kumkum"
                    title="Remove member"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neel mb-1">
                      {t('family.member_name')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`Person ${index + 1} Name`}
                      value={member.name}
                      onChange={(e) => handleMemberChange(member.tempId, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-chandan-border text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neel mb-1">
                      {t('family.member_age')} *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={110}
                      value={member.age}
                      onChange={(e) => handleMemberChange(member.tempId, 'age', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-chandan-border text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neel mb-1">
                      {t('family.member_relation')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Child, Grandmother"
                      value={member.relation}
                      onChange={(e) => handleMemberChange(member.tempId, 'relation', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-chandan-border text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neel mb-1">
                    {t('family.medical_notes')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Speaks only Hindi, wears red shawl, diabetic"
                    value={member.note}
                    onChange={(e) => handleMemberChange(member.tempId, 'note', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-chandan-border text-sm bg-white"
                  />
                </div>

                {/* Photo & Local Vision Embedding */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-chandan-border text-xs font-semibold text-neel cursor-pointer hover:border-kesari">
                    <Camera size={16} className="text-kesari" />
                    <span>{member.photoUrl ? '✓ ' + t('family.photo_selected') : t('family.upload_photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(member.tempId, e)}
                    />
                  </label>
                  {member.photoUrl && (
                    <img
                      src={member.photoUrl}
                      alt="Thumbnail preview"
                      className="w-9 h-9 rounded-lg object-cover border border-kesari"
                    />
                  )}
                  <span className="text-[11px] text-ink-muted">
                    {t('matching.disclaimer')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* DPDP Act 2023 Explicit Plain-Language Consent */}
          <div className="bg-chandan rounded-2xl p-5 border-2 border-haldi text-xs leading-relaxed space-y-3">
            <div className="flex items-center gap-2 font-serif font-bold text-neel text-sm">
              <ShieldCheck size={18} className="text-haldi" />
              <span>{t('family.consent_title')}</span>
            </div>
            <p className="text-ink-muted">
              {t('family.consent_body')}
            </p>
            <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-kesari rounded border-chandan-border focus:ring-kesari"
              />
              <span className="font-bold text-neel">
                {t('family.consent_agree')}
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-base shadow-md transition-colors"
          >
            {t('family.save_family')}
          </button>
        </form>
      )}

      {/* Mode 3: Active Registered Family Details & Wristbands */}
      {viewMode === 'view' && currentFamily && (
        <div className="space-y-6">
          {/* Guardian Overview Badge */}
          <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-neel dark:bg-[#1E2D4A] text-amber-200 flex items-center justify-center font-serif font-bold text-2xl border border-haldi shadow-sm">
                {currentFamily.guardian_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-serif font-bold text-neel">
                    {currentFamily.guardian_name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-kesari-light text-kesari text-xs font-bold border border-kesari/30">
                    {currentFamily.id}
                  </span>
                </div>
                <div className="text-xs text-ink-muted flex flex-wrap items-center gap-3 mt-1">
                  <span>📞 {currentFamily.phone}</span>
                  <span>📍 {currentFamily.village || 'Rajamahendravaram'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-print-all-bands"
                onClick={() => openPrintStation()}
                className="px-3.5 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                title={t('family.batch_print_subtitle')}
              >
                <Printer size={15} />
                <span>{t('family.print_all_bands')}</span>
              </button>
              <button
                id="btn-register-new-family"
                onClick={() => setViewMode('register')}
                className="px-3.5 py-2 rounded-xl bg-chandan-card hover:bg-chandan border border-chandan-border text-xs font-semibold text-neel"
              >
                {t('family.register_new_btn')}
              </button>
            </div>
          </div>

          {/* Real-time Incoming Contact Access Requests Banner (DPDP Section 6) */}
          {pendingRequests && pendingRequests.length > 0 && (
            <div className="bg-gradient-to-r from-kesari-light via-haldi-light to-kesari-light p-5 rounded-2xl border-2 border-kesari shadow-sutra space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-kesari animate-bounce" />
                  <h3 className="font-serif font-bold text-base text-neel">
                    {t('family.live_requests_heading')} ({pendingRequests.length})
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-kesari uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-kesari/40">
                  DPDP Alert
                </span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {t('family.live_requests_desc')}
              </p>

              <div className="space-y-2 pt-1">
                {pendingRequests.map((req) => {
                  const targetMember = familyMembers.find((m) => m.id === req.member_id);
                  return (
                    <div
                      key={req.id}
                      className="bg-white p-3.5 rounded-xl border border-chandan-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="text-xs font-bold text-neel flex items-center gap-1.5">
                          <HeartHandshake size={14} className="text-kesari" />
                          <span>{req.requester_name}</span>
                          {req.requester_booth && (
                            <span className="text-ink-muted font-normal">({req.requester_booth})</span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-muted mt-0.5">
                          Regarding: <strong className="text-kesari">{targetMember?.name || req.member_id}</strong> • ID: <span className="font-mono">{req.member_id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRespondContactRequest(req.id, 'approved')}
                          className="px-3.5 py-1.5 rounded-xl bg-tulsi hover:bg-green-700 text-white text-xs font-bold shadow-sm transition-colors"
                        >
                          ✓ {t('family.grant_access_btn')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRespondContactRequest(req.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-chandan hover:bg-chandan-border text-xs font-semibold text-ink"
                        >
                          ✕ {t('family.reject_access_btn')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Self-Dependent Bharat & DPDP Trust Badge */}
          <div className="bg-chandan/40 rounded-2xl p-4 border border-chandan-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-neel font-serif font-bold">
              <span className="text-base">🇮🇳</span>
              <span>{t('family.self_dependent_badge')}</span>
              <span className="text-ink-muted font-sans font-normal">| {t('family.made_in_india')}</span>
            </div>
            <div className="text-[11px] text-tulsi font-semibold">
              ✓ Edge-first Encrypted • 100% Indian Data Sovereignty
            </div>
          </div>

          {/* Members Cards & Print Wristbands Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-neel flex items-center gap-2">
                <UserPlus size={20} className="text-kesari" />
                <span>{t('family.registered_members_heading')} ({familyMembers.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => openPrintStation()}
                className="text-xs text-kesari font-bold hover:underline flex items-center gap-1"
              >
                <Printer size={13} />
                <span>{t('family.print_all_bands')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl p-5 border-2 shadow-sutra transition-all flex flex-col justify-between ${
                    member.status === 'missing' ? 'border-kumkum bg-kumkum-light/20' : 'border-chandan-border'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-chandan-border">
                      <div>
                        <div className="font-serif font-bold text-lg text-neel">
                          {member.name}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {member.relation} • {member.age} {t('family.years_old')}
                        </div>
                      </div>

                      {member.status === 'missing' ? (
                        <span className="px-2.5 py-1 rounded-full bg-kumkum text-white text-xs font-bold animate-pulse flex items-center gap-1">
                          <AlertTriangle size={13} />
                          <span>{t('family.status_missing')}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-tulsi-light text-tulsi text-xs font-semibold border border-tulsi/30 flex items-center gap-1">
                          <CheckCircle size={13} />
                          <span>{t('family.status_safe')}</span>
                        </span>
                      )}
                    </div>

                    {/* Member Note */}
                    {member.note && (
                      <p className="text-xs text-ink-muted mt-3 italic bg-chandan/30 p-2.5 rounded-lg border border-chandan-border/60">
                        "{member.note}"
                      </p>
                    )}

                    {/* Band ID & Prints Left counter */}
                    <div className="mt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-mitti font-bold bg-haldi-light px-2 py-0.5 rounded border border-haldi/40">
                        {member.id}
                      </span>
                      <span className="text-ink-muted">
                        {3 - member.prints_used} {t('family.prints_left')}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Issue Band, Issue ID Card, QR Profile Preview, Mark Missing */}
                  <div className="mt-5 pt-3 border-t border-chandan-border flex flex-wrap items-center gap-2">
                    <button
                      id={`btn-print-band-${member.id}`}
                      onClick={() => openPrintStation(member.id, 'band')}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm transition-colors"
                      title={t('family.print_band')}
                    >
                      <Printer size={13} />
                      <span>{t('family.print_band')}</span>
                    </button>

                    <button
                      id={`btn-print-card-${member.id}`}
                      onClick={() => openPrintStation(member.id, 'card')}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-neel hover:bg-neel-deep text-white text-xs font-bold shadow-sm transition-colors"
                      title={t('family.print_card')}
                    >
                      <FileText size={13} />
                      <span>{t('family.print_card')}</span>
                    </button>

                    <button
                      onClick={() => setPreviewPublicProfileMemberId(member.id)}
                      className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-xl bg-chandan hover:bg-chandan-border text-neel text-xs font-bold border border-chandan-border transition-colors"
                      title="Preview what others see on QR scan"
                    >
                      <QrCode size={13} className="text-kesari" />
                      <span>Profile</span>
                    </button>

                    {member.status === 'safe' && (
                      <button
                        onClick={() => onMarkMissing(member.id)}
                        className="px-2.5 py-2 rounded-xl bg-kumkum-light hover:bg-kumkum hover:text-white text-kumkum text-xs font-bold border border-kumkum/40 transition-colors"
                      >
                        {t('family.mark_as_missing')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unified Zero-Waste Family Pass & Wristband Print Station */}
      {printStationOpen && currentFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neel/80 backdrop-blur-sm print-only">
          <div className="bg-white p-4 sm:p-6 rounded-3xl max-w-4xl w-full max-h-[96vh] overflow-y-auto border-2 border-kesari shadow-2xl text-ink">
            {/* Modal Header with Title, Back & Cross Buttons (Hidden on print) */}
            <div className="flex justify-between items-center pb-3 border-b border-chandan-border no-print gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintStationOpen(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-chandan hover:bg-chandan-border text-xs font-bold text-neel transition-colors"
                  title="Go Back"
                >
                  <ArrowLeft size={15} />
                  <span>{t('common.cancel')}</span>
                </button>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-neel flex items-center gap-1.5">
                    <Printer size={18} className="text-kesari" />
                    <span>{t('family.print_station_title')}</span>
                  </h3>
                  <span className="text-xs text-ink-muted">
                    {t('family.print_station_desc')}
                  </span>
                </div>
              </div>

              <button
                id="btn-close-print-modal"
                type="button"
                onClick={() => setPrintStationOpen(false)}
                className="p-2 rounded-full bg-chandan/70 hover:bg-kumkum-light hover:text-kumkum text-neel transition-colors shadow-sm"
                aria-label="Close Preview"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Member & Pass Selector Panel (Hidden on print) */}
            <div className="my-4 p-3 sm:p-4 rounded-2xl bg-amber-50/60 dark:bg-[#16223B] border border-amber-200/80 dark:border-amber-500/30 no-print space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neel dark:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-kesari" />
                  <span>{t('family.registered_members_heading')}</span>
                </div>
                {/* Bulk toggles */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setAllSelections(true)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#111A2E] border border-amber-300 dark:border-amber-500/40 font-semibold text-neel dark:text-slate-100 hover:bg-amber-100 transition-colors"
                  >
                    {t('family.select_all')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllSelections(false)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#111A2E] border border-amber-300 dark:border-amber-500/40 font-semibold text-ink-muted dark:text-slate-400 hover:bg-amber-100 transition-colors"
                  >
                    {t('family.clear_selection')}
                  </button>
                  <span className="text-amber-300">|</span>
                  <button
                    type="button"
                    onClick={() => setAllKinds('band')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-[#1E2D4A] border border-amber-300 dark:border-amber-500/40 font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-200 transition-colors"
                  >
                    {t('family.set_all_bands')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllKinds('card')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-[#1E2D4A] border border-amber-300 dark:border-amber-500/40 font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-200 transition-colors"
                  >
                    {t('family.set_all_cards')}
                  </button>
                </div>
              </div>

              {/* Members selection grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {familyMembers.map((m) => {
                  const isSelected = !!printSelections[m.id]?.selected;
                  const kind = printSelections[m.id]?.kind || 'band';
                  return (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-white dark:bg-[#111A2E] border-kesari/70 shadow-xs'
                          : 'bg-white/50 dark:bg-[#16223B]/50 border-amber-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <label className="flex items-center gap-2 cursor-pointer select-none min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMemberSelection(m.id)}
                          className="w-4 h-4 rounded text-kesari focus:ring-kesari border-amber-300"
                        />
                        <div className="truncate">
                          <div className="font-bold text-xs text-neel dark:text-white truncate">{m.name}</div>
                          <div className="text-[10px] text-ink-muted dark:text-slate-400">
                            {m.relation} • {m.age} {t('family.years_old')}
                          </div>
                        </div>
                      </label>

                      {/* Format toggle: Band vs Card */}
                      <div className="flex items-center gap-1 shrink-0 p-0.5 bg-amber-100/70 dark:bg-[#1E2D4A] rounded-lg border border-amber-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setMemberKind(m.id, 'band')}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                            isSelected && kind === 'band'
                              ? 'bg-kesari text-white shadow-xs'
                              : 'text-neel dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10'
                          }`}
                          title="Print as Wristband"
                        >
                          🎗️ {t('band.title').split(' ')[0]}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMemberKind(m.id, 'card')}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                            isSelected && kind === 'card'
                              ? 'bg-neel text-white shadow-xs'
                              : 'text-neel dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10'
                          }`}
                          title="Print as ID Card"
                        >
                          🪪 ID
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Zero Paper Waste Efficiency Meter */}
              <div className="flex items-center justify-between text-[11px] font-bold text-tulsi bg-tulsi-light/70 px-3 py-1.5 rounded-xl border border-tulsi/30">
                <span className="flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>{t('family.paper_save_hint')}</span>
                </span>
                <span className="font-mono text-neel">
                  {familyMembers.filter((m) => printSelections[m.id]?.selected).length} / {familyMembers.length} Selected
                </span>
              </div>
            </div>

            {/* ================================================================= */}
            {/* THE PRINTABLE SHEET (Exact physical items, only person & guardian) */}
            {/* ================================================================= */}
            <div id="printable-sheet" className="my-4 space-y-3">
              {familyMembers.filter((m) => printSelections[m.id]?.selected).length === 0 ? (
                <div className="p-8 text-center text-ink-muted border-2 border-dashed border-amber-200 rounded-2xl">
                  <Printer size={32} className="mx-auto text-amber-300 mb-2" />
                  <p className="text-xs font-semibold">{t('family.select_all')}</p>
                </div>
              ) : (
                familyMembers
                  .filter((m) => printSelections[m.id]?.selected)
                  .map((m) => {
                    const kind = printSelections[m.id]?.kind || 'band';
                    const qrUrl = memberQrMap[m.id];

                    if (kind === 'band') {
                      return (
                        <div key={m.id} className="page-break-inside-avoid space-y-1 overflow-x-auto pb-1">
                          {/* Thermal Wristband Ribbon (Standard ~28mm-32mm compact strip) */}
                          <div className="min-w-[480px] sm:min-w-0 border border-amber-300 rounded-lg p-2 bg-gradient-to-r from-amber-50 via-white to-orange-50 shadow-xs">
                            <RakshaSutraThread className="h-1.5 w-full mb-1" />
                            <div className="flex items-center justify-between gap-3">
                              {/* Left Peel & Stick Tab */}
                              <div className="w-16 bg-amber-100/90 border-r-2 border-dashed border-amber-400 p-1 flex flex-col justify-center items-center text-center shrink-0 rounded-l">
                                <span className="text-[8px] font-bold text-amber-900 uppercase">PEEL & WRAP</span>
                                <span className="text-[9px] font-mono text-amber-900 font-bold">✂ SLIT</span>
                              </div>

                              {/* Diya Logo & Fair Info */}
                              <div className="flex items-center gap-1.5 border-r border-amber-200 pr-2 shrink-0">
                                <img src="/images/diya.png" alt="Diya" className="w-7 h-7 object-contain" />
                                <div className="text-left">
                                  <div className="font-serif font-bold text-[10px] text-neel leading-none">గోదావరి పుష్కరాలు</div>
                                  <div className="text-[9px] font-bold text-kesari">PUSHKARALU 2027</div>
                                  <div className="text-[8px] text-ink-muted">Rajamahendravaram</div>
                                </div>
                              </div>

                              {/* Person & Guardian Essential Details */}
                              <div className="flex-1 min-w-0 text-left px-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif font-bold text-base text-neel truncate">{m.name}</span>
                                  <span className="text-xs text-ink-muted">({m.relation} • {m.age} {t('family.years_old')})</span>
                                  <span className="text-xs text-ink-muted">• Native: {currentFamily.village || 'Rajamahendravaram'}</span>
                                </div>
                                <div className="text-xs text-neel font-bold mt-0.5">
                                  <span>📞 {t('family.guardian_label')}: {currentFamily.guardian_name} ({currentFamily.phone})</span>
                                </div>
                                <div className="text-[10px] font-mono font-bold text-kesari mt-0.5 flex items-center gap-3">
                                  <span className="bg-kesari-light px-1.5 py-0.2 rounded border border-kesari/30">ID: {m.id}</span>
                                  <span className="text-ink-muted font-sans">🚨 Emergency: 112 / 1098</span>
                                </div>
                              </div>

                              {/* Scannable QR Code */}
                              <div className="flex flex-col items-center justify-center shrink-0 pl-2 border-l border-amber-200">
                                {qrUrl ? (
                                  <img src={qrUrl} alt="QR" className="w-18 h-18 border border-neel rounded bg-white p-0.5 shadow-xs" />
                                ) : (
                                  <div className="w-18 h-18 border border-neel rounded bg-white flex items-center justify-center text-xs">QR</div>
                                )}
                                <span className="text-[7.5px] font-bold text-neel mt-0.5">SCAN TO REUNITE</span>
                              </div>
                            </div>
                            <RakshaSutraThread className="h-1.5 w-full mt-1" />
                          </div>
                          {/* Cutting Line */}
                          <div className="text-[9px] font-mono text-center text-ink-muted tracking-widest select-none">
                            ✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ✂
                          </div>
                        </div>
                      );
                    }

                    // CR80 Pocket ID Card (Compact)
                    return (
                      <div key={m.id} className="page-break-inside-avoid max-w-md mx-auto space-y-1">
                        <div className="border-2 border-dashed border-amber-400 rounded-xl p-3 bg-gradient-to-b from-white via-amber-50/40 to-amber-100/40 shadow-xs relative">
                          <div className="flex items-center justify-between pb-1.5 border-b border-amber-200 text-left">
                            <div className="flex items-center gap-1.5">
                              <img src="/images/diya.png" alt="Diya" className="w-6 h-6 object-contain" />
                              <div>
                                <div className="text-[9px] font-serif font-bold text-neel uppercase">AP GOVT • PUSHKARALU 2027</div>
                                <div className="text-[8px] font-bold text-kesari">PILGRIM SAFETY PASS</div>
                              </div>
                            </div>
                            <span className="font-mono text-[9px] font-bold text-kesari bg-white px-1.5 py-0.5 rounded border border-kesari/40">
                              {m.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 my-2 text-left">
                            <div className="w-14 h-16 rounded bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 overflow-hidden">
                              {m.photo_url ? (
                                <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                              ) : (
                                <User size={22} className="text-kesari" />
                              )}
                            </div>

                            <div className="flex-1 text-xs min-w-0">
                              <div className="font-serif font-bold text-sm text-neel truncate">{m.name}</div>
                              <div className="text-[10.5px] text-ink-muted">
                                {m.relation} • {m.age} {t('family.years_old')}
                              </div>
                              <div className="text-[10px] text-ink-muted">
                                📍 Native: {currentFamily.village || 'Rajamahendravaram'}
                              </div>
                              <div className="text-[11px] font-bold text-neel mt-0.5">
                                📞 Guardian: {currentFamily.guardian_name} ({currentFamily.phone})
                              </div>
                            </div>

                            {qrUrl && (
                              <img src={qrUrl} alt="QR" className="w-16 h-16 border border-neel rounded bg-white p-0.5 shrink-0 shadow-xs" />
                            )}
                          </div>

                          <div className="text-[8px] font-bold text-neel border-t border-amber-200 pt-1 flex items-center justify-between">
                            <span>🚨 Helpline: 112 / 1098 Childline</span>
                            <span className="text-kesari">RTIH PS-03 PROTOCOL</span>
                          </div>
                        </div>
                        <div className="text-[8.5px] font-mono text-center text-ink-muted tracking-widest select-none">
                          ✂ - - - - - - - - - - - - - - - - - - - - - - CUT ALONG CARD BORDER - - - - - - - - - - - - - - - - - - - - - - ✂
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Print Dialog Actions (Hidden on print) */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-chandan-border no-print">
              <button
                type="button"
                onClick={() => setPrintStationOpen(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-chandan dark:bg-[#1E2D4A] hover:bg-chandan-border dark:hover:bg-[#2A3F66] text-xs font-bold text-neel dark:text-slate-200 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>{t('common.cancel')}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPrintNow}
                className="px-6 py-2.5 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-102"
              >
                <Printer size={16} />
                <span>
                  {t('family.print_now')} ({familyMembers.filter((m) => printSelections[m.id]?.selected).length})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Public Pilgrim Profile Modal Preview */}
      {previewPublicProfileMemberId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neel/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl my-auto relative">
            <button
              onClick={() => setPreviewPublicProfileMemberId(null)}
              className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-white text-neel shadow-xl hover:bg-kesari hover:text-white transition-colors border-2 border-kesari"
              title="Close Profile (Esc)"
              aria-label="Close Profile"
            >
              <X size={18} />
            </button>
            <PilgrimProfileView
              memberId={previewPublicProfileMemberId}
              onBack={() => setPreviewPublicProfileMemberId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
