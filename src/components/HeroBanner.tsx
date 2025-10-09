import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="space-y-4">
      {/* Main Hero Banner */}
      <div className="relative bg-gradient-to-r from-red-700 to-red-900 text-white overflow-hidden rounded-lg">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-block bg-yellow-400 text-red-900 px-4 py-1 rounded-full mb-4">
              Limited Time Offer
            </div>
            <h2 className="text-white mb-4">Qurbani Festival Sale</h2>
            <h1 className="text-white mb-6">Up to 70% Off</h1>
            <p className="text-white mb-8 text-lg">
              Shop the best deals on fashion, accessories, and home decor
            </p>
            <Button size="lg" className="bg-white text-red-900 hover:bg-gray-100">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Secondary Banners */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-white mb-2">New Collection</h3>
            <p className="text-white mb-4">Trending Fashion Items</p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900">
              Explore Now
            </Button>
          </div>
        </div>
        
        <div className="relative bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-white mb-2">Special Offer</h3>
            <p className="text-white mb-4">Get Flat 7% Cashback</p>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-700">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
