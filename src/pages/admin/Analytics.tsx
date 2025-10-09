import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdmin } from '../../contexts/AdminContext';
import { products } from '../../data/products';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { TrendingUp, DollarSign, ShoppingCart, Users, Calendar as CalendarIcon, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simple date formatter
const format = (date: Date, formatStr: string) => {
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  if (formatStr === 'MMM dd') return `${month} ${day}`;
  if (formatStr === 'yyyy-MM-dd') return `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${day}`;
  return date.toLocaleDateString();
};

export const Analytics: React.FC = () => {
  const { orders, customers } = useAdmin();
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [timeFilter, setTimeFilter] = useState('30days');

  // Generate daily revenue data for the last 30 days
  const generateDailyRevenue = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: format(date, 'MMM dd'),
        revenue: Math.floor(Math.random() * 2000) + 1000,
        orders: Math.floor(Math.random() * 30) + 10,
      });
    }
    return data;
  };

  const dailyData = generateDailyRevenue();

  // Category performance
  const categoryData = [
    { category: "Women's Fashion", revenue: 45200, orders: 234 },
    { category: 'Beauty & Care', revenue: 38900, orders: 189 },
    { category: 'Electronics', revenue: 52100, orders: 156 },
    { category: 'Home & Living', revenue: 29800, orders: 198 },
    { category: "Men's Fashion", revenue: 41500, orders: 212 },
  ];

  // Hourly orders pattern
  const hourlyData = [
    { hour: '12 AM', orders: 5 },
    { hour: '3 AM', orders: 2 },
    { hour: '6 AM', orders: 8 },
    { hour: '9 AM', orders: 25 },
    { hour: '12 PM', orders: 45 },
    { hour: '3 PM', orders: 38 },
    { hour: '6 PM', orders: 52 },
    { hour: '9 PM', orders: 35 },
  ];

  // Customer acquisition
  const acquisitionData = [
    { month: 'Jan', new: 120, returning: 340 },
    { month: 'Feb', new: 145, returning: 380 },
    { month: 'Mar', new: 168, returning: 420 },
    { month: 'Apr', new: 190, returning: 460 },
    { month: 'May', new: 210, returning: 520 },
    { month: 'Jun', new: 235, returning: 580 },
  ];

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalRevenue / orders.length;
  const conversionRate = ((orders.length / customers.length) * 100).toFixed(1);

  const exportReport = () => {
    const csvContent = `Category,Revenue,Orders\n${categoryData.map(c => `${c.category},${c.revenue},${c.orders}`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Advanced Analytics</h2>
            <p className="text-gray-600 mt-1">Detailed insights and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Custom Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                />
              </PopoverContent>
            </Popover>
            <Button onClick={exportReport} className="bg-purple-600 hover:bg-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-gray-900 text-2xl mb-1">${totalRevenue.toFixed(2)}</div>
            <div className="text-green-600 text-sm">+12.5% vs last period</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Avg Order Value</span>
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-gray-900 text-2xl mb-1">${avgOrderValue.toFixed(2)}</div>
            <div className="text-blue-600 text-sm">+8.3% vs last period</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Conversion Rate</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-gray-900 text-2xl mb-1">{conversionRate}%</div>
            <div className="text-purple-600 text-sm">+3.2% vs last period</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active Customers</span>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-gray-900 text-2xl mb-1">{customers.filter(c => c.status === 'active').length}</div>
            <div className="text-orange-600 text-sm">+15.7% vs last period</div>
          </div>
        </div>

        {/* Revenue & Orders Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Revenue & Orders Trend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#9333ea" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" name="Orders" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance & Hourly Pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="category" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="revenue" fill="#9333ea" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Orders Pattern */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Order Pattern by Hour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="hour" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#ef4444" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Customer Acquisition</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={acquisitionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="new" fill="#10b981" name="New Customers" />
              <Bar dataKey="returning" fill="#6366f1" name="Returning Customers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Top Performing Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-gray-600">Sales</th>
                  <th className="text-left py-3 px-4 text-gray-600">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-600">Growth</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product, index) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.title} className="w-10 h-10 object-cover rounded" />
                        <div className="text-gray-900">{product.title}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-gray-900">{Math.floor(Math.random() * 200) + 50} units</td>
                    <td className="py-3 px-4 text-gray-900">${(product.price * (Math.floor(Math.random() * 200) + 50)).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600">+{Math.floor(Math.random() * 30) + 5}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
