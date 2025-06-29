
import React, { useState } from 'react';
import { Plus, Eye, Edit2, Trash2, Search, Filter, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { subsidiaries } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'Draft' | 'Confirmed' | 'Processing' | 'Delivered' | 'Cancelled';
  orderDate: string;
  deliveryDate?: string;
  subsidiaryId: number;
}

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    customerName: "Mwalimu John Kasonga",
    customerPhone: "+255712345678",
    product: "Fertilizer A (50kg)",
    quantity: 10,
    unitPrice: 45000,
    totalAmount: 450000,
    status: 'Confirmed',
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    subsidiaryId: 1
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    customerName: "Mama Grace Mwangi",
    customerPhone: "+255723456789",
    product: "Engine Oil (5L)",
    quantity: 25,
    unitPrice: 18000,
    totalAmount: 450000,
    status: 'Processing',
    orderDate: "2024-01-16",
    subsidiaryId: 2
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    customerName: "Bwana Ahmed Hassan",
    customerPhone: "+255734567890",
    product: "Maize Flour (25kg)",
    quantity: 50,
    unitPrice: 35000,
    totalAmount: 1750000,
    status: 'Delivered',
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-18",
    subsidiaryId: 3
  },
  {
    id: 4,
    orderNumber: "ORD-2024-004",
    customerName: "Dada Sarah Mbogo",
    customerPhone: "+255745678901",
    product: "Local Beer (Crate)",
    quantity: 5,
    unitPrice: 25000,
    totalAmount: 125000,
    status: 'Draft',
    orderDate: "2024-01-17",
    subsidiaryId: 4
  }
];

const Orders: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    let matchesSubsidiary = true;
    if (currentUser?.role !== 'Owner') {
      matchesSubsidiary = order.subsidiaryId === currentUser?.subsidiaryId;
    } else if (selectedSubsidiary !== 'all') {
      matchesSubsidiary = order.subsidiaryId === parseInt(selectedSubsidiary);
    }
    
    return matchesSearch && matchesStatus && matchesSubsidiary;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <Edit2 className="h-4 w-4" />;
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'Processing': return <Clock className="h-4 w-4" />;
      case 'Delivered': return <Package className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and deliveries</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-zakayo-primary hover:bg-zakayo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{filteredOrders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{filteredOrders.filter(o => ['Draft', 'Confirmed', 'Processing'].includes(o.status)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{filteredOrders.filter(o => o.status === 'Delivered').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Package className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">TSh {(filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0) / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const subsidiary = subsidiaries.find(s => s.id === order.subsidiaryId);
          return (
            <Card key={order.id} className="hover-lift card-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer: </span>
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone: </span>
                        <span className="font-medium">{order.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Product: </span>
                        <span className="font-medium">{order.product}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity: </span>
                        <span className="font-medium">{order.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order Date: </span>
                        <span className="font-medium">{order.orderDate}</span>
                      </div>
                      {order.deliveryDate && (
                        <div>
                          <span className="text-muted-foreground">Delivery Date: </span>
                          <span className="font-medium">{order.deliveryDate}</span>
                        </div>
                      )}
                    </div>

                    {subsidiary && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subsidiary.color }}
                        />
                        <span className="text-sm font-medium">{subsidiary.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-xl font-bold">TSh {order.totalAmount.toLocaleString()}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Order</CardTitle>
              <CardDescription>Add a new customer order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="text" 
                placeholder="Customer Name" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="tel" 
                placeholder="Customer Phone" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="text" 
                placeholder="Product" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="number" 
                placeholder="Quantity" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="number" 
                placeholder="Unit Price (TSh)" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="date" 
                placeholder="Delivery Date" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              {currentUser?.role === 'Owner' && (
                <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                  <option>Select Subsidiary</option>
                  {subsidiaries.map(sub => (
                    <option key={sub.id}>{sub.name}</option>
                  ))}
                </select>
              )}
              <div className="flex gap-2">
                <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setShowAddModal(false)} className="flex-1 bg-zakayo-primary hover:bg-zakayo-primary/90">
                  Create Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Orders;
