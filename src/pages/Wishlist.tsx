import { Button } from '../components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export function Wishlist() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
    toast.success(`${item.title} added to cart!`);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      });
    });
    toast.success(`${wishlistItems.length} items added to cart!`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 mx-auto text-gray-300 mb-4" />
          <h2 className="mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Save items you love so you can find them easily later
          </p>
          <Link to="/shop">
            <Button className="bg-purple-700 hover:bg-purple-800">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
          <Button
            onClick={handleAddAllToCart}
            className="bg-purple-700 hover:bg-purple-800 flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add All to Cart
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border overflow-hidden group">
            <Link to={`/product/${item.id}`}>
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.originalPrice && (
                  <div className="absolute top-2 left-2 bg-purple-700 text-white px-2 py-1 rounded-md">
                    -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                  </div>
                )}
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/product/${item.id}`}>
                <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                <h3 className="text-sm mb-3 line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
              </Link>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-purple-700">${item.price.toFixed(2)}</span>
                {item.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 bg-purple-700 hover:bg-purple-800"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => {
                    removeFromWishlist(item.id);
                    toast.success('Removed from wishlist');
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h3 className="mb-4">Looking for more?</h3>
        <Link to="/shop">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
