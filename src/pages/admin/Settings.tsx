import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Bell, Store, CreditCard, Shield, Palette, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type PaymentGatewayId = 'razorpay' | 'phonepe' | 'cashfree' | 'stripe' | 'paypal' | 'cod';

type PaymentGateway = {
  id: PaymentGatewayId;
  name: string;
  description: string;
  features: string[];
  settlement: string;
  docsUrl: string;
  recommended?: boolean;
};

const paymentGateways: PaymentGateway[] = [
  {
    id: 'razorpay',
    name: 'Razorpay UPI & Cards',
    description:
      'Unified Indian checkout experience with support for UPI, cards, net banking, BNPL, and EMI plans.',
    features: ['UPI', 'Cards', 'Net Banking'],
    settlement: 'T+1 settlement cycle',
    docsUrl: 'https://razorpay.com/docs/payments/payment-gateway/quick-start/',
    recommended: true,
  },
  {
    id: 'phonepe',
    name: 'PhonePe Payment Gateway',
    description:
      'Accept payments through PhonePe wallet, UPI intent flows, and auto-reconciled settlements for marketplaces.',
    features: ['PhonePe Wallet', 'UPI Intent', 'Auto Reconciliation'],
    settlement: 'T+1 settlement cycle',
    docsUrl: 'https://www.phonepe.com/business-solutions/payment-gateway/',
  },
  {
    id: 'cashfree',
    name: 'Cashfree Payments',
    description:
      'Collect domestic and international payments with routing, payouts, and instant settlement capabilities.',
    features: ['UPI', 'Cards', 'Pay Later'],
    settlement: 'Instant settlement (Optional add-on)',
    docsUrl: 'https://docs.cashfree.com/docs/payment-gateway/overview',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description:
      'Global card processing with powerful APIs, subscription billing, and multi-currency support.',
    features: ['Cards', 'Apple Pay', 'Subscriptions'],
    settlement: 'T+2 settlement cycle',
    docsUrl: 'https://stripe.com/docs/payments',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description:
      'Offer PayPal wallet and PayPal Credit to international shoppers while protecting high-risk transactions.',
    features: ['PayPal Wallet', 'Buyer Protection'],
    settlement: 'Instant transfer to PayPal balance',
    docsUrl: 'https://www.paypal.com/businessmanage/solutions/checkout',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description:
      'Allow customers to pay with cash or card on delivery with courier reconciliation workflows.',
    features: ['Manual Reconciliation', 'COD Verification'],
    settlement: 'On delivery fulfilment',
    docsUrl: 'https://help.shopify.com/en/manual/payments/manual-payments',
  },
];

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
    storePhone: '+91 98765 43210',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [paymentMethods, setPaymentMethods] = useState<Record<PaymentGatewayId, boolean>>({
    razorpay: true,
    phonepe: true,
    cashfree: false,
    stripe: false,
    paypal: false,
    cod: true,
  });

  const [defaultPaymentGateway, setDefaultPaymentGateway] = useState<PaymentGatewayId>('razorpay');

  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'purple',
    compactMode: false,
    showSidebarLabels: true,
  });

  const handleGatewayToggle = (gatewayId: PaymentGatewayId, enabled: boolean) => {
    if (!enabled && defaultPaymentGateway === gatewayId) {
      toast.error('Select a different default gateway before disabling this one.');
      return;
    }
    setPaymentMethods((previous) => ({ ...previous, [gatewayId]: enabled }));
  };

  const handleSelectDefaultGateway = (gatewayId: PaymentGatewayId) => {
    if (!paymentMethods[gatewayId]) {
      setPaymentMethods((previous) => ({ ...previous, [gatewayId]: true }));
      toast.info('Enabled the payment gateway so it can be set as default.');
    }
    setDefaultPaymentGateway(gatewayId);
  };

  const handleSaveNotifications = () => {
    toast.success('Notification settings saved successfully!');
  };

  const handleSaveStore = () => {
    toast.success('Store settings saved successfully!');
  };

  const handleSavePayment = () => {
    if (!paymentMethods[defaultPaymentGateway]) {
      toast.error('Enable the default payment gateway before saving.');
      return;
    }
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={storeSettings.currency}
                      onValueChange={(value) => setStoreSettings({ ...storeSettings, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={storeSettings.timezone}
                      onValueChange={(value) => setStoreSettings({ ...storeSettings, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India Standard Time</SelectItem>
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

          <TabsContent value="payment">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-900">Payment Methods</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="size-3" />
                    INR default
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm">
                  Choose the gateways you want to offer and assign a default provider for INR payments.
                </p>
              </div>

              <RadioGroup
                value={defaultPaymentGateway}
                onValueChange={(value) => handleSelectDefaultGateway(value as PaymentGatewayId)}
                className="space-y-4"
              >
                {paymentGateways.map((gateway) => {
                  const enabled = paymentMethods[gateway.id];
                  return (
                    <div
                      key={gateway.id}
                      className={`rounded-lg border ${
                        enabled ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'
                      } p-4 transition-shadow hover:shadow-sm`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex flex-1 items-start gap-3">
                          <RadioGroupItem
                            value={gateway.id}
                            id={`default-${gateway.id}`}
                            className="mt-1"
                          />
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={`default-${gateway.id}`}
                                className="cursor-pointer text-gray-900"
                              >
                                {gateway.name}
                              </label>
                              {gateway.recommended && (
                                <Badge variant="secondary" className="border-purple-200 bg-purple-50 text-purple-700">
                                  Recommended
                                </Badge>
                              )}
                              {defaultPaymentGateway === gateway.id && (
                                <Badge className="border-green-200 bg-green-100 text-green-700">
                                  <CheckCircle2 className="size-3" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{gateway.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {gateway.features.map((feature) => (
                                <Badge
                                  key={`${gateway.id}-${feature}`}
                                  variant="secondary"
                                  className="border-purple-200 bg-purple-50 text-purple-700"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span>Settlement: {gateway.settlement}</span>
                              <a
                                href={gateway.docsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 hover:text-purple-700"
                              >
                                View docs
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-3 sm:items-end">
                          <Switch
                            id={`toggle-${gateway.id}`}
                            checked={enabled}
                            onCheckedChange={(checked) => handleGatewayToggle(gateway.id, checked)}
                            aria-label={`Enable ${gateway.name}`}
                          />
                          <span className="text-xs text-gray-500">Enable gateway</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>

              <div className="flex justify-end">
                <Button onClick={handleSavePayment} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

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

          <TabsContent value="appearance">
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 mb-1">Appearance Settings</h3>
                <p className="text-gray-600 text-sm">Customize the look and feel of your admin panel</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={appearance.theme}
                    onValueChange={(value) => setAppearance({ ...appearance, theme: value })}
                  >
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
