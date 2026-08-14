import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  FileCheck, 
  Globe, 
  X,
  Zap
} from 'lucide-react';
import { ActiveView } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface PitchGuideBarProps {
  activeView: ActiveView;
  selectedShipmentId: string | null;
  onSelectShipment: (id: string) => void;
  onOpenPassport: (id: string) => void;
  onOpenBuyerPortal: () => void;
  onOpenOnboarding?: () => void;
  onBatchAutoVerify?: () => void;
  onClose: () => void;
  darkMode: boolean;
}

export const PitchGuideBar: React.FC<PitchGuideBarProps> = ({
  activeView,
  selectedShipmentId,
  onSelectShipment,
  onOpenPassport,
  onOpenBuyerPortal,
  onOpenOnboarding,
  onBatchAutoVerify,
  onClose,
  darkMode,
}) => {
  const { language } = useLanguage();

  return (
    <div className={`border-b transition-all ${
      darkMode 
        ? 'bg-amber-950/40 border-amber-900/60 text-amber-200' 
        : 'bg-amber-50/90 border-amber-200/80 text-amber-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Guide Title */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold font-mono flex-shrink-0">
              ★
            </span>
            <span className="text-xs font-bold tracking-wide uppercase font-heading whitespace-nowrap">
              {language === 'vi' ? 'Quy Trình Demo:' : 'Demo Flow:'}
            </span>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            
            {/* Step 0: Exporter Onboarding */}
            {onOpenOnboarding && (
              <>
                <button
                  id="pitch-step-0-btn"
                  onClick={onOpenOnboarding}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                    activeView === 'onboarding'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-600'
                  }`}
                >
                  <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">{language === 'vi' ? '0. Khởi Tạo DN' : '0. Exporter Setup'}</span>
                </button>

                <ArrowRight size={12} className="text-slate-400 hidden sm:inline flex-shrink-0" />
              </>
            )}

            {/* Step 1: Missing Docs */}
            <button
              id="pitch-step-1-btn"
              onClick={() => onSelectShipment('VN-EXP-2026-9014')}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeView === 'shipment-detail' && selectedShipmentId === 'VN-EXP-2026-9014'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500'
              }`}
            >
              <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{language === 'vi' ? '1. Thiếu Hồ Sơ' : '1. Missing Docs'}</span>
            </button>

            <ArrowRight size={12} className="text-slate-400 hidden sm:inline flex-shrink-0" />

            {/* Step 2: Verified Case */}
            <button
              id="pitch-step-3-btn"
              onClick={() => onSelectShipment('VN-EXP-2026-8842')}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeView === 'shipment-detail' && selectedShipmentId === 'VN-EXP-2026-8842'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-emerald-500'
              }`}
            >
              <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{language === 'vi' ? '2. Đã Thẩm Định' : '2. Verified Case'}</span>
            </button>

            <ArrowRight size={12} className="text-slate-400 hidden sm:inline flex-shrink-0" />

            {/* Step 3: Compliance Passport */}
            <button
              id="pitch-step-4-btn"
              onClick={() => onOpenPassport('VN-EXP-2026-8842')}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeView === 'passport'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-teal-500'
              }`}
            >
              <FileCheck size={13} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="whitespace-nowrap">{language === 'vi' ? '3. Hộ Chiếu Số' : '3. EU Passport'}</span>
            </button>

            <ArrowRight size={12} className="text-slate-400 hidden sm:inline flex-shrink-0" />

            {/* Step 4: EU Buyer Portal */}
            <button
              id="pitch-step-5-btn"
              onClick={onOpenBuyerPortal}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                activeView === 'buyer-portal'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-indigo-500'
              }`}
            >
              <Globe size={13} className="text-blue-500 flex-shrink-0" />
              <span className="whitespace-nowrap">{language === 'vi' ? '4. Cổng Nhà Mua EU' : '4. Buyer Portal'}</span>
            </button>

            {/* Quick Demo: Batch Auto-Verify Simulation */}
            {onBatchAutoVerify && (
              <>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
                <button
                  id="pitch-batch-verify-btn"
                  onClick={onBatchAutoVerify}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 shadow-xs animate-pulse"
                  title="Simulate Batch Auto-Verification for all lots"
                >
                  <Zap size={13} className="fill-slate-950 flex-shrink-0" />
                  <span className="whitespace-nowrap">{language === 'vi' ? '⚡ Thẩm Định Hàng Loạt' : '⚡ Batch Auto-Verify'}</span>
                </button>
              </>
            )}

          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer flex-shrink-0 inline-flex items-center justify-center"
            title="Hide Pitch Guide"
          >
            <X size={14} className="flex-shrink-0" />
          </button>

        </div>
      </div>
    </div>
  );
};

