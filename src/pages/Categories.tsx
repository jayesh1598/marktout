import { useMemo, useState } from 'react';
import { categories, products } from '../data/products';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';

const ALL_CATEGORIES_LABEL = 'All Categories';

export function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES_LABEL);

  const categoryOptions = useMemo(
    () => [ALL_CATEGORIES_LABEL, ...categories.map((category) => category.title)],
    []
  );

  const displayedProducts = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES_LABEL) {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <main className="categories-page bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-12">
        <section className="categories-hero text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-gray-900">Shop by Category</h1>
          <p className="text-gray-600 mt-3">
            Discover curated collections tailored to your interests. Choose a category below to start exploring.
          </p>
        </section>

        <section className="categories-filter-panel bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h2 className="text-xl font-semibold text-purple-900">Browse Categories</h2>
            {selectedCategory !== ALL_CATEGORIES_LABEL && (
              <Button
                variant="outline"
                className="categories-reset-button border-purple-700 text-purple-700 hover:bg-purple-50"
                onClick={() => setSelectedCategory(ALL_CATEGORIES_LABEL)}
              >
                Clear Selection
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {categoryOptions.map((categoryName) => (
              <Button
                key={categoryName}
                variant={selectedCategory === categoryName ? 'default' : 'outline'}
                className={`category-filter-button rounded-full transition-colors ${
                  selectedCategory === categoryName
                    ? 'bg-purple-700 hover:bg-purple-800 text-white'
                    : 'border-purple-200 text-purple-700 hover:border-purple-700 hover:text-purple-800'
                }`}
                onClick={() => setSelectedCategory(categoryName)}
              >
                {categoryName}
              </Button>
            ))}
          </div>
        </section>

        <section className="categories-grid-section">
          <h2 className="sr-only">Category Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </section>

        <section className="categories-product-feed">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedCategory === ALL_CATEGORIES_LABEL ? 'All Products' : selectedCategory}
              </h2>
              <p className="text-gray-600 mt-1">
                Showing {displayedProducts.length} item{displayedProducts.length === 1 ? '' : 's'} curated for this category.
              </p>
            </div>
            <Button
              variant="ghost"
              className="categories-shop-button text-purple-700 hover:text-purple-800"
            >
              View Full Collection
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={`category-${product.id}`} {...product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
