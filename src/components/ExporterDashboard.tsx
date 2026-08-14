import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  X,
  Zap
} from 'lucide-react';
import { GeographicOriginMap } from './GeographicOriginMap';
import { CoffeeShipment, ShipmentStatus, AuditActivityLog } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ExportAnalyticsCharts } from './ExportAnalyticsCharts';
import { RecentActivityLogs } from './RecentActivityLogs';
import { QuickActions } from './QuickActions';
import { INITIAL_AUDIT_LOGS } from '../data/mockData';

interface ExporterDashboardProps {
  shipments: CoffeeShipment[];
  activityLogs?: AuditActivityLog[];
  onSelectShipment: (id: string) => void;
  onOpenNewShipmentModal: () => void;
  onOpenOnboarding?: () => void;
  onSyncSatellite?: () => void;
  onBatchRemindCoops?: () => void;
  onTestTracesGateway?: () => void;
  onBatchAutoVerify?: () => void;
  darkMode: boolean;
}

export const ExporterDashboard: React.FC<ExporterDashboardProps> = ({
  shipments,
  activityLogs = INITIAL_AUDIT_LOGS,
  onSelectShipment,
  onOpenNewShipmentModal,
  onOpenOnboarding,
  onSyncSatellite = () => {},
  onBatchRemindCoops = () => {},
  onTestTracesGateway = () => {},
  onBatchAutoVerify = () => {},
  darkMode,
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  const totalVolumeKg = shipments.reduce((acc, s) => acc + s.volumeKg, 0);
  const totalTons = (totalVolumeKg / 1000).toFixed(1);
  const totalBags = shipments.reduce((acc, s) => acc + s.bagsCount, 0);
  const verifiedCount = shipments.filter(s => s.status === 'Verified' || s.status === 'Sent to Buyer').length;
  const missingCount = shipments.filter(s => s.status === 'Missing Documents').length;
  const pendingCount = shipments.filter(s => s.status === 'Pending Verification').length;
  const sentCount = shipments.filter(s => s.status === 'Sent to Buyer').length;
  const complianceRate = Math.round((verifiedCount / (shipments.length || 1)) * 100);

  const filteredShipments = shipments.filter(s => {
    const q = searchTerm.trim().toLowerCase();
    
    // Status filter chip
    const matchesStatusFilter = 
      statusFilter === 'all' || s.status === statusFilter;

    if (!q) {
      return matchesStatusFilter;
    }

    // 1. Shipment ID / Lot Code / Blockchain / EUDR reference
    const matchesId = 
      s.id.toLowerCase().includes(q) ||
      s.lotCode.toLowerCase().includes(q) ||
      s.eudrReference.toLowerCase().includes(q) ||
      s.documentHash.toLowerCase().includes(q);

    // 2. Farm / Cooperative Name & Location & Variety
    const matchesFarmCoop = 
      s.cooperative.toLowerCase().includes(q) ||
      s.province.toLowerCase().includes(q) ||
      s.region.toLowerCase().includes(q) ||
      s.gpsCoordinates.toLowerCase().includes(q) ||
      s.variety.toLowerCase().includes(q) ||
      s.process.toLowerCase().includes(q) ||
      s.targetBuyer.toLowerCase().includes(q) ||
      s.destinationPort.toLowerCase().includes(q) ||
      s.signatures.some(sig => 
        sig.partyName.toLowerCase().includes(q) || 
        sig.organization.toLowerCase().includes(q) ||
        sig.location.toLowerCase().includes(q)
      ) ||
      s.checklist.some(chk =>
        chk.name.toLowerCase().includes(q) ||
        chk.summary.toLowerCase().includes(q) ||
        (chk.referenceCode && chk.referenceCode.toLowerCase().includes(q))
      );

    // 3. Status matching (both standard enum, English words and Vietnamese translations)
    const matchesStatusText = 
      s.status.toLowerCase().includes(q) ||
      (s.status === 'Verified' && (
        'verified'.includes(q) || 'đã thẩm định'.includes(q) || 'da tham dinh'.includes(q) || 
        'hợp lệ'.includes(q) || 'hop le'.includes(q) || 'pass'.includes(q) || 'compliant'.includes(q) || 'ready'.includes(q)
      )) ||
      (s.status === 'Missing Documents' && (
        'missing'.includes(q) || 'missing docs'.includes(q) || 'missing documents'.includes(q) || 'thiếu hồ sơ'.includes(q) || 'thieu ho so'.includes(q) ||
        'thiếu chứng từ'.includes(q) || 'thieu chung tu'.includes(q) || 'action required'.includes(q) || 'warning'.includes(q) || 'cần xử lý'.includes(q)
      )) ||
      (s.status === 'Pending Verification' && (
        'pending'.includes(q) || 'pending verification'.includes(q) || 'chờ duyệt'.includes(q) || 'cho duyet'.includes(q) ||
        'chờ xác minh'.includes(q) || 'cho xac minh'.includes(q) || 'review'.includes(q)
      )) ||
      (s.status === 'Sent to Buyer' && (
        'sent'.includes(q) || 'sent to buyer'.includes(q) || 'đã gửi'.includes(q) || 'da gui'.includes(q) ||
        'buyer'.includes(q) || 'nhà mua'.includes(q) || 'nha mua'.includes(q)
      ));

    return (matchesId || matchesFarmCoop || matchesStatusText) && matchesStatusFilter;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {t('statusVerified')}
          </span>
        );
      case 'Missing Documents':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
            {t('statusMissingDocs')}
          </span>
        );
      case 'Pending Verification':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {t('statusPending')}
          </span>
        );
      case 'Sent to Buyer':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {t('statusSent')}
          </span>
        );
      default:
        return null;
    }
  };

  const missingShipment = shipments.find(s => s.status === 'Missing Documents') || shipments[0];
  const verifiedShipment = shipments.find(s => s.status === 'Verified') || shipments[1] || shipments[0];

  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all';

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      
      {/* Exporter Onboarding & EUDR Status Quick Banner */}
      {onOpenOnboarding && (
        <div className="rounded-xl bg-[#1b4332] text-white p-4 sm:p-5 border border-[#012d1d] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold font-heading text-white">
                  {language === 'vi' ? 'Hồ Sơ Doanh Nghiệp & Thẩm Định Vùng Trồng EUDR' : 'Exporter Profile & EUDR Sourcing Network'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-400 text-[#012d1d] uppercase">
                  {language === 'vi' ? 'Đạt Chuẩn EU' : 'EUDR Ready'}
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {language === 'vi' 
                  ? 'Liên kết các hợp tác xã tại Đắk Lắk & Lâm Đồng, kiểm toán đa giác vệ tinh Sentinel-2 và kích hoạt chữ ký số PKI.'
                  : 'Link cooperatives across Central Highlands, audit Sentinel-2 farm GIS polygons, and configure digital PKI stamping.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-[#012d1d] text-xs font-bold font-heading transition-all shadow-xs cursor-pointer flex-shrink-0 whitespace-nowrap"
          >
            <span>{language === 'vi' ? 'Mở Quy Trình Khởi Tạo (5 Bước) →' : 'Launch 5-Step Onboarding →'}</span>
          </button>
        </div>
      )}

      {/* TOP SEARCH & FILTER BAR (Shipment ID, Farm/Cooperative Name, Status) */}
      <div 
        id="exporter-top-search-filter-bar"
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 sm:p-5 space-y-3.5 transition-all"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0" />
            <input
              id="top-shipment-search-input"
              type="text"
              placeholder={t('topSearchBarPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 font-medium transition-all"
            />
            {searchTerm && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                title="Clear input"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* New Shipment Action Button */}
          <button
            id="top-new-shipment-btn"
            onClick={onOpenNewShipmentModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <Plus size={16} />
            <span>{language === 'vi' ? '+ Tạo Lô Hàng Mới' : '+ New Shipment'}</span>
          </button>
        </div>

        {/* Status Filter Chips & Quick Suggestions Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              {t('filterStatusLabel')}
            </span>

            {/* All */}
            <button
              id="filter-status-all"
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <span>{t('filterAll')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                statusFilter === 'all' 
                  ? 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {shipments.length}
              </span>
            </button>

            {/* Verified */}
            <button
              id="filter-status-verified"
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'Verified' ? 'all' : 'Verified')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                statusFilter === 'Verified'
                  ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{t('filterVerified')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                {verifiedCount}
              </span>
            </button>

            {/* Missing Documents */}
            <button
              id="filter-status-missing"
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'Missing Documents' ? 'all' : 'Missing Documents')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                statusFilter === 'Missing Documents'
                  ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-400/40'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>{t('filterMissing')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                {missingCount}
              </span>
            </button>

            {/* Pending Verification */}
            <button
              id="filter-status-pending"
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'Pending Verification' ? 'all' : 'Pending Verification')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                statusFilter === 'Pending Verification'
                  ? 'bg-slate-700 text-white shadow-xs ring-2 ring-slate-400/40'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{t('filterPending')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {pendingCount}
              </span>
            </button>

            {/* Sent to Buyer */}
            {sentCount > 0 && (
              <button
                id="filter-status-sent"
                type="button"
                onClick={() => setStatusFilter(statusFilter === 'Sent to Buyer' ? 'all' : 'Sent to Buyer')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  statusFilter === 'Sent to Buyer'
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400/40'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100'
                }`}
              >
                <span>{t('filterSent')}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                  {sentCount}
                </span>
              </button>
            )}
          </div>

          {/* Quick Suggestions & Reset */}
          <div className="flex items-center gap-2 text-xs">
            {hasActiveFilters ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                  {t('showingFilteredOfTotal')} <strong className="text-slate-900 dark:text-white font-mono">{filteredShipments.length}</strong> / {shipments.length} {t('ofShipments')}
                </span>
                <button
                  id="reset-all-filters-btn"
                  type="button"
                  onClick={clearAllFilters}
                  className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors cursor-pointer"
                >
                  ✕ {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>{t('quickSearchTitle')}</span>
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('VN-EXP-2026-9014')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-mono transition-colors cursor-pointer"
                >
                  VN-EXP-9014
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('Buon Ma Thuot')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  Buon Ma Thuot
                </button>
                <button 
                  type="button" 
                  onClick={() => setSearchTerm('Lam Dong')}
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  Lam Dong
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 1. Metric Summary Tiles (High Density Archetype) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Export Volume */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t('metricExportVolume')}
          </p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            {totalTons} <span className="text-sm font-normal text-slate-500">{t('metricTons')}</span>
          </p>
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp size={14} className="flex-shrink-0" />
            <span>{totalVolumeKg.toLocaleString()} kg • {totalBags.toLocaleString()} {t('metricBags')}</span>
          </p>
        </div>

        {/* Compliance Rate */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t('metricComplianceRate')}
          </p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {complianceRate}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {verifiedCount} of {shipments.length} {t('metricDeforestationFree')}
          </p>
        </div>

        {/* Action Required */}
        <div 
          onClick={() => onSelectShipment(missingShipment.id)}
          className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-amber-300 dark:border-amber-700/80 shadow-xs cursor-pointer hover:ring-2 hover:ring-amber-500/40 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                {t('metricActionRequired')}
              </p>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 tracking-tight">
              {missingCount} <span className="text-sm font-normal text-slate-500">{t('metricLot')}</span>
            </p>
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mt-1 flex items-center gap-1">
              <span>{t('metricCoopMissing')}</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>

          {missingCount > 0 && (
            <button
              type="button"
              id="dashboard-action-required-batch-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBatchAutoVerify();
              }}
              className="mt-3 w-full py-1.5 px-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer animate-pulse"
              title="Simultaneously verify all missing documents"
            >
              <Zap size={13} className="fill-slate-950" />
              <span>{language === 'vi' ? `Thẩm Định Tự Động (${missingCount})` : `Batch Auto-Verify (${missingCount})`}</span>
            </button>
          )}
        </div>

        {/* EU Buyer Portals */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-1">
            {t('metricEuBuyerMatch')}
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
            08 <span className="text-sm font-normal text-slate-500">{t('metricPortals')}</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('metricPortsSub')}
          </p>
        </div>

      </div>

      {/* 2. Quick Exporter Actions Toolkit */}
      <QuickActions
        shipments={shipments}
        onOpenNewShipmentModal={onOpenNewShipmentModal}
        onSyncSatellite={onSyncSatellite}
        onBatchRemindCoops={onBatchRemindCoops}
        onTestTracesGateway={onTestTracesGateway}
        onBatchAutoVerify={onBatchAutoVerify}
      />

      {/* 3. Data Visualization Analytics Section (Monthly Trend Line + Compliance Distribution Donut) */}
      <ExportAnalyticsCharts 
        shipments={shipments} 
        onSelectShipment={onSelectShipment} 
      />

      {/* 4. Geographic Origin Density Map (Vietnam Coffee Regions & EUDR Sourcing Radar) */}
      <GeographicOriginMap
        shipments={shipments}
        onSelectShipment={onSelectShipment}
        darkMode={darkMode}
      />

      {/* 4. Main Body Grid (12-Column High Density Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8-Cols: Live Pipeline Table */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Table Container */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">
                  {t('livePipeline')}
                </h3>
                <span className="text-xs text-slate-500 font-mono">({filteredShipments.length} {t('lotsCount')})</span>
              </div>

              {/* Filter & Batch Action controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-36 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Batch Auto-Verify Button */}
                <button
                  id="pipeline-batch-verify-btn"
                  onClick={onBatchAutoVerify}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 ${
                    missingCount > 0
                      ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  title={language === 'vi' ? 'Thẩm định tự động hàng loạt toàn bộ lô thiếu chứng từ' : 'Batch Auto-Verify all shipments with missing documents'}
                >
                  <Zap size={14} className={missingCount > 0 ? 'fill-slate-950' : 'text-amber-500'} />
                  <span>
                    {language === 'vi' 
                      ? (missingCount > 0 ? `Thẩm Định Hàng Loạt (${missingCount})` : 'Thẩm Định Hàng Loạt')
                      : (missingCount > 0 ? `Batch Auto-Verify (${missingCount})` : 'Batch Auto-Verify')}
                  </span>
                </button>

                <button
                  onClick={onOpenNewShipmentModal}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  {t('btnNewShort')}
                </button>
              </div>
            </div>

            {/* Shipments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="px-4 py-3">{t('colId')}</th>
                    <th className="px-4 py-3">{t('colOrigin')}</th>
                    <th className="px-4 py-3">{t('colVolume')}</th>
                    <th className="px-4 py-3">{t('colBuyer')}</th>
                    <th className="px-4 py-3">{t('colStatus')}</th>
                    <th className="px-4 py-3 text-right">{t('colAction')}</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredShipments.map((shipment) => {
                    const isMissing = shipment.status === 'Missing Documents';
                    const isVerified = shipment.status === 'Verified';
                    const isSent = shipment.status === 'Sent to Buyer';

                    return (
                      <tr
                        key={shipment.id}
                        id={`shipment-row-${shipment.id}`}
                        onClick={() => onSelectShipment(shipment.id)}
                        className={`group cursor-pointer transition-colors duration-100 ${
                          isMissing
                            ? 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-100/50'
                            : isVerified
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/15 hover:bg-emerald-100/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/40'
                        }`}
                      >
                        {/* ID */}
                        <td className="px-4 py-3">
                          <div className={`font-mono font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 ${
                            isMissing ? 'underline decoration-amber-400' : ''
                          }`}>
                            {shipment.id}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {shipment.lotCode}
                          </div>
                        </td>

                        {/* Cooperative */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-800 dark:text-white">
                            {shipment.cooperative}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin size={12} className="text-emerald-600 flex-shrink-0" />
                            <span>{shipment.province}, Vietnam</span>
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="px-4 py-3 font-mono">
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            {shipment.volumeKg.toLocaleString()} kg
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {shipment.bagsCount} {t('metricBags')} (60kg)
                          </div>
                        </td>

                        {/* Buyer */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {shipment.targetBuyer}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {shipment.destinationPort}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(shipment.status)}
                        </td>

                        {/* Action Link */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectShipment(shipment.id);
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              isMissing
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : isVerified
                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                            }`}
                          >
                            {isMissing ? t('btnResolve') : isVerified ? t('btnPassport') : t('btnInspect')} &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredShipments.length === 0 && (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
                  <Search size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {language === 'vi' ? 'Không tìm thấy lô hàng xuất khẩu phù hợp' : 'No matching coffee shipments found'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchTerm 
                      ? `${t('noShipmentsFound')} "${searchTerm}"`
                      : (language === 'vi' ? 'Không có lô hàng nào thuộc trạng thái này.' : 'No shipments currently match the selected status.')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all"
                >
                  <span>{language === 'vi' ? 'Hiển Thị Tất Cả Lô Hàng' : 'View All Shipments'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Quick Presenter Action Bar */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">{t('eudrStandardFooter')}</span>
            </div>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
              {t('evmBlock')} #4891024
            </span>
          </div>

        </div>

        {/* Right 4-Cols: Action Required Card + Ready for Passport Card */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Card 1: Missing Documents Inspector Widget */}
          <div 
            onClick={() => onSelectShipment(missingShipment.id)}
            className="bg-white dark:bg-slate-800 rounded-xl border-2 border-amber-300 dark:border-amber-700/80 shadow-md overflow-hidden cursor-pointer group"
          >
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 flex justify-between items-center">
              <h3 className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm uppercase tracking-tight flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t('actionCardTitle')} {missingShipment.id}</span>
              </h3>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded">
                {t('actionCardComplete')}
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{t('chkPolygon')}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{t('chkCustody')}</span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <div className="w-4.5 h-4.5 bg-amber-100 border border-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-700 font-bold text-[10px]">!</span>
                </div>
                <span className="font-bold text-amber-800 dark:text-amber-300 flex-1">{t('chkPhyto')}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectShipment(missingShipment.id);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] px-2.5 py-1 rounded font-bold uppercase transition-colors cursor-pointer"
                >
                  {t('btnRequest')}
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-4.5 h-4.5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{t('chkFreshness')}</span>
              </div>

              {/* Progress bar */}
              <div className="pt-2">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Ready for EU Passport Widget */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-emerald-900 dark:text-white">
              {t('readyPassportTitle')}
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 mb-4 leading-relaxed">
              {t('actionCardTitle')} <span className="font-mono font-bold">{verifiedShipment.id}</span> {t('readyPassportSub')}
            </p>
            <button 
              onClick={() => onSelectShipment(verifiedShipment.id)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-md transition-all active:scale-98 cursor-pointer"
            >
              {t('btnGeneratePassport')}
            </button>
          </div>

        </div>

      </div>

      {/* 4. Live EUDR Audit Trail & Recent Activity Log */}
      <RecentActivityLogs 
        logs={activityLogs} 
        onSelectShipment={onSelectShipment} 
      />

    </div>
  );
};


