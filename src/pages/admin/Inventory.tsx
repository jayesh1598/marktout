import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdmin } from '../../contexts/AdminContext';
import { products } from '../../data/products';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Search, AlertTriangle, Package, Download, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InventoryItem {
  id: number;
  title: string;
  sku: string;
  stock: number;
  reorderLevel: number;
  supplier: string;
  lastRestocked: string;
  image: string;
}

export const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState('');

  // Generate inventory data from products
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(
    products.map((product, index) => ({
      id: product.id,
      title: product.title,
      sku: `SKU-${String(product.id).padStart(5, '0')}`,
      stock: Math.floor(Math.random() * 200) + 10,
      reorderLevel: 20,
      supplier: ['Global Suppliers Inc.', 'Fashion Direct', 'Beauty Warehouse', 'Home Goods Co.'][index % 4],
      lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      image: product.image,
    }))
  );

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockItems = inventoryItems.filter(item => item.stock <= item.reorderLevel);
  const outOfStockItems = inventoryItems.filter(item => item.stock === 0);
  const totalValue = inventoryItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.stock : 0);
  }, 0);

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const quantity = parseInt(restockQuantity);
    if (quantity > 0) {
      setInventoryItems(inventoryItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, stock: item.stock + quantity, lastRestocked: new Date().toISOString().split('T')[0] }
          : item
      ));
      toast.success(`Successfully restocked ${selectedItem.title} with ${quantity} units`);
      setIsRestockDialogOpen(false);
      setRestockQuantity('');
      setSelectedItem(null);
    }
  };

  const openRestockDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsRestockDialogOpen(true);
  };

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (stock <= reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const exportInventory = () => {
    const csvContent = `SKU,Product,Stock,Reorder Level,Supplier,Last Restocked\n${
      inventoryItems.map(item =>
        `${item.sku},"${item.title}",${item.stock},${item.reorderLevel},${item.supplier},${item.lastRestocked}`
      ).join('\n')
    }`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Inventory exported successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Inventory Management</h2>
            <p className="text-gray-600 mt-1">Track and manage your stock levels</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportInventory}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Products</span>
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-gray-900 text-2xl">{inventoryItems.length}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Low Stock Items</span>
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-gray-900 text-2xl">{lowStockItems.length}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Out of Stock</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-gray-900 text-2xl">{outOfStockItems.length}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Value</span>
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-gray-900 text-2xl">${totalValue.toFixed(2)}</div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="text-yellow-900">Low Stock Alert</div>
                <p className="text-yellow-700 text-sm mt-1">
                  {lowStockItems.length} product{lowStockItems.length !== 1 ? 's' : ''} need restocking
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-gray-600">SKU</th>
                  <th className="text-left py-3 px-4 text-gray-600">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-600">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Supplier</th>
                  <th className="text-left py-3 px-4 text-gray-600">Last Restocked</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item.stock, item.reorderLevel);
                  return (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-900">{item.title}</td>
                      <td className="py-3 px-4 text-gray-600">{item.sku}</td>
                      <td className="py-3 px-4 text-gray-900">{item.stock} units</td>
                      <td className="py-3 px-4 text-gray-600">{item.reorderLevel}</td>
                      <td className="py-3 px-4">
                        <Badge className={status.color}>{status.label}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.supplier}</td>
                      <td className="py-3 px-4 text-gray-600">{item.lastRestocked}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRestockDialog(item)}
                        >
                          Restock
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Restock Dialog */}
        <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restock Product</DialogTitle>
              <DialogDescription>
                Add stock for {selectedItem?.title}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity to Add</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              {selectedItem && (
                <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="text-gray-900">{selectedItem.stock} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supplier:</span>
                    <span className="text-gray-900">{selectedItem.supplier}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Restock
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
