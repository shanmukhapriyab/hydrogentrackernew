import { useState } from 'react';

import Login from './pages/Login';
import Layout from './components/Layout';

import ProducerDashboard from './pages/ProducerDashboard';
import ProductionManagement from './pages/ProductionManagement';
import StorageManagement from './pages/StorageManagement';

import LogisticsDashboard from './pages/LogisticsDashboard';
import ShipmentDetails from './pages/ShipmentDetails';
import DeliveryManagement from './pages/DeliveryManagement';

import CustomerDashboard from './pages/CustomerDashboard';

import AdminDashboard from './pages/AdminDashboard';

import ReportsAnalytics from './pages/ReportsAnalytics';
import ProfileSettings from './pages/ProfileSettings';
import Notifications from './pages/Notifications';

import StatesDemo from './pages/States';

type Page =
  | 'login'
  | 'producer-dashboard'
  | 'production'
  | 'storage'
  | 'logistics'
  | 'shipment-details'
  | 'delivery'
  | 'customer-dashboard'
  | 'place-order'
  | 'admin-dashboard'
  | 'user-management'
  | 'reports'
  | 'profile'
  | 'notifications'
  | 'loading'
  | 'empty'
  | 'error';

type UserRole = 'admin' | 'producer' | 'logistics' | 'customer';

const DEFAULT_PAGE: Record<UserRole, Page> = {
  admin: 'admin-dashboard',
  producer: 'producer-dashboard',
  logistics: 'logistics',
  customer: 'customer-dashboard',
};

export default function App() {
  const [page, setPage] = useState<Page>('login');
  const [role, setRole] = useState<UserRole>('admin');

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setPage(DEFAULT_PAGE[selectedRole]);
  };

  const handleNavigate = (newPage: Page) => {
    if (newPage === 'login') {
      setPage('login');
      return;
    }

    setPage(newPage);
  };

  if (page === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'producer-dashboard':
        return (
          <ProducerDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'production':
        return <ProductionManagement />;

      case 'storage':
        return <StorageManagement />;

      case 'logistics':
        return (
          <LogisticsDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'shipment-details':
        return <ShipmentDetails />;

      case 'delivery':
        return <DeliveryManagement />;

      case 'customer-dashboard':
        return (
          <CustomerDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'place-order':
        return (
          <CustomerDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'admin-dashboard':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'user-management':
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        );

      case 'reports':
        return <ReportsAnalytics />;

      case 'profile':
        return <ProfileSettings />;

      case 'notifications':
        return <Notifications />;

      case 'loading':
      case 'empty':
      case 'error':
        return <StatesDemo />;

      default:
        return (
          <AdminDashboard
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <Layout
      currentPage={page}
      onNavigate={handleNavigate}
      userRole={role}
    >
      {renderPage()}
    </Layout>
  );
}