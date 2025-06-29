
import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShoppingCart, 
  FileText, 
  Truck, 
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subsidiaries } from '../data/mockData';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedSubsidiary: number | null;
  onSubsidiaryChange: (subsidiaryId: number | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  selectedSubsidiary,
  onSubsidiaryChange
}) => {
  const { currentUser, canAccess } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'delivery-notes', label: 'Delivery Notes', icon: Truck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  if (currentUser?.role === 'Owner') {
    menuItems.splice(1, 0, { id: 'users', label: 'User Management', icon: Building2 });
  }

  const availableSubsidiaries = currentUser?.role === 'Owner' 
    ? subsidiaries 
    : subsidiaries.filter(s => canAccess(s.id));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-72 transform bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Subsidiary Selector for Owner */}
          {currentUser?.role === 'Owner' && (
            <div className="p-4 border-b">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Select Subsidiary
              </label>
              <select
                value={selectedSubsidiary || 'all'}
                onChange={(e) => onSubsidiaryChange(e.target.value === 'all' ? null : Number(e.target.value))}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Subsidiaries</option>
                {subsidiaries.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Active Subsidiary Display */}
          {selectedSubsidiary && (
            <div className="p-4 bg-muted/30">
              {(() => {
                const subsidiary = subsidiaries.find(s => s.id === selectedSubsidiary);
                return subsidiary ? (
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subsidiary.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{subsidiary.name}</p>
                      <p className="text-xs text-muted-foreground">{subsidiary.description}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-zakayo-primary/10 to-zakayo-secondary/10 text-zakayo-primary border border-zakayo-primary/20" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-zakayo-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto text-zakayo-primary" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={() => onTabChange('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200",
                activeTab === 'settings'
                  ? "bg-gradient-to-r from-zakayo-primary/10 to-zakayo-secondary/10 text-zakayo-primary" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
