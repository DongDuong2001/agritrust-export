import React from 'react';
import { 
  Layout, 
  Package, 
  File, 
  Users, 
  Settings, 
  Moon, 
  Sun,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  missingCount: number;
  verifiedCount: number;
  totalVolumeKg: number;
  darkMode: boolean;
  setDarkMode?: (val: boolean) => void;
  onNavigateToDashboard: () => void;
  onOpenOnboarding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  missingCount,
  verifiedCount,
  darkMode,
  setDarkMode,
  onNavigateToDashboard,
  onOpenOnboarding,
}) => {
  const { t } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }>; badge?: string; badgeColor?: string; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: Layout },
    { 
      id: 'onboarding', 
      label: t('navOnboarding'), 
      icon: ShieldCheck, 
      badge: t('badgeNew'), 
      badgeColor: 'bg-emerald-400 text-[#012d1d] font-extrabold',
      isSpecial: true
    },
    { 
      id: 'shipments', 
      label: t('navShipments'), 
      icon: Package, 
      badge: missingCount > 0 ? `${missingCount} ${t('badgePending')}` : undefined, 
      badgeColor: 'bg-amber-400/20 text-amber-300' 
    },
    { 
      id: 'compliance', 
      label: t('navCompliance'), 
      icon: File,
      badge: t('badgeEudrReady'),
      badgeColor: 'bg-emerald-400/20 text-emerald-300'
    },
    { id: 'buyers', label: t('navBuyers'), icon: Users, badge: t('badgePortals'), badgeColor: 'bg-blue-400/20 text-blue-300' },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <aside className={`w-64 h-full flex-shrink-0 flex flex-col justify-between overflow-y-auto transition-colors z-20 ${
      darkMode 
        ? 'bg-[#012d1d] border-r border-[#1b4332] text-white' 
        : 'bg-[#012d1d] text-white shadow-md'
    }`}>
      
      <div>
        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold font-mono uppercase tracking-widest text-emerald-400/80 whitespace-nowrap">
            {t('navTitle')}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (item.id === 'onboarding' && onOpenOnboarding) {
                    onOpenOnboarding();
                  } else {
                    onNavigateToDashboard();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1b4332] text-white font-bold border-l-3 border-emerald-400 pl-2.5 shadow-xs'
                    : item.isSpecial
                    ? 'text-emerald-300 hover:bg-white/10 hover:text-white bg-emerald-950/40 border border-emerald-800/40 my-1'
                    : 'text-emerald-100/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-emerald-300' : item.isSpecial ? 'text-emerald-400' : 'text-emerald-300/70'}`} />
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${
                    isActive && !item.isSpecial ? 'bg-emerald-400 text-emerald-950' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick EUDR Compliance Summary Card in Sidebar */}
        <div className="p-3 mx-3 rounded-xl bg-[#002114] border border-[#1b4332] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider whitespace-nowrap">
              {t('complianceRate')}
            </span>
            <span className="font-bold text-emerald-400 font-mono whitespace-nowrap">
              {Math.round((verifiedCount / (verifiedCount + missingCount || 1)) * 100)}%
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-[#1b4332] overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full" 
              style={{ width: `${Math.round((verifiedCount / (verifiedCount + missingCount || 1)) * 100)}%` }}
            />
          </div>

          <div className="text-[11px] text-emerald-200/70 space-y-0.5 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap">{t('verifiedLots')}</span>
              <span className="font-semibold text-white font-mono whitespace-nowrap">{verifiedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap">{t('actionItems')}</span>
              <span className="font-semibold text-amber-300 font-mono whitespace-nowrap">{missingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode & System Status Footer */}
      <div className="p-3 border-t border-[#1b4332] space-y-2">
        {setDarkMode && (
          <div 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 bg-[#002114] hover:bg-[#002d1b] rounded-lg flex items-center justify-between cursor-pointer border border-[#1b4332] transition-colors whitespace-nowrap"
          >
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
              {darkMode ? <Moon size={14} className="text-emerald-400 flex-shrink-0" /> : <Sun size={14} className="text-amber-400 flex-shrink-0" />}
              <span className="whitespace-nowrap">{t('darkMode')}</span>
            </span>
            <div className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 flex-shrink-0 ${darkMode ? 'bg-emerald-400' : 'bg-emerald-800'}`}>
              <div className={`w-3.5 h-3.5 rounded-full transition-all ${darkMode ? 'bg-emerald-950 translate-x-3.5' : 'bg-white translate-x-0'}`} />
            </div>
          </div>
        )}

        <div className="px-2 text-[10px] text-emerald-400/70 font-mono flex items-center justify-between whitespace-nowrap">
          <span className="whitespace-nowrap">{t('ledgerVersion')}</span>
          <span className="text-emerald-400 flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="whitespace-nowrap">{t('liveSync')}</span>
          </span>
        </div>
      </div>

    </aside>
  );
};

