import React, { useState } from 'react';
import { 
  Satellite, 
  FileText, 
  BellRing, 
  Globe, 
  PlusCircle, 
  CheckCircle, 
  Loader2, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AuditReportModal } from './AuditReportModal';

interface QuickActionsProps {
  shipments: CoffeeShipment[];
  onOpenNewShipmentModal: () => void;
  onSyncSatellite: () => void;
  onBatchRemindCoops: () => void;
  onTestTracesGateway: () => void;
  onBatchAutoVerify?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  shipments,
  onOpenNewShipmentModal,
  onSyncSatellite,
  onBatchRemindCoops,
  onTestTracesGateway,
  onBatchAutoVerify = () => {}
}) => {
  const { t, language } = useLanguage();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSyncingSatellite, setIsSyncingSatellite] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [isTestingGateway, setIsTestingGateway] = useState(false);
  const [isBatchVerifying, setIsBatchVerifying] = useState(false);
  const [lastSatelliteSyncTime, setLastSatelliteSyncTime] = useState<string | null>(null);
  const [gatewayStatus, setGatewayStatus] = useState<'idle' | 'online'>('online');
  const [gatewayLatency, setGatewayLatency] = useState<number>(84);

  const missingDocsShipments = shipments.filter(s => s.status === 'Missing Documents');

  const handleSatelliteSync = () => {
    if (isSyncingSatellite) return;
    setIsSyncingSatellite(true);

    setTimeout(() => {
      setIsSyncingSatellite(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSatelliteSyncTime(timeStr);
      onSyncSatellite();
    }, 1200);
  };

  const handleRemindCoops = () => {
    if (isSendingReminder) return;
    setIsSendingReminder(true);

    setTimeout(() => {
      setIsSendingReminder(false);
      onBatchRemindCoops();
    }, 1000);
  };

  const handleBatchVerifyAction = () => {
    onBatchAutoVerify();
  };

  const handleTestGateway = () => {
    if (isTestingGateway) return;
    setIsTestingGateway(true);

    setTimeout(() => {
      setIsTestingGateway(false);
      setGatewayLatency(Math.floor(65 + Math.random() * 45));
      setGatewayStatus('online');
      onTestTracesGateway();
    }, 900);
  };

  return (
    <>
      <div id="quick-actions-panel" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('quickActionsTitle')}</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                Utilitarian Toolkit
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('quickActionsSub')}
            </p>
          </div>

          {/* Real-time Gateway status badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            {missingDocsShipments.length > 0 && (
              <button
                type="button"
                id="quick-actions-batch-verify-header-btn"
                onClick={handleBatchVerifyAction}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold font-mono text-[11px] shadow-xs cursor-pointer transition-all animate-pulse"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{language === 'vi' ? `Thẩm Định Tự Động (${missingDocsShipments.length})` : `Batch Auto-Verify (${missingDocsShipments.length})`}</span>
              </button>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TRACES-NT {gatewayLatency}ms</span>
            </span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Action 1: Batch Auto-Verify (Promoted Priority Action) */}
          <button
            type="button"
            id="quick-action-batch-auto-verify-card"
            onClick={handleBatchVerifyAction}
            className={`p-3.5 rounded-xl border transition-all text-left group flex flex-col justify-between cursor-pointer active:scale-98 relative overflow-hidden ${
              missingDocsShipments.length > 0
                ? 'border-amber-300 dark:border-amber-700/80 bg-gradient-to-br from-amber-500/10 via-amber-50/50 dark:via-amber-950/30 to-transparent hover:border-amber-400 dark:hover:border-amber-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shadow-xs">
                  <Zap className="w-4 h-4 fill-amber-500/30" />
                </div>
                {missingDocsShipments.length > 0 ? (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 animate-pulse">
                    {missingDocsShipments.length} {language === 'vi' ? 'cần duyệt' : 'pending'}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    100% Verified
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {t('qaBatchAutoVerify')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {t('qaBatchAutoVerifyDesc')}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>AI + PKI Stamping</span>
              </span>
              <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>{language === 'vi' ? 'Chạy Mô Phỏng' : 'Simulate'} →</span>
              </span>
            </div>
          </button>

          {/* Action 2: Sync Satellite Data */}
          <button
            type="button"
            onClick={handleSatelliteSync}
            disabled={isSyncingSatellite}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700/80 transition-all text-left group flex flex-col justify-between cursor-pointer active:scale-98 disabled:opacity-75"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                  {isSyncingSatellite ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  ) : (
                    <Satellite className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  Sentinel-2
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {isSyncingSatellite ? t('qaSyncing') : t('qaSyncSatellite')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {t('qaSyncSatelliteDesc')}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-750 flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span>0.00% Canopy Loss</span>
              </span>
              <span>{lastSatelliteSyncTime ? `Synced ${lastSatelliteSyncTime}` : 'Live Auto-Sync'}</span>
            </div>
          </button>

          {/* Action 3: Export Audit Report */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700/80 transition-all text-left group flex flex-col justify-between cursor-pointer active:scale-98"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  EU 2023/1115
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {t('qaExportReport')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {t('qaExportReportDesc')}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-750 flex items-center justify-between text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              <span>PDF • CSV • JSON</span>
              <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>Open Dossier</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </button>

          {/* Action 4: Test TRACES-NT Gateway */}
          <button
            type="button"
            onClick={handleTestGateway}
            disabled={isTestingGateway}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 hover:border-sky-300 dark:hover:border-sky-700/80 transition-all text-left group flex flex-col justify-between cursor-pointer active:scale-98 disabled:opacity-75"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                  {isTestingGateway ? (
                    <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                </div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  EU DG ENV
                </span>
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                {isTestingGateway ? t('qaTestingGateway') : t('qaTracesCheck')}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {t('qaTracesCheckDesc')}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-750 flex items-center justify-between text-[10px] font-medium text-slate-400">
              <span className="text-sky-600 dark:text-sky-400 font-semibold font-mono">Status: 200 OK</span>
              <span>Brussels Endpoint</span>
            </div>
          </button>

        </div>

      </div>

      {/* Audit Report Modal */}
      <AuditReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        shipments={shipments}
      />
    </>
  );
};

