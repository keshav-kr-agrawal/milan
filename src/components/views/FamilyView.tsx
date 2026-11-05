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
} from 'lucide-react';

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

  // Selected member for printing band / card
  const [printMember, setPrintMember] = useState<Member | null>(null);
  const [printKind, setPrintKind] = useState<'band' | 'card'>('band');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

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

  // Generate QR code whenever printable member changes
  useEffect(() => {
    if (printMember) {
      QRCode.toDataURL(`GM27:${printMember.id}`, {
        errorCorrectionLevel: 'M',
        width: 250,
        margin: 1,
        color: {
          dark: '#1A1A2E',
          light: '#FFFFFF',
        },
      }).then((url) => setQrDataUrl(url));
    }
  }, [printMember]);

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

  const handlePrint = async (member: Member, kind: 'band' | 'card') => {
    if (member.prints_used >= 3) {
      alert(t('family.print_limit_reached'));
      return;
    }

    // Increment print counter
    await db.members.update(member.id, { prints_used: member.prints_used + 1 });
    await db.prints.add({
      id: 'PRINT-' + Date.now(),
      member_id: member.id,
      kind,
      by: 'family',
      at: new Date().toISOString(),
    });

    setPrintMember({ ...member, prints_used: member.prints_used + 1 });
    setPrintKind(kind);

    setTimeout(() => {
      window.print();
    }, 300);
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

              <div>
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

              <div>
                <label className="block text-xs font-bold text-neel mb-1">
                  {t('family.stay_location')}
                </label>
                <select
                  value={stayLocation}
                  onChange={(e) => setStayLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-chandan-border text-sm focus:border-kesari bg-white"
                >
                  <option value="pushkar">{t('common.ghats.pushkar')}</option>
                  <option value="kotilingala">{t('common.ghats.kotilingala')}</option>
                  <option value="gowthami">{t('common.ghats.gowthami')}</option>
                  <option value="saraswati">{t('common.ghats.saraswati')}</option>
                  <option value="markandeya">{t('common.ghats.markandeya')}</option>
                </select>
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
              <div className="w-14 h-14 rounded-2xl bg-neel text-chandan flex items-center justify-center font-serif font-bold text-2xl border border-haldi shadow-sm">
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
                  <span>⛺ {t(`common.ghats.${currentFamily.stay_location}`) || currentFamily.stay_location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('register')}
                className="px-3.5 py-2 rounded-xl bg-chandan-card hover:bg-chandan border border-chandan-border text-xs font-semibold text-neel"
              >
                {t('family.register_new_btn')}
              </button>
            </div>
          </div>

          {/* Members Cards & Print Wristbands Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-neel flex items-center gap-2">
              <UserPlus size={20} className="text-kesari" />
              <span>{t('family.registered_members_heading')} ({familyMembers.length})</span>
            </h3>

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

                  {/* Actions: Issue Band, Issue ID Card, Mark Missing */}
                  <div className="mt-5 pt-3 border-t border-chandan-border flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handlePrint(member, 'band')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-kesari hover:bg-kesari-hover text-white text-xs font-bold shadow-sm transition-colors"
                      title={t('family.print_band')}
                    >
                      <Printer size={14} />
                      <span>{t('family.print_band')}</span>
                    </button>

                    <button
                      onClick={() => handlePrint(member, 'card')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neel hover:bg-neel-deep text-white text-xs font-bold shadow-sm transition-colors"
                      title={t('family.print_card')}
                    >
                      <FileText size={14} />
                      <span>{t('family.print_card')}</span>
                    </button>

                    {member.status === 'safe' && (
                      <button
                        onClick={() => onMarkMissing(member.id)}
                        className="px-3 py-2 rounded-xl bg-kumkum-light hover:bg-kumkum hover:text-white text-kumkum text-xs font-bold border border-kumkum/40 transition-colors"
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

      {/* Hidden / Modal Print Preview Section (Waterproof Band 25x200mm & ID Card CR80) */}
      {printMember && currentFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neel/80 backdrop-blur-sm print-only">
          <div className="bg-white p-4 sm:p-6 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border-2 border-kesari shadow-sutra-lg text-ink">
            <div className="flex justify-between items-center pb-3 border-b border-chandan-border no-print">
              <h3 className="font-serif font-bold text-base sm:text-lg text-neel">
                {t('family.print_preview')}: {printKind === 'band' ? t('band.title') : t('band.card_title')}
              </h3>
              <button
                onClick={() => setPrintMember(null)}
                className="px-3 py-1 rounded bg-chandan hover:bg-chandan-border text-xs font-bold text-neel transition-colors"
              >
                {t('common.close')}
              </button>
            </div>

            {/* Printable Strip: 25 x 200 mm approx layout */}
            {printKind === 'band' ? (
              <div className="my-4 p-4 border-2 border-dashed border-mitti rounded-xl bg-chandan/20 flex flex-col items-center max-w-full overflow-x-auto">
                <RakshaSutraThread className="h-1 mb-2 w-full" />
                <div className="flex items-center justify-between w-full gap-3 text-xs min-w-[280px]">
                  <div>
                    <div className="font-serif font-bold text-base text-neel">
                      {printMember.name}
                    </div>
                    <div className="text-[11px] text-ink-muted">
                      {t('family.guardian_label')}: {currentFamily.guardian_name} ({currentFamily.phone})
                    </div>
                    <div className="font-mono font-bold text-kesari mt-1">
                      {printMember.id}
                    </div>
                  </div>

                  {qrDataUrl && (
                    <img src={qrDataUrl} alt="Band QR Code" className="w-20 h-20 border border-ink shrink-0" />
                  )}
                </div>

                <div className="mt-3 text-[10px] text-center font-bold text-neel leading-tight border-t border-haldi pt-1.5 w-full">
                  {t('family.band_emergency_note')}
                </div>
                <RakshaSutraThread className="h-1 mt-2 w-full" />
              </div>
            ) : (
              /* Printable CR80 Pocket ID Card: 85.6 x 54 mm ratio */
              <div className="my-4 p-4 border-2 border-neel rounded-2xl bg-chandan/30 flex flex-col justify-between h-56 max-w-sm mx-auto shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-haldi">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-neel text-xs">
                    <DiyaIcon size={18} />
                    <span>{t('app.subtitle')}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-kesari">{printMember.id}</span>
                </div>

                <div className="flex items-center gap-3 my-2">
                  {qrDataUrl && (
                    <img src={qrDataUrl} alt="Card QR" className="w-20 h-20 border border-neel rounded shrink-0" />
                  )}
                  <div className="text-xs">
                    <div className="font-bold text-sm text-neel">{printMember.name}</div>
                    <div className="text-ink-muted">{t('family.age_label')}: {printMember.age} • {printMember.relation}</div>
                    <div className="text-ink-muted mt-1">{t('family.guardian_label')}: {currentFamily.guardian_name}</div>
                    <div className="font-bold text-mitti">{currentFamily.phone}</div>
                  </div>
                </div>

                <div className="text-[10px] text-center text-neel font-bold border-t border-haldi pt-1">
                  {t('family.card_emergency_note')}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4 no-print">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-sm shadow-md transition-colors"
              >
                {t('family.print_now')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
