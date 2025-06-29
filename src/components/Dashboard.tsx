import React from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  FileText, 
  Truck,
  DollarSign,
  Package,
  Users,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getDashboardStats, subsidiaries } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  selectedSubsidiary: number | null;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedSubsidiary }) => {
  const { currentUser } = useAuth();
  const stats = getDashboardStats(selectedSubsidiary);

  const statCards = [
    {
      title: "Total Sales",
      value: `TSh ${stats.totalSales.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      change: "-5.1%",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      title: "Delivered Orders",
      value: stats.deliveredOrders.toString(),
      change: "+15.3%",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    }
  ];

  const invoiceStats = [
    {
      title: "Total Invoices",
      value: stats.totalInvoices.toString(),
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Paid Invoices",
      value: stats.paidInvoices.toString(),
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices.toString(),
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Overdue Invoices",
      value: stats.overdueInvoices.toString(),
      icon: Users,
      color: "text-red-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {selectedSubsidiary 
            ? `Overview for ${subsidiaries.find(s => s.id === selectedSubsidiary)?.name}`
            : currentUser?.role === 'Owner' 
              ? "Complete overview of all subsidiaries"
              : "Overview of your assigned subsidiary"
          }
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover-lift card-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  {" "}from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Invoice Stats */}
      <Card className="hover-lift card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-zakayo-primary" />
            Invoice Overview
          </CardTitle>
          <CardDescription>Current status of all invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {invoiceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subsidiary Overview for Owner */}
      {currentUser?.role === 'Owner' && !selectedSubsidiary && (
        <Card className="hover-lift card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-zakayo-secondary" />
              Subsidiaries Performance
            </CardTitle>
            <CardDescription>Performance overview of all subsidiaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {subsidiaries.map((subsidiary) => {
                const subsidiaryStat = getDashboardStats(subsidiary.id);
                return (
                  <div 
                    key={subsidiary.id} 
                    className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subsidiary.color }}
                      />
                      <h3 className="font-semibold">{subsidiary.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sales</p>
                        <p className="font-bold">TSh {subsidiaryStat.totalSales.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Orders</p>
                        <p className="font-bold">{subsidiaryStat.totalOrders}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
