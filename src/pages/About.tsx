import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ShoppingBag, Users, Award, Truck } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function About() {
  const stats = [
    { icon: ShoppingBag, label: 'Products', value: '10,000+' },
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
    { icon: Truck, label: 'Cities Served', value: '100+' }
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We carefully curate our products to ensure the highest quality standards for our customers.'
    },
    {
      title: 'Customer Satisfaction',
      description: 'Your happiness is our priority. We go above and beyond to ensure you have a great shopping experience.'
    },
    {
      title: 'Sustainability',
      description: 'We are committed to reducing our environmental impact through sustainable practices and eco-friendly packaging.'
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform and services to provide you with the best online shopping experience.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white mb-4">About MarkTout</h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Your trusted online shopping destination for quality products, amazing deals, and exceptional service.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2020, MarkTout began with a simple mission: to make quality products accessible to everyone, 
              everywhere. What started as a small team of passionate entrepreneurs has grown into a thriving e-commerce 
              platform serving thousands of customers daily.
            </p>
            <p className="text-gray-700 mb-4">
              We believe that online shopping should be more than just transactions. It's about creating experiences, 
              building relationships, and making every customer feel valued. Our commitment to excellence drives 
              everything we do, from product selection to customer service.
            </p>
            <p className="text-gray-700">
              Today, we're proud to offer a diverse range of products across multiple categories, all while maintaining 
              our core values of quality, integrity, and customer satisfaction.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMGJ1c2luZXNzfGVufDF8fHx8MTc1OTkzNjAyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Our Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-purple-700" />
                  </div>
                  <h3 className="text-purple-700 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="mb-4">Our Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These core principles guide our decisions and shape the way we do business every day.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <h3 className="mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Join Our Growing Community</h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Experience the difference of shopping with MarkTout. Discover amazing products and unbeatable deals today.
          </p>
          <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
            Start Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
