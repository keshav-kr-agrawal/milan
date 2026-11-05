import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../data/db';
import { OfflineSyncQueue } from '../../services/adapters';
import { Wifi, WifiOff, Users, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export const StatusStrip: React.FC = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queuedCount, setQueuedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Reactive DB queries
  const openCasesCount = useLiveQuery(() => db.cases.where('status').equals('open').count(), [], 2);
  const reunitedCount = useLiveQuery(() => db.cases.where('status').equals('reunited').count(), [], 1);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);
      await OfflineSyncQueue.syncPendingCases();
      setIsSyncing(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = OfflineSyncQueue.subscribe((count) => {
      setQueuedCount(count);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await OfflineSyncQueue.syncPendingCases();
    setIsSyncing(false);
  };

  return (
    <div className="bg-gradient-to-r from-chandan via-chandan-card to-chandan border-b border-chandan-border px-3 sm:px-6 py-2 shadow-sm text-xs text-ink select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Network & Offline Status in single active language */}
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tulsi-light text-tulsi font-bold border border-tulsi/30 shadow-xs">
              <Wifi size={14} className="text-tulsi animate-pulse" />
              <span>{t('status_strip.online')}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-kumkum-light text-kumkum font-bold border border-kumkum/40 shadow-xs">
              <WifiOff size={14} />
              <span>{t('status_strip.offline')}</span>
            </span>
          )}

          {queuedCount > 0 && (
            <button
              onClick={handleManualSync}
              disabled={isSyncing || !isOnline}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-haldi-light text-mitti border border-haldi/60 font-bold hover:bg-haldi transition-colors shadow-xs"
              title="Click to sync queued reports"
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>
                {queuedCount} {t('status_strip.queued_reports')}
              </span>
            </button>
          )}
        </div>

        {/* Live Festival Safety KPIs with Single Active Language */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap font-medium">
          <div className="flex items-center gap-1.5 text-kumkum">
            <Users size={15} />
            <span className="text-xs">
              {t('status_strip.open_cases')}:
            </span>
            <strong className="font-bold text-ink bg-kumkum-light px-2 py-0.5 rounded-full border border-kumkum/30">
              {openCasesCount}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 text-godavari">
            <CheckCircle size={15} />
            <span className="text-xs">
              {t('status_strip.reunited_count')}:
            </span>
            <strong className="font-bold text-ink bg-godavari-light px-2 py-0.5 rounded-full border border-godavari/30">
              {reunitedCount}
            </strong>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-mitti">
            <Clock size={15} />
            <span className="text-xs">{t('status_strip.avg_reunite_time')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusStrip;
