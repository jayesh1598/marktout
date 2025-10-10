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
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Download,
  Tag,
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

type ProductFormState = {
  title: string;
  handle: string;
  price: string;
  originalPrice: string;
  category: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
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
  mainImage: string;
  gallery: string;
  requiresShipping: boolean;
  taxable: boolean;
  weight: string;
  weightUnit: 'g' | 'kg' | 'lb';
  seoTitle: string;
  seoDescription: string;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const createDefaultFormState = (): ProductFormState => ({
  title: '',
  handle: '',
  price: '',
  originalPrice: '',
  category: '',
  description: '',
  status: 'active',
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
  mainImage: '',
  gallery: '',
  requiresShipping: true,
  taxable: true,
  weight: '',
  weightUnit: 'g',
  seoTitle: '',
  seoDescription: '',
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

const parseGalleryInput = (value: string): string[] =>
  value
    .split(/\r?\n|,/) // split by newline or comma
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

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

const formatWeightForForm = (grams?: number, unit: ProductFormState['weightUnit'] = 'g'): string => {
  if (grams === undefined) {
    return '';
  }
  switch (unit) {
    case 'kg':
      return (grams / 1000).toString();
    case 'lb':
      return (grams / 453.592).toFixed(2);
    default:
      return grams.toString();
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

const buildProductDraft = (
  form: ProductFormState,
  fallbackImage: string,
  base?: Product,
): Omit<Product, 'id'> => {
  const sanitizedHandle = form.handle.trim()
    ? generateHandleFromTitle(form.handle)
    : base?.handle ?? generateHandleFromTitle(form.title);

  const mainImageCandidate = form.mainImage.trim() || base?.image || fallbackImage;
  const galleryInput = parseGalleryInput(form.gallery);
  const baseGallery = base?.imageGallery ?? [];
  const combinedGallery = Array.from(
    new Set(
      [mainImageCandidate, ...galleryInput, ...baseGallery].filter(
        (url): url is string => !!url && url.length > 0,
      ),
    ),
  );

  const normalizedInventory = parseIntegerValue(form.inventoryQuantity);
  const grams = convertWeightToGrams(form.weight, form.weightUnit);
  const costPerItem = Number.parseFloat(form.costPerItem);
  const tags = parseTagsValue(form.tags);
  const seoTitle = form.seoTitle.trim() || form.title;
  const seoDescription =
    form.seoDescription.trim() || extractDescriptionText(form.description);
  const availableForSale =
    form.inStock && (normalizedInventory === undefined ? true : normalizedInventory > 0);

  const { id: _ignore, ...baseWithoutId } = base ?? ({} as Product);

  return {
    ...baseWithoutId,
    title: form.title,
    handle: sanitizedHandle,
    price: Number.parseFloat(form.price) || 0,
    originalPrice: Number.parseFloat(form.originalPrice) || 0,
    image: mainImageCandidate || fallbackImage,
    imageGallery: combinedGallery.length > 0 ? combinedGallery : [fallbackImage],
    category: form.category,
    rating: Number.parseFloat(form.rating) || 0,
    reviews: Number.parseInt(form.reviews, 10) || 0,
    description: form.description,
    bodyHtml: form.description,
    inStock: availableForSale,
    sku: form.sku.trim() || undefined,
    barcode: form.barcode.trim() || undefined,
    vendor: form.vendor.trim() || undefined,
    inventoryQuantity: normalizedInventory,
    inventoryPolicy: form.inventoryPolicy,
    inventoryTracker: form.inventoryTracker,
    fulfillmentService: form.fulfillmentService,
    costPerItem: Number.isFinite(costPerItem) ? costPerItem : undefined,
    tags,
    grams,
    weightUnit: form.weightUnit,
    requiresShipping: form.requiresShipping,
    taxable: form.taxable,
    status: form.status,
    seoTitle,
    seoDescription,
    published: form.status === 'active',
  };
};

const getStatusBadgeStyles = (status?: string) => {
  switch (status) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'archived':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    default:
      return 'bg-green-100 text-green-700 border-green-200';
  }
};

export const Products: React.FC = () => {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts as Product[]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormState>(createDefaultFormState());

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
    const matchesCategory = product.category?.toLowerCase().includes(normalizedQuery);
    const matchesVendor = product.vendor?.toLowerCase().includes(normalizedQuery);
    const matchesTags = product.tags?.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery),
    );
    const matchesHandle = product.handle?.toLowerCase().includes(normalizedQuery);

    return matchesTitle || matchesCategory || matchesVendor || matchesTags || matchesHandle;
  });

  const resetForm = () => {
    setFormData(createDefaultFormState());
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProductDraft = buildProductDraft(formData, FALLBACK_IMAGE);
    const newProduct: Product = {
      ...newProductDraft,
      id: Math.max(...productsList.map((p) => p.id), 0) + 1,
    };
    setProductsList([...productsList, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Product added successfully!');
  };

  const handleEditProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updatedDraft = buildProductDraft(formData, FALLBACK_IMAGE, editingProduct);

    const updatedProducts = productsList.map((product) =>
      product.id === editingProduct.id
        ? {
            ...product,
            ...updatedDraft,
          }
        : product,
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
    const derivedWeightUnit: ProductFormState['weightUnit'] =
      product.weightUnit === 'kg' || product.weightUnit === 'lb' ? product.weightUnit : 'g';

    setEditingProduct(product);
    setFormData({
      title: product.title,
      handle: product.handle ?? generateHandleFromTitle(product.title),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      description: product.bodyHtml ?? product.description ?? '',
      status: (product.status as ProductFormState['status']) ?? (product.published ? 'active' : 'draft'),
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      inStock: product.inStock !== false,
      sku: product.sku ?? '',
      barcode: product.barcode ?? '',
      vendor: product.vendor ?? '',
      inventoryQuantity: product.inventoryQuantity?.toString() ?? '',
      inventoryPolicy: (product.inventoryPolicy as 'continue' | 'deny') ?? 'deny',
      inventoryTracker: (product.inventoryTracker as 'shopify' | 'custom') ?? 'shopify',
      fulfillmentService: (product.fulfillmentService as 'manual' | 'third-party') ?? 'manual',
      costPerItem: product.costPerItem?.toString() ?? '',
      tags: product.tags?.join(', ') ?? '',
      mainImage: product.image ?? '',
      gallery: (product.imageGallery ?? [])
        .filter((url) => !!url && url !== product.image)
        .join('\n'),
      requiresShipping: product.requiresShipping !== false,
      taxable: product.taxable !== false,
      weight: formatWeightForForm(product.grams, derivedWeightUnit),
      weightUnit: derivedWeightUnit,
      seoTitle: product.seoTitle ?? '',
      seoDescription: product.seoDescription ?? '',
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

  const seoPreviewTitle = formData.seoTitle.trim() || formData.title || 'New product';
  const seoPreviewDescription = (
    formData.seoDescription.trim() || extractDescriptionText(formData.description)
  ).slice(0, 160);
  const seoPreviewHandle = formData.handle.trim() || generateHandleFromTitle(formData.title || 'new-product');

  const ProductForm: React.FC<{
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
    onCancel: () => void;
  }> = ({ onSubmit, submitLabel, onCancel }) => (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Product information</h4>
            <p className="text-gray-600 text-sm">
              Define the basic details that describe how the product appears in your storefront.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Product Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">Handle (URL)</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                onBlur={() =>
                  setFormData((prev) => ({
                    ...prev,
                    handle: prev.handle
                      ? generateHandleFromTitle(prev.handle)
                      : generateHandleFromTitle(prev.title),
                  }))
                }
                placeholder="custom-product-slug"
              />
              <p className="text-xs text-gray-500">
                This will appear in your product URL as /products/{formData.handle || generateHandleFromTitle(formData.title || 'new-product')}.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as ProductFormState['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
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
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                placeholder="e.g. festive, limited edition"
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={6}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Media</h4>
            <p className="text-gray-600 text-sm">
              Control which images appear on the product page. Provide direct URLs or CDN links.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainImage">Primary Image URL</Label>
            <Input
              id="mainImage"
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gallery">Gallery Images</Label>
            <Textarea
              id="gallery"
              value={formData.gallery}
              onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
              placeholder="Enter one image URL per line"
              rows={4}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Pricing</h4>
            <p className="text-gray-600 text-sm">
              Set the selling price, compare-at price, and cost per item for margin tracking.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Compare-at Price</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="costPerItem">Cost per Item</Label>
              <Input
                id="costPerItem"
                type="number"
                step="0.01"
                value={formData.costPerItem}
                onChange={(e) => setFormData({ ...formData, costPerItem: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Charge taxes</Label>
              <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
                <Switch
                  id="taxable"
                  checked={formData.taxable}
                  onCheckedChange={(checked) => setFormData({ ...formData, taxable: checked })}
                />
                <Label htmlFor="taxable" className="text-sm text-gray-700 cursor-pointer">
                  Collect taxes on this product
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Inventory</h4>
            <p className="text-gray-600 text-sm">
              Track unique identifiers and stock levels across your sales channels.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventoryQuantity">Available quantity</Label>
              <Input
                id="inventoryQuantity"
                type="number"
                min="0"
                value={formData.inventoryQuantity}
                onChange={(e) => setFormData({ ...formData, inventoryQuantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventoryPolicy">Allow purchase when out of stock</Label>
              <Select
                value={formData.inventoryPolicy}
                onValueChange={(value) =>
                  setFormData({ ...formData, inventoryPolicy: value as ProductFormState['inventoryPolicy'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deny">Stop selling when out of stock</SelectItem>
                  <SelectItem value="continue">Continue selling when out of stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inventoryTracker">Inventory tracked by</Label>
              <Select
                value={formData.inventoryTracker}
                onValueChange={(value) =>
                  setFormData({ ...formData, inventoryTracker: value as ProductFormState['inventoryTracker'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopify">MarkTout Inventory</SelectItem>
                  <SelectItem value="custom">External system</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fulfillmentService">Fulfilment service</Label>
              <Select
                value={formData.fulfillmentService}
                onValueChange={(value) =>
                  setFormData({ ...formData, fulfillmentService: value as ProductFormState['fulfillmentService'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="third-party">Third-party</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
            />
            <Label htmlFor="inStock" className="text-sm text-gray-700 cursor-pointer">
              Product is available for purchase
            </Label>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Shipping</h4>
            <p className="text-gray-600 text-sm">
              Set physical attributes required for shipping labels and rates.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-gray-200 p-3">
            <Switch
              id="requiresShipping"
              checked={formData.requiresShipping}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, requiresShipping: checked })
              }
            />
            <Label htmlFor="requiresShipping" className="text-sm text-gray-700 cursor-pointer">
              This product requires shipping
            </Label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={!formData.requiresShipping}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightUnit">Weight unit</Label>
              <Select
                value={formData.weightUnit}
                onValueChange={(value) =>
                  setFormData({ ...formData, weightUnit: value as ProductFormState['weightUnit'] })
                }
                disabled={!formData.requiresShipping}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="g">Grams (g)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Search engine listing</h4>
            <p className="text-gray-600 text-sm">
              Customize how this product appears on search engines like Google and Bing.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              maxLength={70}
            />
            <p className="text-xs text-gray-500">{70 - formData.seoTitle.length} characters remaining.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">Meta description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              rows={4}
              maxLength={320}
            />
            <p className="text-xs text-gray-500">{320 - formData.seoDescription.length} characters remaining.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
            <div className="text-xs text-gray-500">https://marktout.com/products/{seoPreviewHandle}</div>
            <div className="text-lg text-blue-700">{seoPreviewTitle}</div>
            <div className="text-sm text-gray-700">{seoPreviewDescription}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div>
            <h4 className="text-gray-900">Social proof</h4>
            <p className="text-gray-600 text-sm">Optional review data used to display ratings on product cards.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="reviews">Number of Reviews</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Tag className="w-3 h-3" />
          SEO preview updates live as you edit the form.
        </div>
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
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
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  resetForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your catalog.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm
                  onSubmit={handleAddProduct}
                  submitLabel="Add Product"
                  onCancel={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

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

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600">Pricing</th>
                  <th className="text-left py-3 px-4 text-gray-600">Inventory</th>
                  <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const inventoryDisplay = product.inventoryQuantity ?? '∞';
                  return (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        <div className="font-medium">{product.title}</div>
                        {product.handle && (
                          <div className="text-xs text-gray-500">/{product.handle}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{product.category}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadgeStyles(product.status)}>
                          {product.status ? product.status.charAt(0).toUpperCase() + product.status.slice(1) : 'Active'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        <div>{currencyFormatter.format(product.price)}</div>
                        {product.originalPrice ? (
                          <div className="text-xs text-gray-500 line-through">
                            {currencyFormatter.format(product.originalPrice)}
                          </div>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        <div className="text-sm text-gray-900">{inventoryDisplay} units</div>
                        <div
                          className={`text-xs ${
                            product.inStock !== false ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.inStock !== false ? 'Available' : 'Sold out'}
                        </div>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingProduct(null);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details below.
              </DialogDescription>
            </DialogHeader>
            <ProductForm
              onSubmit={handleEditProduct}
              submitLabel="Update Product"
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingProduct(null);
                resetForm();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};
