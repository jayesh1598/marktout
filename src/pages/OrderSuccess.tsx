import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

export function OrderSuccess() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="h-24 w-24 mx-auto text-green-500" />
        </div>
        <h1 className="mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon. 
          You will receive an email confirmation with your order details and tracking information.
        </p>
        <div className="space-y-3">
          <Link to="/profile">
            <Button className="w-full bg-purple-700 hover:bg-purple-800">
              View Order Status
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
