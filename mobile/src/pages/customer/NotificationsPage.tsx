import React, { useState } from 'react';
import { StatusBar } from '../../components/layout/StatusBar';
import { CustomerBottomNav } from '../../components/layout/CustomerBottomNav';
import { HomeIndicator } from '../../components/layout/HomeIndicator';
import { useCustomer } from '../../context/CustomerContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Utensils, Calendar, Clock, Bell, CheckCheck, MapPin } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAllNotificationsRead,
    markNotificationRead,
  } = useCustomer();

  const [selectedNotif, setSelectedNotif] = useState<any>(null);

  const todayNotifs = notifications.filter((n) => n.section === 'TODAY');
  const earlierNotifs = notifications.filter((n) => n.section === 'EARLIER');

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'TABLE_READY':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#00B37E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Utensils className="w-5 h-5" />
          </div>
        );
      case 'REMINDER':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#181A1E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
        );
      case 'TIME_CHANGED':
      case 'QUEUE_UPDATE':
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#181A1E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        );
      case 'CONFIRMED':
      default:
        return (
          <div className="w-11 h-11 rounded-2xl bg-[#181A1E] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Bell className="w-5 h-5 text-sky-400" />
          </div>
        );
    }
  };

  const handleCardClick = (notif: any) => {
    markNotificationRead(notif.id);
    setSelectedNotif(notif);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F2FBF7] via-[#F6F9F8] to-[#F6F9F8] min-h-full">
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status bar */}
        <StatusBar time="9:41" />

        {/* Top Header */}
        <div className="flex items-center justify-between mt-3 mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#E8FAF0] text-[#00875A] font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 ? (
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-bold text-[#009669] hover:text-emerald-700 transition flex items-center gap-1 active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          ) : (
            <span className="text-xs font-semibold text-zinc-400">All caught up</span>
          )}
        </div>

        {/* Section 1: TODAY */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2.5">
            <span>TODAY</span>
            <span>14 Jun 2025</span>
          </div>

          <div className="space-y-3">
            {todayNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleCardClick(notif)}
                className={`bg-white rounded-3xl p-4 border transition-all cursor-pointer relative shadow-soft hover:border-zinc-300 ${
                  notif.isUnread
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-[#EEF2F0]'
                }`}
              >
                {/* Unread Indicator Dot */}
                {notif.isUnread && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00B37E]" />
                )}

                <div className="flex items-start gap-3">
                  {getNotifIcon(notif.type)}

                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-sm font-extrabold text-zinc-900 leading-tight">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
                      {notif.body}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {notif.timeAgo}
                        {notif.bookingRef && ` • ${notif.bookingRef}`}
                      </span>

                      {notif.actionLabel && (
                        <span className="bg-[#E8FAF0] text-[#00875A] text-xs font-bold px-3 py-1 rounded-full">
                          {notif.actionLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: EARLIER */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2.5">
            EARLIER
          </div>

          <div className="space-y-3">
            {earlierNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleCardClick(notif)}
                className="bg-white rounded-3xl p-4 border border-[#EEF2F0] shadow-soft hover:border-zinc-300 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {getNotifIcon(notif.type)}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-extrabold text-zinc-900 leading-tight">
                      {notif.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
                      {notif.body}
                    </p>
                    <span className="text-[11px] text-zinc-400 font-medium mt-2 block">
                      {notif.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Customer Nav & Indicator */}
      <div className="w-full shrink-0">
        <CustomerBottomNav />
        <HomeIndicator />
      </div>

      {/* Notification Detail Modal */}
      <Modal
        isOpen={Boolean(selectedNotif)}
        onClose={() => setSelectedNotif(null)}
        title={selectedNotif?.title || 'Notification Details'}
        subtitle="Customer operational alert"
      >
        <div className="flex flex-col gap-3">
          <div className="bg-[#E8FAF0] border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-950 leading-relaxed">
            <p className="font-semibold">{selectedNotif?.body}</p>
            {selectedNotif?.type === 'TABLE_READY' && (
              <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-emerald-800 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Host station located inside main lobby entrance.</span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            onClick={() => setSelectedNotif(null)}
            fullWidth
            className="bg-[#181A1E] mt-2"
          >
            Acknowledge & Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
