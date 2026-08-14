import React from 'react';
import { 
  Sun, 
  Moon, 
  RotateCcw, 
  Building, 
  CheckCircle, 
  PlayCircle,
  Plus,
  Bell
} from 'lucide-react';
import { ActiveView } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { AgriTrustLogo } from './AgriTrustLogo';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onResetDemo: () => void;
  showPitchGuide: boolean;
  setShowPitchGuide: (val: boolean) => void;
  onOpenNewShipmentModal?: () => void;
  onOpenNotificationCenter?: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  darkMode,
  setDarkMode,
  onResetDemo,
  showPitchGuide,
  setShowPitchGuide,
  onOpenNewShipmentModal,
  onOpenNotificationCenter,
  unreadNotificationsCount = 0,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className={`border-b flex-shrink-0 transition-colors duration-150 sticky top-0 z-30 ${
      darkMode 
        ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-xs' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand Header */}
          <div 
            className="flex items-center gap-3 cursor-pointer flex-shrink-0 group" 
            onClick={() => setActiveView('dashboard')}
          >
            <AgriTrustLogo size="md" darkMode={darkMode} />
            <div className="hidden xl:block pl-2 border-l border-slate-200 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                {t('brandSub')}
              </p>
            </div>
          </div>

          {/* Center Role Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold flex-shrink-0">
            <button
              id="role-exporter-btn"
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeView !== 'buyer-portal'
                  ? 'bg-white dark:bg-emerald-800 text-emerald-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building size={14} className="text-emerald-600 dark:text-emerald-300 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('portalExporter')}</span>
            </button>

            <button
              id="role-buyer-btn"
              onClick={() => setActiveView('buyer-portal')}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                activeView === 'buyer-portal'
                  ? 'bg-emerald-700 dark:bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle size={14} className="text-emerald-300 flex-shrink-0" />
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="whitespace-nowrap">{t('portalBuyer')}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              </span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            
            {/* Language Toggle Button (EN / VI) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0">
              <button
                id="lang-vi-btn"
                onClick={() => setLanguage('vi')}
                title="Chuyển sang Tiếng Việt"
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  language === 'vi'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-xs whitespace-nowrap font-bold">VI</span>
              </button>
              <button
                id="lang-en-btn"
                onClick={() => setLanguage('en')}
                title="Switch to English"
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="text-xs whitespace-nowrap font-bold">EN</span>
              </button>
            </div>

            {onOpenNewShipmentModal && activeView !== 'buyer-portal' && (
              <button
                onClick={onOpenNewShipmentModal}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <Plus size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">{t('newShipmentBtn')}</span>
              </button>
            )}

            {/* Notification Center Bell Trigger */}
            {onOpenNotificationCenter && (
              <button
                id="notification-center-btn"
                onClick={onOpenNotificationCenter}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex-shrink-0 inline-flex items-center justify-center border border-slate-200 dark:border-slate-700"
                title={language === 'vi' ? 'Trung tâm thông báo Zalo & Hệ thống' : 'Notification Center'}
              >
                <Bell size={15} className="flex-shrink-0" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Pitch Flow Helper Toggle */}
            <button
              id="pitch-guide-toggle-btn"
              onClick={() => setShowPitchGuide(!showPitchGuide)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 cursor-pointer ${
                showPitchGuide
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Presentation Demo Guide"
            >
              <PlayCircle size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="hidden lg:inline whitespace-nowrap">{t('pitchGuideBtn')}</span>
            </button>

            {/* Reset Demo Button */}
            <button
              id="reset-demo-btn"
              onClick={onResetDemo}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer flex-shrink-0 inline-flex items-center justify-center"
              title={t('resetDemoBtn')}
            >
              <RotateCcw size={14} className="flex-shrink-0" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer flex-shrink-0 inline-flex items-center justify-center"
              title={darkMode ? t('lightMode') : t('darkMode')}
            >
              {darkMode ? <Sun size={14} className="text-amber-400 flex-shrink-0" /> : <Moon size={14} className="text-slate-700 flex-shrink-0" />}
            </button>

            {/* User Avatar Chip */}
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs text-emerald-800 dark:text-emerald-300 flex-shrink-0 whitespace-nowrap">
              VN
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

