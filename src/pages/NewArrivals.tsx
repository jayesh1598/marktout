import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Filter, Leaf } from 'lucide-react';
import { products, categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';

const ALL_NEW_LABEL = 'All Collections';

export function NewArrivals() {
  const [activeFilter, setActiveFilter] = useState<string>(ALL_NEW_LABEL);

  const sortedProducts = useMemo(() => {
    return [...products].sort((first, second) => second.id - first.id);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === ALL_NEW_LABEL) {
      return sortedProducts;
    }

    return sortedProducts.filter((product) => product.category === activeFilter);
  }, [sortedProducts, activeFilter]);

  const heroHighlights = sortedProducts.slice(0, 3);
  const categoryFilters = [ALL_NEW_LABEL, ...categories.map((category) => category.title)];

  return (
    <main className="new-arrivals-page bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-12">
        <section className="new-arrivals-hero grid gap-8 rounded-3xl bg-white p-8 shadow-sm lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-purple-700">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Fresh Finds</span>
            </div>
            <h1 className="text-4xl font-semibold text-gray-900">New Arrivals</h1>
            <p className="max-w-2xl text-lg text-gray-600">
              Step into the latest fashion, beauty, and lifestyle drops. Handpicked arrivals that just landed in store.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-purple-700 hover:bg-purple-800">
                <Link to="/shop">Shop the Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-purple-700 text-purple-700 hover:bg-purple-50">
                <Link to="/wishlist">Build Your Wishlist</Link>
              </Button>
            </div>
          </div>
          <div className="new-arrivals-highlight-panel grid gap-4">
            {heroHighlights.map((product) => (
              <div key={`highlight-${product.id}`} className="flex items-center gap-4 rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
                <Leaf className="h-6 w-6 text-purple-700" />
                <div>
                  <p className="text-sm uppercase tracking-wide text-purple-600">Just In</p>
                  <h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="new-arrivals-filters rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 text-purple-700">
              <Filter className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Refine by Category</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categoryFilters.map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={activeFilter === filterOption ? 'default' : 'outline'}
                  className={`new-arrivals-filter-button rounded-full ${
                    activeFilter === filterOption
                      ? 'bg-purple-700 hover:bg-purple-800 text-white'
                      : 'border-purple-200 text-purple-700 hover:border-purple-700 hover:text-purple-800'
                  }`}
                  onClick={() => setActiveFilter(filterOption)}
                >
                  {filterOption}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="new-arrivals-grid space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Latest Drops</h2>
              <p className="text-gray-600">
                Showing {filteredProducts.length} newly added item{filteredProducts.length === 1 ? '' : 's'} ready to ship.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-purple-700 hover:text-purple-800"
            >
              <Link to="/contact">Need Styling Help?</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={`arrival-${product.id}`} {...product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
