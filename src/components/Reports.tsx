
import React, { useState } from 'react';
import { Download, Filter, BarChart3, PieChart, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { subsidiaries } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Reports: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [selectedReport, setSelectedReport] = useState('sales');

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: DollarSign, description: 'Sales performance and revenue analysis' },
    { id: 'orders', name: 'Orders Report', icon: BarChart3, description: 'Order processing and fulfillment metrics' },
    { id: 'customers', name: 'Customer Report', icon: PieChart, description: 'Customer demographics and behavior' },
    { id: 'products', name: 'Product Report', icon: TrendingUp, description: 'Product performance and inventory' }
  ];

  const mockReportData = {
    sales: {
      totalRevenue: 12450000,
      growth: '+15.2%',
      topProducts: ['Fertilizer A', 'Engine Oil', 'Maize Flour'],
      monthlyData: [
        { month: 'Jan', revenue: 2100000 },
        { month: 'Feb', revenue: 2450000 },
        { month: 'Mar', revenue: 2890000 },
        { month: 'Apr', revenue: 2340000 },
        { month: 'May', revenue: 2670000 }
      ]
    },
    orders: {
      totalOrders: 456,
      pending: 23,
      completed: 398,
      cancelled: 35,
      averageOrderValue: 275000
    },
    customers: {
      totalCustomers: 234,
      newCustomers: 45,
      activeCustomers: 189,
      retentionRate: '78%'
    },
    products: {
      totalProducts: 89,
      topSelling: 'Fertilizer A',
      lowStock: 12,
      outOfStock: 3
    }
  };

  const salesData = mockReportData.sales;
  const ordersData = mockReportData.orders;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-zakayo-primary hover:bg-zakayo-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background min-w-[140px]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            {currentUser?.role === 'Owner' && (
              <select
                value={selectedSubsidiary}
                onChange={(e) => setSelectedSubsidiary(e.target.value)}
                className="px-4 py-2 border border-input rounded-md bg-background min-w-[180px]"
              >
                <option value="all">All Subsidiaries</option>
                {subsidiaries.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                className="px-3 py-2 border border-input rounded-md bg-background"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                className="px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Type Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isSelected = selectedReport === report.id;
          return (
            <Card 
              key={report.id} 
              className={`cursor-pointer transition-all hover-lift card-shadow ${
                isSelected ? 'ring-2 ring-zakayo-primary bg-zakayo-primary/5' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-zakayo-primary text-white' 
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isSelected 
                        ? 'text-white' 
                        : 'text-blue-600 dark:text-blue-300'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.name}</h3>
                    <p className="text-xs text-muted-foreground">{report.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Report Content */}
      {selectedReport === 'sales' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-zakayo-primary" />
                  Sales Overview
                </CardTitle>
                <CardDescription>Revenue performance for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold">TSh {(salesData.totalRevenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Growth</p>
                      <p className="text-2xl font-bold text-green-600">{salesData.growth}</p>
                    </div>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="h-64 bg-gradient-to-t from-zakayo-primary/10 to-transparent rounded-lg flex items-end justify-center p-4">
                    <div className="flex items-end gap-2 h-full w-full max-w-md">
                      {salesData.monthlyData.map((data, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-gradient-to-t from-zakayo-primary to-zakayo-secondary rounded-t-md"
                            style={{ height: `${(data.revenue / 3000000) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground">{data.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="hover-lift card-shadow">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-zakayo-primary to-zakayo-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{product}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">TSh {(Math.random() * 2000000 + 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                      <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 50 + 10)} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedReport === 'orders' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{ordersData.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{ordersData.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{ordersData.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift card-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">TSh {(ordersData.averageOrderValue / 1000).toLocaleString()}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Export Options */}
      <Card className="hover-lift card-shadow">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Download reports in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button className="bg-zakayo-primary hover:bg-zakayo-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
