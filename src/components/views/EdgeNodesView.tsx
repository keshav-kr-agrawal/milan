import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, type Case } from '../../data/db';
import {
  DiyaIcon,
  RakshaSutraThread,
  KolamDivider,
} from '../motifs/CulturalMotifs';
import {
  Wifi,
  Download,
  Upload,
  CheckCircle,
  FileCode,
  HardDrive,
  RefreshCw,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export const EdgeNodesView: React.FC = () => {
  const { t } = useTranslation();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number>(0);

  // Simulated node state
  const nodes = [
    { id: 'NODE-01', name: t('edge_nodes.node_pushkar'), ip: '192.168.4.1', ghat: 'Pushkar Ghat', lastSync: '12 mins ago', cases: 8, status: 'active' },
    { id: 'NODE-02', name: t('edge_nodes.node_kotilingala'), ip: '192.168.4.2', ghat: 'Kotilingala Ghat', lastSync: '4 mins ago', cases: 14, status: 'active' },
    { id: 'NODE-03', name: t('edge_nodes.node_gowthami'), ip: '192.168.4.3', ghat: 'Gowthami Ghat', lastSync: '28 mins ago', cases: 5, status: 'active' },
  ];

  const handleExportMaskedLookup = async () => {
    const members = await db.members.toArray();
    const families = await db.families.toArray();

    const familyMap = new Map(families.map((f) => [f.id, f]));

    // Strict DPDP Sanitization: Only First Name, Age Group, Masked Phone!
    const sanitizedLookup = members.map((m) => {
      const fam = familyMap.get(m.family_id);
      const rawPhone = fam?.phone || '+91 98480 00000';
      const maskedPhone = `${rawPhone.slice(0, 5)}*** **${rawPhone.slice(-3)}`;

      return {
        band_id: m.id,
        name: m.name.split(' ')[0], // First name only
        age_group: m.age < 13 ? 'child' : m.age > 60 ? 'elder' : 'adult',
        masked_phone: maskedPhone,
        status: m.status,
      };
    });

    const blob = new Blob([JSON.stringify(sanitizedLookup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esp32_godavari_milan_masked_lookup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportNodeDump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
          setImportStatus('Error: Invalid JSON schema. Must be an array of case objects.');
          return;
        }

        let addedCount = 0;
        for (const item of parsed) {
          if (item.id && item.type) {
            const existing = await db.cases.get(item.id);
            if (!existing) {
              await db.cases.add({
                ...item,
                source: 'node',
                queued_offline: false,
              });
              addedCount++;
            }
          }
        }

        setImportedCount(addedCount);
        setImportStatus(`Successfully verified and merged ${addedCount} offline cases from ESP32 edge node!`);
      } catch (err) {
        setImportStatus('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="pb-3 border-b border-chandan-border">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neel flex items-center gap-2">
          <Wifi size={28} className="text-kesari" />
          <span>{t('edge_nodes.title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          {t('edge_nodes.desc')}
        </p>
      </div>

      {/* Edge Node Status Grid */}
      <div className="bg-white rounded-2xl p-6 border-2 border-chandan-border shadow-sutra space-y-4">
        <h2 className="text-base font-serif font-bold text-neel flex items-center justify-between">
          <span>{t('edge_nodes.sync_status')}</span>
          <span className="text-xs text-tulsi font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tulsi animate-pulse" />
            {t('edge_nodes.operational_badge')}
          </span>
        </h2>

        <div className="divide-y divide-chandan-border">
          {nodes.map((node) => (
            <div key={node.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-sm text-neel">{node.name}</div>
                <div className="text-ink-muted">{t('edge_nodes.hotspot_ip')}: <span className="font-mono">{node.ip}</span> • {t('edge_nodes.location')}: {node.ghat}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink-muted">{t('edge_nodes.last_sync')}: <strong>{node.lastSync}</strong></span>
                <span className="px-2 py-0.5 rounded bg-tulsi-light text-tulsi font-bold">{node.cases} {t('edge_nodes.cases_count')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Actions: Export & Import */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export Masked Lookup */}
        <div className="bg-white rounded-2xl p-6 border-2 border-kesari shadow-sutra flex flex-col justify-between space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-kesari-light text-kesari flex items-center justify-center mb-2">
              <Download size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-neel">
              {t('edge_nodes.export_lookup_btn')}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {t('edge_nodes.export_desc')}
            </p>
          </div>
          <button
            onClick={handleExportMaskedLookup}
            className="w-full py-3 rounded-xl bg-kesari hover:bg-kesari-hover text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2"
          >
            <Download size={15} />
            <span>{t('edge_nodes.download_btn')}</span>
          </button>
        </div>

        {/* Import Node Dump */}
        <div className="bg-white rounded-2xl p-6 border-2 border-godavari shadow-sutra flex flex-col justify-between space-y-3">
          <div>
            <div className="w-10 h-10 rounded-xl bg-godavari-light text-godavari flex items-center justify-center mb-2">
              <Upload size={20} />
            </div>
            <h3 className="font-serif font-bold text-base text-neel">
              {t('edge_nodes.import_node_dump')}
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              {t('edge_nodes.import_desc')}
            </p>
          </div>

          <label className="w-full py-3 rounded-xl bg-godavari hover:bg-teal-800 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 cursor-pointer text-center">
            <Upload size={15} />
            <span>{t('edge_nodes.select_file_btn')}</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportNodeDump}
            />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-tulsi-light text-tulsi text-xs font-bold border border-tulsi/30 flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={18} />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Docs link */}
      <div className="p-4 rounded-xl bg-chandan border border-haldi/60 text-xs text-ink flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-kesari" />
          <span>{t('edge_nodes.spec_title')}</span>
        </div>
        <span className="font-mono text-mitti font-bold">/docs/edge-node.md</span>
      </div>
    </div>
  );
};
