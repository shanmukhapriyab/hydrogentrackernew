import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Factory, Database, Truck, Package, Users,
  BarChart3, Settings, Bell, LogOut, ChevronRight, Menu, X,
  Zap, ShoppingCart, MapPin, User, ChevronDown
} from 'lucide-react';
import { api } from '../lib/api';
import { subscribeToResource } from '../lib/realtime';

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
  children: React.ReactNode;
}

const NAV_ITEMS: Record<UserRole, { label: string; page: Page; icon: React.FC<{ size?: number; className?: string }> }[]> = {
  admin: [
    { label: 'Admin Dashboard', page: 'admin-dashboard', icon: LayoutDashboard },
    { label: 'User Management', page: 'user-management', icon: Users },
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
    { label: 'Production', page: 'production', icon: Factory },
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
    { label: 'Place Order', page: 'place-order', icon: ShoppingCart },
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

export default function Layout({ currentPage, onNavigate, userRole, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navItems = NAV_ITEMS[userRole];

  useEffect(() => {
    const load = () => api<{ read: boolean }[]>('/notifications').then(items => setUnreadCount(items.filter(item => !item.read).length)).catch(() => setUnreadCount(0));
    load();
    return subscribeToResource('notifications', load);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100 gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm leading-none">HydrogenTrack</div>
            <div className="text-xs text-slate-400 mt-0.5">Supply Chain Platform</div>
          </div>
          <button className="ml-auto lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Role switcher */}
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {ROLE_NAMES[userRole].split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-700 truncate">{ROLE_NAMES[userRole]}</div>
              <div className="text-xs text-slate-400">{ROLE_LABELS[userRole]}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-3 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => { onNavigate(item.page); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                  ${active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.page === 'notifications' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* View switcher */}
        <div className="px-3 py-3 border-t border-slate-100 flex-shrink-0">
          <p className="text-xs font-medium text-slate-400 px-3 mb-2">Switch View</p>
          <div className="space-y-0.5">
            {(['admin', 'producer', 'logistics', 'customer'] as UserRole[]).map(role => (
              <button
                key={role}
                onClick={() => {
                  const firstPage = NAV_ITEMS[role][0].page;
                  onNavigate(firstPage);
                  // We need to signal role change - handled via page navigation
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all
                  ${userRole === role ? 'text-blue-700 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <User size={12} />
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
            <span className="text-slate-400">HydrogenTrack</span>
            <ChevronRight size={14} />
            <span className="font-medium text-slate-700 truncate">
              {navItems.find(n => n.page === currentPage)?.label ?? 'Overview'}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => onNavigate('notifications')}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            >
              {ROLE_NAMES[userRole].split(' ').map(n => n[0]).join('')}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
