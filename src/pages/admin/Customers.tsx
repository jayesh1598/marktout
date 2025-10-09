import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdmin } from '../../contexts/AdminContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Search, Mail, Phone } from 'lucide-react';

export const Customers: React.FC = () => {
  const { customers } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const inactiveCustomers = customers.filter((c) => c.status === 'inactive').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-gray-900">Customers Management</h2>
          <p className="text-gray-600 mt-1">Manage and track customer information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-600 text-sm">Total Customers</div>
            <div className="text-gray-900 text-2xl mt-1">{totalCustomers}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-600 text-sm">Active</div>
            <div className="text-green-700 text-2xl mt-1">{activeCustomers}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-600 text-sm">Inactive</div>
            <div className="text-gray-700 text-2xl mt-1">{inactiveCustomers}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-gray-600 text-sm">Total Revenue</div>
            <div className="text-purple-700 text-2xl mt-1">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600">Customer ID</th>
                  <th className="text-left py-3 px-4 text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-600">Join Date</th>
                  <th className="text-left py-3 px-4 text-gray-600">Total Orders</th>
                  <th className="text-left py-3 px-4 text-gray-600">Total Spent</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{customer.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-red-500 rounded-full flex items-center justify-center text-white">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="text-gray-900">{customer.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{customer.joinDate}</td>
                    <td className="py-3 px-4 text-gray-900">{customer.totalOrders}</td>
                    <td className="py-3 px-4 text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Top Customers by Spend</h3>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.totalSpent - a.totalSpent)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-500">#{index + 1}</div>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-red-500 rounded-full flex items-center justify-center text-white text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-gray-900">{customer.name}</div>
                        <div className="text-gray-500 text-sm">{customer.totalOrders} orders</div>
                      </div>
                    </div>
                    <div className="text-gray-900">${customer.totalSpent.toFixed(2)}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Recent Customers</h3>
            <div className="space-y-3">
              {customers
                .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                .slice(0, 5)
                .map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-red-500 rounded-full flex items-center justify-center text-white text-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-gray-900">{customer.name}</div>
                        <div className="text-gray-500 text-sm">{customer.email}</div>
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm">{customer.joinDate}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
