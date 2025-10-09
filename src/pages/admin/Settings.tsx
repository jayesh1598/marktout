import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Bell, Store, CreditCard, Shield, Palette, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    orderEmails: true,
    inventoryAlerts: true,
    customerMessages: false,
    marketing: true,
    weeklyReports: true,
  });

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'MarkTout',
    storeEmail: 'support@marktout.com',
    storePhone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'America/New_York',
  });

  const [paymentMethods, setPaymentMethods] = useState({
    stripe: true,
    paypal: true,
    cod: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'purple',
    compactMode: false,
    showSidebarLabels: true,
  });

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully!');
  };

  const handleSaveStore = () => {
    toast.success('Store settings saved successfully!');
  };

  const handleSavePayment = () => {
    toast.success('Payment settings saved successfully!');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully!');
  };

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Manage your store preferences and configuration</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="store">
              <Store className="w-4 h-4 mr-2" />
              Store
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-1">Email Notifications</h3>
                <p className="text-gray-600 text-sm">Configure when you want to receive email notifications</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Order notifications</div>
                    <p className="text-gray-600 text-sm">Receive emails for new orders</p>
                  </div>
                  <Switch
                    checked={notifications.orderEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderEmails: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Inventory alerts</div>
                    <p className="text-gray-600 text-sm">Get notified about low stock items</p>
                  </div>
                  <Switch
                    checked={notifications.inventoryAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, inventoryAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Customer messages</div>
                    <p className="text-gray-600 text-sm">Receive notifications for customer inquiries</p>
                  </div>
                  <Switch
                    checked={notifications.customerMessages}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, customerMessages: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Marketing updates</div>
                    <p className="text-gray-600 text-sm">Stay updated with marketing campaigns</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Weekly reports</div>
                    <p className="text-gray-600 text-sm">Receive weekly performance reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-1">Store Information</h3>
                <p className="text-gray-600 text-sm">Update your store details and preferences</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={storeSettings.currency} onValueChange={(value) => setStoreSettings({ ...storeSettings, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={storeSettings.timezone} onValueChange={(value) => setStoreSettings({ ...storeSettings, timezone: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveStore} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-1">Payment Methods</h3>
                <p className="text-gray-600 text-sm">Enable or disable payment gateways</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-gray-900">Stripe</div>
                    <p className="text-gray-600 text-sm">Accept credit cards and digital wallets</p>
                  </div>
                  <Switch
                    checked={paymentMethods.stripe}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, stripe: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-gray-900">PayPal</div>
                    <p className="text-gray-600 text-sm">Accept PayPal payments</p>
                  </div>
                  <Switch
                    checked={paymentMethods.paypal}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, paypal: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="text-gray-900">Cash on Delivery</div>
                    <p className="text-gray-600 text-sm">Allow customers to pay on delivery</p>
                  </div>
                  <Switch
                    checked={paymentMethods.cod}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, cod: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePayment} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-1">Security Settings</h3>
                <p className="text-gray-600 text-sm">Manage your account security</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>

                <div className="pt-4 space-y-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900">Two-factor authentication</div>
                      <p className="text-gray-600 text-sm">Add an extra layer of security</p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900">Login notifications</div>
                      <p className="text-gray-600 text-sm">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={security.loginNotifications}
                      onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-1">Appearance Settings</h3>
                <p className="text-gray-600 text-sm">Customize the look and feel of your admin panel</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={appearance.theme} onValueChange={(value) => setAppearance({ ...appearance, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple & Red (Default)</SelectItem>
                      <SelectItem value="blue">Blue & Cyan</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Compact mode</div>
                    <p className="text-gray-600 text-sm">Reduce spacing in the interface</p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => setAppearance({ ...appearance, compactMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-900">Show sidebar labels</div>
                    <p className="text-gray-600 text-sm">Display text labels in the sidebar</p>
                  </div>
                  <Switch
                    checked={appearance.showSidebarLabels}
                    onCheckedChange={(checked) => setAppearance({ ...appearance, showSidebarLabels: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAppearance} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
