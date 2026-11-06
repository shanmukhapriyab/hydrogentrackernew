import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Factory, Database, Truck, Package,
  BarChart3, Settings, Bell, LogOut, ChevronRight, Zap, MapPin
} from 'lucide-react';
import { api } from '../lib/api';
import { subscribeToResource } from '../lib/realtime';
import { ThemeToggle } from './ui';

type Page =
  | 'login' | 'producer-dashboard' | 'production' | 'storage'
  | 'logistics' | 'shipment-details' | 'delivery' | 'customer-dashboard'
  | 'place-order' | 'admin-dashboard' | 'user-management' | 'reports'
  | 'profile' | 'notifications' | 'loading' | 'empty' | 'error';

type UserRole = 'admin' | 'producer' | 'logistics' | 'customer';

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  userRole: UserRole;
  isDark: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: Record<UserRole, { label: string; page: Page; icon: React.FC<{ size?: number; className?: string }> }[]> = {
  admin: [
    { label: 'Admin Dashboard', page: 'admin-dashboard', icon: LayoutDashboard },
    { label: 'Production', page: 'production', icon: Factory },
    { label: 'Storage', page: 'storage', icon: Database },
    { label: 'Logistics', page: 'logistics', icon: Truck },
    { label: 'Delivery', page: 'delivery', icon: Package },
    { label: 'Reports & Analytics', page: 'reports', icon: BarChart3 },
    { label: 'Notifications', page: 'notifications', icon: Bell },
    { label: 'Profile / Settings', page: 'profile', icon: Settings },
  ],
  producer: [
    { label: 'Dashboard', page: 'producer-dashboard', icon: LayoutDashboard },
    { label: 'Storage', page: 'storage', icon: Database },
    { label: 'Reports', page: 'reports', icon: BarChart3 },
    { label: 'Notifications', page: 'notifications', icon: Bell },
    { label: 'Profile', page: 'profile', icon: Settings },
  ],
  logistics: [
    { label: 'Logistics Dashboard', page: 'logistics', icon: LayoutDashboard },
    { label: 'Shipments', page: 'shipment-details', icon: MapPin },
    { label: 'Delivery', page: 'delivery', icon: Package },
    { label: 'Storage', page: 'storage', icon: Database },
    { label: 'Notifications', page: 'notifications', icon: Bell },
    { label: 'Profile', page: 'profile', icon: Settings },
  ],
  customer: [
    { label: 'Dashboard', page: 'customer-dashboard', icon: LayoutDashboard },
    { label: 'Shipment Tracking', page: 'shipment-details', icon: MapPin },
    { label: 'Notifications', page: 'notifications', icon: Bell },
    { label: 'Profile', page: 'profile', icon: Settings },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  producer: 'Producer',
  logistics: 'Logistics Manager',
  customer: 'Customer',
};

const ROLE_NAMES: Record<UserRole, string> = {
  admin: 'Alexandra Mitchell',
  producer: 'Carlos Reyes',
  logistics: 'Priya Sharma',
  customer: 'Thomas Berg',
};

export default function Layout({ currentPage, onNavigate, userRole, isDark, onToggleTheme, children }: LayoutProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const navItems = NAV_ITEMS[userRole];

  useEffect(() => {
    const load = () => api<{ read: boolean }[]>('/notifications').then(items => setUnreadCount(items.filter(item => !item.read).length)).catch(() => setUnreadCount(0));
    load();
    return subscribeToResource('notifications', load);
  }, []);

  return (
    <div className="app-shell flex h-screen w-full min-w-0 bg-slate-50">
      <aside className="app-sidebar flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0b3157]">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-none tracking-tight text-slate-900">HydrogenTrack</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">Operations platform</div>
          </div>
        </div>
        <div className="border-b border-slate-100 px-4 py-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6f2f1] text-xs font-semibold text-[#0b625e]">
              {ROLE_NAMES[userRole].split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-slate-800">{ROLE_NAMES[userRole]}</div>
              <div className="truncate text-[11px] text-slate-500">{ROLE_LABELS[userRole]}</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-scroll flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Primary navigation">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Operations</p>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex w-full items-center gap-3 border-l-2 px-3 py-2 text-left text-xs transition-colors ${
                  active
                    ? 'border-[#0b625e] bg-[#eef7f6] font-semibold text-[#0b625e]'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={active ? 'text-[#0b625e]' : 'text-slate-400'} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.page === 'notifications' && unreadCount > 0 && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">{unreadCount}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button onClick={() => onNavigate('profile')} className="mb-1 flex w-full items-center gap-3 px-2 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900">
            <Settings size={15} className="text-slate-400" /> Account settings
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              onNavigate('login');
            }}
            className="flex w-full items-center gap-3 px-2 py-2 text-xs text-slate-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={15} className="text-slate-400" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Operations</span>
            <ChevronRight size={13} className="hidden sm:inline text-slate-300" />
            <span className="truncate font-semibold text-slate-800">{navItems.find(n => n.page === currentPage)?.label ?? 'Overview'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[11px] text-slate-400 md:inline">Environment: Production</span>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <button onClick={() => onNavigate('notifications')} className="relative flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-50" aria-label="Open notifications">
              <Bell size={17} />
              {unreadCount > 0 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-600" />}
            </button>
          </div>
        </header>
        <main className="w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
