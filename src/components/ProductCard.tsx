import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category: string;
}

export function ProductCard({ 
  id,
  image, 
  title, 
  price, 
  originalPrice, 
  rating = 4.5, 
  reviews = 0,
  category
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
  const inWishlist = isInWishlist(id);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, image, title, price });
    toast.success(`${title} added to cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({ id, image, title, price, originalPrice, category });
      toast.success('Added to wishlist!');
    }
  };

  return (
    <Link to={`/product/${id}`}>
      <div className="group relative bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-purple-700 text-white px-2 py-1 rounded-md z-10">
            -{discount}%
          </div>
        )}
        
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors z-10 ${
            inWishlist 
              ? 'bg-purple-700 text-white' 
              : 'bg-white hover:bg-purple-700 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <ImageWithFallback 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{title}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            {reviews > 0 && (
              <span className="text-xs text-gray-500">({reviews})</span>
            )}
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-700">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-purple-700 hover:bg-purple-800"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
