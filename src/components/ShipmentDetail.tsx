import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Send, 
  Location, 
  File, 
  FileCheck, 
  ShieldCheck, 
  Building, 
  Satellite, 
  Layers, 
  Award, 
  Bolt, 
  Call, 
  Check 
} from 'reicon-react';
import { CoffeeShipment, ComplianceItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ShipmentDetailProps {
  shipment: CoffeeShipment;
  onBack: () => void;
  onRequestDocument: (shipmentId: string, itemName: string) => void;
  onSimulateCoopUpload: (shipmentId: string) => void;
  onGeneratePassport: (shipmentId: string) => void;
  darkMode: boolean;
}

export const ShipmentDetail: React.FC<ShipmentDetailProps> = ({
  shipment,
  onBack,
  onRequestDocument,
  onSimulateCoopUpload,
  onGeneratePassport,
  darkMode,
}) => {
  const { t, language } = useLanguage();
  const [requestSent, setRequestSent] = useState(false);
  const isFullyVerified = shipment.completenessPercent === 100 || shipment.status === 'Verified' || shipment.status === 'Sent to Buyer';

  const handleRequestClick = (item: ComplianceItem) => {
    setRequestSent(true);
    onRequestDocument(shipment.id, item.name);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'geolocation':
        return <Satellite size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />;
      case 'custody':
        return <Layers size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />;
      case 'certification':
        return <Award size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />;
      case 'freshness':
        return <Clock size={16} className="text-teal-600 dark:text-teal-400 flex-shrink-0" />;
      default:
        return <File size={16} className="text-slate-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          id="back-to-dashboard-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer w-fit whitespace-nowrap flex-shrink-0"
        >
          <ArrowLeft size={14} className="flex-shrink-0" />
          <span>{t('backToPipeline')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {isFullyVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
              <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              {t('fullyCompliant')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 whitespace-nowrap flex-shrink-0">
              <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
              {t('missingCert')}
            </span>
          )}

          {/* If verified, show primary passport button in header too */}
          {isFullyVerified && (
            <button
              id="header-generate-passport-btn"
              onClick={() => onGeneratePassport(shipment.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <FileCheck size={14} className="flex-shrink-0" />
              <span>{t('btnPassport')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-5">
        
        {/* Title and Origin Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {t('colId')} {shipment.id}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-600">
                {shipment.lotCode}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mt-1.5">
              <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <Building size={14} className="text-emerald-600 flex-shrink-0" />
                {shipment.cooperative}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Location size={14} className="text-slate-400 flex-shrink-0" />
                {shipment.province}, Vietnam ({shipment.elevationMeters}m)
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                {t('colBuyer')}: {shipment.targetBuyer} ({shipment.destinationPort})
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{t('colVolume')}</div>
              <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                {shipment.volumeKg.toLocaleString()} kg
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{t('cuppingScore')}</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                {shipment.cuppingScore} pts
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{t('deforestationRisk')}</div>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                0.0% (Zero)
              </div>
            </div>
          </div>
        </div>

        {/* Completeness Percentage Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>{t('checklistTitle')}</span>
              <span className="text-[11px] font-normal text-slate-500">
                ({language === 'vi' ? '4 trụ cột bắt buộc' : '4 core statutory modules'})
              </span>
            </span>
            <span className={`font-bold ${
              isFullyVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {shipment.completenessPercent}% {language === 'vi' ? 'Hoàn Thành' : 'Complete'}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFullyVerified 
                  ? 'bg-emerald-600' 
                  : 'bg-amber-500'
              }`}
              style={{ width: `${shipment.completenessPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Compliance Checklist */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              {language === 'vi' ? 'Danh mục Bằng chứng & Kiểm toán' : 'Audit Checklist & Evidence'}
            </span>
            <span className="text-slate-500">{language === 'vi' ? 'Niêm phong sổ cái bất biến' : 'Immutable Ledger Stamped'}</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {shipment.checklist.map((item) => {
              const isMissing = item.status === 'missing';
              const isComplete = item.status === 'complete';

              return (
                <div
                  key={item.id}
                  id={`checklist-item-${item.id}`}
                  className={`p-3.5 rounded-lg border transition-all text-xs ${
                    isMissing
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/80 shadow-2xs'
                      : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    
                    {/* Left: Status Icon and Details */}
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {isComplete ? (
                          <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-300 dark:border-amber-800 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          {isComplete ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {t('statusVerified')}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                              {t('metricActionRequired')}
                            </span>
                          )}
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          {item.summary}
                        </p>

                        {item.referenceCode && (
                          <div className="pt-0.5 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <span>{t('refCode')} {item.referenceCode}</span>
                            {item.updatedAt && <span>• {t('updated')} {item.updatedAt}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-shrink-0 flex items-center gap-2 md:self-center">
                      {isMissing ? (
                        <div className="flex items-center gap-2">
                          <button
                            id="request-doc-btn"
                            onClick={() => handleRequestClick(item)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              requestSent
                                ? 'bg-slate-800 text-white'
                                : 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer active:scale-95'
                            }`}
                          >
                            <Send className="w-3.5 h-3.5 inline mr-1" />
                            <span>{requestSent ? (language === 'vi' ? 'Đã yêu cầu ✓' : 'Requested ✓') : t('btnRequestCoop')}</span>
                          </button>

                          {/* Presenter Instant Upload Shortcut */}
                          <button
                            id="simulate-coop-upload-btn"
                            onClick={() => onSimulateCoopUpload(shipment.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 cursor-pointer whitespace-nowrap flex-shrink-0"
                            title="Simulate immediate cooperative upload for live pitch presentation"
                          >
                            <Bolt size={12} className="text-amber-500 inline mr-1 flex-shrink-0" />
                            <span>⚡ {t('btnSimulateUpload')}</span>
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
                          <Check size={12} className="flex-shrink-0" />
                          {language === 'vi' ? 'Đã Hợp Lệ' : 'Validated'}
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* If Missing Docs: Cooperative Contact Card */}
        {!isFullyVerified && (
          <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 flex-shrink-0">
                <Call size={14} className="flex-shrink-0" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">{language === 'vi' ? 'Hợp tác xã phụ trách: ' : 'Assigned Co-op: '}</span>
                <span className="text-slate-700 dark:text-slate-300">Buon Ma Thuot Robusta Co-op (Nguyen Van Hung)</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 whitespace-nowrap">
              {language === 'vi' ? 'Kênh kết nối Zalo & Cổng nông vụ trực tuyến' : 'Live Zalo & Farmgate bridge active'}
            </div>
          </div>
        )}

        {/* Bottom Banner & Generate Passport Button for Verified Case */}
        {isFullyVerified && (
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
                <h3 className="text-sm sm:text-base font-bold tracking-tight">
                  {language === 'vi' ? 'Toàn Bộ Yêu Cầu Tuân Thủ EUDR Đã Thỏa Mãn' : 'All EUDR Compliance Requirements Satisfied'}
                </h3>
              </div>
              <p className="text-xs text-emerald-200">
                {language === 'vi' 
                  ? 'Lô hàng 100% không gây mất rừng, chứng nhận chuỗi hành trình đầy đủ và đã niêm phong mật mã.'
                  : 'Lot is 100% deforestation-free, chain-of-custody certified, and cryptographically verified.'}
              </p>
            </div>

            <button
              id="generate-compliance-passport-btn"
              onClick={() => onGeneratePassport(shipment.id)}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <FileCheck size={16} className="text-slate-950 flex-shrink-0" />
              <span>{t('btnGeneratePassport')}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

