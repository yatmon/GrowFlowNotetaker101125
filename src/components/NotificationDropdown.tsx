import { useRef, useEffect, useState } from 'react';
import { Notification } from '../lib/supabase';
import { X, ChevronRight } from 'lucide-react';

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_ICONS = {
  assigned: '📋',
  updated: '✏️',
  completed: '✅',
};

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTimeAgo = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return created.toLocaleDateString();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {notifications.some(n => !n.read) && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                  !notification.read ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-xl flex-shrink-0">
                    {NOTIFICATION_ICONS[notification.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeAgo(notification.created_at)}
                    </p>
                  </div>

                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                      className="flex-shrink-0 w-2 h-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                      title="Mark as read"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 text-center">
        <button className="text-sm font-medium text-green-700 hover:text-green-800 flex items-center justify-center gap-1 w-full transition-colors">
          View all notifications
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
