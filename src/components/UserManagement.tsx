
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, UserPlus, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { users, subsidiaries } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  if (currentUser?.role !== 'Owner') {
    return (
      <div className="p-6">
        <div className="bg-card rounded-lg p-8 text-center border border-destructive/20">
          <h3 className="text-lg font-semibold mb-2 text-destructive">Access Denied</h3>
          <p className="text-muted-foreground">Only owners can access user management.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Owner': return 'bg-zakayo-primary text-white';
      case 'Manager': return 'bg-zakayo-secondary text-white';
      case 'Staff': return 'bg-zakayo-success text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users across all subsidiaries</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-zakayo-primary hover:bg-zakayo-primary/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-input rounded-md bg-background min-w-[120px]"
            >
              <option value="all">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => {
          const subsidiary = user.subsidiaryId ? subsidiaries.find(s => s.id === user.subsidiaryId) : null;
          return (
            <Card key={user.id} className="hover-lift card-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-zakayo-primary to-zakayo-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  {subsidiary && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subsidiary</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subsidiary.color }}
                        />
                        <span className="text-sm font-medium">{subsidiary.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add User Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
              <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                <option>Select Role</option>
                <option>Manager</option>
                <option>Staff</option>
              </select>
              <select className="w-full px-3 py-2 border border-input rounded-md bg-background">
                <option>Select Subsidiary</option>
                {subsidiaries.map(sub => (
                  <option key={sub.id}>{sub.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setShowAddModal(false)} className="flex-1 bg-zakayo-primary hover:bg-zakayo-primary/90">
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
