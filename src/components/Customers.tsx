
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Phone, Mail, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { subsidiaries } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  subsidiaryId: number;
  totalOrders: number;
  totalValue: number;
  status: 'Active' | 'Inactive';
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Mwalimu John Kasonga",
    email: "john.kasonga@gmail.com",
    phone: "+255712345678",
    address: "Mwanza, Tanzania",
    subsidiaryId: 1,
    totalOrders: 12,
    totalValue: 2400000,
    status: 'Active'
  },
  {
    id: 2,
    name: "Mama Grace Mwangi",
    email: "grace.mwangi@yahoo.com",
    phone: "+255723456789",
    address: "Dar es Salaam, Tanzania",
    subsidiaryId: 2,
    totalOrders: 8,
    totalValue: 1800000,
    status: 'Active'
  },
  {
    id: 3,
    name: "Bwana Ahmed Hassan",
    email: "ahmed.hassan@hotmail.com",
    phone: "+255734567890",
    address: "Arusha, Tanzania",
    subsidiaryId: 3,
    totalOrders: 15,
    totalValue: 3200000,
    status: 'Active'
  },
  {
    id: 4,
    name: "Dada Sarah Mbogo",
    email: "sarah.mbogo@gmail.com",
    phone: "+255745678901",
    address: "Dodoma, Tanzania",
    subsidiaryId: 4,
    totalOrders: 6,
    totalValue: 950000,
    status: 'Inactive'
  }
];

const Customers: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    
    let matchesSubsidiary = true;
    if (currentUser?.role !== 'Owner') {
      matchesSubsidiary = customer.subsidiaryId === currentUser?.subsidiaryId;
    } else if (selectedSubsidiary !== 'all') {
      matchesSubsidiary = customer.subsidiaryId === parseInt(selectedSubsidiary);
    }
    
    return matchesSearch && matchesSubsidiary;
  });

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
           'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-zakayo-primary hover:bg-zakayo-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{filteredCustomers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <User className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{filteredCustomers.filter(c => c.status === 'Active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <User className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{filteredCustomers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">TSh {(filteredCustomers.reduce((sum, c) => sum + c.totalValue, 0) / 1000000).toFixed(1)}M</p>
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
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

      {/* Customers List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => {
          const subsidiary = subsidiaries.find(s => s.id === customer.subsidiaryId);
          return (
            <Card key={customer.id} className="hover-lift card-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-zakayo-primary to-zakayo-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">{customer.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {customer.address}
                          </div>
                        </div>
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
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="font-bold">{customer.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="font-bold">TSh {(customer.totalValue / 1000).toLocaleString()}K</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
              <CardDescription>Create a new customer profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="text" 
                placeholder="Customer Name" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="text" 
                placeholder="Address" 
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
                  Add Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Customers;
