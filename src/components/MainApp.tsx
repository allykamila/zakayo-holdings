
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import Customers from './Customers';
import Orders from './Orders';
import Invoices from './Invoices';
import DeliveryNotes from './DeliveryNotes';
import Reports from './Reports';
import Settings from './Settings';
import { useAuth } from '../contexts/AuthContext';
import { subsidiaries } from '../data/mockData';

const MainApp: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState<number | null>(null);
  const { currentUser } = useAuth();

  // Auto-select subsidiary for non-owners
  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'Owner' && currentUser.subsidiaryId) {
      setSelectedSubsidiary(currentUser.subsidiaryId);
    }
  }, [currentUser]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard selectedSubsidiary={selectedSubsidiary} />;
      case 'users':
        return <UserManagement />;
      case 'customers':
        return <Customers />;
      case 'orders':
        return <Orders />;
      case 'invoices':
        return <Invoices />;
      case 'delivery-notes':
        return <DeliveryNotes />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard selectedSubsidiary={selectedSubsidiary} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedSubsidiary={selectedSubsidiary}
          onSubsidiaryChange={setSelectedSubsidiary}
        />
        
        <main className="flex-1 lg:ml-72 transition-all duration-300">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainApp;
