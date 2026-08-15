import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  Send, 
  Satellite, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Check, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { AuditActivityLog, ActivityActionType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface RecentActivityLogsProps {
  logs: AuditActivityLog[];
  onSelectShipment?: (shipmentId: string) => void;
  maxItems?: number;
}

export const RecentActivityLogs: React.FC<RecentActivityLogsProps> = ({
  logs,
  onSelectShipment,
  maxItems = 10
}) => {
  const { language, t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | ActivityActionType>('all');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    if (selectedFilter === 'all') return true;
    return log.actionType === selectedFilter;
  }).slice(0, maxItems);

  const handleCopyHash = (id: string, hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHashId(id);
      setTimeout(() => setCopiedHashId(null), 2500);
    }
  };

  const getActionBadge = (actionType: ActivityActionType) => {
    switch (actionType) {
      case 'batch_auto_verify':
        return {
          icon: <Zap size={15} className="text-amber-500 dark:text-amber-400 fill-amber-500/20" />,
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300',
          dot: 'bg-amber-500 animate-ping',
          label: language === 'vi' ? 'Thẩm Định Hàng Loạt' : 'Batch Auto-Verified',
        };
      case 'passport_generated':
        return {
          icon: <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-500',
          label: language === 'vi' ? 'Hộ Chiếu EUDR' : 'Passport Issued',
        };
      case 'coop_upload':
        return {
          icon: <FileCheck size={15} className="text-sky-600 dark:text-sky-400" />,
          bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300',
          dot: 'bg-sky-500',
          label: language === 'vi' ? 'HTX Tải Lên' : 'Co-op Upload',
        };
      case 'sent_to_buyer':
        return {
          icon: <Send size={14} className="text-blue-600 dark:text-blue-400" />,
          bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
          dot: 'bg-blue-500',
          label: language === 'vi' ? 'Gửi Nhà Mua EU' : 'Dispatched to Buyer',
        };
      case 'satellite_audit':
        return {
          icon: <Satellite size={15} className="text-indigo-600 dark:text-indigo-400" />,
          bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300',
          dot: 'bg-indigo-500',
          label: language === 'vi' ? 'Vệ Tinh Sentinel-2' : 'Sentinel-2 Audit',
        };
      case 'customs_seal':
        return {
          icon: <MapPin size={15} className="text-purple-600 dark:text-purple-400" />,
          bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300',
          dot: 'bg-purple-500',
          label: language === 'vi' ? 'Kẹp Chì Cảng Cát Lái' : 'Port E-Seal',
        };
      case 'doc_requested':
        return {
          icon: <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-500',
          label: language === 'vi' ? 'Yêu Cầu Bổ Sung' : 'Action Required',
        };
      default:
        return {
          icon: <CheckCircle size={15} className="text-slate-600 dark:text-slate-400" />,
          bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300',
          dot: 'bg-slate-400',
          label: language === 'vi' ? 'Sự Kiện Lô Hàng' : 'Shipment Event',
        };
    }
  };

  return (
    <div id="recent-activity-log-component" className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col">
      
      {/* Header with Live Pulse indicator and filters */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{t('activityLogTitle')}</span>
            </h3>
            
            {/* Live Synchronized Pill */}
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('activityLiveStream')}</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('activityLogSub')}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {t('activityFilterAll')} ({logs.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === 'passport_generated' ? 'all' : 'passport_generated')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              selectedFilter === 'passport_generated'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            {t('activityFilterPassport')}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === 'coop_upload' ? 'all' : 'coop_upload')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              selectedFilter === 'coop_upload'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 hover:bg-sky-100'
            }`}
          >
            {t('activityFilterUpload')}
          </button>

          <button
            type="button"
            onClick={() => setSelectedFilter(selectedFilter === 'sent_to_buyer' ? 'all' : 'sent_to_buyer')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              selectedFilter === 'sent_to_buyer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            {t('activityFilterBuyer')}
          </button>
        </div>
      </div>

      {/* Activity Trail Items */}
      <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[380px] overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            {t('activityEmpty')}
          </div>
        ) : (
          filteredLogs.map((log) => {
            const badge = getActionBadge(log.actionType);
            const isCopied = copiedHashId === log.id;

            return (
              <div
                key={log.id}
                id={`activity-item-${log.id}`}
                className="p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
              >
                {/* Left side: Icon badge, Action Title, Description & Metadata */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  
                  {/* Action Icon Badge with active dot */}
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                      {badge.icon}
                    </div>
                    <span 
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${badge.dot}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>

                      {log.shipmentId && (
                        <button
                          type="button"
                          onClick={() => onSelectShipment?.(log.shipmentId)}
                          className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer bg-emerald-50/80 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60"
                          title="Click to view shipment details"
                        >
                          <span>{log.shipmentId}</span>
                          <ArrowRight size={11} />
                        </button>
                      )}

                      {log.cooperative && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          • {log.cooperative}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                      {language === 'vi' && log.titleVi ? log.titleVi : log.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                      {language === 'vi' && log.descriptionVi ? log.descriptionVi : log.description}
                    </p>

                    {/* Cryptographic Transaction Hash / Signer footer */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-medium text-slate-600 dark:text-slate-300">{log.actor}</span>
                        <span className="text-slate-500 dark:text-slate-400">({log.actorRole})</span>
                      </span>

                      {log.txHash && (
                        <div className="flex items-center gap-1.5 font-mono text-[10px] bg-slate-100 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          <span className="text-slate-500 dark:text-slate-400 font-sans">{t('activityTxHash')}:</span>
                          <span className="truncate max-w-[130px] sm:max-w-[220px]">{log.txHash}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyHash(log.id, log.txHash!, e)}
                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold ml-1 cursor-pointer"
                            title="Copy cryptographic proof hash"
                          >
                            {isCopied ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                <Check size={10} /> {t('activityCopied')}
                              </span>
                            ) : (
                              'Copy'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Timestamp & Direct Navigation Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0 sm:pt-0.5 pl-11 sm:pl-0">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    <Clock size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="font-semibold">{log.timestamp}</span>
                  </div>

                  {log.shipmentId && (
                    <button
                      type="button"
                      onClick={() => onSelectShipment?.(log.shipmentId)}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 rounded-md transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>{t('activityViewShipment')}</span>
                      <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Audit Banner */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'vi' ? 'Mỗi sự kiện được ký điện tử và lưu trữ bất biến trên AgriTrust EUDR Ledger' : 'All events cryptographically signed and anchored to AgriTrust EUDR Ledger'}</span>
        </span>
        <span className="font-mono text-slate-500 dark:text-slate-400">
          EVM Block #4891024 • Algorithm: Ed25519
        </span>
      </div>

    </div>
  );
};
