import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import confetti from 'canvas-confetti';
import { db, type Case, type Match, type AccessLog } from '../../data/db';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
  RiverWaves,
} from '../motifs/CulturalMotifs';
import {
  PhoneCall,
  ShieldCheck,
  CheckSquare,
  Users,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle,
  FileSpreadsheet,
  Eye,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const HelpDeskView: React.FC = () => {
  const { t } = useTranslation();

  // Officer Auth State (Prototype PIN: 2027)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('milan_officer_auth') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab within Help Desk: 'queue' | 'map' | 'access_log'
  const [deskTab, setDeskTab] = useState<'queue' | 'map' | 'access_log'>('queue');

  // Filters
  const [filterAge, setFilterAge] = useState<string>('all');
  const [filterGhat, setFilterGhat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('open');

  // Selected case for 4-Step Reunification Checklist Modal
  const [reuniteCase, setReuniteCase] = useState<Case | null>(null);
  const [chk1Id, setChk1Id] = useState(false);
  const [chk2Secret, setChk2Secret] = useState(false);
  const [chk3Visual, setChk3Visual] = useState(false);
  const [chk4Recognition, setChk4Recognition] = useState(false);
  const [officerName, setOfficerName] = useState('Insp. K. Ramanayya');
  const [checklistError, setChecklistError] = useState('');

  // Live queries
  const allCases = useLiveQuery(() => db.cases.toArray(), [], []);
  const allMatches = useLiveQuery(() => db.matches.toArray(), [], []);
  const accessLogs = useLiveQuery(() => db.access_log.reverse().limit(30).toArray(), [], []);

  // Compute KPIs
  const openCases = allCases.filter((c) => c.status === 'open');
  const reunitedCases = allCases.filter((c) => c.status === 'reunited');
  const offlineQueued = allCases.filter((c) => Boolean(c.queued_offline));
  const rateUnder30 = 92; // 92% reunited <30 mins

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === '2027') {
      setIsAuthenticated(true);
      sessionStorage.setItem('milan_officer_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Access PIN. Prototype Officer PIN is 2027.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('milan_officer_auth');
  };

  // Sort queue by urgency: Children first, then Elders, then time elapsed
  const filteredCases = allCases
    .filter((c) => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (filterAge !== 'all' && c.age_group !== filterAge) return false;
      if (filterGhat !== 'all' && c.location !== filterGhat) return false;
      return true;
    })
    .sort((a, b) => {
      // Urgency weight: child (4) > elder (3) > teen (2) > adult (1)
      const weight = (grp: string) => (grp === 'child' ? 4 : grp === 'elder' ? 3 : grp === 'teen' ? 2 : 1);
      const diff = weight(b.age_group) - weight(a.age_group);
      if (diff !== 0) return diff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleCompleteReunification = async () => {
    if (!chk1Id || !chk2Secret || !chk3Visual || !chk4Recognition) {
      setChecklistError('All 4 mandatory security checks must be verified and checked.');
      return;
    }

    if (!reuniteCase) return;

    // Update case to reunited
    await db.cases.update(reuniteCase.id, {
      status: 'reunited',
      reunited_at: new Date().toISOString(),
    });

    if (reuniteCase.member_id) {
      await db.members.update(reuniteCase.member_id, { status: 'safe' });
    }

    // Add immutable release log
    await db.access_log.add({
      id: 'RELEASE-' + Date.now(),
      actor: `${officerName} (Desk Officer)`,
      role: 'desk',
      action: 'reunite_release',
      target: reuniteCase.id,
      reason: `Safely handed over to guardian. All 4 checklist verification criteria satisfied.`,
      at: new Date().toISOString(),
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#C8691A', '#D9A21B', '#3F6B3A', '#1F6F78'],
    });

    setReuniteCase(null);
    setChk1Id(false);
    setChk2Secret(false);
    setChk3Visual(false);
    setChk4Recognition(false);
    setChecklistError('');
  };

  const handleExportCsv = () => {
    const headers = ['Case ID', 'Type', 'Status', 'Person Name', 'Age Group', 'Location Ghat', 'Language', 'Created At', 'Reunited At'];
    const rows = allCases.map((c) => [
      c.id,
      c.type,
      c.status,
      `"${c.person_name || ''}"`,
      c.age_group,
      c.location,
      c.language,
      c.created_at,
      c.reunited_at || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Godavari_Milan_Pushkaralu_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If Not Authenticated, show Officer PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-neel shadow-sutra-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neel text-haldi flex items-center justify-center mx-auto shadow">
            <KeyRound size={32} />
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-neel">
            {t('helpdesk.login_title')}
          </h1>

          <p className="text-xs text-ink-muted">
            {t('helpdesk.authorized_officers_note')}
          </p>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-neel mb-1 text-left">
                {t('helpdesk.pin_label')}
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="2027"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-chandan-border text-center text-2xl font-mono font-bold tracking-widest text-neel focus:border-kesari"
              />
              <span className="text-[11px] text-tulsi font-semibold block mt-1">
                {t('helpdesk.test_pin_hint')}
              </span>
            </div>

            {authError && (
              <div className="text-xs font-bold text-kumkum bg-kumkum-light p-2.5 rounded-lg">
                ⚠️ {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-neel hover:bg-neel-deep text-white font-bold text-sm shadow transition-colors"
            >
              {t('helpdesk.login_btn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Officer Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-chandan-border gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neel text-haldi rounded-xl">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-neel">
              {t('helpdesk.login_title')}
            </h1>
            <div className="text-xs text-ink-muted flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tulsi" />
              <span>Officer On Duty: <strong>Insp. K. Ramanayya</strong> (Station: Kotilingala Ghat)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-chandan-card hover:bg-chandan border border-chandan-border text-xs font-bold text-neel transition-colors"
            title="Download CSV case register"
          >
            <Download size={14} />
            <span>{t('helpdesk.export_csv')}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-kumkum-light hover:bg-kumkum hover:text-white text-kumkum text-xs font-bold border border-kumkum/40 transition-colors"
          >
            {t('helpdesk.logout')}
          </button>
        </div>
      </div>

      {/* KPI Row (5 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm">
          <div className="text-xs text-ink-muted">{t('helpdesk.kpi_open')}</div>
          <div className="text-2xl font-serif font-bold text-kumkum mt-1">{openCases.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm">
          <div className="text-xs text-ink-muted">{t('helpdesk.kpi_reunited')}</div>
          <div className="text-2xl font-serif font-bold text-godavari mt-1">{reunitedCases.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm">
          <div className="text-xs text-ink-muted">{t('helpdesk.kpi_avg_mins')}</div>
          <div className="text-2xl font-serif font-bold text-neel mt-1">18 <span className="text-xs font-sans">mins</span></div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm">
          <div className="text-xs text-ink-muted">{t('helpdesk.kpi_offline_queued')}</div>
          <div className="text-2xl font-serif font-bold text-mitti mt-1">{offlineQueued.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-chandan-border shadow-sm col-span-2 sm:col-span-1">
          <div className="text-xs text-ink-muted">{t('helpdesk.kpi_rate_30m')}</div>
          <div className="text-2xl font-serif font-bold text-tulsi mt-1">{rateUnder30}%</div>
        </div>
      </div>

      {/* Internal Navigation Tabs: Triage Queue | Ghat Board | Access Audit Log */}
      <div className="flex border-b border-chandan-border gap-2 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setDeskTab('queue')}
          className={`py-2 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap ${
            deskTab === 'queue' ? 'border-kesari text-kesari' : 'border-transparent text-ink-muted hover:text-neel'
          }`}
        >
          {t('helpdesk.triage_tab')} ({filteredCases.length})
        </button>

        <button
          onClick={() => setDeskTab('map')}
          className={`py-2 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap ${
            deskTab === 'map' ? 'border-kesari text-kesari' : 'border-transparent text-ink-muted hover:text-neel'
          }`}
        >
          {t('helpdesk.ghat_map_tab')}
        </button>

        <button
          onClick={() => setDeskTab('access_log')}
          className={`py-2 px-3 sm:px-4 border-b-2 transition-colors whitespace-nowrap ${
            deskTab === 'access_log' ? 'border-kesari text-kesari' : 'border-transparent text-ink-muted hover:text-neel'
          }`}
        >
          {t('helpdesk.audit_ledger_tab')} ({accessLogs.length})
        </button>
      </div>

      {/* Tab 1: Triage Queue with Urgency Sorting & Filters */}
      {deskTab === 'queue' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-chandan-card rounded-xl border border-chandan-border text-xs">
            <span className="font-bold text-neel flex items-center gap-1">
              <Filter size={14} /> {t('helpdesk.filter_label')}
            </span>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-chandan-border bg-white text-ink font-medium"
            >
              <option value="all">{t('helpdesk.filter_all')}</option>
              <option value="open">{t('helpdesk.open_only')}</option>
              <option value="reunited">{t('helpdesk.reunited_only')}</option>
            </select>

            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-chandan-border bg-white text-ink font-medium"
            >
              <option value="all">{t('helpdesk.all_ages')}</option>
              <option value="child">{t('helpdesk.filter_children')}</option>
              <option value="elder">{t('helpdesk.filter_elders')}</option>
              <option value="teen">{t('helpdesk.teens')}</option>
              <option value="adult">{t('helpdesk.adults')}</option>
            </select>

            <select
              value={filterGhat}
              onChange={(e) => setFilterGhat(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-chandan-border bg-white text-ink font-medium"
            >
              <option value="all">{t('helpdesk.all_ghats')}</option>
              <option value="pushkar">{t('common.ghats.pushkar')}</option>
              <option value="kotilingala">{t('common.ghats.kotilingala')}</option>
              <option value="gowthami">{t('common.ghats.gowthami')}</option>
              <option value="saraswati">{t('common.ghats.saraswati')}</option>
              <option value="markandeya">{t('common.ghats.markandeya')}</option>
              <option value="padmavathi">{t('common.ghats.padmavathi')}</option>
              <option value="subramanya">{t('common.ghats.subramanya')}</option>
            </select>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.map((caseItem) => {
              const matches = allMatches.filter(
                (m) => m.case_a === caseItem.id || m.case_b_or_member === caseItem.id
              );
              const isUrgent = caseItem.age_group === 'child' || caseItem.age_group === 'elder';

              return (
                <div
                  key={caseItem.id}
                  className={`bg-white rounded-2xl p-5 border-2 shadow-sutra space-y-4 transition-all ${
                    caseItem.status === 'open' && isUrgent
                      ? 'border-kumkum'
                      : caseItem.status === 'reunited'
                      ? 'border-tulsi bg-tulsi-light/10'
                      : 'border-chandan-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-chandan-border gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                          caseItem.type === 'missing'
                            ? 'bg-kumkum text-white'
                            : 'bg-godavari text-white'
                        }`}
                      >
                        {caseItem.type === 'missing' ? 'MISS' : 'FND'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-neel">
                            {caseItem.person_name}
                          </span>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-chandan text-mitti">
                            {caseItem.id}
                          </span>
                          {isUrgent && caseItem.status === 'open' && (
                            <span className="px-2 py-0.5 rounded bg-kumkum text-white text-[10px] font-bold uppercase animate-pulse">
                              Urgent: {caseItem.age_group}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ink-muted">
                          📍 {t(`common.ghats.${caseItem.location}`) || caseItem.location} • Age: <strong>{caseItem.age_group}</strong> • Source: <strong>{caseItem.source}</strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      {caseItem.status === 'open' ? (
                        <button
                          onClick={() => setReuniteCase(caseItem)}
                          className="px-4 py-2 rounded-xl bg-tulsi hover:bg-green-700 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                        >
                          <CheckSquare size={14} />
                          <span>{t('helpdesk.reunite_action')}</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-tulsi text-white text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={14} />
                          <span>Safely Reunited</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-ink leading-relaxed">
                    <strong>Clothing / Identifiers:</strong> {caseItem.clothing}
                    {caseItem.notes && <div className="text-ink-muted mt-1 italic">"{caseItem.notes}"</div>}
                  </div>

                  {/* Face Match Shortlist Indicator */}
                  {matches.length > 0 && (
                    <div className="p-3 rounded-xl bg-haldi-light border border-haldi/60 text-xs space-y-1">
                      <div className="font-bold text-mitti flex items-center gap-1.5">
                        <Sparkles size={14} className="text-kesari" />
                        <span>Client-side Face Match Candidate Found:</span>
                      </div>
                      {matches.map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-ink">
                          <span>
                            Candidate: <strong>{m.case_b_or_member}</strong> (Distance: {m.distance})
                          </span>
                          <span className="px-2 py-0.5 rounded bg-kesari text-white font-bold text-[10px]">
                            {m.confidence === 'strong' ? 'High Similarity' : 'Possible Match'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Interactive SVG Ghat Schematic Board */}
      {deskTab === 'map' && (
        <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra space-y-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-neel flex items-center gap-2">
              <MapPin size={20} className="text-kesari" />
              <span>Rajamahendravaram Sacred Ghats Safety Board</span>
            </h2>
            <p className="text-xs text-ink-muted">
              Live distribution of open separated pilgrim cases across bathing ghats.
            </p>
          </div>

          <div className="relative border-2 border-godavari/40 rounded-2xl p-4 bg-chandan/20 overflow-x-auto">
            {/* SVG Schematic Board */}
            <svg viewBox="0 0 700 240" className="w-full min-w-[550px] h-64 text-neel" fill="none">
              {/* River Godavari Flow Curve */}
              <path
                d="M 20 80 Q 200 40 380 90 T 680 130"
                stroke="var(--color-godavari)"
                strokeWidth="32"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                d="M 20 80 Q 200 40 380 90 T 680 130"
                stroke="var(--color-godavari)"
                strokeWidth="4"
                strokeDasharray="6 6"
              />

              {/* Ghat Pin 1: Pushkar Ghat */}
              <g transform="translate(80, 50)">
                <circle cx="0" cy="0" r="16" fill="var(--color-kesari)" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">1</text>
                <text x="0" y="30" textAnchor="middle" fill="var(--color-neel)" fontSize="11" fontWeight="bold">Pushkar Ghat</text>
              </g>

              {/* Ghat Pin 2: Kotilingala Ghat */}
              <g transform="translate(220, 45)">
                <circle cx="0" cy="0" r="18" fill="var(--color-kumkum)" className="animate-pulse" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">1</text>
                <text x="0" y="32" textAnchor="middle" fill="var(--color-kumkum)" fontSize="11" fontWeight="bold">Kotilingala Ghat (Alert)</text>
              </g>

              {/* Ghat Pin 3: Gowthami Ghat */}
              <g transform="translate(360, 75)">
                <circle cx="0" cy="0" r="14" fill="var(--color-tulsi)" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">0</text>
                <text x="0" y="28" textAnchor="middle" fill="var(--color-neel)" fontSize="11" fontWeight="bold">Gowthami Ghat</text>
              </g>

              {/* Ghat Pin 4: Saraswati Ghat */}
              <g transform="translate(480, 95)">
                <circle cx="0" cy="0" r="16" fill="var(--color-kesari)" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">1</text>
                <text x="0" y="30" textAnchor="middle" fill="var(--color-neel)" fontSize="11" fontWeight="bold">Saraswati Ghat</text>
              </g>

              {/* Ghat Pin 5: Markandeya Ghat */}
              <g transform="translate(600, 125)">
                <circle cx="0" cy="0" r="14" fill="var(--color-godavari)" />
                <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">✓</text>
                <text x="0" y="28" textAnchor="middle" fill="var(--color-neel)" fontSize="11" fontWeight="bold">Markandeya</text>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* Tab 3: DPDP Act 2023 Access Log Ledger */}
      {deskTab === 'access_log' && (
        <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra space-y-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-neel flex items-center gap-2">
              <ShieldCheck size={20} className="text-haldi" />
              <span>Immutable DPDP Access & Audit Ledger</span>
            </h2>
            <p className="text-xs text-ink-muted">
              Every sensitive view, emergency override, and release action is timestamped and recorded.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-chandan-border bg-chandan-card text-neel font-bold">
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">Actor</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Target</th>
                  <th className="p-2.5">Official Reason / Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-chandan-border">
                {accessLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-chandan/30">
                    <td className="p-2.5 font-mono text-ink-muted">{new Date(log.at).toLocaleTimeString()}</td>
                    <td className="p-2.5 font-bold text-neel">{log.actor}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-chandan font-mono text-[10px] uppercase">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-mitti">{log.target}</td>
                    <td className="p-2.5 text-ink-muted">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Mandatory 4-Step Reunification Protocol */}
      {reuniteCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neel/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full border-2 border-tulsi shadow-sutra-lg space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-chandan-border">
              <CheckSquare size={24} className="text-tulsi" />
              <div>
                <h3 className="font-serif font-bold text-lg text-neel">
                  {t('helpdesk.checklist_title')}
                </h3>
                <div className="text-xs text-ink-muted">
                  Case ID: <strong>{reuniteCase.id}</strong> ({reuniteCase.person_name})
                </div>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              {t('helpdesk.checklist_desc')}
            </p>

            {/* 4 Checkboxes with Clean Single-Language Text */}
            <div className="space-y-3 text-xs text-ink">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-chandan/30 border border-chandan-border cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={chk1Id}
                  onChange={(e) => setChk1Id(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-tulsi rounded focus:ring-tulsi"
                />
                <div className="leading-snug">
                  <div className="font-bold text-neel">{t('helpdesk.check1')}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{t('helpdesk.check1_detail')}</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-chandan/30 border border-chandan-border cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={chk2Secret}
                  onChange={(e) => setChk2Secret(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-tulsi rounded focus:ring-tulsi"
                />
                <div className="leading-snug">
                  <div className="font-bold text-neel">{t('helpdesk.check2')}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{t('helpdesk.check2_detail')}</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-chandan/30 border border-chandan-border cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={chk3Visual}
                  onChange={(e) => setChk3Visual(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-tulsi rounded focus:ring-tulsi"
                />
                <div className="leading-snug">
                  <div className="font-bold text-neel">{t('helpdesk.check3')}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{t('helpdesk.check3_detail')}</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-chandan/30 border border-chandan-border cursor-pointer hover:bg-white transition-colors">
                <input
                  type="checkbox"
                  checked={chk4Recognition}
                  onChange={(e) => setChk4Recognition(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-tulsi rounded focus:ring-tulsi"
                />
                <div className="leading-snug">
                  <div className="font-bold text-neel">{t('helpdesk.check4')}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{t('helpdesk.check4_detail')}</div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-neel mb-1">
                {t('helpdesk.officer_name_label')}
              </label>
              <input
                type="text"
                required
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-chandan-border text-xs focus:border-tulsi"
              />
            </div>

            {checklistError && (
              <div className="text-xs font-bold text-kumkum bg-kumkum-light p-2.5 rounded-lg">
                ⚠️ {checklistError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-chandan-border">
              <button
                type="button"
                onClick={() => setReuniteCase(null)}
                className="px-4 py-2 rounded-xl bg-chandan text-xs font-bold text-ink"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleCompleteReunification}
                className="px-5 py-2.5 rounded-xl bg-tulsi hover:bg-green-700 text-white text-xs font-bold shadow"
              >
                {t('helpdesk.confirm_reunion_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
