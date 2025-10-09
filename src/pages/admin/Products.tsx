import React, { useMemo, useRef, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { products as initialProducts } from '../../data/products';
import type { Product as CatalogProduct } from '../../data/products';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Download,
  Package,
  BarChart2,
  Activity,
  Megaphone,
  CreditCard,
  Truck,
} from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner@2.0.3';

type OptionValue = {
  name: string;
  value: string;
};

type CsvRow = Record<string, string | undefined | null>;

type Product = CatalogProduct & {
  imageGallery?: string[];
  handle?: string;
  vendor?: string;
  tags?: string[];
  standardizedProductType?: string;
  customProductType?: string;
  bodyHtml?: string;
  sku?: string;
  barcode?: string;
  status?: string;
  inventoryQuantity?: number;
  inventoryPolicy?: string;
  inventoryTracker?: string;
  fulfillmentService?: string;
  requiresShipping?: boolean;
  taxable?: boolean;
  grams?: number;
  weightUnit?: string;
  seoTitle?: string;
  seoDescription?: string;
  googleProductCategory?: string;
  googleShoppingGender?: string;
  googleShoppingAgeGroup?: string;
  googleShoppingMpn?: string;
  googleShoppingAdWordsGrouping?: string;
  googleShoppingAdWordsLabels?: string[];
  googleShoppingCondition?: string;
  googleShoppingCustomProduct?: boolean;
  googleShoppingCustomLabels?: string[];
  giftCard?: boolean;
  published?: boolean;
  optionValues?: OptionValue[];
  costPerItem?: number;
  csvRows?: CsvRow[];
};

type IntegrationStatus = 'connected' | 'not_connected';

type IntegrationItem = {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  docsUrl?: string;
};

type ProductFormState = {
  title: string;
  price: string;
  originalPrice: string;
  category: string;
  description: string;
  rating: string;
  reviews: string;
  inStock: boolean;
  sku: string;
  barcode: string;
  vendor: string;
  inventoryQuantity: string;
  inventoryPolicy: 'continue' | 'deny';
  inventoryTracker: 'shopify' | 'custom';
  fulfillmentService: 'manual' | 'third-party';
  costPerItem: string;
  tags: string;
  weight: string;
  weightUnit: 'g' | 'kg' | 'lb';
};

type InventorySettings = {
  reorderPoint: string;
  safetyStock: string;
  restockLeadTime: string;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400';

const createDefaultFormState = (): ProductFormState => ({
  title: '',
  price: '',
  originalPrice: '',
  category: '',
  description: '',
  rating: '5',
  reviews: '0',
  inStock: true,
  sku: '',
  barcode: '',
  vendor: '',
  inventoryQuantity: '',
  inventoryPolicy: 'deny',
  inventoryTracker: 'shopify',
  fulfillmentService: 'manual',
  costPerItem: '',
  tags: '',
  weight: '',
  weightUnit: 'g',
});

const defaultInventorySettings: InventorySettings = {
  reorderPoint: '25',
  safetyStock: '50',
  restockLeadTime: '7',
};

const parseNumberValue = (value?: string | null): number | undefined => {
  const normalized = value?.toString().trim();
  if (!normalized) {
    return undefined;
  }
  const numeric = Number(normalized.replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(numeric) ? numeric : undefined;
};

const parseIntegerValue = (value?: string | null): number | undefined => {
  const numeric = parseNumberValue(value);
  if (numeric === undefined) {
    return undefined;
  }
  return Math.round(numeric);
};

const parseBooleanValue = (value?: string | null): boolean | undefined => {
  const normalized = value?.toString().trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (['true', 'yes', '1'].includes(normalized)) {
    return true;
  }
  if (['false', 'no', '0'].includes(normalized)) {
    return false;
  }
  return undefined;
};

const parseTagsValue = (value?: string | null): string[] =>
  value
    ? value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

const extractDescriptionText = (html?: string | null): string => {
  if (!html) {
    return '';
  }
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

const buildOptionValues = (row: CsvRow): OptionValue[] => {
  const optionKeys: Array<[string, string]> = [
    ['Option1 Name', 'Option1 Value'],
    ['Option2 Name', 'Option2 Value'],
    ['Option3 Name', 'Option3 Value'],
  ];

  return optionKeys
    .map(([nameKey, valueKey]) => {
      const name = row[nameKey]?.toString().trim();
      const value = row[valueKey]?.toString().trim();
      if (!name || !value) {
        return null;
      }
      return { name, value };
    })
    .filter((option): option is OptionValue => option !== null);
};

const collectGoogleLabels = (row: CsvRow): string[] => {
  const labelKeys = [
    'Google Shopping / Custom Label 0',
    'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2',
    'Google Shopping / Custom Label 3',
    'Google Shopping / Custom Label 4',
  ];

  return labelKeys
    .map((key) => row[key]?.toString().trim())
    .filter((label): label is string => !!label && label.length > 0);
};

const collectAdWordsLabels = (row: CsvRow): string[] =>
  parseTagsValue(row['Google Shopping / AdWords Labels']);

const collectImageGallery = (rows: CsvRow[]): string[] =>
  rows
    .map((row) => row['Image Src']?.toString().trim())
    .filter((src): src is string => !!src && src.length > 0);

const sortRowsByImagePosition = (rows: CsvRow[]): CsvRow[] =>
  [...rows].sort((a, b) => {
    const positionA = parseIntegerValue(a['Image Position']) ?? Number.MAX_SAFE_INTEGER;
    const positionB = parseIntegerValue(b['Image Position']) ?? Number.MAX_SAFE_INTEGER;
    return positionA - positionB;
  });

const generateHandleFromTitle = (title: string): string =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || `product-${Date.now()}`;

const convertWeightToGrams = (
  weightValue: string,
  unit: ProductFormState['weightUnit'],
): number | undefined => {
  const parsedValue = Number.parseFloat(weightValue);
  if (!Number.isFinite(parsedValue)) {
    return undefined;
  }
  switch (unit) {
    case 'kg':
      return parsedValue * 1000;
    case 'lb':
      return parsedValue * 453.592;
    default:
      return parsedValue;
  }
};

const createProductFromGroup = (
  handle: string,
  groupRows: CsvRow[],
): Omit<Product, 'id'> | null => {
  const sortedRows = sortRowsByImagePosition(groupRows);
  const primaryRow = sortedRows[0];

  if (!primaryRow) {
    return null;
  }

  const title = primaryRow['Title']?.toString().trim();

  if (!title) {
    return null;
  }

  const bodyHtml = primaryRow['Body (HTML)']?.toString();
  const descriptionText = extractDescriptionText(bodyHtml);

  const price = parseNumberValue(primaryRow['Variant Price']) ?? 0;
  const compareAt = parseNumberValue(primaryRow['Variant Compare At Price']) ?? 0;
  const inventoryQty = parseIntegerValue(primaryRow['Variant Inventory Qty']);
  const imageGallery = collectImageGallery(sortedRows);
  const tags = parseTagsValue(primaryRow['Tags']);
  const requiresShipping = parseBooleanValue(primaryRow['Variant Requires Shipping']);
  const taxable = parseBooleanValue(primaryRow['Variant Taxable']);
  const published = parseBooleanValue(primaryRow['Published']);
  const giftCard = parseBooleanValue(primaryRow['Gift Card']);
  const customProductFlag = parseBooleanValue(primaryRow['Google Shopping / Custom Product']);

  return {
    title,
    price,
    originalPrice: compareAt,
    image: imageGallery[0] ?? FALLBACK_IMAGE,
    imageGallery,
    category:
      primaryRow['Custom Product Type']?.toString().trim() ||
      primaryRow['Standardized Product Type']?.toString().trim() ||
      'Uncategorized',
    rating: 0,
    reviews: 0,
    description: descriptionText,
    bodyHtml,
    inStock: inventoryQty !== undefined ? inventoryQty > 0 : true,
    handle,
    vendor: primaryRow['Vendor']?.toString().trim(),
    tags,
    standardizedProductType: primaryRow['Standardized Product Type']?.toString().trim(),
    customProductType: primaryRow['Custom Product Type']?.toString().trim(),
    sku: primaryRow['Variant SKU']?.toString().trim(),
    barcode: primaryRow['Variant Barcode']?.toString().trim(),
    status: primaryRow['Status']?.toString().trim(),
    inventoryQuantity: inventoryQty,
    inventoryPolicy: primaryRow['Variant Inventory Policy']?.toString().trim(),
    inventoryTracker: primaryRow['Variant Inventory Tracker']?.toString().trim(),
    fulfillmentService: primaryRow['Variant Fulfillment Service']?.toString().trim(),
    requiresShipping,
    taxable,
    grams: parseNumberValue(primaryRow['Variant Grams']),
    weightUnit: primaryRow['Variant Weight Unit']?.toString().trim(),
    seoTitle: primaryRow['SEO Title']?.toString().trim(),
    seoDescription: primaryRow['SEO Description']?.toString().trim(),
    googleProductCategory: primaryRow['Google Shopping / Google Product Category']?.toString().trim(),
    googleShoppingGender: primaryRow['Google Shopping / Gender']?.toString().trim(),
    googleShoppingAgeGroup: primaryRow['Google Shopping / Age Group']?.toString().trim(),
    googleShoppingMpn: primaryRow['Google Shopping / MPN']?.toString().trim(),
    googleShoppingAdWordsGrouping: primaryRow['Google Shopping / AdWords Grouping']?.toString().trim(),
    googleShoppingAdWordsLabels: collectAdWordsLabels(primaryRow),
    googleShoppingCondition: primaryRow['Google Shopping / Condition']?.toString().trim(),
    googleShoppingCustomProduct: customProductFlag,
    googleShoppingCustomLabels: collectGoogleLabels(primaryRow),
    giftCard,
    published,
    optionValues: buildOptionValues(primaryRow),
    costPerItem: parseNumberValue(primaryRow['Cost per item']),
    csvRows: groupRows,
  };
};

const convertRowsToProducts = (rows: CsvRow[]): Omit<Product, 'id'>[] => {
  const grouped = new Map<string, CsvRow[]>();

  rows.forEach((row) => {
    const handle = row['Handle']?.toString().trim();
    if (!handle) {
      return;
    }
    const group = grouped.get(handle) ?? [];
    group.push(row);
    grouped.set(handle, group);
  });

  const products: Omit<Product, 'id'>[] = [];
  grouped.forEach((groupRows, handle) => {
    const product = createProductFromGroup(handle, groupRows);
    if (product) {
      products.push(product);
    }
  });

  return products;
};

const mergeImportedProducts = (
  existing: Product[],
  incoming: Omit<Product, 'id'>[],
): Product[] => {
  let maxId = existing.reduce((max, product) => Math.max(max, product.id), 0);
  const updated = [...existing];

  incoming.forEach((product) => {
    const handleKey = product.handle?.toLowerCase();
    const existingIndex = handleKey
      ? updated.findIndex((item) => item.handle?.toLowerCase() === handleKey)
      : -1;

    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...product,
      };
    } else {
      maxId += 1;
      updated.push({ ...product, id: maxId });
    }
  });

  return updated;
};

export const Products: React.FC = () => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts as Product[]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormState>(createDefaultFormState());
  const [inventorySettings, setInventorySettings] = useState<InventorySettings>(
    defaultInventorySettings,
  );
  const [marketingIntegrations, setMarketingIntegrations] = useState<IntegrationItem[]>([
    {
      id: 'google-marketing-platform',
      name: 'Google Marketing Platform',
      description: 'Sync product feeds for Shopping Ads and performance tracking.',
      status: 'not_connected',
      docsUrl: 'https://ads.google.com/',
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads & Instagram',
      description: 'Promote catalog items across Facebook and Instagram audiences.',
      status: 'not_connected',
      docsUrl: 'https://business.facebook.com/',
    },
    {
      id: 'whatsapp-campaigns',
      name: 'WhatsApp Campaigns',
      description: 'Send product announcements and restock alerts via WhatsApp.',
      status: 'not_connected',
      docsUrl: 'https://www.whatsapp.com/business/',
    },
  ]);
  const [paymentIntegrations, setPaymentIntegrations] = useState<IntegrationItem[]>([
    {
      id: 'phonepe',
      name: 'PhonePe',
      description: 'Enable UPI and wallet payments with PhonePe Checkout.',
      status: 'not_connected',
      docsUrl: 'https://www.phonepe.com/business-solutions/',
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Accept cards, UPI, BNPL, and subscriptions through Razorpay.',
      status: 'not_connected',
      docsUrl: 'https://razorpay.com/',
    },
    {
      id: 'payu',
      name: 'PayU Money',
      description: 'Collect domestic and international payments with PayU.',
      status: 'not_connected',
      docsUrl: 'https://india.payu.com/',
    },
    {
      id: 'gokwik',
      name: 'GoKwik',
      description: 'Improve COD conversion with GoKwik’s smart checkout.',
      status: 'not_connected',
      docsUrl: 'https://www.gokwik.co/',
    },
  ]);
  const [deliveryIntegrations, setDeliveryIntegrations] = useState<IntegrationItem[]>([
    {
      id: 'shiprocket',
      name: 'Shiprocket',
      description: 'Manage shipping labels and NDR workflows with Shiprocket.',
      status: 'not_connected',
      docsUrl: 'https://www.shiprocket.in/',
    },
    {
      id: 'nimbuzz',
      name: 'Nimbuzz Logistics',
      description: 'Automate courier allocation and live tracking with Nimbuzz.',
      status: 'not_connected',
      docsUrl: 'https://www.nimbuzz.com/',
    },
  ]);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Map<string, true>();
    productsList.forEach((product) => {
      if (product.category) {
        uniqueCategories.set(product.category, true);
      }
    });
    if (formData.category) {
      uniqueCategories.set(formData.category, true);
    }
    return Array.from(uniqueCategories.keys()).sort((a, b) => a.localeCompare(b));
  }, [productsList, formData.category]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = productsList.filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    const matchesTitle = product.title.toLowerCase().includes(normalizedQuery);
    const matchesCategory = product.category
      ?.toLowerCase()
      .includes(normalizedQuery);
    const matchesVendor = product.vendor
      ?.toLowerCase()
      .includes(normalizedQuery);
    const matchesTags = product.tags?.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery),
    );

    return matchesTitle || matchesCategory || matchesVendor || matchesTags;
  });

  const resetForm = () => {
    setFormData(createDefaultFormState());
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400';
    const inventoryQuantity = Number.parseInt(formData.inventoryQuantity, 10);
    const normalizedInventory = Number.isFinite(inventoryQuantity) ? inventoryQuantity : undefined;
    const grams = convertWeightToGrams(formData.weight, formData.weightUnit);
    const tags = parseTagsValue(formData.tags);
    const costPerItem = Number.parseFloat(formData.costPerItem);
    const newProduct: Product = {
      id: Math.max(...productsList.map((p) => p.id), 0) + 1,
      title: formData.title,
      handle: generateHandleFromTitle(formData.title),
      price: Number.parseFloat(formData.price) || 0,
      originalPrice: Number.parseFloat(formData.originalPrice) || 0,
      image: defaultImage,
      imageGallery: [defaultImage],
      category: formData.category,
      rating: Number.parseFloat(formData.rating) || 0,
      reviews: Number.parseInt(formData.reviews, 10) || 0,
      description: formData.description,
      bodyHtml: formData.description,
      inStock:
        formData.inStock && (normalizedInventory === undefined ? true : normalizedInventory > 0),
      inventoryQuantity: normalizedInventory,
      inventoryPolicy: formData.inventoryPolicy,
      inventoryTracker: formData.inventoryTracker,
      fulfillmentService: formData.fulfillmentService,
      costPerItem: Number.isFinite(costPerItem) ? costPerItem : undefined,
      sku: formData.sku.trim() || undefined,
      barcode: formData.barcode.trim() || undefined,
      vendor: formData.vendor.trim() || undefined,
      tags,
      grams,
      weightUnit: formData.weightUnit,
    };
    setProductsList([...productsList, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Product added successfully!');
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedProducts = productsList.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            title: formData.title,
            price: Number.parseFloat(formData.price) || 0,
            originalPrice: Number.parseFloat(formData.originalPrice) || 0,
            category: formData.category,
            description: formData.description,
            bodyHtml: formData.description,
            rating: Number.parseFloat(formData.rating) || 0,
            reviews: Number.parseInt(formData.reviews, 10) || 0,
            inStock: formData.inStock,
          }
        : product
    );
    setProductsList(updatedProducts);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    resetForm();
    toast.success('Product updated successfully!');
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProductsList(productsList.filter((product) => product.id !== id));
      toast.success('Product deleted successfully!');
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      description: product.bodyHtml ?? product.description ?? '',
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      inStock: product.inStock !== false,
    });
    setIsEditDialogOpen(true);
  };

  const exportProducts = () => {
    const csvContent = `Title,Price,Original Price,Category,Rating,Reviews,In Stock,Description\n${
      productsList
        .map(
          (p) =>
            `"${p.title.replace(/"/g, '""')}",${p.price},${p.originalPrice || ''},${p.category},${p.rating},${p.reviews},${
              p.inStock !== false ? 'Yes' : 'No'
            },"${(p.bodyHtml ?? p.description ?? '').replace(/"/g, '""')}"`,
        )
        .join('\n')
    }`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Products exported successfully!');
  };

  const handleImportProducts = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = event.target.files ?? [];

    if (!file) {
      return;
    }

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (result) => {
        if (result.errors.length > 0) {
          console.error(result.errors);
          toast.error('The CSV contains formatting errors. Please review and try again.');
          return;
        }

        const cleanedRows = (result.data as CsvRow[]).filter((row) =>
          Object.values(row).some((value) => value && value.toString().trim().length > 0),
        );

        if (cleanedRows.length === 0) {
          toast.error('No product rows were found in the CSV file.');
          return;
        }

        const importedProducts = convertRowsToProducts(cleanedRows);

        if (importedProducts.length === 0) {
          toast.error('No valid products could be created from the CSV file.');
          return;
        }

        setProductsList((previousProducts) =>
          mergeImportedProducts(previousProducts, importedProducts),
        );
        toast.success(
          `${importedProducts.length} product${importedProducts.length > 1 ? 's' : ''} imported successfully.`,
        );
      },
      error: (error) => {
        console.error(error);
        toast.error('Unable to read the CSV file. Please try again.');
      },
    });

    event.target.value = '';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Products Management</h2>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" onClick={handleImportProducts}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={exportProducts}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to your catalog.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Name</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviews">Number of Reviews</Label>
                    <Input
                      id="reviews"
                      type="number"
                      value={formData.reviews}
                      onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Add Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 text-gray-600">Rating</th>
                  <th className="text-left py-3 px-4 text-gray-600">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-900">{product.title}</td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-gray-900">
                      ${product.price.toFixed(2)}
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through ml-2 text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      ⭐ {product.rating} ({product.reviews})
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${
                          product.inStock !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Product Name</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-originalPrice">Original Price (Optional)</Label>
                  <Input
                    id="edit-originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-rating">Rating</Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-reviews">Number of Reviews</Label>
                  <Input
                    id="edit-reviews"
                    type="number"
                    value={formData.reviews}
                    onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-inStock">In Stock</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Update Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
