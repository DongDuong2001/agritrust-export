import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Copy, 
  Check, 
  Location, 
  Download, 
  Lock, 
  Satellite, 
  AlertCircle
} from 'reicon-react';
import { CoffeeShipment } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AgriTrustLogo } from './AgriTrustLogo';

interface BuyerPortalProps {
  shipments: CoffeeShipment[];
  initialShipmentId?: string;
  onReturnToExporter: () => void;
  darkMode: boolean;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  shipments,
  initialShipmentId = 'VN-EXP-2026-8842',
  onReturnToExporter,
  darkMode,
}) => {
  const { t, language } = useLanguage();
  const [searchCode, setSearchCode] = useState(initialShipmentId);
  const [selectedShipment, setSelectedShipment] = useState<CoffeeShipment | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = shipments.find(s => s.id === initialShipmentId) || shipments[1] || shipments[0];
    if (found) {
      setSelectedShipment(found);
      setSearchCode(found.id);
    }
  }, [initialShipmentId, shipments]);

  const handleSearch = (codeToSearch: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      const found = shipments.find(s => 
        s.id.toLowerCase() === codeToSearch.trim().toLowerCase() ||
        s.lotCode.toLowerCase() === codeToSearch.trim().toLowerCase()
      );
      if (found) {
        setSelectedShipment(found);
      }
      setIsVerifying(false);
    }, 250);
  };

  const handleCopyHash = () => {
    if (selectedShipment) {
      navigator.clipboard.writeText(selectedShipment.documentHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Buyer Portal Header & Context Banner (High Density Theme) */}
      <div className="rounded-xl bg-[#064E3B] text-white p-5 shadow-xs border border-emerald-900/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AgriTrustLogo size="sm" darkMode={true} />
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-200 border border-emerald-700/60 uppercase tracking-wider">
                {t('buyerGatewayHeader')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {t('buyerTitle')}
            </h1>
            <p className="text-xs text-emerald-100/90 max-w-2xl">
              {t('buyerDesc')}
            </p>
          </div>

          <button
            id="return-to-exporter-btn"
            onClick={onReturnToExporter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer w-fit self-start md:self-auto whitespace-nowrap flex-shrink-0"
          >
            <span>{t('btnSwitchExporter')}</span>
          </button>
        </div>

        {/* Search & Verification Input Bar */}
        <div className="p-3 rounded-lg bg-black/20 border border-white/10 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('buyerSearchPlaceholder')}
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchCode)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-white/20 bg-black/40 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
              />
            </div>

            <button
              id="buyer-verify-btn"
              onClick={() => handleSearch(searchCode)}
              disabled={isVerifying}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50 flex-shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{isVerifying ? t('btnVerifying') : t('btnVerifyShipment')}</span>
            </button>
          </div>

          {/* Quick-select Sample Reference Codes */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-100/90 pt-0.5">
            <span className="text-[11px] text-emerald-200/70 font-medium">{t('quickLookups')}</span>
            {shipments.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSearchCode(s.id);
                  handleSearch(s.id);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                  selectedShipment?.id === s.id
                    ? 'bg-emerald-300 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
                }`}
              >
                {s.id} ({s.status === 'Verified' ? (language === 'vi' ? 'Đã xác thực' : 'Verified') : (language === 'vi' ? 'Thiếu hồ sơ' : 'Missing Docs')})
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Verification Result Display */}
      {selectedShipment ? (
        <div className="space-y-5 animate-in fade-in duration-150">
          
          {/* Top Trust Badge Card */}
          <div className={`p-4 sm:p-5 rounded-xl border shadow-xs transition-all ${
            selectedShipment.status === 'Verified' || selectedShipment.status === 'Sent to Buyer'
              ? 'bg-white dark:bg-slate-800 border-emerald-600/40 dark:border-emerald-500/30'
              : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-xs flex-shrink-0 ${
                  selectedShipment.status === 'Verified' || selectedShipment.status === 'Sent to Buyer'
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-center md:justify-start gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {language === 'vi' ? 'Trạng Thái Thẩm Định EUDR' : 'EUDR Verification Status'}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedShipment.status === 'Verified' || selectedShipment.status === 'Sent to Buyer'
                      ? t('verifiedResultTitle')
                      : t('pendingResultTitle')}
                  </h2>

                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {selectedShipment.status === 'Verified' || selectedShipment.status === 'Sent to Buyer'
                      ? t('verifiedResultDesc')
                      : t('pendingResultDesc')}
                  </p>
                </div>
              </div>

              {/* Status Pill & Actions */}
              <div className="flex flex-col items-center md:items-end gap-1.5 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono">{t('dueDiligenceRef')}</div>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {selectedShipment.eudrReference}
                  </div>
                </div>

                <button
                  onClick={() => alert(`EUDR Due Diligence Statement (JSON-LD & PDF XML) for ${selectedShipment.id} ready for download.`)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <Download size={12} className="flex-shrink-0" />
                  <span>{t('btnDownloadStatement')}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Cryptographic Document Hash & Proof Box */}
          <div className="p-3.5 rounded-lg bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {t('cryptoHashBox')}
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">{t('blockNum')} #{selectedShipment.blockNumber}</span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 break-all">
              <span>{selectedShipment.documentHash}</span>
              <button
                onClick={handleCopyHash}
                className="flex-shrink-0 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                title="Copy Hash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Clean 5-Stage Verified History Timeline */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t('timelineTitle')}</span>
                <span className="text-xs font-normal text-slate-500">
                  {t('timelineSub')}
                </span>
              </h3>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                100% {language === 'vi' ? 'Truy Xuất Nguồn Gốc' : 'Traceable'}
              </span>
            </div>

            {/* Timeline List */}
            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-600">
              {selectedShipment.timeline.map((item, idx) => (
                <div key={idx} className="relative group text-xs">
                  
                  {/* Step Node Icon */}
                  <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shadow-xs border-2 border-white dark:border-slate-800">
                    <Check className="w-3 h-3" />
                  </div>

                  {/* Content Box */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        {language === 'vi' ? 'Giai đoạn' : 'Stage'} {item.step}: {item.stage}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    <p className="text-slate-600 dark:text-slate-300">
                      {item.details}
                    </p>

                    <div className="pt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Location size={12} className="text-emerald-600 flex-shrink-0" />
                        {item.location}
                      </span>

                      {item.meta?.coordinates && (
                        <span className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                          GIS: {item.meta.coordinates}
                        </span>
                      )}

                      {item.meta?.deforestationRisk && (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                          {item.meta.deforestationRisk}
                        </span>
                      )}

                      {item.meta?.containerNo && (
                        <span className="font-mono text-teal-700 dark:text-teal-300">
                          {language === 'vi' ? 'Mã Container:' : 'Container:'} {item.meta.containerNo}
                        </span>
                      )}
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Satellite Geolocation & Farm Plot Radar Simulation */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-400">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    {t('satelliteBoxTitle')}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {t('satelliteBoxSub')}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                0.0% {language === 'vi' ? 'Rủi Ro Mất Rừng' : 'Deforestation Risk'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{t('mappedPlots')}</span>
                <span className="font-bold text-white text-xs">{selectedShipment.farmPlotsCount} {language === 'vi' ? 'Đa Giác Nông Hộ' : 'Smallholder Polygons'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{t('centroidCoords')}</span>
                <span className="font-mono font-bold text-emerald-300 text-xs">{selectedShipment.gpsCoordinates}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{t('forestStability')}</span>
                <span className="font-bold text-white text-xs">99.4% {language === 'vi' ? 'Tán Rừng Ổn Định' : 'Preserved Forest Shade'}</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <AlertCircle className="w-6 h-6 mx-auto text-slate-400 mb-1" />
          <p className="font-bold text-xs">{t('noShipmentFound')} "{searchCode}".</p>
          <p className="text-[11px] mt-0.5">{t('tryQuickButtons')}</p>
        </div>
      )}

    </div>
  );
};

