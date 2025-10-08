import { Search, ShoppingCart, User, Heart, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSearch } from '../contexts/SearchContext';
import { useState } from 'react';

export function Header() {
  const { getCartItemsCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const cartItemsCount = getCartItemsCount();
  const wishlistCount = getWishlistCount();
  const [searchInput, setSearchInput] = useState('');

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      {/* Top Bar */}
      <div className="bg-purple-700 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <p className="text-sm">Free Shipping on Orders Over $50</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">Track Order</a>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/">
              <h1 className="text-purple-700 cursor-pointer">MarkTout</h1>
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Input 
              type="search" 
              placeholder="Search for products..." 
              className="w-full pl-4 pr-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchQuery(searchInput);
                  navigate('/shop');
                }
              }}
            />
            <Button 
              size="icon" 
              className="absolute right-0 top-0 h-full bg-purple-700 hover:bg-purple-800"
              onClick={() => {
                setSearchQuery(searchInput);
                navigate('/shop');
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Icons */}
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-8 mt-4 pt-4 border-t">
          <Link to="/" className="hover:text-purple-700 transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-purple-700 transition-colors">Shop</Link>
          <a href="#categories" className="hover:text-purple-700 transition-colors">Categories</a>
          <a href="#deals" className="hover:text-purple-700 transition-colors">Deals</a>
          <a href="#new" className="hover:text-purple-700 transition-colors">New Arrivals</a>
          <Link to="/about" className="hover:text-purple-700 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-purple-700 transition-colors">Contact</Link>
        </nav>
      </div>
      
      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Input 
            type="search" 
            placeholder="Search for products..." 
            className="w-full pl-4 pr-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setSearchQuery(searchInput);
                navigate('/shop');
              }
            }}
          />
          <Button 
            size="icon" 
            className="absolute right-0 top-0 h-full bg-purple-700 hover:bg-purple-800"
            onClick={() => {
              setSearchQuery(searchInput);
              navigate('/shop');
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
