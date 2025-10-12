import { useMemo } from 'react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, Percent, Sparkles } from 'lucide-react';

interface DealProduct {
  product: (typeof products)[number];
  discount: number;
}

export function Deals() {
  const dealProducts = useMemo<DealProduct[]>(() => {
    return products
      .filter((product) => product.originalPrice && product.originalPrice > product.price)
      .map((product) => ({
        product,
        discount: Math.round((1 - product.price / (product.originalPrice ?? product.price)) * 100)
      }))
      .sort((a, b) => b.discount - a.discount);
  }, []);

  const topDeals = dealProducts.slice(0, 4);

  return (
    <main className="deals-page bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-12">
        <section className="deals-hero relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 text-white">
          <div className="relative z-10 px-8 py-14 md:px-12 md:py-20">
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest">
              <Sparkles className="h-5 w-5" />
              <span>Exclusive offers</span>
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold">Today&apos;s Best Deals</h1>
            <p className="mt-4 max-w-xl text-lg text-purple-100">
              Score limited-time markdowns on top-rated products across every category. Fresh deals are added daily, so don&apos;t miss out.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-purple-100">
                <Link to="/shop">Browse Full Store</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/wishlist">Save Your Favorites</Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 z-0 hidden md:block w-1/3 bg-white/10 blur-3xl" aria-hidden="true" />
        </section>

        <section className="deals-quick-stats grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-purple-700">
              <Percent className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Top Discounts</h2>
            </div>
            <p className="mt-2 text-gray-600">
              Enjoy savings up to {dealProducts[0]?.discount ?? 0}% on select collections curated just for you.
            </p>
          </div>
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-purple-700">
              <Clock className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Limited Time</h2>
            </div>
            <p className="mt-2 text-gray-600">
              Deals refresh frequently. Grab your favorites before the countdown hits zero.
            </p>
          </div>
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-purple-700">
              <Sparkles className="h-6 w-6" />
              <h2 className="text-lg font-semibold">Member Perks</h2>
            </div>
            <p className="mt-2 text-gray-600">
              Login to unlock early access and personalized deal recommendations tailored to your taste.
            </p>
          </div>
        </section>

        {topDeals.length > 0 && (
          <section className="featured-deals space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Handpicked Spotlight</h2>
                <p className="text-gray-600">Our team&apos;s favorite steals you should add to cart right now.</p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-purple-700 text-purple-700 hover:bg-purple-50"
              >
                <Link to="/cart">Review Cart</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topDeals.map(({ product }) => (
                <ProductCard key={`spotlight-${product.id}`} {...product} />
              ))}
            </div>
          </section>
        )}

        <section className="all-deals space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Explore All Deals</h2>
              <p className="text-gray-600">
                Browse {dealProducts.length} discounted item{dealProducts.length === 1 ? '' : 's'} with savings across every department.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-purple-700 hover:text-purple-800"
              asChild
            >
              <Link to="/profile">Personalize Deals</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dealProducts.map(({ product }) => (
              <ProductCard key={`deal-${product.id}`} {...product} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
