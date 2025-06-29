
import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, Palette, Database, Users, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('general');

  const settingSections = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'users', name: 'User Preferences', icon: Users },
    { id: 'data', name: 'Data & Backup', icon: Database },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and configurations</p>
        </div>
        <Button className="bg-zakayo-primary hover:bg-zakayo-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {settingSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                      isActive 
                        ? 'bg-zakayo-primary text-white' 
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.name}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'general' && (
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic application settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Name</label>
                    <input 
                      type="text" 
                      defaultValue="Zakayo Holdings"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Business Address</label>
                    <textarea 
                      defaultValue="Mwanza, Tanzania"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="+255 123 456 789"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="info@zakayoholdings.com"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tax Registration Number</label>
                    <input 
                      type="text" 
                      defaultValue="TIN: 123-456-789"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Order Updates</h4>
                      <p className="text-sm text-muted-foreground">Get notified about order status changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Payment Alerts</h4>
                      <p className="text-sm text-muted-foreground">Notifications for payment confirmations</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Low Stock Alerts</h4>
                      <p className="text-sm text-muted-foreground">Alert when products are running low</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">WhatsApp Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Change Password</h4>
                    <div className="space-y-3">
                      <input 
                        type="password" 
                        placeholder="Current Password"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      />
                      <input 
                        type="password" 
                        placeholder="New Password"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      />
                      <input 
                        type="password" 
                        placeholder="Confirm New Password"
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      />
                    </div>
                    <Button className="mt-3 bg-zakayo-primary hover:bg-zakayo-primary/90">
                      Update Password
                    </Button>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Session Management</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Manage active sessions and devices</p>
                      </div>
                      <Button variant="outline">
                        View Sessions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Theme</h4>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleTheme}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          theme === 'light' 
                            ? 'border-zakayo-primary bg-zakayo-primary/10' 
                            : 'border-input hover:border-zakayo-primary/50'
                        }`}
                      >
                        <div className="w-16 h-12 bg-white rounded border mb-2" />
                        <p className="text-sm font-medium">Light</p>
                      </button>
                      <button
                        onClick={toggleTheme}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          theme === 'dark' 
                            ? 'border-zakayo-primary bg-zakayo-primary/10' 
                            : 'border-input hover:border-zakayo-primary/50'
                        }`}
                      >
                        <div className="w-16 h-12 bg-gray-800 rounded border mb-2" />
                        <p className="text-sm font-medium">Dark</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Language</h4>
                    <select className="w-full max-w-xs px-3 py-2 border border-input rounded-md bg-background">
                      <option>English</option>
                      <option>Swahili</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Date Format</h4>
                    <select className="w-full max-w-xs px-3 py-2 border border-input rounded-md bg-background">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Currency Display</h4>
                    <select className="w-full max-w-xs px-3 py-2 border border-input rounded-md bg-background">
                      <option>TSh (Tanzanian Shilling)</option>
                      <option>USD (US Dollar)</option>
                      <option>EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'users' && (
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Personal settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Profile Information</h4>
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Display Name</label>
                        <input 
                          type="text" 
                          defaultValue={currentUser?.name || ''}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <input 
                          type="email" 
                          defaultValue={currentUser?.email || ''}
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Dashboard Preferences</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show Quick Stats</p>
                          <p className="text-sm text-muted-foreground">Display key metrics on dashboard</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-refresh Data</p>
                          <p className="text-sm text-muted-foreground">Automatically update dashboard data</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'data' && (
            <Card className="hover-lift card-shadow">
              <CardHeader>
                <CardTitle>Data & Backup</CardTitle>
                <CardDescription>Manage your data and backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Data Export</h4>
                    <p className="text-sm text-muted-foreground mb-3">Export your data for backup or migration purposes</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="mr-2">
                        <Database className="h-4 w-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" className="mr-2">
                        <Database className="h-4 w-4 mr-2" />
                        Export Orders Only
                      </Button>
                      <Button variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        Export Customers Only
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Automatic Backup</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Automatic Backup</p>
                          <p className="text-sm text-muted-foreground">Automatically backup data daily</p>
                        </div>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Backup Frequency</label>
                        <select className="w-full max-w-xs px-3 py-2 border border-input rounded-md bg-background">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 text-destructive">Danger Zone</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                        Clear All Data
                      </Button>
                      <p className="text-sm text-muted-foreground">This action cannot be undone. All your data will be permanently deleted.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
