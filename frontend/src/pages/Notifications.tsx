import { useState } from 'react';
import { Bell, CheckCheck, Filter, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Card, PageHeader, Button } from '../components/ui';
import { ALERTS } from '../data/mockData';

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [alerts, setAlerts] = useState(ALERTS);

  const markAllRead = () => setAlerts(a => a.map(x => ({ ...x, read: true })));
  const dismiss = (id: string) => setAlerts(a => a.filter(x => x.id !== id));
  const markRead = (id: string) => setAlerts(a => a.map(x => x.id === id ? { ...x, read: true } : x));

  const filtered = alerts.filter(a =>
    filter === 'all' ? true :
    filter === 'unread' ? !a.read :
    filter === 'critical' ? a.type === 'critical'
    : true
  );

  const unreadCount = alerts.filter(a => !a.read).length;

  const TYPE_STYLES: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
    critical: {
      icon: <AlertTriangle size={14} className="text-red-600" />,
      bg: 'bg-red-50',
      border: 'border-l-red-500',
    },
    warning: {
      icon: <AlertTriangle size={14} className="text-amber-500" />,
      bg: 'bg-amber-50',
      border: 'border-l-amber-400',
    },
    info: {
      icon: <Info size={14} className="text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-l-blue-400',
    },
    success: {
      icon: <CheckCircle size={14} className="text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-l-emerald-400',
    },
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl fade-in">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        actions={
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <CheckCheck size={13} />Mark All Read
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(['all', 'unread', 'critical'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell size={32} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No notifications to show</p>
          </div>
        )}
        {filtered.map(alert => {
          const style = TYPE_STYLES[alert.type] ?? TYPE_STYLES['info'];
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${style.bg} ${style.border} ${!alert.read ? 'ring-1 ring-inset ring-slate-200' : 'opacity-70'} transition-all`}
            >
              <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                {style.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!alert.read ? 'text-slate-900' : 'text-slate-600'}`}>
                    {alert.title}
                    {!alert.read && <span className="ml-2 inline-block w-1.5 h-1.5 bg-blue-500 rounded-full align-middle" />}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!alert.read && (
                      <button
                        onClick={() => markRead(alert.id)}
                        className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                      title="Dismiss"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{alert.message}</p>
                <p className="text-xs text-slate-400 mt-1.5">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <div className="text-center">
          <button className="text-xs text-slate-400 hover:text-slate-600">Load older notifications</button>
        </div>
      )}
    </div>
  );
}
