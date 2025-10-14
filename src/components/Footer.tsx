import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white mb-4">MarkTout</h3>
            <p className="text-gray-400 mb-4">
              Your one-stop shop for fashion, accessories, and home decor. Quality products at unbeatable prices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-purple-700 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
             
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">My Account</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Information</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>123 Fashion Street, NY 10001, USA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>support@marktout.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white mb-2">Subscribe to Our Newsletter</h4>
            <p className="text-gray-400 mb-4">Get the latest updates on new products and upcoming sales</p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button className="bg-purple-700 hover:bg-purple-800">Subscribe</Button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 MarkTout. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
