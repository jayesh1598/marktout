import { HeroBanner } from '../components/HeroBanner';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { ChevronRight } from 'lucide-react';
import { products, categories } from '../data/products';

export function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <HeroBanner />
      </section>
      
      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2>Shop by Category</h2>
          <Button variant="ghost" className="text-purple-700">
            View All <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </section>
      
      {/* Chair Delight Section */}
      <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-purple-900">CHAIR DELIGHT</h2>
              <p className="text-purple-700">Comfort meets style</p>
            </div>
            <Button className="bg-purple-700 hover:bg-purple-800">
              View Collection
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Today's Best Deals */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2>Today's Best Deals</h2>
            <p className="text-gray-600">Limited time offers</p>
          </div>
          <Button variant="outline" className="border-purple-700 text-purple-700">
            See All Deals <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2>Featured Products</h2>
            <Button variant="ghost" className="text-purple-700">
              View All <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...products, ...products].slice(0, 12).map((product, index) => (
              <ProductCard key={`featured-${index}`} {...product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2>New Arrivals</h2>
            <p className="text-gray-600">Fresh from the runway</p>
          </div>
          <Button className="bg-purple-700 hover:bg-purple-800">
            Explore More
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={`new-${product.id}`} {...product} />
          ))}
        </div>
      </section>
      
      {/* Special Offer Banner */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-white mb-4">Limited Time Offer!</h2>
          <p className="text-white text-lg mb-6">
            Get up to 50% off on selected items. Hurry, sale ends soon!
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
            Shop Now
          </Button>
        </div>
      </section>
      
      {/* Trending Now */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2>Trending Now</h2>
          <Button variant="outline" className="border-purple-700 text-purple-700">
            View All <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...products, ...products].slice(0, 12).map((product, index) => (
            <ProductCard key={`trending-${index}`} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}
