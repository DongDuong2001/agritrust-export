import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X, 
  Search, 
  ExternalLink, 
  MessageSquare, 
  Satellite, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Clock, 
  Send,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AppNotification } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onToggleReadStatus: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearLog: () => void;
  onDeleteNotification: (id: string) => void;
  onRestoreDefaultNotifications: () => void;
  onSimulateZaloAlert: () => void;
  onSelectShipment?: (shipmentId: string) => void;
  onViewPassport?: (shipmentId: string) => void;
  darkMode?: boolean;
}

type FilterTab = 'all' | 'zalo' | 'system' | 'unread';

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onToggleReadStatus,
  onMarkAllAsRead,
  onClearLog,
  onDeleteNotification,
  onRestoreDefaultNotifications,
  onSimulateZaloAlert,
  onSelectShipment,
  onViewPassport,
  darkMode = false,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Tab filter
      if (activeTab === 'unread' && n.isRead) return false;
      if (activeTab === 'zalo' && n.source !== 'zalo') return false;
      if (activeTab === 'system' && n.source === 'zalo') return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (language === 'vi' ? n.titleVi : n.title).toLowerCase();
      const msg = (language === 'vi' ? n.messageVi : n.message).toLowerCase();
      const sender = (n.sender?.name || '').toLowerCase();
      const org = (n.sender?.organization || '').toLowerCase();
      const lot = (n.lotCode || '').toLowerCase();
      const shipId = (n.shipmentId || '').toLowerCase();

      return title.includes(q) || msg.includes(q) || sender.includes(q) || org.includes(q) || lot.includes(q) || shipId.includes(q);
    });
  }, [notifications, activeTab, searchQuery, language]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const zaloCount = notifications.filter(n => n.source === 'zalo').length;
  const systemCount = notifications.filter(n => n.source !== 'zalo').length;

  if (!isOpen) return null;

  const handleActionClick = (notif: AppNotification) => {
    onMarkAsRead(notif.id);
    if (notif.shipmentId) {
      if (notif.actionType === 'view_passport' && onViewPassport) {
        onViewPassport(notif.shipmentId);
      } else if (onSelectShipment) {
        onSelectShipment(notif.shipmentId);
      }
      onClose();
    }
  };

  const getChannelBadge = (notif: AppNotification) => {
    switch (notif.channel) {
      case 'zalo_oa':
        return {
          label: 'Zalo Official Account',
          bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
          icon: <MessageSquare size={12} className="text-blue-600 dark:text-blue-400" />
        };
      case 'zalo_mini_app':
        return {
          label: 'Zalo Mini App HTX',
          bg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
          icon: <Send size={12} className="text-sky-600 dark:text-sky-400" />
        };
      case 'traces_eu':
        return {
          label: 'EU TRACES-NT Customs',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
          icon: <ShieldCheck size={12} className="text-indigo-600 dark:text-indigo-400" />
        };
      case 'agritrust_cloud':
      default:
        return {
          label: notif.source === 'satellite' ? 'Copernicus Sentinel-2' : 'AgriTrust Cloud',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
          icon: notif.source === 'satellite' ? <Satellite size={12} className="text-emerald-600 dark:text-emerald-400" /> : <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" />
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-3xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden transition-all ${
          darkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-4 sm:p-6 border-b flex-shrink-0 flex items-start justify-between gap-4 ${
          darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-300 flex-shrink-0 relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  {t('notificationsTitle')}
                </h2>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    {unreadCount} {t('notifBadgeUnread')}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Check size={11} /> All read
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('notificationsSub')}
              </p>
            </div>
          </div>

          <button
            id="close-notif-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className={`px-4 sm:px-6 py-3 border-b flex-shrink-0 flex flex-wrap items-center justify-between gap-2.5 ${
          darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/30'
        }`}>
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('notifTabAll')} ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('zalo')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'zalo'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare size={12} />
              <span>Zalo OA ({zaloCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Satellite size={12} />
              <span>EUDR ({systemCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'unread'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>{t('notifTabUnread')} ({unreadCount})</span>
            </button>
          </div>

          {/* Quick Operations */}
          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={onMarkAllAsRead}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <CheckCheck size={14} />
                <span>{t('notifMarkAllRead')}</span>
              </button>
            )}

            <button
              id="simulate-zalo-btn"
              onClick={onSimulateZaloAlert}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              title="Send a real-time incoming Zalo test message"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>{t('notifSimulateZalo')}</span>
            </button>

            {notifications.length > 0 && !showClearConfirm && (
              <button
                id="clear-log-btn"
                onClick={() => setShowClearConfirm(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                title="Clear all alerts"
              >
                <Trash2 size={13} />
                <span>{t('notifClearLog')}</span>
              </button>
            )}

            {showClearConfirm && (
              <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 px-2 py-1 rounded-lg">
                <span className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                  {language === 'vi' ? 'Xác nhận xóa?' : 'Clear all?'}
                </span>
                <button
                  onClick={() => {
                    onClearLog();
                    setShowClearConfirm(false);
                  }}
                  className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold cursor-pointer"
                >
                  {language === 'vi' ? 'Có' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[11px] font-bold cursor-pointer"
                >
                  {language === 'vi' ? 'Hủy' : 'No'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className={`px-4 sm:px-6 py-2.5 border-b flex-shrink-0 ${
          darkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-100 bg-slate-50/20'
        }`}>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('notifSearchPlaceholder')}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border outline-none transition-all ${
                darkMode 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-emerald-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Notification Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 min-h-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                <Bell size={24} className="opacity-50" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {t('notifEmptyTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                {t('notifEmptyDesc')}
              </p>
              {notifications.length === 0 && (
                <button
                  onClick={onRestoreDefaultNotifications}
                  className="mt-4 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw size={13} />
                  <span>{t('notifRestoreDemo')}</span>
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const channelBadge = getChannelBadge(notif);
              const isUnread = !notif.isRead;

              return (
                <div
                  key={notif.id}
                  id={`notif-card-${notif.id}`}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all relative group ${
                    isUnread
                      ? darkMode
                        ? 'bg-slate-800/80 border-emerald-800/70 shadow-sm'
                        : 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                      : darkMode
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Unread Accent Indicator */}
                  {isUnread && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-emerald-600 rounded-r-full" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Avatar / Source Icon */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border ${
                        notif.source === 'zalo'
                          ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800'
                          : notif.source === 'satellite'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800'
                            : notif.source === 'customs'
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
                              : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}>
                        {notif.sender?.avatarText || (notif.source === 'zalo' ? 'ZA' : 'SYS')}
                      </div>

                      {/* Middle: Content */}
                      <div className="min-w-0 flex-1">
                        {/* Badges & Meta */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${channelBadge.bg}`}>
                            {channelBadge.icon}
                            <span>{channelBadge.label}</span>
                          </span>

                          {notif.priority === 'urgent' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                              <AlertCircle size={10} /> Urgent
                            </span>
                          )}

                          {notif.lotCode && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {notif.lotCode}
                            </span>
                          )}

                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 ml-auto">
                            <Clock size={11} />
                            <span>{language === 'vi' ? notif.timeAgoVi : notif.timeAgo}</span>
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className={`text-xs sm:text-sm font-bold leading-tight ${
                          isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {language === 'vi' ? notif.titleVi : notif.title}
                        </h4>

                        {/* Message text */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {language === 'vi' ? notif.messageVi : notif.message}
                        </p>

                        {/* Sender info & timestamp */}
                        {notif.sender && (
                          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {notif.sender.name}
                            </span>
                            <span>•</span>
                            <span>{notif.sender.role}</span>
                            {notif.sender.organization && (
                              <>
                                <span>•</span>
                                <span className="italic">{notif.sender.organization}</span>
                              </>
                            )}
                          </div>
                        )}

                        {/* Action Buttons Row */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          {notif.shipmentId && (
                            <button
                              onClick={() => handleActionClick(notif)}
                              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>
                                {notif.actionType === 'view_passport' 
                                  ? t('notifActionViewPassport') 
                                  : t('notifActionViewShipment')}
                              </span>
                              <ExternalLink size={11} />
                            </button>
                          )}

                          {notif.source === 'zalo' && (
                            <button
                              onClick={() => onMarkAsRead(notif.id)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <MessageSquare size={11} />
                              <span>{language === 'vi' ? 'Mở Zalo OA' : 'Open Zalo OA'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => onToggleReadStatus(notif.id)}
                            className="px-2 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                            title={isUnread ? t('notifMarkRead') : t('notifMarkUnread')}
                          >
                            {isUnread ? (
                              <>
                                <Eye size={12} />
                                <span className="text-[11px]">{t('notifMarkRead')}</span>
                              </>
                            ) : (
                              <>
                                <EyeOff size={12} />
                                <span className="text-[11px]">{t('notifMarkUnread')}</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onDeleteNotification(notif.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title={t('notifDelete')}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-3 sm:p-4 border-t flex-shrink-0 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 ${
          darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {language === 'vi' 
                ? 'Đồng bộ hóa 2 chiều: Zalo Webhook & EUDR Smart Oracle' 
                : '2-Way Sync Active: Zalo Webhook & EUDR Smart Oracle'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
